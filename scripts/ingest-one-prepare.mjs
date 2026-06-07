#!/usr/bin/env node
// ingest-one-prepare — compute write-plan JSON for a single hand-picked item.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  computeNormKey, slugify, seriesToDir, deriveSourceType, findDuplicate,
} from './ingest-lib.mjs';

const ROOT = process.cwd();

// Build seen sets from _history.jsonl + raw/**/*.md frontmatter.
export function loadSeen(root = ROOT) {
  const normKeys = new Set();
  const urls = new Set();
  const pathByKey = new Map();
  const pathByUrl = new Map();

  const histPath = path.join(root, 'raw/_cards/_history.jsonl');
  if (fs.existsSync(histPath)) {
    for (const line of fs.readFileSync(histPath, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t) continue;
      try {
        const o = JSON.parse(t);
        if (o.norm_key) { normKeys.add(o.norm_key); if (o.raw_path) pathByKey.set(o.norm_key, o.raw_path); }
      } catch { /* skip bad line */ }
    }
  }

  const rawDir = path.join(root, 'raw');
  for (const file of walkMd(rawDir)) {
    if (file.includes(path.join('raw', '_cards'))) continue;
    const fm = readFrontmatter(file);
    if (!fm) continue;
    const rel = path.relative(root, file).replace(/\\/g, '/');
    if (fm.source_url) { urls.add(fm.source_url); pathByUrl.set(fm.source_url, rel); }
    if (fm.title && fm.source_url) {
      const key = computeNormKey(fm.title, fm.source_url);
      normKeys.add(key); pathByKey.set(key, rel);
    }
  }
  return { normKeys, urls, pathByKey, pathByUrl };
}

function* walkMd(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walkMd(full);
    else if (ent.isFile() && ent.name.endsWith('.md')) yield full;
  }
}

// Minimal frontmatter reader: grabs top-level title + source_url string values.
function readFrontmatter(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const block = m[1];
  const grab = (key) => {
    const r = block.match(new RegExp('^' + key + ':\\s*"?(.*?)"?\\s*$', 'm'));
    return r ? r[1].trim() : null;
  };
  return { title: grab('title'), source_url: grab('source_url') };
}

export function buildPlan(input, seen) {
  const { title, url, series, date } = input;
  const source_type = deriveSourceType(url);
  const dir = seriesToDir(series);
  const slug = slugify(title);
  const filename = `${date}-${slug}.md`;
  const rel_path = `raw/${dir}/${filename}`;
  const norm_key = computeNormKey(title, url);
  const skip_fetch = source_type === 'twitter' || source_type === 'wechat';
  const dup = findDuplicate(norm_key, url, seen.normKeys, seen.urls);
  const existing_path = dup.hit
    ? (dup.by === 'source_url' ? seen.pathByUrl.get(url) : seen.pathByKey.get(norm_key)) || null
    : null;
  return {
    title, source_url: url, source_type, series, dir, slug, date, filename, rel_path,
    norm_key, skip_fetch, origin: input.origin,
    duplicate: { hit: dup.hit, by: dup.by, existing_path },
  };
}

function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      title: { type: 'string' },
      url: { type: 'string' },
      series: { type: 'string', default: 'S0_industry' },
      origin: { type: 'string', default: 'manual' },
      date: { type: 'string' },
    },
  });
  if (!values.title || !values.url || !values.date) {
    process.stderr.write('error: --title, --url, --date required\n');
    process.exit(2);
  }
  const seen = loadSeen();
  const plan = buildPlan(values, seen);
  process.stdout.write(JSON.stringify(plan, null, 2) + '\n');
}

import { pathToFileURL } from 'node:url';
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}
