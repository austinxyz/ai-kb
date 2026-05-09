#!/usr/bin/env node
// aihot-daily — fetch and render aihot.virxact.com /api/public/daily for fast reading.
// No ingest, no triage, no wiki. Just "30-second AI news scan" per author's design intent.
//
// Usage:
//   node scripts/aihot-daily.mjs                  # latest daily
//   node scripts/aihot-daily.mjs 2026-05-08       # specific date
//   node scripts/aihot-daily.mjs --list 14        # list last 14 daily dates
//   node scripts/aihot-daily.mjs --json           # raw JSON instead of markdown

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const BASE = 'https://aihot.virxact.com/api/public';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const ARCHIVE_DIR = path.join(process.cwd(), 'daily', 'aihot');
const GENERATED_AT_RE = /<!--\s*generatedAt:\s*([^\s>]+)\s*-->/;

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      timeout: 30000,
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} from ${url}: ${body.slice(0, 200)}`));
          return;
        }
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`bad JSON from ${url}: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

function trunc(s, n) {
  if (!s) return '';
  s = String(s).replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

function shortSource(name) {
  if (!name) return '';
  // "X：OpenAI (@OpenAI)" → "X@OpenAI", "Claude Code：GitHub Releases（RSS）" → "GH Releases"
  return String(name)
    .replace(/^X[:：]\s*/, 'X：')
    .replace(/\(RSS\)|（RSS）/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderDaily(d) {
  const lines = [];
  const date = d.date || 'unknown';
  const generated = d.generatedAt ? new Date(d.generatedAt).toISOString().slice(11, 16) + ' UTC' : '';
  const winStart = d.windowStart ? d.windowStart.slice(0, 10) : '';
  const winEnd = d.windowEnd ? d.windowEnd.slice(0, 10) : '';

  lines.push('');
  lines.push(`━━━ AI 日报 · ${date} ━━━`);
  if (winStart && winEnd) lines.push(`窗口: ${winStart} → ${winEnd}${generated ? '  |  生成于 ' + generated : ''}`);
  lines.push('');

  if (d.lead) {
    const t = d.lead.title || d.lead.leadTitle || '';
    if (t) {
      lines.push(`★ Lead: ${t}`);
      if (d.lead.summary) lines.push(`  ${trunc(d.lead.summary, 200)}`);
      if (d.lead.sourceUrl) lines.push(`  ${d.lead.sourceUrl}`);
      lines.push('');
    }
  }

  let total = 0;
  for (const sec of d.sections || []) {
    const items = sec.items || [];
    if (!items.length) continue;
    total += items.length;
    lines.push(`## ${sec.label}  (${items.length})`);
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const idx = String(i + 1).padStart(2);
      lines.push(` ${idx}. ${it.title || '(无标题)'}`);
      if (it.summary) lines.push(`     ${trunc(it.summary, 180)}`);
      const src = shortSource(it.sourceName);
      if (src || it.sourceUrl) lines.push(`     · ${src}${src && it.sourceUrl ? ' · ' : ''}${it.sourceUrl || ''}`);
    }
    lines.push('');
  }

  if (d.flashes && d.flashes.length) {
    lines.push(`## 简讯  (${d.flashes.length})`);
    for (let i = 0; i < d.flashes.length; i++) {
      const f = d.flashes[i];
      const t = f.title || f.text || '';
      lines.push(` ${String(i + 1).padStart(2)}. ${trunc(t, 200)}`);
      if (f.sourceUrl) lines.push(`     ${f.sourceUrl}`);
    }
    lines.push('');
  }

  lines.push(`━━━ ${total} 条精选 / 5 版块 ━━━`);
  return lines.join('\n');
}

function renderList(j) {
  const lines = ['', `━━━ 可用日报 (last ${j.count}) ━━━`];
  for (const d of j.items || []) {
    const lead = d.leadTitle ? ` — ${trunc(d.leadTitle, 60)}` : '';
    lines.push(`  ${d.date}${lead}`);
  }
  return lines.join('\n');
}

// Save rendered markdown to daily/aihot/<date>.md, gitignored.
// Idempotent: skip if existing file's generatedAt comment matches; overwrite if it changed.
function saveRenderedToCache(d, rendered) {
  if (!d || !d.date) return null;
  const file = path.join(ARCHIVE_DIR, `${d.date}.md`);
  const generatedAt = d.generatedAt || '';

  if (fs.existsSync(file)) {
    try {
      const existing = fs.readFileSync(file, 'utf8');
      const m = existing.match(GENERATED_AT_RE);
      if (m && m[1] === generatedAt) {
        return { path: file, action: 'skip', reason: 'same generatedAt' };
      }
    } catch { /* fall through to overwrite */ }
  }

  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  const header = `<!-- generatedAt: ${generatedAt} -->\n<!-- savedAt: ${new Date().toISOString()} -->\n`;
  fs.writeFileSync(file, header + rendered + '\n', 'utf8');
  return { path: file, action: fs.existsSync(file) ? 'updated' : 'wrote' };
}

async function main(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      list: { type: 'string' },   // --list <N>
      json: { type: 'boolean', default: false },
      'no-save': { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  try {
    if (values.list) {
      const n = Number(values.list);
      const j = await getJson(`${BASE}/dailies?take=${encodeURIComponent(n)}`);
      if (values.json) { process.stdout.write(JSON.stringify(j, null, 2) + '\n'); return; }
      process.stdout.write(renderList(j) + '\n');
      return;
    }

    let url = `${BASE}/daily`;
    const date = positionals[0];
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        process.stderr.write(`error: date must be YYYY-MM-DD, got "${date}"\n`);
        process.exit(2);
      }
      url = `${BASE}/daily/${date}`;
    }
    const j = await getJson(url);
    if (values.json) { process.stdout.write(JSON.stringify(j, null, 2) + '\n'); return; }
    const rendered = renderDaily(j);
    process.stdout.write(rendered + '\n');
    if (!values['no-save']) {
      const r = saveRenderedToCache(j, rendered);
      if (r) {
        const rel = path.relative(process.cwd(), r.path).replace(/\\/g, '/');
        process.stderr.write(`[cache] ${r.action}: ${rel}${r.reason ? ' (' + r.reason + ')' : ''}\n`);
      }
    }
  } catch (e) {
    if (/HTTP 404/.test(e.message)) {
      process.stderr.write(`error: 该日期日报不存在（生成时间约北京时间 08:00；早期日期可能未归档）\n`);
      process.exit(1);
    }
    process.stderr.write(`fatal: ${e.message}\n`);
    process.exit(1);
  }
}

import { pathToFileURL } from 'node:url';
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}

export { renderDaily, renderList, shortSource, trunc };
