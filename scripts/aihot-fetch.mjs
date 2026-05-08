#!/usr/bin/env node
// aihot-fetch — fetch aihot.virxact.com curated cards into JSON.
// Default backend: public REST API at /api/public/feed (since 2026-05-08).
// Legacy backend: RSC paginated /all scrape — fallback via AIHOT_BACKEND=rsc.
// See aihot-fetch.notes.md.

const SOURCE_TYPE_RULES = [
  [/(^|\.)twitter\.com$|(^|\.)x\.com$/i, 'twitter'],
  [/(^|\.)mp\.weixin\.qq\.com$/i, 'wechat'],
  [/(^|\.)github\.com$|(^|\.)github\.io$/i, 'github'],
  [/(^|\.)arxiv\.org$/i, 'arxiv'],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/i, 'youtube'],
];

export function deriveSourceType(url) {
  try {
    const host = new URL(url).hostname;
    for (const [re, type] of SOURCE_TYPE_RULES) {
      if (re.test(host)) return type;
    }
    return 'blog';
  } catch {
    return 'blog';
  }
}

// Match self.__next_f.push([N, "...escaped JSON..."]) calls.
const PUSH_RE = /self\.__next_f\.push\(\[\d+,("(?:\\"|[^"])*")\]\)/g;

// Each item object in the RSC stream begins with {"id":"cm..." (CUID-ish).
const ITEM_START_RE = /\{"id":"cm[a-z0-9]{20,}"/g;

function decodeRscChunks(html) {
  const chunks = [];
  for (const m of html.matchAll(PUSH_RE)) {
    chunks.push(JSON.parse(m[1]));
  }
  return chunks;
}

// Walk forward from startIdx (which must point at '{') balancing braces while
// respecting JSON string escaping. Returns exclusive end index, or -1 on
// unterminated object.
function findObjectEnd(s, startIdx) {
  let depth = 0;
  let i = startIdx;
  let inString = false;
  while (i < s.length) {
    const c = s[i];
    if (inString) {
      if (c === '\\') { i += 2; continue; }
      if (c === '"') inString = false;
    } else {
      if (c === '"') inString = true;
      else if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) return i + 1;
      }
    }
    i++;
  }
  return -1;
}

function extractItemsFromDecoded(decoded) {
  const out = [];
  for (const m of decoded.matchAll(ITEM_START_RE)) {
    const start = m.index;
    const end = findObjectEnd(decoded, start);
    if (end < 0) continue;
    let raw;
    try {
      raw = JSON.parse(decoded.slice(start, end));
    } catch {
      continue;
    }
    if (!raw || typeof raw.id !== 'string') continue;
    out.push(toContractItem(raw));
  }
  return out;
}

function toContractItem(raw) {
  const url = typeof raw.url === 'string' ? raw.url : '';
  const tags = Array.isArray(raw.aiTags)
    ? raw.aiTags.map(t => {
        if (typeof t === 'string') return t;
        if (t && typeof t.tag === 'string') return t.tag;
        return null;
      }).filter(Boolean)
    : [];
  return {
    aihot_id: String(raw.id),
    aihot_url: '',
    title: (typeof raw.title === 'string' && raw.title) ? raw.title
      : (typeof raw.titleZh === 'string' ? raw.titleZh : ''),
    summary: typeof raw.summaryZh === 'string' ? raw.summaryZh : '',
    recommendation_reason: typeof raw.aiSelectedReason === 'string' ? raw.aiSelectedReason : '',
    tags,
    starred_count: Number(raw.qualityScore ?? raw.finalScore ?? 0),
    published_at: typeof raw.publishedAt === 'string' ? raw.publishedAt : new Date().toISOString(),
    source_url: url,
    source_type: deriveSourceType(url),
    aiSelected: Boolean(raw.aiSelected),
    duplicate_count: typeof raw.duplicateCount === 'number' ? raw.duplicateCount : 0,
    duplicate_sources: Array.isArray(raw.duplicateSources) ? raw.duplicateSources : [],
  };
}

export function parseRscPayload(html) {
  const chunks = decodeRscChunks(html);
  if (chunks.length === 0) {
    throw new Error('no self.__next_f.push payload found in HTML');
  }
  const decoded = chunks.join('');
  return extractItemsFromDecoded(decoded);
}

export function parseSince(since) {
  const days = typeof since === 'number'
    ? since
    : Number(String(since).replace(/d$/i, ''));
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error(`invalid since: ${JSON.stringify(since)}`);
  }
  return days;
}

export function windowFilter(items, since, now = new Date()) {
  const days = parseSince(since);
  const cutoff = new Date(now.getTime() - days * 86400 * 1000);
  return items.filter(it => {
    if (typeof it.published_at !== 'string') return false;
    const pub = new Date(it.published_at);
    return !isNaN(pub.getTime()) && pub >= cutoff;
  });
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'identity',
};

const PAGE_SIZE_GUESS = 40;
const MAX_PAGES_HARD_CAP = 200;

async function fetchPage(page) {
  const url = `https://aihot.virxact.com/all?page=${page}`;
  const res = await fetch(url, { headers: BROWSER_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

// API backend (default since 2026-05-08).
// Hits /api/public/feed?mode=selected|all&since=ISO&take=N + cursor pagination.
const API_BASE = 'https://aihot.virxact.com/api/public/feed';
const API_TAKE = 100;
const API_MAX_PAGES = 50;

async function fetchApiPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_HEADERS['User-Agent'],
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

export async function fetchViaApi(since, now = new Date(), opts = {}) {
  const days = parseSince(since);
  const cutoff = new Date(now.getTime() - days * 86400 * 1000);
  const fetchPageFn = opts.fetchApiPage ?? fetchApiPage;
  const maxPages = opts.maxPages ?? API_MAX_PAGES;
  const mode = opts.mode ?? 'selected';
  const items = [];
  const errors = [];
  const seenIds = new Set();
  let cursor = '';

  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('since', cutoff.toISOString());
    params.set('take', String(API_TAKE));
    if (cursor) params.set('cursor', cursor);
    const url = `${API_BASE}?${params.toString()}`;

    let payload;
    try {
      payload = await fetchPageFn(url);
    } catch (e) {
      errors.push({ stage: 'api_fetch', page, message: e.message });
      break;
    }
    const pageItems = Array.isArray(payload?.items) ? payload.items : [];
    if (pageItems.length === 0) break;

    for (const raw of pageItems) {
      if (!raw || typeof raw.id !== 'string') continue;
      if (seenIds.has(raw.id)) continue;
      seenIds.add(raw.id);
      items.push(toContractItem(raw));
    }

    if (!payload.hasNext || !payload.nextCursor) break;
    cursor = payload.nextCursor;
  }
  return { items, errors };
}

export async function fetchPaginated(since, now = new Date(), opts = {}) {
  const days = parseSince(since);
  const cutoff = new Date(now.getTime() - days * 86400 * 1000);
  const fetchPageFn = opts.fetchPage ?? fetchPage;
  const maxPages = opts.maxPages ?? MAX_PAGES_HARD_CAP;
  const seenIds = new Set();
  const items = [];
  const errors = [];

  for (let page = 1; page <= maxPages; page++) {
    let html;
    try {
      html = await fetchPageFn(page);
    } catch (e) {
      errors.push({ stage: 'fetch_page', page, message: e.message });
      break;
    }
    let pageItems;
    try {
      pageItems = parseRscPayload(html);
    } catch (e) {
      errors.push({ stage: 'parse_page', page, message: e.message });
      break;
    }
    if (pageItems.length === 0) break;

    let oldestOnPage = null;
    for (const item of pageItems) {
      if (seenIds.has(item.aihot_id)) continue;
      seenIds.add(item.aihot_id);
      items.push(item);
      const pub = new Date(item.published_at);
      if (!isNaN(pub.getTime()) && (oldestOnPage === null || pub < oldestOnPage)) {
        oldestOnPage = pub;
      }
    }
    if (oldestOnPage && oldestOnPage < cutoff) break;
  }
  return { items, errors };
}

import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';

async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      since: { type: 'string', default: '3d' },
      limit: { type: 'string' },
      'from-fixture': { type: 'string' },
      'curated-only': { type: 'boolean', default: true },
      'all': { type: 'boolean', default: false },
    },
  });

  const fetched_at = new Date();
  const errors = [];
  let items = [];
  // Backend: 'api' (default) | 'rsc' (legacy fallback). Override with AIHOT_BACKEND env.
  const backend = (process.env.AIHOT_BACKEND || 'api').toLowerCase();
  let fetch_method = backend === 'rsc' ? 'paginated_all' : 'public_api';

  try {
    if (values['from-fixture']) {
      const html = await readFile(values['from-fixture'], 'utf-8');
      items = parseRscPayload(html);
      fetch_method = 'fixture';
    } else if (backend === 'rsc') {
      const result = await fetchPaginated(values.since, fetched_at);
      items = result.items;
      errors.push(...result.errors);
    } else {
      const mode = values.all ? 'all' : 'selected';
      const result = await fetchViaApi(values.since, fetched_at, { mode });
      items = result.items;
      errors.push(...result.errors);
    }
  } catch (e) {
    errors.push({ stage: 'fetch_or_parse', message: e.message });
  }

  if (items.length === 0 && errors.length > 0) {
    process.stderr.write(`aihot-fetch fatal: ${errors.map(e => e.message).join('; ')}\n`);
    if (backend === 'rsc') {
      process.stderr.write(`If RSC streaming format changed, re-probe and update parser.\n`);
    } else {
      process.stderr.write(`API at /api/public/feed failed. Try AIHOT_BACKEND=rsc to fall back to RSC scrape.\n`);
    }
    process.exit(1);
  }

  const filtered = windowFilter(items, values.since, fetched_at);
  const curated = (values['curated-only'] && !values.all)
    ? filtered.filter(it => it.aiSelected === true)
    : filtered;
  const limited = values.limit ? curated.slice(0, Number(values.limit)) : curated;

  const output = {
    fetched_at: fetched_at.toISOString(),
    window: { since: values.since, until: fetched_at.toISOString() },
    source: 'aihot.virxact.com',
    fetch_method,
    curated_only: !values.all,
    items: limited,
    errors,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  process.exit(errors.length > 0 ? 2 : 0);
}

import { pathToFileURL } from 'node:url';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(err => {
    process.stderr.write(`aihot-fetch unhandled: ${err.stack ?? err}\n`);
    process.exit(1);
  });
}
