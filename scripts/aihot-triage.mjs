#!/usr/bin/env node
// Render triage UI grouped by primary_series.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const KEPT = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/kept.json'), 'utf8'));
const CLS = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/classification.json'), 'utf8'));

const byId = new Map();
for (const i of KEPT.items) byId.set(i.aihot_id, i);
const clsById = new Map();
for (const c of CLS) clsById.set(c.aihot_id, c);

const seriesOrder = ['S4_agent', 'S2_methodology', 'S1_infra', 'S3_roles', 'S0_industry', 'SKIP'];
const seriesLabel = {
  'S4_agent': 'Series 4 — Agent Engineering',
  'S2_methodology': 'Series 2 — AI 时代开发方法论',
  'S1_infra': 'Series 1 — AI Native Infra',
  'S3_roles': 'Series 3 — 工程师角色变迁',
  'S0_industry': 'Series 0 — 行业洞察（兜底）',
  'SKIP': 'SKIP（LLM 建议跳过）',
};
const confOrder = { high: 0, medium: 1, low: 2 };

// Build #N global numbering by source order
const numbered = KEPT.items.map((it, idx) => ({
  num: idx + 1,
  item: it,
  cls: clsById.get(it.aihot_id),
}));

// Group by primary_series
const groups = new Map();
for (const s of seriesOrder) groups.set(s, []);
for (const n of numbered) {
  const s = n.cls?.primary_series || 'SKIP';
  if (!groups.has(s)) groups.set(s, []);
  groups.get(s).push(n);
}

// Sort each non-SKIP group by confidence (high → low)
for (const s of seriesOrder) {
  if (s === 'SKIP') continue;
  groups.get(s).sort((a, b) => (confOrder[a.cls.confidence] ?? 9) - (confOrder[b.cls.confidence] ?? 9));
}

const lines = [];
function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
function trunc(s, n) {
  if (!s) return '';
  s = String(s).replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

let totalNonSkip = 0;
let totalSkip = 0;

for (const s of seriesOrder) {
  const arr = groups.get(s) || [];
  if (!arr.length) continue;
  lines.push('');
  lines.push(`━━━ ${seriesLabel[s]}  (${arr.length}) ━━━`);
  if (s === 'SKIP') {
    totalSkip += arr.length;
    // Tally reasons
    const reasonCounts = new Map();
    for (const n of arr) {
      const r = (n.cls?.skip_reason || '未知').slice(0, 30);
      reasonCounts.set(r, (reasonCounts.get(r) || 0) + 1);
    }
    const sorted = [...reasonCounts.entries()].sort((a, b) => b[1] - a[1]);
    lines.push(`  共 ${arr.length} 条 SKIP，主要原因：`);
    for (const [r, n] of sorted.slice(0, 8)) lines.push(`    ${n}× ${r}`);
    lines.push(`  （详见 raw/_cards/current/classification.json）`);
    continue;
  }
  for (const n of arr) {
    const it = n.item;
    const c = n.cls;
    totalNonSkip++;
    const tag = c.confidence === 'high' ? '[HIGH]' : c.confidence === 'medium' ? '[med] ' : '[low] ';
    const also = (c.also_relevant && c.also_relevant.length) ? ` →${c.also_relevant.join(',')}` : '';
    lines.push(` #${pad(n.num, 3)} ${tag} ${trunc(it.title, 75)}${also}`);
    const tags = (it.tags || []).join(',');
    lines.push(`        ★${it.starred_count ?? '-'} | ${it.source_type} | ${tags}`);
    lines.push(`        理由: ${trunc(it.recommendation_reason, 95)}`);
  }
}

lines.push('');
lines.push(`━━━ 统计 ━━━`);
lines.push(`原始 ${KEPT.total} / 已去重 ${KEPT.dropped_by_id + KEPT.dropped_by_norm} / 进入 triage ${totalNonSkip + totalSkip} / 其中 SKIP ${totalSkip} / 入库候选 ${totalNonSkip}`);
const byConf = { high: 0, medium: 0, low: 0 };
for (const c of CLS) if (c.primary_series !== 'SKIP') byConf[c.confidence] = (byConf[c.confidence] || 0) + 1;
lines.push(`按 confidence: high=${byConf.high} medium=${byConf.medium} low=${byConf.low}`);

const out = lines.join('\n');
fs.writeFileSync(path.join(ROOT, 'raw/_cards/current/_triage.txt'), out, 'utf8');
console.log(out);
