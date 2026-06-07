import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalize, computeNormKey, slugify, cstDate, seriesToDir,
  parseDailyDate, findDuplicate, deriveSourceType,
} from './ingest-lib.mjs';

test('normalize: lowercase, strip whitespace + punctuation, keep CJK', () => {
  assert.equal(normalize('Hello World!'), 'helloworld');
  assert.equal(normalize('  AI 时代 的 Agent  '), 'ai时代的agent');
  assert.equal(normalize(''), '');
  assert.equal(normalize(null), '');
});

test('computeNormKey: normalize(title) + || + url', () => {
  assert.equal(computeNormKey('Foo Bar', 'https://x.com/a'), 'foobar||https://x.com/a');
  assert.equal(computeNormKey('标题', ''), '标题||');
});

test('slugify: ascii lowercases and hyphenates', () => {
  assert.equal(slugify('Hello World: A Test'), 'hello-world-a-test');
  assert.equal(slugify(''), 'untitled');
});

test('slugify: CJK kept, others hyphenated, 80 cap', () => {
  assert.equal(slugify('AI 时代的 Agent'), 'AI-时代的-Agent');
  assert.equal(slugify('a'.repeat(100)).length, 80);
});

test('cstDate: UTC+8 date slice', () => {
  assert.equal(cstDate('2026-06-05T20:00:00Z'), '2026-06-06'); // 20:00Z + 8h = next day
  assert.equal(cstDate('2026-06-05T10:00:00Z'), '2026-06-05');
});

test('seriesToDir: maps all 5 series, fallback industry_insight', () => {
  assert.equal(seriesToDir('S1_infra'), 'ai_native_infra');
  assert.equal(seriesToDir('S2_methodology'), 'dev_methodology');
  assert.equal(seriesToDir('S3_roles'), 'engineering_roles');
  assert.equal(seriesToDir('S4_agent'), 'agent_engineering');
  assert.equal(seriesToDir('S0_industry'), 'industry_insight');
  assert.equal(seriesToDir('garbage'), 'industry_insight');
});

test('parseDailyDate: normalizes various inputs to YYYY-MM-DD', () => {
  assert.equal(parseDailyDate('2026-06-05'), '2026-06-05');
  assert.equal(parseDailyDate('6月5', 2026), '2026-06-05');
  assert.equal(parseDailyDate('6月5日', 2026), '2026-06-05');
  assert.equal(parseDailyDate('6-5', 2026), '2026-06-05');
  assert.equal(parseDailyDate('not a date', 2026), null);
});

test('findDuplicate: hits on normKey or url, else null', () => {
  const seenKeys = new Set(['foobar||https://x.com/a']);
  const seenUrls = new Set(['https://y.com/b']);
  assert.deepEqual(
    findDuplicate('foobar||https://x.com/a', 'https://x.com/a', seenKeys, seenUrls),
    { hit: true, by: 'norm_key' }
  );
  assert.deepEqual(
    findDuplicate('zzz||https://y.com/b', 'https://y.com/b', seenKeys, seenUrls),
    { hit: true, by: 'source_url' }
  );
  assert.equal(findDuplicate('new||https://z.com/c', 'https://z.com/c', seenKeys, seenUrls).hit, false);
});

test('parseDailyDate: missing year on short formats returns null (no garbage)', () => {
  assert.equal(parseDailyDate('6月5'), null);
  assert.equal(parseDailyDate('6-5'), null);
  assert.equal(parseDailyDate('2026-06-05'), '2026-06-05'); // ISO still works without year
});

test('deriveSourceType re-exported and works', () => {
  assert.equal(deriveSourceType('https://arxiv.org/abs/1'), 'arxiv');
  assert.equal(deriveSourceType('https://example.com/post'), 'blog');
});
