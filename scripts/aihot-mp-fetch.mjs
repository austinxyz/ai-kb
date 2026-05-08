#!/usr/bin/env node
// aihot-mp-fetch — scrape aihot.virxact.com/mp (公众号爆文 hot list).
// Output JSON envelope parallel to aihot-fetch.mjs, but with mp-specific fields.
// No body extraction (mp.weixin.qq.com triggers anti-scrape captcha — out of scope).

import https from 'node:https';
import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const BASE = 'https://aihot.virxact.com/mp';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const PAGE_HARD_CAP = 30;

// /mp accepts these literal `since` values; everything else is normalized.
const ACCEPTED_SINCE = new Set(['24h', '7d', '30d', '365d', 'all']);

export function normalizeSince(input) {
  if (input == null) return '30d';
  const s = String(input).trim().toLowerCase();
  if (ACCEPTED_SINCE.has(s)) return s;
  // Map Nd numbers to nearest accepted bucket.
  const m = s.match(/^(\d+)d$/);
  if (m) {
    const n = Number(m[1]);
    if (n <= 1) return '24h';
    if (n <= 7) return '7d';
    if (n <= 30) return '30d';
    if (n <= 365) return '365d';
    return 'all';
  }
  if (s === '24h' || s === '1d') return '24h';
  return '30d';
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 30000,
    }, res => {
      if (res.statusCode >= 400) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
  });
}

// Match the React server-component anchor that carries the row ID:
//     \"$\",\"tr\",\"cm...\"
// Document order is preserved.
const ROW_ID_RE = /\\"\$\\"\s*,\s*\\"tr\\"\s*,\s*\\"(cm[a-z0-9]{20,28})\\"/g;

export function extractRowIds(html) {
  return [...html.matchAll(ROW_ID_RE)].map(m => m[1]);
}

function textOf(el) {
  return (el?.textContent ?? '').trim();
}

function parseInteger(s) {
  if (s == null) return 0;
  const cleaned = String(s).replace(/[,\s]/g, '');
  if (cleaned === '' || cleaned === '-') return 0;
  // 10w+ style → expand: 10 万 = 100000, 1.5w = 15000
  let m = cleaned.match(/^([\d.]+)(w|万)\+?$/i);
  if (m) return Math.round(parseFloat(m[1]) * 10000);
  m = cleaned.match(/^([\d.]+)k\+?$/i);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseDateLocal(s) {
  // /mp shows YYYY-MM-DD only — treat as UTC midnight to keep ISO output stable.
  const m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Date().toISOString();
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).toISOString();
}

export function parseMpHtml(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const rows = [...doc.querySelectorAll('table.mp-table tbody tr')];
  const ids = extractRowIds(html);
  const items = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const tr = rows[i];
    const tds = [...tr.querySelectorAll('td')];
    if (tds.length < 6) {
      errors.push({ stage: 'row_columns', row: i, message: `expected 6 td, got ${tds.length}` });
      continue;
    }
    const id = ids[i];
    if (!id) {
      errors.push({ stage: 'row_id', row: i, message: 'missing aihot_id' });
      continue;
    }

    const dateStr = textOf(tds[0]);
    const titleA = tds[1].querySelector('a.mp-title-link');
    const title = textOf(titleA);
    const url = titleA?.getAttribute('href') ?? '';
    const accountA = tds[1].querySelector('a.mp-account-cell, a.mp-account-cell-sm');
    const accountName = textOf(tds[1].querySelector('span.mp-account'));
    const accountHref = accountA?.getAttribute('href') ?? '';
    const accountSlug = accountHref.startsWith('/mp/account/')
      ? accountHref.slice('/mp/account/'.length)
      : '';

    const item = {
      aihot_id: id,
      title,
      source_url: url,
      source_type: 'wechat',
      published_at: parseDateLocal(dateStr),
      account: accountName,
      account_slug: accountSlug,
      read_count: parseInteger(textOf(tds[2])),
      like_count: parseInteger(textOf(tds[3])),
      share_count: parseInteger(textOf(tds[4])),
      anomaly_score: parseInteger(textOf(tds[5])),
    };
    items.push(item);
  }
  return { items, errors };
}

export async function fetchMp(since, opts = {}) {
  const fetchHtmlFn = opts.fetchHtml ?? fetchHtml;
  const maxPages = opts.maxPages ?? PAGE_HARD_CAP;
  const sinceParam = normalizeSince(since);
  const items = [];
  const errors = [];
  const seenIds = new Set();

  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}?since=${sinceParam}&page=${page}`;
    let html;
    try {
      html = await fetchHtmlFn(url);
    } catch (e) {
      errors.push({ stage: 'fetch_page', page, message: e.message });
      break;
    }
    let pageResult;
    try {
      pageResult = parseMpHtml(html);
    } catch (e) {
      errors.push({ stage: 'parse_page', page, message: e.message });
      break;
    }
    errors.push(...pageResult.errors.map(e => ({ ...e, page })));
    if (pageResult.items.length === 0) break;

    let added = 0;
    for (const it of pageResult.items) {
      if (seenIds.has(it.aihot_id)) continue;
      seenIds.add(it.aihot_id);
      items.push(it);
      added++;
    }
    if (added === 0) break; // page entirely duplicate → end of pagination
  }
  return { items, errors, since: sinceParam };
}

async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      since: { type: 'string', default: '30d' },
      limit: { type: 'string' },
      'from-fixture': { type: 'string' },
    },
  });

  const fetched_at = new Date();
  const errors = [];
  let items = [];
  let fetch_method = 'mp_html_table';
  let sinceUsed = values.since;

  try {
    if (values['from-fixture']) {
      const html = await readFile(values['from-fixture'], 'utf-8');
      const r = parseMpHtml(html);
      items = r.items;
      errors.push(...r.errors);
      fetch_method = 'fixture';
    } else {
      const r = await fetchMp(values.since);
      items = r.items;
      errors.push(...r.errors);
      sinceUsed = r.since;
    }
  } catch (e) {
    errors.push({ stage: 'fetch_or_parse', message: e.message });
  }

  if (items.length === 0 && errors.some(e => e.stage === 'fetch_page' || e.stage === 'parse_page')) {
    process.stderr.write(`aihot-mp-fetch fatal: ${errors.map(e => e.message).join('; ')}\n`);
    process.stderr.write(`If /mp HTML structure changed, re-probe and update parser.\n`);
    process.exit(1);
  }

  const limited = values.limit ? items.slice(0, Number(values.limit)) : items;
  const output = {
    fetched_at: fetched_at.toISOString(),
    window: { since: sinceUsed, until: fetched_at.toISOString() },
    source: 'aihot.virxact.com/mp',
    fetch_method,
    items: limited,
    errors,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  process.exit(errors.length > 0 && items.length === 0 ? 2 : 0);
}

import { pathToFileURL } from 'node:url';
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(err => {
    process.stderr.write(`aihot-mp-fetch unhandled: ${err.stack ?? err}\n`);
    process.exit(1);
  });
}
