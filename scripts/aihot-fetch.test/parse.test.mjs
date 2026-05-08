import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveSourceType } from '../aihot-fetch.mjs';

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
