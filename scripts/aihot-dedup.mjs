#!/usr/bin/env node
// Build dedup state and filter items.
// Inputs: raw/_cards/current/items.json, raw/_cards/_history.jsonl, raw/**/*.md
// Output: raw/_cards/current/kept.json + stderr summary
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ITEMS_FILE = path.join(ROOT, 'raw/_cards/current/items.json');
const HISTORY_FILE = path.join(ROOT, 'raw/_cards/_history.jsonl');
const RAW_DIR = path.join(ROOT, 'raw');

function normalize(title) {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w一-鿿]/g, '');
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip _cards inside raw
      if (path.relative(RAW_DIR, full).startsWith('_cards')) continue;
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield full;
    }
  }
}

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = text.slice(3, end).trim();
  // Tiny YAML parser for our needs: only flat keys we care about.
  const out = {};
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

const seen_ids = new Set();
const seen_norm_keys = new Set();

// 1. Load history
if (fs.existsSync(HISTORY_FILE)) {
  const lines = fs.readFileSync(HISTORY_FILE, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const j = JSON.parse(line);
      if (j.aihot_id) seen_ids.add(j.aihot_id);
      if (j.norm_key) seen_norm_keys.add(j.norm_key);
    } catch {}
  }
}

// 2. Walk raw/
let scanned = 0;
if (fs.existsSync(RAW_DIR)) {
  for (const file of walk(RAW_DIR)) {
    scanned++;
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
    const fm = parseFrontmatter(text);
    if (!fm) continue;
    if (fm.aihot_id) seen_ids.add(fm.aihot_id);
    if (fm.title && fm.source_url) {
      const key = normalize(fm.title) + '||' + fm.source_url;
      seen_norm_keys.add(key);
    }
  }
}

// 3. Load items, filter
const data = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf8'));
const items = data.items || [];

const kept = [];
let dropped_by_id = 0;
let dropped_by_norm = 0;

for (const it of items) {
  if (seen_ids.has(it.aihot_id)) { dropped_by_id++; continue; }
  const key = normalize(it.title) + '||' + (it.source_url || '');
  if (seen_norm_keys.has(key)) { dropped_by_norm++; continue; }
  kept.push(it);
}

const outFile = path.join(ROOT, 'raw/_cards/current/kept.json');
fs.writeFileSync(outFile, JSON.stringify({
  fetched_at: data.fetched_at,
  window: data.window,
  total: items.length,
  kept: kept.length,
  dropped_by_id,
  dropped_by_norm,
  scanned_md_files: scanned,
  items: kept,
}, null, 2));

process.stderr.write(
  `total=${items.length} kept=${kept.length} dropped_by_id=${dropped_by_id} dropped_by_norm=${dropped_by_norm} scanned_md=${scanned}\n`
);
