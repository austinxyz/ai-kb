# `/ingest-one` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 加一个 `/ingest-one` slash command，把用户手挑的单条内容（Notion 日报 / 博主 / 官博 / 链接）抓正文 → 写 `raw/` → 交互式入 `wiki/`。

**Architecture:** 纯函数逻辑（slug/source_type/normalize/dir-map/dedup/date）抽进可测的 `scripts/ingest-lib.mjs`；CLI `scripts/ingest-one-prepare.mjs` 用 lib + 读 history/raw 算出"写入计划 JSON"（含去重命中）；命令 `.claude/commands/ingest-one.md` 是 prompt，编排 Notion 定位 / WebFetch / 写 raw / 交互入 wiki。复用 `aihot-fetch.mjs` 已导出的 `deriveSourceType`。

**Tech Stack:** Node ESM（`.mjs`），`node:test` 单测，Notion MCP（命令层），WebFetch（命令层）。

**Spec:** `docs/superpowers/specs/2026-06-07-ingest-one-design.md`

---

## File Structure

| 文件 | 职责 | 动作 |
|------|------|------|
| `scripts/ingest-lib.mjs` | 纯函数：normalize / computeNormKey / slugify / cstDate / seriesToDir / parseDailyDate / findDuplicate；re-export deriveSourceType | Create |
| `scripts/ingest-lib.test.mjs` | ingest-lib 单测 | Create |
| `scripts/ingest-one-prepare.mjs` | CLI：读 args + history + raw → 输出写入计划 JSON（含 dup 检测）| Create |
| `.claude/commands/ingest-one.md` | 命令 prompt：编排全流程 | Create |
| `CLAUDE.md` | 在命令清单加 `/ingest-one` 说明 | Modify |

**不动**：`scripts/aihot-prepare-write.mjs`（已跑完的一次性脚本，避免无关重构）。`deriveSourceType` 保留在 `aihot-fetch.mjs` 作单一真相，由 ingest-lib re-export。

---

## Task 1: ingest-lib 纯函数 + 单测

**Files:**
- Create: `scripts/ingest-lib.mjs`
- Test: `scripts/ingest-lib.test.mjs`

- [ ] **Step 1: 写失败测试**

`scripts/ingest-lib.test.mjs`:
```javascript
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

test('deriveSourceType re-exported and works', () => {
  assert.equal(deriveSourceType('https://arxiv.org/abs/1'), 'arxiv');
  assert.equal(deriveSourceType('https://example.com/post'), 'blog');
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/ingest-lib.test.mjs`
Expected: FAIL — `Cannot find module './ingest-lib.mjs'`

- [ ] **Step 3: 写最小实现**

`scripts/ingest-lib.mjs`:
```javascript
// ingest-lib — pure helpers shared by ingest-one command + prepare CLI.
// source_type detection reused from aihot-fetch (single source of truth).
import { deriveSourceType } from './aihot-fetch.mjs';

export { deriveSourceType };

const SERIES_DIR = {
  S1_infra: 'ai_native_infra',
  S2_methodology: 'dev_methodology',
  S3_roles: 'engineering_roles',
  S4_agent: 'agent_engineering',
  S0_industry: 'industry_insight',
};

export function normalize(title) {
  if (!title) return '';
  return String(title).toLowerCase().replace(/\s+/g, '').replace(/[^\w一-鿿]/g, '');
}

export function computeNormKey(title, url) {
  return normalize(title) + '||' + (url || '');
}

export function slugify(title) {
  if (!title) return 'untitled';
  const hasCJK = /[一-鿿]/.test(title);
  let s = hasCJK
    ? title.replace(/[^一-鿿a-zA-Z0-9]+/g, '-')
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/g, '');
  return s || 'untitled';
}

export function cstDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const cst = new Date(d.getTime() + 8 * 3600 * 1000);
  return cst.toISOString().slice(0, 10);
}

export function seriesToDir(series) {
  return SERIES_DIR[series] || 'industry_insight';
}

// Accept "2026-06-05", "6月5", "6月5日", "6-5". year defaults to provided fallback.
export function parseDailyDate(input, year) {
  if (!input) return null;
  const s = String(input).trim();
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
  }
  const cn = s.match(/^(\d{1,2})月(\d{1,2})日?$/);
  if (cn) {
    return `${year}-${cn[1].padStart(2, '0')}-${cn[2].padStart(2, '0')}`;
  }
  const dash = s.match(/^(\d{1,2})-(\d{1,2})$/);
  if (dash) {
    return `${year}-${dash[1].padStart(2, '0')}-${dash[2].padStart(2, '0')}`;
  }
  return null;
}

export function findDuplicate(normKey, url, seenNormKeys, seenUrls) {
  if (seenNormKeys.has(normKey)) return { hit: true, by: 'norm_key' };
  if (url && seenUrls.has(url)) return { hit: true, by: 'source_url' };
  return { hit: false, by: null };
}
```

> 注：`slugify` 先 `slice(0,80)` 可能留尾 `-`，故再 `replace(/-+$/g,'')`。`cstDate` 对非法输入返回 null（与 aihot 版略异，更稳）。

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/ingest-lib.test.mjs`
Expected: PASS（8 tests）

- [ ] **Step 5: Commit**

```bash
git add scripts/ingest-lib.mjs scripts/ingest-lib.test.mjs
git commit -m "feat: ingest-lib 纯函数（slug/source_type/dedup/date）+ 单测"
```

---

## Task 2: ingest-one-prepare CLI（算写入计划 + 去重）

**Files:**
- Create: `scripts/ingest-one-prepare.mjs`
- Test: `scripts/ingest-one-prepare.test.mjs`

CLI 接口（命令层调用）：
```
node scripts/ingest-one-prepare.mjs \
  --title "<标题>" --url "<url>" --series S4_agent \
  --origin aihot [--date 2026-06-05]
```
stdout：单个 JSON 对象 `{ title, source_url, source_type, series, dir, slug, date, filename, rel_path, norm_key, skip_fetch, duplicate: { hit, by, existing_path } }`。

- [ ] **Step 1: 写失败测试**

`scripts/ingest-one-prepare.test.mjs`:
```javascript
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
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/ingest-one-prepare.test.mjs`
Expected: FAIL — `Cannot find module './ingest-one-prepare.mjs'`

- [ ] **Step 3: 写实现**

`scripts/ingest-one-prepare.mjs`:
```javascript
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
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
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
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/ingest-one-prepare.test.mjs`
Expected: PASS（3 tests）

- [ ] **Step 5: 跑全量测试 + 真实 smoke**

Run: `node --test scripts/`
Expected: 全 PASS（含 aihot 既有测试不回归）

Run: `node scripts/ingest-one-prepare.mjs --title "Test Article" --url "https://example.com/x" --series S4_agent --origin manual --date 2026-06-07`
Expected: stdout 是 JSON，`rel_path` = `raw/agent_engineering/2026-06-07-test-article.md`，`duplicate.hit` = false

- [ ] **Step 6: Commit**

```bash
git add scripts/ingest-one-prepare.mjs scripts/ingest-one-prepare.test.mjs
git commit -m "feat: ingest-one-prepare CLI（写入计划 + history/raw 去重）"
```

---

## Task 3: `/ingest-one` 命令 prompt

**Files:**
- Create: `.claude/commands/ingest-one.md`

- [ ] **Step 1: 写命令文件**

`.claude/commands/ingest-one.md`:
````markdown
---
description: 单条手挑入库 — 抓正文 → 写 raw → 交互式入 wiki（源无关）
argument-hint: <标题> <url>  或  「6月5 模型版块第3条」
---

把用户手挑的**单条**内容入库。来源可为 Notion aihot 日报 / 博主 / 官博 / 随手链接。
Spec: `docs/superpowers/specs/2026-06-07-ingest-one-design.md`。

User invoked: `/ingest-one $ARGUMENTS`

按顺序执行，任一步出错即停并报告。

## Step 1: 解析输入，定位 title + url

判断 `$ARGUMENTS` 形态：

- **含 http(s):// 链接** → 直给模式。取链接为 `url`；链接前的文字为 `title`（无则置空，抓取后从正文补）。`origin.type = blog`（域名是已知博主/官博）或 `manual`。
- **无链接，形如「<日期> [版块]第N条」** → Notion 定位模式：
  1. 解析日期（`6月5` / `6月5日` / `2026-06-05` 均可，缺年份按当前年 2026）。
  2. `notion-search` 找标题为「AI 日报 <YYYY-MM-DD>」的页面。找不到 → 停，报错，提示用 `notion-search` 可见的近期日报日期。
  3. `notion-fetch` 读该页全文（五版块：每版块标题 + 编号条目，每条带 标题 + 一句摘要 + source url）。
  4. 定位目标条：
     - 版块已指明（如「模型版块第3条」「Agent第2条」）→ 取该版块第 N 条。
     - 版块未指明（只说「第3条」）→ 列出该天所有版块+编号清单，请用户指明，等输入。
  5. 取该条的 source url 为 `url`、标题为 `title`。`origin.type = aihot`，记 `notion_date` 与 `section`。

**回显确认**：定位到后，输出 `找到：<title> — <url>（来源：<origin.type>），确认抓取？` 等用户确认（直给模式且链接明确时可跳过确认直接抓）。

## Step 2: 分类

对该条 inline 判定（规则同 aihot-pull）：
- `primary_series`：S1_infra（基础设施）/ S2_methodology（开发方法论）/ S3_roles（角色变迁）/ S4_agent（Agent 工程）/ S0_industry（兜底行业洞察）。只选一个。
- `also_relevant`：其他相关系列（可空）。
- `confidence`：high / medium / low。

## Step 3: 算写入计划 + 去重

运行：
```bash
node scripts/ingest-one-prepare.mjs --title "<title>" --url "<url>" --series <primary_series> --origin <origin.type> --date <YYYY-MM-DD>
```
`--date`：aihot 来源用日报日期；博主/官博/链接用条目发布日（不确定则今天）。

解析 stdout JSON 得 `rel_path` / `slug` / `source_type` / `skip_fetch` / `duplicate`。

**去重命中**（`duplicate.hit == true`）→ 警告：`已存在：<duplicate.existing_path>（命中 <duplicate.by>）。仍要写入吗？` 等用户确认；拒则中止本条。

## Step 4: 抓正文

- `skip_fetch == false`（arxiv/github/blog/youtube）→ WebFetch `url`，prompt：`提取文章正文为干净 markdown。保留代码块、列表、标题。去掉导航/广告/评论/订阅提示。中文内容保留中文。`
  - 成功 → `content_source: original_full`、`fetch_status: ok`、正文入文件。
  - 失败 → `content_source: summary_only`、`fetch_status: failed`、`fetch_error: <错误>`、正文留空。
- `skip_fetch == true`（twitter/wechat）→ 不抓。`content_source: summary_only`、`fetch_status: skipped`。正文留空（aihot 来源可放 Notion 摘要）。

## Step 5: 写 raw

用 Write 写 `<rel_path>`，frontmatter（通用 schema + origin 块）：

```yaml
---
title: "<title>"
slug: <slug 去 .md>
source_url: <url>
source_type: <source_type>
fetched_at: <当前 ISO 8601>
content_source: <original_full | summary_only>
fetch_status: <ok | failed | skipped>
fetch_error: <null | string>
classification:
  primary_series: <series>
  also_relevant: [<...>]
  confidence: <high | medium | low>
origin:
  type: <aihot | blog | manual>
  # aihot: 追加 notion_date / section / aihot_url: ""
  # blog:  追加 blog_name
---

<正文 when original_full，否则空>
```

追加一行到 `raw/_cards/_history.jsonl`：
```bash
echo '{"aihot_id":null,"norm_key":"<norm_key>","raw_path":"<rel_path>","origin":"<origin.type>"}' >> raw/_cards/_history.jsonl
```

## Step 6: 入 wiki（交互）

1. 读正文（或摘要），跟用户**讨论关键要点**。
2. **深度变体判断**：若该条高价值/有争议 → 提议 Luwei 深度模式（结构化分析对话 → transcript 存 `chat/` 公开 或 `output/` 私有 → wiki 链回 + 分歧矩阵，见 CLAUDE.md「Ingest 深度分析变体」）。否则走主路径。
3. 写/**更新** `wiki/<分类>/<条目>.md`（4 段结构：定义/核心要点/与其他概念的关系/参考来源）。category 映射：S1→AI基础设施、S2→应用开发、S3→行业洞察、S4→模型与技术(默认)/应用开发(偏实战)、S0→行业洞察。
4. 更新 `wiki/index.md`（对应分类表格加/改条目）。
5. 追加 `wiki/log.md`：
   ```markdown
   ## [<YYYY-MM-DD>] ingest-one | <资料名>
   - 存入：<rel_path>
   - 新建/更新条目：wiki/<path>
   - 来源：<origin.type>
   ```

**draft 配额提醒**（不强拦）：glob `wiki/**/*.md` 数 `status: draft`，>10 则提醒一句「wiki 已有 X 个 draft，建议抽空清理」。

## 终态报告

- 入库：<rel_path>（source_type / content_source / fetch_status）
- wiki：新建/更新 <path>，或走了深度变体（transcript 路径）
- 去重 / 抓取降级 / 配额提醒（若有）
````

- [ ] **Step 2: 验证命令文件能被识别**

Run: `node -e "const t=require('fs').readFileSync('.claude/commands/ingest-one.md','utf8'); if(!t.includes('$ARGUMENTS')) throw new Error('missing $ARGUMENTS'); console.log('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/ingest-one.md
git commit -m "feat: /ingest-one 命令 prompt（Notion 定位 / 抓取 / 写 raw / 入 wiki）"
```

---

## Task 4: 文档 + 真实集成验证

**Files:**
- Modify: `CLAUDE.md`（命令清单加 `/ingest-one`）

- [ ] **Step 1: 更新 CLAUDE.md**

在 `CLAUDE.md` 的「aihot 三个 slash command（用途分工）」一节**后**，新增一节：

```markdown
## /ingest-one — 单条手挑入库

当你已在 Notion 日报（或博主/官博/链接）看到一条想入库，不必跑批量 `/aihot-pull`：

- `/ingest-one <标题> <url>` — 直给链接
- `/ingest-one 6月5 模型版块第3条` — 从 Notion AI 日报定位

流程：定位 → 回显确认 → 抓正文 → 写 `raw/<系列>/` → 交互式入 wiki。
去重撞了会警告+问。详见 `docs/superpowers/specs/2026-06-07-ingest-one-design.md`。
```

- [ ] **Step 2: 真实集成验证（直给模式）**

在真实会话里跑（用一个真实可抓的 blog url，例如 spec 里的源之一）：
```
/ingest-one https://karpathy.bearblog.dev/<某篇>
```
人工核对：
- raw 文件写到正确系列目录、frontmatter 完整、正文非空
- `_history.jsonl` 追加了一行
- wiki 走了交互讨论 + 写/更新条目 + index + log

- [ ] **Step 3: 真实集成验证（Notion 定位模式）**

```
/ingest-one <今天或昨天> <某版块>第1条
```
人工核对：Notion 定位准、回显确认、后续同上。

- [ ] **Step 4: 去重验证**

对 Step 2 同一 url 再跑一次 `/ingest-one`，确认警告 + 问、拒绝则不写第二份。

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md 加 /ingest-one 命令说明"
```

---

## Self-Review Notes

- **Spec coverage**：§1 形态(Task3)、§2 输入解析+消歧(Task3 Step1)、§3 抓取+raw+去重+slug+frontmatter(Task1/2/3)、§4 wiki 交互+深度变体+配额(Task3 Step6)、§5 错误+测试(各 Task 测试 + Task3 容错)、复用建议 B(Task1 ingest-lib)。全覆盖。
- **No placeholders**：所有 step 含真实代码/命令/期望输出。
- **Type consistency**：`buildPlan` 返回字段（rel_path/slug/source_type/skip_fetch/duplicate{hit,by,existing_path}）在 Task2 定义、Task3 命令消费，一致。`deriveSourceType` 来自 aihot-fetch、ingest-lib re-export、prepare 引用，单一真相。
- **DRY**：source_type 复用既有 export；slug/normalize/dir-map 集中 ingest-lib，不动已跑完的 aihot-prepare-write。
```
