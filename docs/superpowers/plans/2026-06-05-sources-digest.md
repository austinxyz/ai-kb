# Sources Digest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 每天从 AI 博客/官博源拉新文章生成"标题+一句话"digest，并入现有 aihot Notion 日报子页。

**Architecture:** 新增独立脚本 `scripts/sources-digest.mjs`（aihot-daily.mjs 不动）。RSS 源用 fast-xml-parser 解析（兼容 Atom + RSS2.0），48h 窗口过滤；无 feed 的 Anthropic/OpenAI 用 jsdom 抓列表页标题+链接。渲染 markdown 按源分组，单源失败容错。远程 routine 跑两脚本，agent 合并写 Notion。

**Tech Stack:** Node ESM、`fast-xml-parser`(新增)、`jsdom`(已有)、`node:test`、`node:https`。

**已验证的真实 feed/scrape 配置**（2026-06-05 curl 实测）：
- Karpathy `https://karpathy.bearblog.dev/feed/` (Atom, 200)
- Steipete `https://steipete.me/rss.xml` (RSS2.0, 200)
- HuggingFace `https://huggingface.co/blog/feed.xml` (200)
- Latent Space `https://www.latent.space/feed` (200)
- Sergey Levine `https://sergeylevine.substack.com/feed` (RSS2.0, 200)
- DeepMind `https://deepmind.google/blog/rss.xml` (RSS2.0, 200)
- Anthropic scrape `https://www.anthropic.com/news` selector `a[href^="/news/"]` (200)
- OpenAI scrape `https://openai.com/news/` selector `a[href^="/index/"]` (200，**需完整浏览器 UA**)

---

## File Structure

- Create `scripts/sources-feeds.json` — 机器可读源配置
- Create `scripts/sources-digest.mjs` — 抓取+解析+渲染+CLI，导出纯函数供测
- Create `scripts/sources-digest.test/parse.test.mjs` — 单元测试
- Create `scripts/sources-digest.test/fixtures/` — atom.xml / rss2.xml / anthropic.html / openai.html
- Modify `package.json` — 加 `fast-xml-parser` 依赖 + `sources-digest` npm script

纯函数（`stripHtml` `trunc` `normalizeFeed` `windowFilter` `parseScrapeList` `renderDigest`）与 IO（`fetchText` `main`）分离，便于 TDD。

---

### Task 0: 依赖 + 配置文件

**Files:**
- Modify: `package.json`
- Create: `scripts/sources-feeds.json`

- [ ] **Step 1: 装依赖**

Run: `npm install fast-xml-parser@^4.5.0`
Expected: package.json dependencies 多 `fast-xml-parser`，无报错。

- [ ] **Step 2: 加 npm script**

`package.json` 的 `"scripts"` 块加一行：

```json
    "sources-digest": "node scripts/sources-digest.mjs"
```

- [ ] **Step 3: 写配置 `scripts/sources-feeds.json`**

```json
[
  { "name": "Andrej Karpathy", "type": "rss", "feedUrl": "https://karpathy.bearblog.dev/feed/" },
  { "name": "Peter Steinberger", "type": "rss", "feedUrl": "https://steipete.me/rss.xml" },
  { "name": "Hugging Face", "type": "rss", "feedUrl": "https://huggingface.co/blog/feed.xml" },
  { "name": "Latent Space", "type": "rss", "feedUrl": "https://www.latent.space/feed" },
  { "name": "Sergey Levine", "type": "rss", "feedUrl": "https://sergeylevine.substack.com/feed" },
  { "name": "Google DeepMind", "type": "rss", "feedUrl": "https://deepmind.google/blog/rss.xml" },
  { "name": "Anthropic", "type": "scrape", "listUrl": "https://www.anthropic.com/news", "selector": "a[href^=\"/news/\"]", "base": "https://www.anthropic.com" },
  { "name": "OpenAI", "type": "scrape", "listUrl": "https://openai.com/news/", "selector": "a[href^=\"/index/\"]", "base": "https://openai.com" }
]
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json scripts/sources-feeds.json
git commit -m "chore: sources-digest 依赖与源配置"
```

---

### Task 1: stripHtml + trunc 辅助函数

**Files:**
- Create: `scripts/sources-digest.mjs`
- Test: `scripts/sources-digest.test/parse.test.mjs`

- [ ] **Step 1: 写失败测试**

`scripts/sources-digest.test/parse.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripHtml, trunc } from '../sources-digest.mjs';

test('stripHtml: 去标签、解码实体、压空白', () => {
  assert.equal(stripHtml('<p>Hello&nbsp;<b>world</b></p>'), 'Hello world');
  assert.equal(stripHtml('a &amp; b &lt;tag&gt;'), 'a & b <tag>');
  assert.equal(stripHtml('  multi\n  line  '), 'multi line');
  assert.equal(stripHtml(''), '');
  assert.equal(stripHtml(null), '');
});

test('trunc: 超长截断加省略号', () => {
  assert.equal(trunc('short', 10), 'short');
  assert.equal(trunc('abcdefghij', 5), 'abcd…');
  assert.equal(trunc('', 5), '');
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/sources-digest.test/`
Expected: FAIL — `Cannot find module '../sources-digest.mjs'`

- [ ] **Step 3: 写最小实现**

`scripts/sources-digest.mjs`:

```javascript
#!/usr/bin/env node
// sources-digest — fetch AI blog/lab sources (RSS + scrape), render "标题+一句话" digest.
// Usage:
//   node scripts/sources-digest.mjs            # render markdown
//   node scripts/sources-digest.mjs --json     # raw JSON
//   node scripts/sources-digest.mjs --hours 72 # override 48h window

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ' };

function stripHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, m => ENTITIES[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

function trunc(s, n) {
  if (!s) return '';
  s = String(s).replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

export { stripHtml, trunc };
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/sources-digest.test/`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/sources-digest.mjs scripts/sources-digest.test/parse.test.mjs
git commit -m "feat: sources-digest stripHtml + trunc 辅助"
```

---

### Task 2: normalizeFeed — 解析 Atom + RSS2.0

**Files:**
- Modify: `scripts/sources-digest.mjs`
- Test: `scripts/sources-digest.test/parse.test.mjs`
- Create: `scripts/sources-digest.test/fixtures/atom.xml`, `scripts/sources-digest.test/fixtures/rss2.xml`

- [ ] **Step 1: 建 fixtures**

`scripts/sources-digest.test/fixtures/atom.xml`:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>karpathy</title>
  <entry>
    <title>On Software 2.0</title>
    <link href="https://karpathy.bearblog.dev/software-2/" rel="alternate"/>
    <updated>2026-06-05T10:00:00+00:00</updated>
    <summary>Neural nets as a new software stack &amp; more.</summary>
  </entry>
  <entry>
    <title>Old Post</title>
    <link href="https://karpathy.bearblog.dev/old/" rel="alternate"/>
    <updated>2020-01-01T10:00:00+00:00</updated>
    <summary>Ancient.</summary>
  </entry>
</feed>
```

`scripts/sources-digest.test/fixtures/rss2.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
  <title>Google DeepMind News</title>
  <item>
    <title>Gemini update</title>
    <link>https://deepmind.google/blog/gemini-update/</link>
    <pubDate>Thu, 05 Jun 2026 09:00:00 GMT</pubDate>
    <description>&lt;p&gt;A new model.&lt;/p&gt;</description>
  </item>
</channel></rss>
```

- [ ] **Step 2: 写失败测试**

追加到 `parse.test.mjs`:

```javascript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { normalizeFeed } from '../sources-digest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = name => readFileSync(join(__dirname, 'fixtures', name), 'utf8');

test('normalizeFeed: Atom feed → 归一条目', () => {
  const items = normalizeFeed(fx('atom.xml'));
  assert.equal(items.length, 2);
  assert.equal(items[0].title, 'On Software 2.0');
  assert.equal(items[0].link, 'https://karpathy.bearblog.dev/software-2/');
  assert.equal(items[0].summary, 'Neural nets as a new software stack & more.');
  assert.ok(items[0].date instanceof Date);
  assert.equal(items[0].date.getUTCFullYear(), 2026);
});

test('normalizeFeed: RSS2.0 feed → 归一条目', () => {
  const items = normalizeFeed(fx('rss2.xml'));
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Gemini update');
  assert.equal(items[0].link, 'https://deepmind.google/blog/gemini-update/');
  assert.equal(items[0].summary, 'A new model.');
  assert.equal(items[0].date.getUTCFullYear(), 2026);
});
```

- [ ] **Step 3: 跑测试确认失败**

Run: `node --test scripts/sources-digest.test/`
Expected: FAIL — `normalizeFeed is not a function`

- [ ] **Step 4: 写实现**

`sources-digest.mjs` 顶部加 import，并加 `normalizeFeed`：

```javascript
import { XMLParser } from 'fast-xml-parser';

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', trimValues: true });

// 取可能是 {#text} 对象或字符串的字段
function textOf(v) {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (typeof v === 'object' && '#text' in v) return String(v['#text']);
  return '';
}

function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// Atom <link> 可能是数组或单个；取 rel=alternate 或第一个 href
function atomLink(link) {
  const arr = Array.isArray(link) ? link : [link];
  const alt = arr.find(l => l && l['@_rel'] === 'alternate') || arr[0];
  return alt ? (alt['@_href'] || '') : '';
}

function normalizeFeed(xmlText) {
  const doc = xml.parse(xmlText);
  if (doc.feed) {
    // Atom
    const entries = [].concat(doc.feed.entry || []);
    return entries.map(e => ({
      title: stripHtml(textOf(e.title)),
      link: atomLink(e.link),
      date: parseDate(textOf(e.updated) || textOf(e.published)),
      summary: stripHtml(textOf(e.summary) || textOf(e.content)),
    }));
  }
  if (doc.rss && doc.rss.channel) {
    // RSS 2.0
    const items = [].concat(doc.rss.channel.item || []);
    return items.map(it => ({
      title: stripHtml(textOf(it.title)),
      link: textOf(it.link),
      date: parseDate(textOf(it.pubDate)),
      summary: stripHtml(textOf(it.description)),
    }));
  }
  return [];
}

export { stripHtml, trunc, normalizeFeed };
```

(把已有的 `export { stripHtml, trunc };` 替换为上面这行含 `normalizeFeed` 的导出。)

- [ ] **Step 5: 跑测试确认通过**

Run: `node --test scripts/sources-digest.test/`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add scripts/sources-digest.mjs scripts/sources-digest.test/
git commit -m "feat: sources-digest normalizeFeed 兼容 Atom + RSS2.0"
```

---

### Task 3: windowFilter — 48h 窗口过滤

**Files:**
- Modify: `scripts/sources-digest.mjs`
- Test: `scripts/sources-digest.test/parse.test.mjs`

- [ ] **Step 1: 写失败测试**

追加到 `parse.test.mjs`:

```javascript
import { windowFilter } from '../sources-digest.mjs';

test('windowFilter: 仅保留窗口内有 date 的条目', () => {
  const now = new Date('2026-06-05T12:00:00Z');
  const items = [
    { title: 'fresh', date: new Date('2026-06-05T00:00:00Z') },  // 12h 前
    { title: 'stale', date: new Date('2026-06-01T00:00:00Z') },  // >48h
    { title: 'nodate', date: null },
  ];
  const kept = windowFilter(items, 48, now);
  assert.deepEqual(kept.map(i => i.title), ['fresh']);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/sources-digest.test/`
Expected: FAIL — `windowFilter is not a function`

- [ ] **Step 3: 写实现**

`sources-digest.mjs` 加（`now` 参数便于测试注入；默认实时）：

```javascript
function windowFilter(items, hours, now = new Date()) {
  const cutoff = now.getTime() - hours * 3600 * 1000;
  return items.filter(i => i.date instanceof Date && i.date.getTime() >= cutoff);
}
```

更新导出加 `windowFilter`。

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/sources-digest.test/`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/sources-digest.mjs scripts/sources-digest.test/parse.test.mjs
git commit -m "feat: sources-digest 48h windowFilter"
```

---

### Task 4: parseScrapeList — jsdom 抓列表页

**Files:**
- Modify: `scripts/sources-digest.mjs`
- Test: `scripts/sources-digest.test/parse.test.mjs`
- Create: `scripts/sources-digest.test/fixtures/anthropic.html`

- [ ] **Step 1: 建 fixture**

`scripts/sources-digest.test/fixtures/anthropic.html`:

```html
<!doctype html><html><body>
  <a href="/news/claude-opus-4-8">Claude Opus 4.8</a>
  <a href="/news/expanding-project-glasswing">Expanding Project Glasswing</a>
  <a href="/news/claude-opus-4-8">Claude Opus 4.8</a>
  <a href="/about">About</a>
</body></html>
```

- [ ] **Step 2: 写失败测试**

追加到 `parse.test.mjs`:

```javascript
import { parseScrapeList } from '../sources-digest.mjs';

test('parseScrapeList: 抽 title+link、补全相对路径、去重、限量', () => {
  const html = fx('anthropic.html');
  const items = parseScrapeList(html, 'a[href^="/news/"]', 'https://www.anthropic.com', 8);
  assert.equal(items.length, 2); // 去重后两条
  assert.equal(items[0].title, 'Claude Opus 4.8');
  assert.equal(items[0].link, 'https://www.anthropic.com/news/claude-opus-4-8');
  assert.equal(items[0].summary, ''); // scrape 无摘要
  assert.equal(items[1].link, 'https://www.anthropic.com/news/expanding-project-glasswing');
});

test('parseScrapeList: cap 限制条数', () => {
  const html = fx('anthropic.html');
  const items = parseScrapeList(html, 'a[href^="/news/"]', 'https://www.anthropic.com', 1);
  assert.equal(items.length, 1);
});
```

- [ ] **Step 3: 跑测试确认失败**

Run: `node --test scripts/sources-digest.test/`
Expected: FAIL — `parseScrapeList is not a function`

- [ ] **Step 4: 写实现**

`sources-digest.mjs` 加 import + 函数：

```javascript
import { JSDOM } from 'jsdom';

function parseScrapeList(html, selector, base, cap = 8) {
  const dom = new JSDOM(html);
  const anchors = [...dom.window.document.querySelectorAll(selector)];
  const seen = new Set();
  const out = [];
  for (const a of anchors) {
    const href = a.getAttribute('href') || '';
    const link = new URL(href, base).href;
    if (seen.has(link)) continue;
    const title = (a.textContent || '').replace(/\s+/g, ' ').trim();
    if (!title) continue;
    seen.add(link);
    out.push({ title, link, date: null, summary: '' });
    if (out.length >= cap) break;
  }
  return out;
}
```

更新导出加 `parseScrapeList`。

- [ ] **Step 5: 跑测试确认通过**

Run: `node --test scripts/sources-digest.test/`
Expected: PASS (7 tests)

- [ ] **Step 6: Commit**

```bash
git add scripts/sources-digest.mjs scripts/sources-digest.test/
git commit -m "feat: sources-digest parseScrapeList（jsdom 列表页抽取）"
```

---

### Task 5: renderDigest — markdown 渲染

**Files:**
- Modify: `scripts/sources-digest.mjs`
- Test: `scripts/sources-digest.test/parse.test.mjs`

- [ ] **Step 1: 写失败测试**

追加到 `parse.test.mjs`:

```javascript
import { renderDigest } from '../sources-digest.mjs';

test('renderDigest: 按源分组、含摘要、标记失败源', () => {
  const results = [
    { name: 'Karpathy', ok: true, items: [
      { title: 'Post A', link: 'https://x/a', summary: 'one liner' },
      { title: 'Post B', link: 'https://x/b', summary: '' },
    ] },
    { name: 'Anthropic', ok: false, error: 'HTTP 403' },
    { name: 'OpenAI', ok: true, items: [] },
  ];
  const md = renderDigest(results, '2026-06-05');
  assert.match(md, /## 源博客新文 · 2026-06-05/);
  assert.match(md, /### Karpathy/);
  assert.match(md, /\[Post A\]\(https:\/\/x\/a\) — one liner/);
  assert.match(md, /\[Post B\]\(https:\/\/x\/b\)/);
  assert.match(md, /### Anthropic ⚠️ 抓取失败: HTTP 403/);
  // 空结果源不应单列条目，但应可见（0 条）
  assert.match(md, /### OpenAI/);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/sources-digest.test/`
Expected: FAIL — `renderDigest is not a function`

- [ ] **Step 3: 写实现**

```javascript
function renderDigest(results, date) {
  const lines = [`## 源博客新文 · ${date}`, ''];
  let total = 0;
  for (const r of results) {
    if (!r.ok) {
      lines.push(`### ${r.name} ⚠️ 抓取失败: ${r.error}`, '');
      continue;
    }
    const items = r.items || [];
    if (!items.length) {
      lines.push(`### ${r.name}`, '_（无新文）_', '');
      continue;
    }
    total += items.length;
    lines.push(`### ${r.name}`);
    for (const it of items) {
      const tail = it.summary ? ` — ${trunc(it.summary, 120)}` : '';
      lines.push(`- [${it.title}](${it.link})${tail}`);
    }
    lines.push('');
  }
  lines.push(`_共 ${total} 条新文 / ${results.length} 源_`);
  return lines.join('\n');
}
```

更新导出加 `renderDigest`。

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/sources-digest.test/`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/sources-digest.mjs scripts/sources-digest.test/parse.test.mjs
git commit -m "feat: sources-digest renderDigest markdown 渲染"
```

---

### Task 6: fetchText + main 编排 + CLI

**Files:**
- Modify: `scripts/sources-digest.mjs`

- [ ] **Step 1: 加 fetchText（https.get + 完整浏览器 UA）**

OpenAI 实测需完整 UA，故统一用浏览器 UA：

```javascript
import https from 'node:https';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': '*/*' }, timeout: 20000 }, res => {
      // 跟随一次重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        resolve(fetchText(new URL(res.headers.location, url).href));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode >= 400) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        resolve(body);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}
```

- [ ] **Step 2: 加 fetchSource（按 type 路由，单源容错）**

```javascript
async function fetchSource(src, hours, now) {
  try {
    if (src.type === 'rss') {
      const text = await fetchText(src.feedUrl);
      const items = windowFilter(normalizeFeed(text), hours, now);
      return { name: src.name, ok: true, items };
    }
    if (src.type === 'scrape') {
      const html = await fetchText(src.listUrl);
      const items = parseScrapeList(html, src.selector, src.base, 8);
      return { name: src.name, ok: true, items };
    }
    return { name: src.name, ok: false, error: `unknown type ${src.type}` };
  } catch (e) {
    return { name: src.name, ok: false, error: e.message };
  }
}
```

- [ ] **Step 3: 加 main + CLI（仿 aihot-daily：--json / --hours）**

```javascript
async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      json: { type: 'boolean', default: false },
      hours: { type: 'string', default: '48' },
    },
    allowPositionals: true,
  });
  const hours = Number(values.hours) || 48;
  const now = new Date();
  const date = now.toISOString().slice(0, 10);

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const sources = JSON.parse(readFileSync(join(__dirname, 'sources-feeds.json'), 'utf8'));

  const results = [];
  for (const src of sources) {
    results.push(await fetchSource(src, hours, now));
  }

  if (values.json) { process.stdout.write(JSON.stringify({ date, results }, null, 2) + '\n'); return; }
  process.stdout.write(renderDigest(results, date) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(e => { process.stderr.write(`fatal: ${e.message}\n`); process.exit(1); });
}
```

- [ ] **Step 4: 确认单元测试仍全绿**

Run: `node --test scripts/sources-digest.test/`
Expected: PASS (8 tests) — 新增 IO 代码不破坏纯函数测试。

- [ ] **Step 5: Commit**

```bash
git add scripts/sources-digest.mjs
git commit -m "feat: sources-digest fetch 编排与 CLI"
```

---

### Task 7: 真源冒烟测试

**Files:** 无（手动验证）

- [ ] **Step 1: 跑真实源**

Run: `node scripts/sources-digest.mjs --hours 168`
（用 168h=7d 放宽窗口，确保至少抓到几条肉眼可验。）
Expected: 输出 `## 源博客新文` markdown；RSS 源出条目；Anthropic/OpenAI 出近期标题；失败源带 ⚠️ 不阻塞其余。

- [ ] **Step 2: 跑 JSON 模式抽查链接**

Run: `node scripts/sources-digest.mjs --json --hours 168`
Expected: 各源 `items[].link` 为绝对 URL，scrape 源链接前缀正确（anthropic.com/news/、openai.com/index/）。

- [ ] **Step 3: 修正发现的问题**

若某 RSS 源结构异常（如 link 为空）或 scrape selector 0 命中 → 调 `normalizeFeed`/`sources-feeds.json` selector，补对应 fixture + 测试，再重跑。

- [ ] **Step 4: Commit（若有修正）**

```bash
git add -A
git commit -m "fix: sources-digest 真源冒烟修正"
```

---

### Task 8: 文档 + routine 集成说明

**Files:**
- Modify: `wiki/log.md`
- Create: `docs/sources-digest-routine.md`（远程 routine 手配步骤）

- [ ] **Step 1: 写 routine 集成说明 `docs/sources-digest-routine.md`**

```markdown
# Sources Digest — 远程 routine 集成

## 合并进 aihot 日报 routine

现有 aihot routine（id `trig_01F4aVETEiPucA7LJz8atGo6`, cron `30 0 * * *`）需扩展：

1. routine 指令加跑第二脚本：
   `node scripts/sources-digest.mjs --no-save`（注：本脚本无 --no-save，直接 `node scripts/sources-digest.mjs`）
2. agent 把两段 markdown 合并：aihot 五版块 + 「## 源博客新文」。
3. 去重：agent 读昨天 `AI 日报 YYYY-MM-DD` 子页已出现的 URL，跳过 scrape 源重复项。
4. 写入同一个 `AI 日报 YYYY-MM-DD` Notion 子页。

## allowlist（必须手配，web UI）

claude.ai/code → routine → 环境设置 → Network access → Custom，加入：
- karpathy.bearblog.dev
- steipete.me
- huggingface.co
- www.latent.space
- sergeylevine.substack.com
- deepmind.google
- www.anthropic.com
- openai.com

环境 id `env_017ZpHgYb3ngN7WeVMU2YGUk`。脚本/settings.json 无此字段，仅 web UI 可配。
```

- [ ] **Step 2: 追加 wiki/log.md 记录**

在 `wiki/log.md` 顶部 `---` 后插入：

```markdown
## [2026-06-05] feat | sources-digest 源博客每日 digest

- 新增 `scripts/sources-digest.mjs` + `scripts/sources-feeds.json`：RSS(6)+scrape(2) 源拉新文
- 深度：标题+一句话（48h 窗口）；并入 aihot Notion 日报
- routine 集成说明：`docs/sources-digest-routine.md`（allowlist 需 web UI 手配）

---
```

- [ ] **Step 3: Commit**

```bash
git add docs/sources-digest-routine.md wiki/log.md
git commit -m "docs: sources-digest routine 集成与 allowlist 说明"
```

- [ ] **Step 4: Push**

```bash
git push
```

---

## 用户手动收尾（代码外，Claude 无法代做）

1. web UI 给 routine env 加 8 个 allowlist 域（见 `docs/sources-digest-routine.md`）。
2. web UI 改 aihot routine 指令：加跑 `node scripts/sources-digest.mjs` + 合并/查重逻辑。
3. 次日 08:30 后查 Notion `AI 日报` 子页确认「源博客新文」版块生成。

---

## Self-Review

- **Spec 覆盖**：深度(标题+一句话)→Task5；RSS+scrape→Task2/4；48h 窗口→Task3；单源容错→Task6 fetchSource；Notion 合并+查重→Task8 文档；allowlist→Task8。全覆盖。
- **占位扫描**：无 TBD；feed URL/selector 均为实测真值。
- **类型一致**：归一条目结构 `{title, link, date, summary}` 贯穿 normalizeFeed/windowFilter/parseScrapeList/renderDigest；scrape 补 `date:null, summary:''` 对齐。
- **已知缺口**：routine 指令改造与 allowlist 是 web UI 手动步骤（非脚本），已在"用户手动收尾"显式列出。
