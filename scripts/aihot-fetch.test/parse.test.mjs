import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { deriveSourceType, parseRscPayload, windowFilter, parseSince } from '../aihot-fetch.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOMEPAGE_FIXTURE = join(__dirname, 'fixtures', 'sample_homepage.html');
const ALL_PAGE_FIXTURE = join(__dirname, 'fixtures', 'sample_all_page5.html');

test('deriveSourceType: twitter and x.com', () => {
  assert.equal(deriveSourceType('https://twitter.com/foo/status/123'), 'twitter');
  assert.equal(deriveSourceType('https://x.com/bar/status/456'), 'twitter');
  assert.equal(deriveSourceType('https://mobile.twitter.com/baz'), 'twitter');
});

test('deriveSourceType: wechat', () => {
  assert.equal(deriveSourceType('https://mp.weixin.qq.com/s/xyz'), 'wechat');
});

test('deriveSourceType: github', () => {
  assert.equal(deriveSourceType('https://github.com/anthropics/claude-code'), 'github');
  assert.equal(deriveSourceType('https://octocat.github.io/page'), 'github');
});

test('deriveSourceType: arxiv', () => {
  assert.equal(deriveSourceType('https://arxiv.org/abs/2501.00001'), 'arxiv');
});

test('deriveSourceType: youtube', () => {
  assert.equal(deriveSourceType('https://www.youtube.com/watch?v=abc'), 'youtube');
  assert.equal(deriveSourceType('https://youtu.be/abc'), 'youtube');
});

test('deriveSourceType: fallback to blog', () => {
  assert.equal(deriveSourceType('https://example.com/post/1'), 'blog');
  assert.equal(deriveSourceType('https://substack.com/p/foo'), 'blog');
});

test('deriveSourceType: malformed URL falls back to blog', () => {
  assert.equal(deriveSourceType('not-a-url'), 'blog');
  assert.equal(deriveSourceType(''), 'blog');
});

test('parseRscPayload: extracts items from /(curated) homepage fixture', () => {
  const html = readFileSync(HOMEPAGE_FIXTURE, 'utf-8');
  const items = parseRscPayload(html);
  assert.ok(Array.isArray(items), 'should return array');
  assert.equal(items.length, 40, 'homepage fixture has 40 items');

  const item = items[0];
  assert.match(item.aihot_id, /^cm[a-z0-9]{20,}$/, 'aihot_id is a CUID');
  assert.ok(typeof item.title === 'string' && item.title.length > 0);
  assert.ok(typeof item.source_url === 'string');
  assert.match(item.published_at, /^\d{4}-\d{2}-\d{2}T/, 'published_at is ISO 8601');
  assert.equal(typeof item.source_type, 'string');
  assert.ok(Array.isArray(item.tags));
  assert.ok(typeof item.aiSelected === 'boolean');
  assert.ok(typeof item.starred_count === 'number');
});

test('parseRscPayload: aihot_id values are unique', () => {
  const html = readFileSync(HOMEPAGE_FIXTURE, 'utf-8');
  const items = parseRscPayload(html);
  const ids = new Set(items.map(it => it.aihot_id));
  assert.equal(ids.size, items.length, 'all IDs unique');
});

test('parseRscPayload: source_type is derived from source_url', () => {
  const html = readFileSync(HOMEPAGE_FIXTURE, 'utf-8');
  const items = parseRscPayload(html);
  for (const it of items) {
    if (!it.source_url) continue;
    assert.equal(it.source_type, deriveSourceType(it.source_url));
  }
});

test('parseRscPayload: /all firehose page also parses', () => {
  const html = readFileSync(ALL_PAGE_FIXTURE, 'utf-8');
  const items = parseRscPayload(html);
  assert.ok(items.length > 0, 'all-page fixture has items');
  const selected = items.filter(it => it.aiSelected);
  const unselected = items.filter(it => !it.aiSelected);
  assert.ok(selected.length > 0, 'should have some aiSelected items');
  assert.ok(unselected.length > 0, '/all has both selected and unselected');
});

test('parseRscPayload: tags are flat strings (not nested objects)', () => {
  const html = readFileSync(HOMEPAGE_FIXTURE, 'utf-8');
  const items = parseRscPayload(html);
  for (const it of items) {
    for (const t of it.tags) {
      assert.equal(typeof t, 'string', `tag "${JSON.stringify(t)}" should be string`);
    }
  }
});

test('parseRscPayload: throws on missing RSC chunks', () => {
  assert.throws(() => parseRscPayload('<html><body>no payload</body></html>'),
    /no self\.__next_f\.push/);
});

test('parseRscPayload: returns empty array if RSC has no items', () => {
  // valid push call but no item objects
  const html = '<html><script>self.__next_f.push([1,"3:I[\\"x\\"]\\n4:[]\\n"])</script></html>';
  const items = parseRscPayload(html);
  assert.deepEqual(items, []);
});

test('parseSince: numeric days', () => {
  assert.equal(parseSince(7), 7);
  assert.equal(parseSince(30), 30);
});

test('parseSince: "Nd" string', () => {
  assert.equal(parseSince('7d'), 7);
  assert.equal(parseSince('30d'), 30);
  assert.equal(parseSince('1d'), 1);
});

test('parseSince: rejects nonsense', () => {
  assert.throws(() => parseSince(''), /invalid since/);
  assert.throws(() => parseSince('abc'), /invalid since/);
  assert.throws(() => parseSince(0), /invalid since/);
  assert.throws(() => parseSince(-3), /invalid since/);
});

test('windowFilter: keeps items within N days', () => {
  const now = new Date('2026-05-07T12:00:00Z');
  const items = [
    { aihot_id: 'a', published_at: '2026-05-06T10:00:00Z' },
    { aihot_id: 'b', published_at: '2026-04-29T10:00:00Z' },
    { aihot_id: 'c', published_at: '2026-05-01T10:00:00Z' },
  ];
  const kept = windowFilter(items, 7, now);
  assert.deepEqual(kept.map(i => i.aihot_id), ['a', 'c']);
});

test('windowFilter: parses --since "7d" string', () => {
  const now = new Date('2026-05-07T00:00:00Z');
  const items = [
    { aihot_id: 'fresh', published_at: '2026-05-04T00:00:00Z' },
    { aihot_id: 'stale', published_at: '2026-04-20T00:00:00Z' },
  ];
  assert.equal(windowFilter(items, '7d', now).length, 1);
  assert.equal(windowFilter(items, '14d', now).length, 1);
  assert.equal(windowFilter(items, '30d', now).length, 2);
});

test('windowFilter: drops items with malformed published_at', () => {
  const now = new Date('2026-05-07T12:00:00Z');
  const items = [
    { aihot_id: 'good', published_at: '2026-05-06T10:00:00Z' },
    { aihot_id: 'bad', published_at: 'not-a-date' },
    { aihot_id: 'missing' }, // no field at all
  ];
  const kept = windowFilter(items, 7, now);
  assert.deepEqual(kept.map(i => i.aihot_id), ['good']);
});
