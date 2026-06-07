import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildPlan, loadSeen } from './ingest-one-prepare.mjs';

test('buildPlan: computes paths, source_type, skip_fetch, no dup', () => {
  const seen = { normKeys: new Set(), urls: new Set(), pathByKey: new Map(), pathByUrl: new Map() };
  const p = buildPlan({
    title: 'Agent Memory Patterns',
    url: 'https://example.com/agent-memory',
    series: 'S4_agent',
    origin: 'blog',
    date: '2026-06-05',
  }, seen);
  assert.equal(p.source_type, 'blog');
  assert.equal(p.dir, 'agent_engineering');
  assert.equal(p.slug, 'agent-memory-patterns');
  assert.equal(p.filename, '2026-06-05-agent-memory-patterns.md');
  assert.equal(p.rel_path, 'raw/agent_engineering/2026-06-05-agent-memory-patterns.md');
  assert.equal(p.skip_fetch, false);
  assert.equal(p.duplicate.hit, false);
});

test('buildPlan: twitter/wechat → skip_fetch true', () => {
  const seen = { normKeys: new Set(), urls: new Set(), pathByKey: new Map(), pathByUrl: new Map() };
  const p = buildPlan({
    title: 'A tweet', url: 'https://x.com/u/status/1',
    series: 'S0_industry', origin: 'manual', date: '2026-06-05',
  }, seen);
  assert.equal(p.source_type, 'twitter');
  assert.equal(p.skip_fetch, true);
});

test('buildPlan: detects duplicate by url with existing_path', () => {
  const url = 'https://example.com/dup';
  const seen = {
    normKeys: new Set(), urls: new Set([url]),
    pathByKey: new Map(), pathByUrl: new Map([[url, 'raw/x/old.md']]),
  };
  const p = buildPlan({
    title: 'Dup', url, series: 'S0_industry', origin: 'manual', date: '2026-06-05',
  }, seen);
  assert.equal(p.duplicate.hit, true);
  assert.equal(p.duplicate.by, 'source_url');
  assert.equal(p.duplicate.existing_path, 'raw/x/old.md');
});

test('loadSeen: parses quoted frontmatter url + title without stray quotes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ingest-seen-'));
  try {
    const dir = path.join(root, 'raw', 'agent_engineering');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'x.md'),
      '---\ntitle: "Agent Memory"\nsource_url: "https://example.com/a"\nstatus: ok\n---\n\nbody\n');
    const seen = loadSeen(root);
    assert.ok(seen.urls.has('https://example.com/a'), 'url present without quotes');
    assert.ok([...seen.urls].every(u => !u.startsWith('"') && !u.endsWith('"')), 'no stray quotes');
    assert.ok(seen.normKeys.has('agentmemory||https://example.com/a'), 'norm_key computed correctly');
    assert.equal(seen.pathByUrl.get('https://example.com/a'), 'raw/agent_engineering/x.md');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('loadSeen: tolerates missing repo (empty sets)', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ingest-empty-'));
  try {
    const seen = loadSeen(root);
    assert.equal(seen.urls.size, 0);
    assert.equal(seen.normKeys.size, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
