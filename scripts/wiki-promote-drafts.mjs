#!/usr/bin/env node
// Promote all wiki/**/*.md files with `status: draft` to `status: stable`.
// Only touches the status line; preserves rest of file byte-for-byte.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.endsWith('.md')) yield p;
  }
}

const promoted = [];
for (const f of walk(path.join(ROOT, 'wiki'))) {
  const txt = fs.readFileSync(f, 'utf8');
  if (!txt.startsWith('---')) continue;
  const fmEnd = txt.indexOf('\n---', 3);
  if (fmEnd < 0) continue;
  const fm = txt.slice(0, fmEnd);
  if (!/^status:\s*draft\s*$/m.test(fm)) continue;
  const next = fm.replace(/^status:\s*draft\s*$/m, 'status: stable') + txt.slice(fmEnd);
  fs.writeFileSync(f, next, 'utf8');
  const titleM = fm.match(/^title:\s*(.+)$/m);
  promoted.push({ path: path.relative(ROOT, f), title: (titleM ? titleM[1] : '').trim() });
}

console.log(`promoted ${promoted.length} drafts -> stable:`);
for (const p of promoted) console.log(`  ${p.path}  (${p.title})`);
