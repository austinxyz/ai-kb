import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { deriveSourceType, parseRscPayload, windowFilter, parseSince, fetchViaApi } from '../aihot-fetch.mjs';
import { parseMpHtml, normalizeSince, extractRowIds, fetchMp } from '../aihot-mp-fetch.mjs';

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

// ---------------- fetchViaApi (public REST API backend) ----------------

function makeApiPage(items, opts = {}) {
  return {
    items,
    hasNext: opts.hasNext ?? false,
    nextCursor: opts.nextCursor ?? null,
  };
}

function rawApiItem(overrides = {}) {
  return {
    id: 'cmtest1234567890abcdef',
    url: 'https://example.com/a',
    title: 'Sample',
    titleZh: 'Sample 中文',
    summaryZh: '一段中文摘要',
    aiSelected: true,
    aiSelectedReason: '推荐理由',
    qualityScore: 80,
    finalScore: 75,
    aiTags: [{ tag: 'Agent' }, { tag: 'MCP/工具调用' }],
    publishedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    source: 'Example RSS',
    duplicateCount: 0,
    duplicateSources: [],
    ...overrides,
  };
}

test('fetchViaApi: maps API fields to contract', async () => {
  const page = makeApiPage([rawApiItem({ id: 'cmapi0000000000000000a' })]);
  const calls = [];
  const result = await fetchViaApi('3d', new Date(), {
    fetchApiPage: async (url) => { calls.push(url); return page; },
  });
  assert.equal(result.items.length, 1);
  const it = result.items[0];
  assert.equal(it.aihot_id, 'cmapi0000000000000000a');
  assert.equal(it.title, 'Sample'); // prefers title over titleZh
  assert.equal(it.summary, '一段中文摘要');
  assert.equal(it.recommendation_reason, '推荐理由');
  assert.deepEqual(it.tags, ['Agent', 'MCP/工具调用']);
  assert.equal(it.starred_count, 80);
  assert.equal(it.source_url, 'https://example.com/a');
  assert.equal(it.source_type, 'blog');
  assert.equal(it.aiSelected, true);
  assert.equal(it.duplicate_count, 0);
  assert.deepEqual(it.duplicate_sources, []);
  assert.equal(it.aihot_url, '');
  assert.equal(calls.length, 1);
  assert.match(calls[0], /mode=selected/);
  assert.match(calls[0], /since=/);
});

test('fetchViaApi: paginates via nextCursor until hasNext=false', async () => {
  const pages = [
    makeApiPage([rawApiItem({ id: 'cma000000000000000001' })], { hasNext: true, nextCursor: 'c1' }),
    makeApiPage([rawApiItem({ id: 'cma000000000000000002' })], { hasNext: true, nextCursor: 'c2' }),
    makeApiPage([rawApiItem({ id: 'cma000000000000000003' })], { hasNext: false, nextCursor: null }),
  ];
  let i = 0;
  const calls = [];
  const result = await fetchViaApi('3d', new Date(), {
    fetchApiPage: async (url) => { calls.push(url); return pages[i++]; },
  });
  assert.equal(result.items.length, 3);
  assert.deepEqual(result.items.map(x => x.aihot_id), [
    'cma000000000000000001',
    'cma000000000000000002',
    'cma000000000000000003',
  ]);
  assert.equal(calls.length, 3);
  assert.ok(!calls[0].includes('cursor='), 'first page has no cursor');
  assert.match(calls[1], /cursor=c1/);
  assert.match(calls[2], /cursor=c2/);
});

test('fetchViaApi: deduplicates by id across pages', async () => {
  // Same id appears on two pages — should only count once
  const pages = [
    makeApiPage([rawApiItem({ id: 'cmadup00000000000000a' })], { hasNext: true, nextCursor: 'x' }),
    makeApiPage([rawApiItem({ id: 'cmadup00000000000000a' })], { hasNext: false, nextCursor: null }),
  ];
  let i = 0;
  const result = await fetchViaApi('3d', new Date(), {
    fetchApiPage: async () => pages[i++],
  });
  assert.equal(result.items.length, 1);
});

test('fetchViaApi: mode=all is honored', async () => {
  const calls = [];
  await fetchViaApi('3d', new Date(), {
    fetchApiPage: async (url) => { calls.push(url); return makeApiPage([], { hasNext: false }); },
    mode: 'all',
  });
  assert.match(calls[0], /mode=all/);
});

test('fetchViaApi: collects errors when fetch throws and stops', async () => {
  const result = await fetchViaApi('3d', new Date(), {
    fetchApiPage: async () => { throw new Error('boom'); },
  });
  assert.equal(result.items.length, 0);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].message, /boom/);
});

test('fetchViaApi: tags accept already-flat string array (defensive)', async () => {
  const page = makeApiPage([rawApiItem({ aiTags: ['plain1', 'plain2'] })]);
  const result = await fetchViaApi('3d', new Date(), { fetchApiPage: async () => page });
  assert.deepEqual(result.items[0].tags, ['plain1', 'plain2']);
});

// ---------------- aihot-mp-fetch (公众号爆文 list) ----------------

const MP_FIXTURE = join(__dirname, 'fixtures', 'sample_mp_page1.html');

test('normalizeSince: passes through accepted values', () => {
  for (const v of ['24h', '7d', '30d', '365d', 'all']) {
    assert.equal(normalizeSince(v), v);
  }
});

test('normalizeSince: maps Nd to nearest accepted bucket', () => {
  assert.equal(normalizeSince('1d'), '24h');
  assert.equal(normalizeSince('3d'), '7d');
  assert.equal(normalizeSince('14d'), '30d');
  assert.equal(normalizeSince('60d'), '365d');
  assert.equal(normalizeSince('500d'), 'all');
});

test('normalizeSince: defaults to 30d on garbage', () => {
  assert.equal(normalizeSince(undefined), '30d');
  assert.equal(normalizeSince('foo'), '30d');
  assert.equal(normalizeSince(''), '30d');
});

test('extractRowIds: pulls IDs from RSC tr markers in document order', () => {
  const html = readFileSync(MP_FIXTURE, 'utf-8');
  const ids = extractRowIds(html);
  assert.ok(ids.length >= 18, `expected >= 18 row IDs, got ${ids.length}`);
  for (const id of ids) {
    assert.match(id, /^cm[a-z0-9]{20,28}$/);
  }
  assert.equal(new Set(ids).size, ids.length, 'IDs are unique');
});

test('parseMpHtml: extracts items with required fields', () => {
  const html = readFileSync(MP_FIXTURE, 'utf-8');
  const { items, errors } = parseMpHtml(html);
  assert.ok(items.length >= 18, `expected >= 18 items, got ${items.length}`);
  // Tolerable: at most a couple rows can fail row_id alignment.
  assert.ok(errors.length <= 2, `unexpected errors: ${JSON.stringify(errors)}`);
  const it = items[0];
  assert.match(it.aihot_id, /^cm[a-z0-9]{20,28}$/);
  assert.ok(it.title.length > 0);
  assert.ok(it.source_url.startsWith('https://mp.weixin.qq.com/'));
  assert.equal(it.source_type, 'wechat');
  assert.match(it.published_at, /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  assert.ok(it.account.length > 0);
  assert.ok(it.account_slug.length > 0);
  assert.equal(typeof it.read_count, 'number');
  assert.equal(typeof it.like_count, 'number');
  assert.equal(typeof it.share_count, 'number');
  assert.equal(typeof it.anomaly_score, 'number');
});

test('parseMpHtml: source_type is always wechat for mp items', () => {
  const html = readFileSync(MP_FIXTURE, 'utf-8');
  const { items } = parseMpHtml(html);
  for (const it of items) assert.equal(it.source_type, 'wechat');
});

test('parseMpHtml: read_count and like_count are non-negative integers', () => {
  const html = readFileSync(MP_FIXTURE, 'utf-8');
  const { items } = parseMpHtml(html);
  for (const it of items) {
    assert.ok(Number.isInteger(it.read_count) && it.read_count >= 0, `read_count: ${it.read_count}`);
    assert.ok(Number.isInteger(it.like_count) && it.like_count >= 0);
    assert.ok(Number.isInteger(it.share_count) && it.share_count >= 0);
    assert.ok(Number.isInteger(it.anomaly_score) && it.anomaly_score >= 0);
  }
});

test('fetchMp: dedups across pages and stops on duplicate-only page', async () => {
  const html = readFileSync(MP_FIXTURE, 'utf-8');
  const calls = [];
  const r = await fetchMp('30d', {
    fetchHtml: async (url) => { calls.push(url); return html; },
    maxPages: 4,
  });
  // Same fixture served on every page → second page is all dups → stop
  assert.equal(calls.length, 2);
  assert.ok(r.items.length >= 18);
  assert.equal(r.since, '30d');
});

test('fetchMp: stops on empty page', async () => {
  const emptyHtml = '<!doctype html><html><body><table class="mp-table"><tbody></tbody></table></body></html>';
  const calls = [];
  const r = await fetchMp('30d', {
    fetchHtml: async (url) => { calls.push(url); return emptyHtml; },
    maxPages: 5,
  });
  assert.equal(calls.length, 1);
  assert.equal(r.items.length, 0);
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
