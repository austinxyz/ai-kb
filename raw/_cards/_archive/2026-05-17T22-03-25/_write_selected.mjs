import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('raw/_cards/current/kept.json', 'utf8'));
const cls = JSON.parse(fs.readFileSync('raw/_cards/current/classification.json', 'utf8'));
const clsMap = {};
for (const c of cls) clsMap[c.aihot_id] = c;

const selected = [
  'cmp72xh52070qslnz2cdl9apt', // 微软研究院
  'cmp7gzh5x0abkslnz3k1vgqjz', // 100 Codex实例
  'cmp71k78q06p8slnzvgf8b9x8', // OpenSquilla
  'cmp7gqr520a8sslnzyvbw2zpq', // Jensen Huang
  'cmp780kw8087mslnzyamm5l6a', // 杨立昆
];

const seriesDir = {
  S1_infra: 'ai_native_infra',
  S2_methodology: 'dev_methodology',
  S3_roles: 'engineering_roles',
  S4_agent: 'agent_engineering',
  S0_industry: 'industry_insight',
};

function normalize(t) {
  return String(t || '').toLowerCase().replace(/\s+/g, '').replace(/[^\w一-鿿]/g, '');
}

function slug(t) {
  if (/[一-鿿]/.test(t)) {
    return t.replace(/[^一-鿿a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/, '').slice(0, 80);
  }
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/, '').slice(0, 80);
}

const now = new Date().toISOString();
const written = [];
const histLines = [];

for (const id of selected) {
  const it = items.find(x => x.aihot_id === id);
  const c = clsMap[id];
  const dir = 'raw/' + seriesDir[c.primary_series];

  const pubDate = new Date(it.published_at);
  const cst = new Date(pubDate.getTime() + 8 * 3600000);
  const dateStr = cst.toISOString().slice(0, 10);

  const titleClean = it.title.replace(/\n/g, ' ').trim();
  const sl = slug(titleClean);
  const fname = dateStr + '-' + sl + '.md';
  const fpath = dir + '/' + fname;

  const tags = (it.tags || []).map(t => `"${t}"`).join(', ');
  const alsoRel = (c.also_relevant || []).map(x => `"${x}"`).join(', ');
  const summary = (it.summary || '').replace(/\n/g, '\n  ');
  const reason = (it.recommendation_reason || '').replace(/\n/g, '\n  ');
  const titleEscaped = titleClean.replace(/"/g, '\\"');

  const content = `---
title: "${titleEscaped}"
slug: ${dateStr}-${sl}
fetched_at: ${now}
aihot_id: "${it.aihot_id}"
aihot_url: ""
aihot_published_at: ${it.published_at}
aihot_tags: [${tags}]
aihot_starred: ${it.starred_count || 0}
aihot_summary: |
  ${summary}
aihot_recommendation_reason: |
  ${reason}
source_url: "${it.source_url}"
source_type: "${it.source_type}"
content_source: aihot_summary_only
fetch_status: skipped_by_source_type
fetch_error: null
classification:
  primary_series: ${c.primary_series}
  also_relevant: [${alsoRel}]
  confidence: ${c.confidence}
---
`;

  fs.writeFileSync(fpath, content, 'utf8');
  written.push({ id, path: fpath, title: titleClean.slice(0, 60) });

  const nk = normalize(it.title) + '||' + (it.source_url || '');
  histLines.push(JSON.stringify({ aihot_id: id, norm_key: nk, raw_path: fpath }));
}

fs.appendFileSync('raw/_cards/_history.jsonl', histLines.join('\n') + '\n', 'utf8');
fs.writeFileSync('raw/_cards/current/done.flag', now, 'utf8');

console.log('写入完成:');
for (const w of written) console.log(' ', w.path, '|', w.title);
