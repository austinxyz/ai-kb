import fs from 'node:fs';
import path from 'node:path';

const targets = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    const st = fs.statSync(fp);
    if (st.isDirectory()) { if (!f.startsWith('_')) walk(fp); }
    else if (f.endsWith('.md')) targets.push(fp.split(path.sep).join('/'));
  }
}
walk('raw');

const results = [];
for (const fp of targets) {
  try {
    const txt = fs.readFileSync(fp, 'utf8');
    const m = txt.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = m[1];
    const wsMatch = fm.match(/wiki_status:\s*(\S+)/);
    const ws = wsMatch ? wsMatch[1] : 'none';
    if (ws !== 'not_eligible_summary_only' && ws !== 'none') continue;

    const tMatch = fm.match(/title:\s*"?([^"\n]+)"?\s*$/m);
    const title = tMatch ? tMatch[1].trim().slice(0, 60) : fp;
    const urlMatch = fm.match(/source_url:\s*"?([^"\n]+)"?/);
    const url = urlMatch ? urlMatch[1].trim() : '';
    const stMatch = fm.match(/source_type:\s*"?([^"\n]+)"?/);
    const sourceType = stMatch ? stMatch[1].trim() : '';
    const seriesMatch = fm.match(/primary_series:\s*"?([^"\n]+)"?/);
    const series = seriesMatch ? seriesMatch[1].replace(/"/g,'').trim() : '?';

    const fetchable = !['twitter','wechat'].includes(sourceType);
    results.push({ ws, series, title, url, sourceType, fetchable, fp });
  } catch {}
}

console.log(`总计: ${results.length} 条\n`);
console.log('=== 可抓原文 ===');
for (const r of results.filter(x => x.fetchable)) {
  console.log(`[${r.series}] ${r.title}`);
  console.log(`  type: ${r.sourceType}  url: ${r.url}`);
  console.log(`  file: ${r.fp}\n`);
}
console.log('=== 仅摘要（Twitter/WeChat）===');
for (const r of results.filter(x => !x.fetchable)) {
  console.log(`[${r.series}] ${r.title}`);
  console.log(`  file: ${r.fp}`);
}
