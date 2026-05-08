#!/usr/bin/env node
// Build a prepared selection list for Step 6.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const KEPT = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/kept.json'), 'utf8'));
const CLS = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/classification.json'), 'utf8'));

const SELECTED_NUMS = [352, 293, 174, 166, 190, 236, 225, 191, 140, 218, 220, 110, 147, 36, 87, 137, 152, 144, 237, 271, 273, 289, 284, 307, 332, 13, 131, 161, 207, 268, 278, 326];

const SERIES_DIR = {
  S1_infra: 'ai_native_infra',
  S2_methodology: 'dev_methodology',
  S3_roles: 'engineering_roles',
  S4_agent: 'agent_engineering',
  S0_industry: 'industry_insight',
};

function normalize(title) {
  if (!title) return '';
  return String(title).toLowerCase().replace(/\s+/g, '').replace(/[^\w一-鿿]/g, '');
}

function slugify(title) {
  if (!title) return 'untitled';
  // Detect CJK
  const hasCJK = /[一-鿿]/.test(title);
  let s;
  if (hasCJK) {
    s = title.replace(/[^一-鿿a-zA-Z0-9]+/g, '-');
  } else {
    s = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  s = s.replace(/^-+|-+$/g, '').slice(0, 80);
  return s || 'untitled';
}

function cstDate(iso) {
  // UTC + 8
  const d = new Date(iso);
  const cst = new Date(d.getTime() + 8 * 3600 * 1000);
  return cst.toISOString().slice(0, 10);
}

const clsById = new Map();
for (const c of CLS) clsById.set(c.aihot_id, c);

const numbered = KEPT.items.map((it, idx) => ({ num: idx + 1, item: it }));
const byNum = new Map(numbered.map(n => [n.num, n.item]));

const out = [];
const missing = [];
for (const n of SELECTED_NUMS) {
  const it = byNum.get(n);
  if (!it) { missing.push(n); continue; }
  const c = clsById.get(it.aihot_id);
  const series = c?.primary_series || 'S0_industry';
  const dir = SERIES_DIR[series] || 'industry_insight';
  const slug = slugify(it.title);
  const date = cstDate(it.published_at || KEPT.fetched_at);
  const filename = `${date}-${slug}.md`;
  const rel_path = `raw/${dir}/${filename}`;
  const norm_key = normalize(it.title) + '||' + (it.source_url || '');
  const skip_fetch = it.source_type === 'twitter' || it.source_type === 'wechat';
  out.push({
    num: n,
    aihot_id: it.aihot_id,
    title: it.title,
    source_url: it.source_url,
    source_type: it.source_type,
    series,
    dir,
    confidence: c?.confidence,
    also_relevant: c?.also_relevant || [],
    slug,
    date,
    filename,
    rel_path,
    abs_path: path.join(ROOT, rel_path),
    norm_key,
    skip_fetch,
    item: it,
  });
}

fs.writeFileSync(path.join(ROOT, 'raw/_cards/current/_to_write.json'), JSON.stringify(out, null, 2));
console.log('selected:', out.length);
console.log('missing nums:', missing);
console.log('by source_type:');
const bySrc = {};
for (const r of out) bySrc[r.source_type] = (bySrc[r.source_type] || 0) + 1;
console.log(JSON.stringify(bySrc, null, 2));
console.log('skip_fetch:', out.filter(r => r.skip_fetch).length);
console.log('webfetch_needed:', out.filter(r => !r.skip_fetch).length);
console.log('by series:');
const bySeries = {};
for (const r of out) bySeries[r.series] = (bySeries[r.series] || 0) + 1;
console.log(JSON.stringify(bySeries, null, 2));
