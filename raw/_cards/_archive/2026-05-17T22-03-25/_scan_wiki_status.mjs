import fs from 'node:fs';
import path from 'node:path';

const results = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    const st = fs.statSync(fp);
    if (st.isDirectory()) {
      if (!f.startsWith('_')) walk(fp);
    } else if (f.endsWith('.md')) {
      results.push(fp.split(path.sep).join('/'));
    }
  }
}
walk('raw');

const groups = {};
for (const fp of results) {
  try {
    const txt = fs.readFileSync(fp, 'utf8');
    const m = txt.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = m[1];
    const tMatch = fm.match(/title:\s*"?([^"\n]+)"?\s*$/m);
    const title = tMatch ? tMatch[1].trim().slice(0, 55) : fp.split('/').pop();
    const wsMatch = fm.match(/wiki_status:\s*(\S+)/);
    const ws = wsMatch ? wsMatch[1] : 'none';
    const sMatch = fm.match(/primary_series:\s*(\S+)/);
    const series = sMatch ? sMatch[1] : '?';
    if (!groups[ws]) groups[ws] = [];
    groups[ws].push({ series, fp, title });
  } catch {}
}

const order = ['none', 'pending', 'not_eligible_summary_only', 'drafted', 'conflict_skipped'];
for (const ws of order) {
  const items = groups[ws] || [];
  if (!items.length) continue;
  console.log(`\n=== wiki_status: ${ws} (${items.length}) ===`);
  for (const x of items) {
    console.log(`  [${x.series}] ${x.title}`);
    console.log(`        ${x.fp}`);
  }
}
