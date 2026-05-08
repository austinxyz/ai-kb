#!/usr/bin/env node
// Manual smoke test — actually hits aihot.virxact.com.
// Run with: node scripts/aihot-fetch.test/smoke.mjs [--since 7d]
// Do NOT add to CI — we don't want to hammer aihot.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(__dirname, '..', 'aihot-fetch.mjs');
const since = process.argv[2] ?? '--since';
const days = process.argv[3] ?? '7d';

const args = since === '--since' ? ['--since', days] : ['--since', '7d'];
console.log(`SMOKE: running aihot-fetch ${args.join(' ')}...`);
const t0 = Date.now();
const result = spawnSync('node', [SCRIPT, ...args], { encoding: 'utf-8' });
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

if (result.status !== 0 && result.status !== 2) {
  console.error(`SMOKE FAIL: exit ${result.status}, ${elapsed}s`);
  console.error('--- stderr ---');
  console.error(result.stderr);
  process.exit(1);
}

let output;
try {
  output = JSON.parse(result.stdout);
} catch (e) {
  console.error(`SMOKE FAIL: stdout not valid JSON (${e.message})`);
  console.error('--- stdout (first 500 chars) ---');
  console.error(result.stdout.slice(0, 500));
  process.exit(1);
}

console.log(
  `SMOKE OK: items=${output.items.length}, method=${output.fetch_method}, ` +
  `errors=${output.errors.length}, elapsed=${elapsed}s`
);
if (output.items.length === 0) {
  console.error('SMOKE WARN: zero items returned — site may have changed');
  process.exit(1);
}

const sample = output.items[0];
console.log('--- first item ---');
console.log(JSON.stringify({
  aihot_id: sample.aihot_id,
  title: sample.title?.slice(0, 80),
  source_type: sample.source_type,
  published_at: sample.published_at,
  aiSelected: sample.aiSelected,
  tags: sample.tags,
}, null, 2));

if (output.errors.length > 0) {
  console.log('--- errors[] ---');
  for (const err of output.errors) console.log(' ', err);
}
