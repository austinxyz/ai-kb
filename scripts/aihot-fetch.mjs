#!/usr/bin/env node
// aihot-fetch — fetch and parse aihot.virxact.com curated cards into JSON.
// Strategy: paginated /all + filter aiSelected:true. See aihot-fetch.notes.md.

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
    ? raw.aiTags.map(t => (t && typeof t.tag === 'string') ? t.tag : null).filter(Boolean)
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
