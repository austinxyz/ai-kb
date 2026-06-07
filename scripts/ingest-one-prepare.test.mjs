import { test } from 'node:test';
import assert from 'node:assert/strict';
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
