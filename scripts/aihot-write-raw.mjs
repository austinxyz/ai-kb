#!/usr/bin/env node
// Construct raw md files from _to_write.json + cached bodies + items metadata.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TO_WRITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/_to_write.json'), 'utf8'));
const BODIES_DIR = path.join(ROOT, 'raw/_cards/current/_bodies');
const HISTORY = path.join(ROOT, 'raw/_cards/_history.jsonl');

// Items map for richer fields
const KEPT = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/kept.json'), 'utf8'));
const itemById = new Map();
for (const it of KEPT.items) itemById.set(it.aihot_id, it);

// Failed fetches — empty after re-extraction with direct HTTPS+readability+turndown
const FAILED = new Set();
const FAILED_REASON = {};

const fetchedAt = new Date().toISOString();
const writtenPaths = [];
const historyLines = [];

function yamlStr(s) {
  if (s == null) return 'null';
  s = String(s);
  // Use double quotes; escape only quotes and backslashes
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}
function yamlBlock(s) {
  if (s == null || s === '') return '""';
  // Multi-line literal block — indent by 2
  const lines = String(s).split(/\r?\n/);
  return '|\n' + lines.map(l => '  ' + l).join('\n');
}
function yamlArray(arr) {
  if (!arr || !arr.length) return '[]';
  return '[' + arr.map(s => yamlStr(s)).join(', ') + ']';
}

for (const r of TO_WRITE) {
  const it = itemById.get(r.aihot_id);
  let body = '';
  let content_source, fetch_status, fetch_error;

  if (r.skip_fetch) {
    content_source = 'aihot_summary_only';
    fetch_status = 'skipped_by_source_type';
    fetch_error = null;
  } else if (FAILED.has(String(r.num))) {
    content_source = 'aihot_summary_only';
    fetch_status = 'failed';
    fetch_error = FAILED_REASON[String(r.num)] || 'unknown';
  } else {
    const bodyPath = path.join(BODIES_DIR, `${r.num}.md`);
    if (!fs.existsSync(bodyPath)) {
      content_source = 'aihot_summary_only';
      fetch_status = 'failed';
      fetch_error = 'body file missing';
    } else {
      body = fs.readFileSync(bodyPath, 'utf8').trim();
      content_source = 'original_full';
      fetch_status = 'ok';
      fetch_error = null;
    }
  }

  const fm = [];
  fm.push('---');
  fm.push(`title: ${yamlStr(it.title)}`);
  fm.push(`slug: ${r.date}-${r.slug}`);
  fm.push(`fetched_at: ${fetchedAt}`);
  fm.push(`aihot_id: ${yamlStr(it.aihot_id)}`);
  fm.push(`aihot_url: ${yamlStr(it.aihot_url || '')}`);
  fm.push(`aihot_published_at: ${it.published_at || ''}`);
  fm.push(`aihot_tags: ${yamlArray(it.tags)}`);
  fm.push(`aihot_starred: ${it.starred_count ?? 0}`);
  fm.push(`aihot_summary: ${yamlBlock(it.summary)}`);
  fm.push(`aihot_recommendation_reason: ${yamlBlock(it.recommendation_reason)}`);
  fm.push(`source_url: ${yamlStr(it.source_url || '')}`);
  fm.push(`source_type: ${yamlStr(it.source_type)}`);
  fm.push(`content_source: ${yamlStr(content_source)}`);
  fm.push(`fetch_status: ${yamlStr(fetch_status)}`);
  fm.push(`fetch_error: ${fetch_error == null ? 'null' : yamlStr(fetch_error)}`);
  fm.push(`classification:`);
  fm.push(`  primary_series: ${yamlStr(r.series)}`);
  fm.push(`  also_relevant: ${yamlArray(r.also_relevant)}`);
  fm.push(`  confidence: ${yamlStr(r.confidence)}`);
  fm.push('---');
  fm.push('');

  const text = fm.join('\n') + (body ? body + '\n' : '');

  fs.mkdirSync(path.dirname(r.abs_path), { recursive: true });
  fs.writeFileSync(r.abs_path, text, 'utf8');
  writtenPaths.push({
    num: r.num,
    rel: r.rel_path,
    series: r.series,
    content_source,
    fetch_status,
  });

  historyLines.push(JSON.stringify({
    aihot_id: it.aihot_id,
    norm_key: r.norm_key,
    raw_path: r.rel_path,
  }));
}

// History append is skipped on re-write runs (history was already written on first run).
// To re-enable, set REWRITE_APPEND_HISTORY=1.
if (process.env.REWRITE_APPEND_HISTORY === '1') {
  fs.appendFileSync(HISTORY, historyLines.join('\n') + '\n', 'utf8');
}

// done flag
fs.writeFileSync(path.join(ROOT, 'raw/_cards/current/done.flag'), fetchedAt, 'utf8');

console.log('written:', writtenPaths.length);
for (const w of writtenPaths) {
  console.log(`  #${w.num} ${w.series} ${w.fetch_status} -> ${w.rel}`);
}
console.log('history appended:', historyLines.length);
