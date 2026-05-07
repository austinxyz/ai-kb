# aihot.virxact.com Ingest Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a half-automated weekly pipeline that ingests AI articles from aihot.virxact.com, classifies them into 4 blog series, drops them into `raw/`, and auto-drafts wiki entries for high-confidence picks.

**Architecture:** Thin Node.js script (`scripts/aihot-fetch.mjs`) handles the CSR-scraping problem only. A Claude slash command (`.claude/commands/aihot-pull.md`) does dedup, multi-label classification, triage UI, deep-fetching, raw writes, and conditional wiki drafting. No external services, no database — dedup keys live in `raw/_cards/_history.jsonl` and existing raw frontmatter.

**Tech Stack:** Node.js ≥ 20 (ESM, zero deps preferred), `node:test` for unit tests, `node:fetch` for HTTP, Playwright as last-resort fallback only. Claude Code skills + WebFetch tool for the orchestration layer.

**Spec reference:** `docs/superpowers/specs/2026-05-07-aihot-ingest-pipeline-design.md`

---

## File Structure

Files this plan creates or modifies:

```
ai/
├── scripts/
│   ├── aihot-fetch.mjs                              # CREATE — main scraper (Phase 1)
│   ├── aihot-fetch.notes.md                         # CREATE — probe findings (Phase 1)
│   └── aihot-fetch.test/
│       ├── parse.test.mjs                           # CREATE — unit tests
│       ├── smoke.mjs                                # CREATE — manual smoke test
│       └── fixtures/
│           ├── next_data_sample.html                # CREATE — try-1 fixture
│           └── api_sample.json                      # CREATE — try-2 fixture (if needed)
├── .claude/
│   └── commands/
│       └── aihot-pull.md                            # CREATE — slash command (Phase 2)
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   ├── 2026-05-07-aihot-ingest-pipeline-design.md  # EXISTS
│       │   └── aihot-fixtures/
│       │       └── golden-classification.json      # CREATE — classifier regression set
│       └── plans/
│           └── 2026-05-07-aihot-ingest-pipeline.md  # THIS FILE
└── raw/
    ├── _cards/
    │   ├── current/                                 # CREATE (empty dir)
    │   ├── _archive/                                # CREATE (empty dir)
    │   └── _history.jsonl                           # CREATE (empty file)
    ├── ai_native_infra/                             # CREATE
    ├── dev_methodology/                             # CREATE
    ├── engineering_roles/                           # CREATE
    ├── agent_engineering/                           # CREATE
    └── industry_insight/                            # CREATE
```

**Boundaries:**
- `scripts/aihot-fetch.mjs` is the only code file. Pure: fetches → parses → writes JSON to stdout.
- `.claude/commands/aihot-pull.md` is the orchestrator. Pure markdown prompt + Bash invocations.
- The 5 series directories under `raw/` are write targets; nothing reads from them except dedup glob.
- `_cards/current/` is workspace; `_cards/_archive/` is durable history; `_history.jsonl` is the dedup index.

---

## Phase 1 — Scraper (Tasks 1-7)

### Task 1: Bootstrap directory structure

**Files:**
- Create: `raw/_cards/current/.gitkeep`
- Create: `raw/_cards/_archive/.gitkeep`
- Create: `raw/_cards/_history.jsonl` (empty)
- Create: `raw/ai_native_infra/.gitkeep`
- Create: `raw/dev_methodology/.gitkeep`
- Create: `raw/engineering_roles/.gitkeep`
- Create: `raw/agent_engineering/.gitkeep`
- Create: `raw/industry_insight/.gitkeep`
- Create: `scripts/aihot-fetch.test/fixtures/.gitkeep`

- [ ] **Step 1: Create directories and placeholder files**

Run:
```bash
mkdir -p raw/_cards/current raw/_cards/_archive
mkdir -p raw/{ai_native_infra,dev_methodology,engineering_roles,agent_engineering,industry_insight}
mkdir -p scripts/aihot-fetch.test/fixtures
touch raw/_cards/current/.gitkeep
touch raw/_cards/_archive/.gitkeep
touch raw/_cards/_history.jsonl
touch raw/ai_native_infra/.gitkeep
touch raw/dev_methodology/.gitkeep
touch raw/engineering_roles/.gitkeep
touch raw/agent_engineering/.gitkeep
touch raw/industry_insight/.gitkeep
touch scripts/aihot-fetch.test/fixtures/.gitkeep
```

- [ ] **Step 2: Verify**

Run:
```bash
ls -la raw/_cards raw/ai_native_infra raw/dev_methodology raw/engineering_roles raw/agent_engineering raw/industry_insight scripts/aihot-fetch.test/fixtures
```
Expected: each directory exists with the placeholder file inside.

- [ ] **Step 3: Commit**

```bash
git add raw/ scripts/
git commit -m "chore: 初始化 aihot 流水线目录结构"
```

---

### Task 2: Probe aihot.virxact.com (one-time investigation)

**Goal:** Determine which fetch strategy is feasible BEFORE writing parser code. The whole architecture pivots on this finding.

**Files:**
- Create: `scripts/aihot-fetch.notes.md`
- Create: `scripts/aihot-fetch.test/fixtures/next_data_sample.html` (only if try-1 succeeds)
- Create: `scripts/aihot-fetch.test/fixtures/api_sample.json` (only if try-2 succeeds)

- [ ] **Step 1: Try strategy 1 — `__NEXT_DATA__` extraction**

Run:
```bash
curl -sL https://aihot.virxact.com/ -o /tmp/aihot_home.html
grep -c '__NEXT_DATA__\|__NUXT__\|__INITIAL_STATE__' /tmp/aihot_home.html
```

- If output is `1` or more: try-1 is viable. Save the HTML for parser fixture:
  ```bash
  cp /tmp/aihot_home.html scripts/aihot-fetch.test/fixtures/next_data_sample.html
  ```
  Inspect the JSON content:
  ```bash
  grep -oP '<script id="__NEXT_DATA__"[^>]*>\K[^<]+' /tmp/aihot_home.html | head -c 2000
  ```
  Note in `aihot-fetch.notes.md`: where in the JSON tree the items live (e.g. `props.pageProps.posts[]`), what fields are named (id, title, summary, tags, etc.).

- If output is `0`: try-1 fails, proceed to step 2.

- [ ] **Step 2: Try strategy 2 — reverse API**

Open https://aihot.virxact.com/ in a browser with DevTools open, Network tab filtered to XHR/Fetch. Reload. Look for requests to `/api/*` or similar. Record:

- Endpoint URL pattern
- Query parameters (especially date/page/limit)
- Response shape (paste a sample into `scripts/aihot-fetch.test/fixtures/api_sample.json`)
- Authentication required? (cookies, headers — usually no for public aggregators, but check)

If found: note in `aihot-fetch.notes.md`. If not found: try-2 fails, proceed to step 3.

- [ ] **Step 3: Try strategy 3 — Playwright (only if 1 and 2 both failed)**

Document the decision in `aihot-fetch.notes.md` that Playwright is required, and STOP this task. The plan branches: see "Playwright addendum" at the end of Phase 1 if you reach this step.

- [ ] **Step 4: Write notes file**

Create `scripts/aihot-fetch.notes.md` with this structure:

```markdown
# aihot-fetch implementation notes

## Probe date
2026-05-07 (update on each re-probe)

## Chosen strategy
[next_data | api | playwright]

## How items are retrieved
[concrete description: which URL, which JSON path, what auth]

## Field mapping (raw JSON → our contract)
| Our field           | Source path / regex                     |
|---------------------|------------------------------------------|
| aihot_id            | <e.g. data.props.pageProps.posts[].id>   |
| title               | <e.g. data.props.pageProps.posts[].title>|
| summary             | <...>                                    |
| recommendation_reason | <...>                                  |
| tags                | <...>                                    |
| starred_count       | <...>                                    |
| published_at        | <...>                                    |
| source_url          | <...>                                    |

## Pagination / windowing
[How to filter to last N days. Either client-side after fetch, or via API param.]

## Known quirks
[anything weird]
```

- [ ] **Step 5: Commit**

```bash
git add scripts/aihot-fetch.notes.md scripts/aihot-fetch.test/fixtures/
git commit -m "docs: aihot 站点探站记录与 fixture"
```

**Acceptance:** `aihot-fetch.notes.md` declares a chosen strategy AND has a populated field mapping table.

---

### Task 3: TDD — `deriveSourceType` utility

**Files:**
- Create: `scripts/aihot-fetch.mjs`
- Create: `scripts/aihot-fetch.test/parse.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `scripts/aihot-fetch.test/parse.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```
Expected: FAIL with `Cannot find module './aihot-fetch.mjs'` or similar.

- [ ] **Step 3: Implement `deriveSourceType`**

Create `scripts/aihot-fetch.mjs`:

```javascript
#!/usr/bin/env node
// aihot-fetch — fetch and parse aihot.virxact.com cards into JSON.
// Strategy: try __NEXT_DATA__ first, then reverse API, then Playwright.
// See aihot-fetch.notes.md for the chosen strategy.

const SOURCE_TYPE_RULES = [
  [/(^|\.)twitter\.com$|(^|\.)x\.com$/i, 'twitter'],
  [/(^|\.)mp\.weixin\.qq\.com$/i, 'wechat'],
  [/(^|\.)github\.com$|(^|\.)github\.io$/i, 'github'],
  [/(^|\.)arxiv\.org$/i, 'arxiv'],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/i, 'youtube'],
];

export function deriveSourceType(url) {
  try {
    const host = new URL(url).hostname;
    for (const [re, type] of SOURCE_TYPE_RULES) {
      if (re.test(host)) return type;
    }
    return 'blog';
  } catch {
    return 'blog';
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```
Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/aihot-fetch.mjs scripts/aihot-fetch.test/parse.test.mjs
git commit -m "feat(scripts): aihot-fetch deriveSourceType 域名映射"
```

---

### Task 4: TDD — `parseNextData` (only if try-1 chosen in Task 2)

**Skip this task if strategy is not `next_data`.** If strategy is `api`, see Task 4-alt below. If `playwright`, see Playwright addendum.

**Files:**
- Modify: `scripts/aihot-fetch.mjs`
- Modify: `scripts/aihot-fetch.test/parse.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `scripts/aihot-fetch.test/parse.test.mjs`:

```javascript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseNextData } from '../aihot-fetch.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = join(__dirname, 'fixtures', 'next_data_sample.html');

test('parseNextData: extracts items from real fixture', () => {
  const html = readFileSync(FIXTURE_PATH, 'utf-8');
  const items = parseNextData(html);
  assert.ok(Array.isArray(items), 'should return array');
  assert.ok(items.length > 0, 'should have at least one item');

  const item = items[0];
  assert.ok(typeof item.aihot_id === 'string' && item.aihot_id.length > 0, 'aihot_id required');
  assert.ok(typeof item.title === 'string' && item.title.length > 0, 'title required');
  assert.ok(typeof item.source_url === 'string', 'source_url required');
  assert.match(item.published_at, /^\d{4}-\d{2}-\d{2}T/, 'published_at must be ISO 8601');
  assert.equal(typeof item.source_type, 'string');
  assert.ok(Array.isArray(item.tags), 'tags must be array');
});

test('parseNextData: throws on missing __NEXT_DATA__', () => {
  assert.throws(() => parseNextData('<html><body>no payload</body></html>'),
    /__NEXT_DATA__ not found/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```
Expected: FAIL with `parseNextData is not exported` or similar.

- [ ] **Step 3: Implement `parseNextData`**

⚠ **You must adapt the field extraction to match what your probe (Task 2) found.** The skeleton below assumes the items live at `props.pageProps.posts[]` — replace `getPosts(data)` body to match your actual JSON tree. Example field names from the spec are placeholders; check `aihot-fetch.notes.md` for the real ones.

Append to `scripts/aihot-fetch.mjs`:

```javascript
const NEXT_DATA_RE = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/;

export function parseNextData(html) {
  const match = html.match(NEXT_DATA_RE);
  if (!match) throw new Error('__NEXT_DATA__ not found in HTML');
  let data;
  try {
    data = JSON.parse(match[1]);
  } catch (e) {
    throw new Error(`__NEXT_DATA__ JSON parse failed: ${e.message}`);
  }
  const rawPosts = getPosts(data);
  return rawPosts.map(toItem).filter(Boolean);
}

// REPLACE this body to match your probe findings.
// Example: data.props.pageProps.posts, or data.props.pageProps.feed.items, etc.
function getPosts(data) {
  return data?.props?.pageProps?.posts ?? [];
}

// REPLACE field names to match your probe findings.
function toItem(p) {
  if (!p?.id || !p?.title) return null;
  const source_url = p.sourceUrl ?? p.source_url ?? p.url ?? '';
  return {
    aihot_id: String(p.id),
    aihot_url: `https://aihot.virxact.com/post/${p.id}`,
    title: p.title,
    summary: p.summary ?? '',
    recommendation_reason: p.recommendationReason ?? p.recommendation_reason ?? '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    starred_count: Number(p.starredCount ?? p.starred_count ?? 0),
    published_at: toIso(p.publishedAt ?? p.published_at ?? p.createdAt),
    source_url,
    source_type: deriveSourceType(source_url),
  };
}

function toIso(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```
Expected: all tests PASS. If field assertions fail, the probe field mapping in `getPosts` / `toItem` needs to match the actual fixture structure.

- [ ] **Step 5: Commit**

```bash
git add scripts/aihot-fetch.mjs scripts/aihot-fetch.test/parse.test.mjs
git commit -m "feat(scripts): aihot-fetch parseNextData 解析 SSR payload"
```

---

### Task 4-alt: TDD — `parseApiResponse` (only if try-2 chosen)

**Skip this task if strategy is `next_data`.**

- [ ] **Step 1: Write the failing test**

Append to `scripts/aihot-fetch.test/parse.test.mjs`:

```javascript
import { parseApiResponse } from '../aihot-fetch.mjs';

const API_FIXTURE = JSON.parse(readFileSync(
  join(__dirname, 'fixtures', 'api_sample.json'), 'utf-8'));

test('parseApiResponse: maps API response to contract', () => {
  const items = parseApiResponse(API_FIXTURE);
  assert.ok(Array.isArray(items));
  assert.ok(items.length > 0);
  const item = items[0];
  assert.ok(item.aihot_id);
  assert.ok(item.title);
  assert.match(item.published_at, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(typeof item.source_type, 'string');
});
```

- [ ] **Step 2: Run, fail, implement, run, pass**

Adapt `parseApiResponse(json)` in `aihot-fetch.mjs` mirroring the `parseNextData` shape but operating on JSON instead of HTML. Field mapping comes from your probe.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(scripts): aihot-fetch parseApiResponse 解析后端 API"
```

---

### Task 5: TDD — `windowFilter` for `--since N d`

**Files:**
- Modify: `scripts/aihot-fetch.mjs`
- Modify: `scripts/aihot-fetch.test/parse.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `parse.test.mjs`:

```javascript
import { windowFilter } from '../aihot-fetch.mjs';

test('windowFilter: keeps items within N days', () => {
  const now = new Date('2026-05-07T12:00:00Z');
  const items = [
    { aihot_id: 'a', published_at: '2026-05-06T10:00:00Z' },
    { aihot_id: 'b', published_at: '2026-04-29T10:00:00Z' }, // 8 days old
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
```

- [ ] **Step 2: Run, fail**

Run:
```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```
Expected: FAIL with `windowFilter is not exported`.

- [ ] **Step 3: Implement**

Append to `aihot-fetch.mjs`:

```javascript
export function windowFilter(items, since, now = new Date()) {
  const days = typeof since === 'number'
    ? since
    : Number(String(since).replace(/d$/i, ''));
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error(`windowFilter: invalid since: ${since}`);
  }
  const cutoff = new Date(now.getTime() - days * 86400 * 1000);
  return items.filter(it => {
    const pub = new Date(it.published_at);
    return !isNaN(pub.getTime()) && pub >= cutoff;
  });
}
```

- [ ] **Step 4: Run, pass**

Run:
```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(scripts): aihot-fetch windowFilter 时间窗过滤"
```

---

### Task 6: Wire CLI + JSON output

**Files:**
- Modify: `scripts/aihot-fetch.mjs`

- [ ] **Step 1: Add CLI entry point**

Append to `scripts/aihot-fetch.mjs`:

```javascript
import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';

const HOMEPAGE = 'https://aihot.virxact.com/';

async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      since: { type: 'string', default: '7d' },
      limit: { type: 'string' },
      'from-fixture': { type: 'string' },
    },
  });

  const fetched_at = new Date();
  const errors = [];
  let items = [];
  let fetch_method = 'next_data';

  try {
    let html;
    if (values['from-fixture']) {
      html = await readFile(values['from-fixture'], 'utf-8');
      fetch_method = 'fixture';
    } else {
      const res = await fetch(HOMEPAGE, {
        headers: { 'User-Agent': 'Mozilla/5.0 aihot-fetch/0.1' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${HOMEPAGE}`);
      html = await res.text();
    }
    items = parseNextData(html);
  } catch (e) {
    errors.push({ stage: 'fetch_or_parse', message: e.message });
  }

  if (items.length === 0 && errors.length > 0) {
    process.stderr.write(`aihot-fetch fatal: ${errors.map(e => e.message).join('; ')}\n`);
    process.stderr.write(`If __NEXT_DATA__ is gone, re-probe and update parser.\n`);
    process.exit(1);
  }

  const filtered = windowFilter(items, values.since, fetched_at);
  const limited = values.limit ? filtered.slice(0, Number(values.limit)) : filtered;

  const output = {
    fetched_at: fetched_at.toISOString(),
    window: { since: values.since, until: fetched_at.toISOString() },
    source: 'aihot.virxact.com',
    fetch_method,
    items: limited,
    errors,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  process.exit(errors.length > 0 ? 2 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2)).catch(err => {
    process.stderr.write(`aihot-fetch unhandled: ${err.stack ?? err}\n`);
    process.exit(1);
  });
}
```

- [ ] **Step 2: Test fixture mode**

Run:
```bash
node scripts/aihot-fetch.mjs --from-fixture scripts/aihot-fetch.test/fixtures/next_data_sample.html --since 30d
```
Expected: JSON to stdout with `items[]` populated, exit code 0.

- [ ] **Step 3: Verify exit codes**

Run:
```bash
node scripts/aihot-fetch.mjs --from-fixture /tmp/does_not_exist.html
echo "exit: $?"
```
Expected: stderr message + exit code 1.

- [ ] **Step 4: Commit**

```bash
git add scripts/aihot-fetch.mjs
git commit -m "feat(scripts): aihot-fetch CLI 入口与 JSON 输出"
```

---

### Task 7: Smoke test against real aihot

**Files:**
- Create: `scripts/aihot-fetch.test/smoke.mjs`

- [ ] **Step 1: Create smoke runner**

Create `scripts/aihot-fetch.test/smoke.mjs`:

```javascript
#!/usr/bin/env node
// Manual smoke test — actually hits aihot.virxact.com.
// Run with: node scripts/aihot-fetch.test/smoke.mjs
// Do NOT add to CI — we don't want to hammer aihot.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(__dirname, '..', 'aihot-fetch.mjs');

const result = spawnSync('node', [SCRIPT, '--since', '7d'], { encoding: 'utf-8' });

if (result.status !== 0 && result.status !== 2) {
  console.error('SMOKE FAIL: exit', result.status);
  console.error(result.stderr);
  process.exit(1);
}

const output = JSON.parse(result.stdout);
console.log(`SMOKE: items=${output.items.length}, method=${output.fetch_method}, errors=${output.errors.length}`);
if (output.items.length === 0) {
  console.error('SMOKE WARN: zero items returned — site may have changed');
  process.exit(1);
}
console.log('First item:', JSON.stringify(output.items[0], null, 2));
```

- [ ] **Step 2: Run smoke test**

Run:
```bash
node scripts/aihot-fetch.test/smoke.mjs
```
Expected: prints `SMOKE: items=N, method=next_data, errors=0` with N > 0 and a sample item dump.

If this fails: re-run probe (Task 2) — site may have changed since you last looked.

- [ ] **Step 3: Commit**

```bash
git add scripts/aihot-fetch.test/smoke.mjs
git commit -m "test(scripts): aihot-fetch 真实站点 smoke test"
```

---

### Phase 1 Acceptance Criteria

Before moving to Phase 2, verify ALL of:

- [ ] `node --test scripts/aihot-fetch.test/` passes (all unit tests green)
- [ ] `node scripts/aihot-fetch.test/smoke.mjs` returns non-empty items from real aihot
- [ ] `scripts/aihot-fetch.notes.md` documents the chosen strategy and field mapping
- [ ] Running `node scripts/aihot-fetch.mjs --since 7d > /tmp/out.json` produces valid JSON with `items[]` and exit code 0 or 2
- [ ] Every item in output has `aihot_id`, `title`, `source_url`, `source_type`, `published_at` (ISO format)
- [ ] All 5 series directories under `raw/` exist and have `.gitkeep` so they appear in git

### Playwright Addendum (only if Tasks 2 strategies 1 and 2 both failed)

If you got here: create `scripts/aihot-fetch/` subdirectory with its own `package.json` (do NOT add Playwright to root). Install Playwright there, write the page navigation, replace the `fetch()` call in Task 6 Step 1 with a call into a new `fetchViaPlaywright()` function that returns the rendered HTML. Tests still apply — the parser stays the same since you're feeding it rendered HTML. Add `node_modules/` to `.gitignore` if not already.

---

## Phase 2 — Slash Command (Tasks 8-15)

### Task 8: Create slash command skeleton

**Files:**
- Create: `.claude/commands/aihot-pull.md`

- [ ] **Step 1: Write the command file with frontmatter and skeleton**

Create `.claude/commands/aihot-pull.md`:

````markdown
---
description: Pull recent aihot.virxact.com cards, classify into 4 blog series, triage, and write to raw/
argument-hint: [--since 7d] [--resume] [--dry-run]
---

You are running the aihot ingest pipeline. Spec: `docs/superpowers/specs/2026-05-07-aihot-ingest-pipeline-design.md`.

The user invoked: `/aihot-pull $ARGUMENTS`

Parse arguments:
- `--since <Nd>` (default `7d`)
- `--resume` (skip Step 1-4, read `raw/_cards/current/`)
- `--dry-run` (run Step 1-5, stop before writing anything)
- `--from-cards <path>` (skip Step 1 entirely, read items.json from given path; for golden-fixture testing)

Execute the 7 steps below in order. Stop and report to the user on any error.

## Step 1: Fetch from aihot

If `--from-cards <path>`: copy that file to `raw/_cards/current/items.json` and skip to Step 2.

If `--resume` and `raw/_cards/current/items.json` exists, skip to Step 2.

Otherwise: check `raw/_cards/current/done.flag` — if it exists, this is a stale completed run; archive it first:
- `mv raw/_cards/current raw/_cards/_archive/$(date +%Y-%m-%dT%H-%M-%S)`
- `mkdir -p raw/_cards/current`

Run: `node scripts/aihot-fetch.mjs --since <since>`

If exit code is 1: stop, show stderr to user, suggest re-running probe.
If exit code is 2: warn user about partial fetch, continue.
If exit code is 0: proceed.

Save stdout to `raw/_cards/current/items.json`.

## Step 2: Load dedup state

- Read `raw/_cards/_history.jsonl` line-by-line. Each line is `{"aihot_id": "...", "norm_key": "...", "raw_path": "..."}`.
- Glob `raw/**/*.md` (excluding `raw/_cards/`). For each, read frontmatter and extract `aihot_id` if present.
- Build `seen_ids` (Set of aihot_id strings) and `seen_norm_keys` (Set of normalized keys).
- Normalization: `normalize(title) = title.toLowerCase().replace(/\s+/g, '').replace(/[^\w一-龥]/g, '')` then concat with `aihot_url`.

## Step 3: Local filter

For each item in `items.json`:
- If `aihot_id` ∈ seen_ids: drop, count as "already seen"
- Else compute norm_key; if ∈ seen_norm_keys: drop, count as "already seen"
- Else: keep

Report dropped count to user.

## Step 4: LLM classification

For the kept items, classify them in a single batch using the rules below. Output a JSON array. Save to `raw/_cards/current/classification.json`.

### Classification rules

四个目标系列：
- **S1_infra** — AI Native 基础设施层。关键词：K8s、IaC、Terraform、控制平面、调度、GPU、平台工程、SRE、计算治理、可观测性
- **S2_methodology** — AI 时代的开发方法论。关键词：Vibe coding、SDD、Spec、Claude Code 用法、Agile + AI、提示工程、harness、工作流
- **S3_roles** — AI 时代工程师角色变迁。关键词：PM、EM、Architect、Senior Dev、Junior、招聘、组织变革、岗位被替代
- **S4_agent** — Agent 工程。关键词：Agent 架构、记忆、tool use、planner、multi-agent、autonomous loop、MCP

兜底桶：
- **S0_industry** — 行业洞察、思维模型、宏观趋势、不属于上面四类但有长期价值的内容

判定标准：
- `primary_series`: 一句话概括最契合哪个系列？只能选一个。
- `also_relevant`: 其他相关系列（可空，可多个）。
- `confidence`: `high` | `medium` | `low`
  - `high` = 跟系列核心议题直接相关，适合作为 blog 引用素材（有数据/有观点/有案例）
  - `medium` = 相关但偏边缘
  - `low` = 沾边但很弱
- `skip_reason`: 如果应该跳过，写明原因（产品广告、过度肤浅、重复主题等）。否则 `null`。

特别注意 S3_roles：aihot 没有"角色"标签，需要看正文/标题判断是否在讨论"AI 时代某个工程角色应该做什么"。常见错判：把"AI Codex 出新版"判成 S3，错。它属于 S2 或纯 SKIP。

输出 JSON 数组，包在 ```json ... ``` 围栏里，不要任何解释文字：

```json
[{
  "aihot_id": "...",
  "primary_series": "S1_infra | S2_methodology | S3_roles | S4_agent | S0_industry | SKIP",
  "also_relevant": [],
  "confidence": "high | medium | low",
  "skip_reason": null
}]
```

输出之前先在心里扫一遍：每条记录都有 `aihot_id` / `primary_series` / `confidence` 三个必填字段吗？没有就重新生成那条。

If parsing the JSON fails: retry once with the prefix "上次输出无法解析为 JSON，请只输出 JSON 数组". If second attempt also fails: write raw output to `raw/_cards/current/_failed_classification.txt`, stop, report to user.

## Step 5: Triage UI

Render a markdown table grouped by `primary_series`, with confidence badges:

```
━━━ Series 4 — Agent Engineering ━━━
 #1  [high]  论文：Mixture of Agents …  tags: 智能体,论文/研究
      理由: <recommendation_reason 截断 80 字>
 #2  [med]   X 帖：…
━━━ Series 1 — AI Native Infra ━━━
 #5  [high]  …
━━━ Series 0 — 行业洞察（兜底）━━━
 #11 [low]   …
━━━ SKIP（LLM 建议跳过）━━━
 #20 [—]    产品更新公告，不构成素材
```

Show summary: `候选 N / 已去重 M / SKIP 建议 K`

If `--dry-run`: stop here, report to user.

Otherwise ask:
> 勾选要入库的编号。语法：
> - 数字列表："1,3,5-8"
> - "all-high"：所有 confidence==high
> - "all-S4"（或 S1/S2/S3/S0）：某系列所有
> - "none"：跳过本次入库

Wait for user response. Parse selection into a set of `aihot_id`s.

## Step 6: Deep fetch + write raw

For each selected `aihot_id`:

1. Look up the item in `items.json` and its classification entry.
2. Determine fetch behavior by `source_type`:
   - `arxiv` / `github` / `blog` / `youtube`: WebFetch the `source_url`, prompt = "Extract the article body as clean markdown. Preserve code blocks, lists, headings. Drop nav, ads, comments."
   - `twitter` / `wechat`: skip WebFetch (high failure rate). Set `content_source: aihot_summary_only`, `fetch_status: skipped_by_source_type`.
3. If WebFetch was attempted and succeeded: `content_source: original_full`, `fetch_status: ok`. Body goes after frontmatter.
4. If WebFetch failed: `content_source: aihot_summary_only`, `fetch_status: failed`, `fetch_error: <message>`. Body left empty.
5. Compute slug:
   - If title is all ASCII: lowercase → keep `[a-z0-9]` → spaces to `-`
   - If title has Chinese: keep CJK + alphanumeric → other chars to `-`
   - Truncate to 80 chars
6. Map `primary_series` to directory:
   - S1_infra → `raw/ai_native_infra/`
   - S2_methodology → `raw/dev_methodology/`
   - S3_roles → `raw/engineering_roles/`
   - S4_agent → `raw/agent_engineering/`
   - S0_industry → `raw/industry_insight/`
7. Write to `raw/<series_dir>/<published_date>-<slug>.md` with this frontmatter:

```yaml
---
title: "<title>"
slug: <date>-<slug>
fetched_at: <fetched_at ISO>
aihot_id: "<aihot_id>"
aihot_url: <aihot_url>
aihot_published_at: <published_at>
aihot_tags: [<tags>]
aihot_starred: <starred_count>
aihot_summary: |
  <summary>
aihot_recommendation_reason: |
  <recommendation_reason>
source_url: <source_url>
source_type: <source_type>
content_source: <original_full | aihot_summary_only>
fetch_status: <ok | failed | skipped_by_source_type>
fetch_error: <null or error string>
classification:
  primary_series: <series>
  also_relevant: [<...>]
  confidence: <level>
---

<article body or empty>
```

(Note: `wiki_status`, `wiki_target`, and `wiki_conflict_with` are NOT written here — Step 7 adds them after deciding the wiki outcome. This avoids a transient `pending` value the spec doesn't define.)

8. Append to `raw/_cards/_history.jsonl`:
```json
{"aihot_id": "<id>", "norm_key": "<norm_key>", "raw_path": "<path>"}
```

After all selected items written: write `raw/_cards/current/done.flag` with current timestamp.

## Step 7: Conditional wiki draft + log

For each raw file just written, decide `wiki_status` per the table:

| 条件 | 行为 |
|------|------|
| `confidence != high` | `wiki_status: low_confidence_skipped`; no draft |
| `content_source != original_full` | `wiki_status: not_eligible_summary_only`; no draft |
| `confidence == high` AND `content_source == original_full`: read `wiki/index.md` and check for existing entries on the same topic |
| ↳ conflict found | `wiki_status: conflict_skipped`; set `wiki_conflict_with: <existing path>` |
| ↳ no conflict, draft quota OK (see hard gate below) | `wiki_status: drafted`; create `wiki/<category>/<title>.md` with `status: draft` |
| ↳ no conflict, draft quota exhausted | `wiki_status: deferred_draft_quota`; do not create draft |

> **Spec follow-up:** the values `deferred_draft_quota` and the `wiki_status` field semantics ("set in Step 7, not at raw write time") should be reflected in spec §4 enum. Update the spec when you finish this task.

Default `primary_series` → wiki category mapping:
- S1_infra → `AI基础设施`
- S2_methodology → `应用开发`
- S3_roles → `行业洞察`
- S4_agent → `模型与技术` (default) or `应用开发` if hands-on code
- S0_industry → `行业洞察`

Wiki draft frontmatter (extends existing schema in CLAUDE.md):

```yaml
---
title: <title>
category: <mapped category>
tags: [<derived tags>]
source: "[[raw/<series_dir>/<filename without .md>]]"
updated: <today YYYY-MM-DD>
status: draft
aihot_origin:
  aihot_id: "<id>"
  aihot_url: <aihot_url>
  series: <primary_series>
  drafted_by: aihot-pull
  drafted_at: <today>
---

## 定义
<one-sentence what this is>

## 核心要点
- <bullet>
- <bullet>

## 与其他概念的关系
- [[wiki/<related>|<related title>]]: <relationship>

## 参考来源
- [[raw/<series_dir>/<filename without .md>|<source title>]]
```

Update each raw file's frontmatter with the final `wiki_status`, `wiki_target`, `wiki_conflict_with`.

**Hard gate (risk #3 from spec):** before drafting, count `wiki/**/*.md` files with `status: draft`. If count > 10, refuse to draft new ones — write `wiki_status: deferred_draft_quota` to the raw file instead, and report to user that they need to clean up existing drafts.

Append to `wiki/log.md`:

```markdown
## [<today>] aihot-pull --since <since> | 候选 <N> / 入库 <M> / 起草 wiki <D>
- run-id: <fetched_at>
- 入库:
  - <list of new raw paths with (series, content_source)>
- 起草 wiki draft:
  - <list of new wiki paths>
- 冲突跳过:
  - "<title>" ↔ <conflicting wiki path>
- 抓取降级:
  - <list of fetch_failed raw paths with reason>
- LLM 建议跳过: <count> 条（<top 2 skip_reason categories>）
```

Write `raw/_cards/current/wiki_drafted.flag`.

## Final report to user

Summarize:
- N items pulled, M dropped as duplicates, K classified as SKIP
- L items selected by user, written to raw/
- D wiki drafts created, C conflicts skipped, S summary-only items not eligible for draft
- Any errors encountered

End: "Run logged to wiki/log.md. Review wiki drafts (`status: draft`) when ready."
````

- [ ] **Step 2: Verify the file is loaded by Claude Code**

Run:
```bash
ls -la .claude/commands/aihot-pull.md
```
Expected: file exists.

In a fresh Claude Code session, type `/aihot-pull --help` (or just `/aihot-pull` and let it explain). Claude should recognize the slash command.

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/aihot-pull.md
git commit -m "feat(commands): /aihot-pull slash command 骨架"
```

---

### Task 9: Build golden classification fixture

**Files:**
- Create: `docs/superpowers/specs/aihot-fixtures/golden-classification.json`

- [ ] **Step 1: Run a real fetch and pick 15 cards**

Run:
```bash
node scripts/aihot-fetch.mjs --since 14d > /tmp/aihot_2w.json
```

- [ ] **Step 2: Hand-label 15 representative cards**

Pick a mix:
- 3 clear S1 (infra/K8s/platform)
- 3 clear S2 (methodology/Claude Code/SDD)
- 2 S3 (roles, harder to find — may need 1)
- 4 S4 (agent/MCP/multi-agent)
- 1 S0 (industry insight)
- 2 SKIP (product release notes, shallow content)

Create `docs/superpowers/specs/aihot-fixtures/golden-classification.json`:

```json
{
  "labeled_at": "2026-05-07",
  "items": [
    {
      "aihot_id": "<from real fetch>",
      "title": "<truncated title>",
      "expected_primary_series": "S4_agent",
      "expected_confidence": "high",
      "rationale": "Multi-agent paper with concrete benchmarks — fits Agent series core."
    }
  ]
}
```

Fill in 15 entries. Aim for diversity so the classifier is exercised across borderline cases.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/aihot-fixtures/
git commit -m "test(specs): aihot 分类黄金集（15 条人工标注）"
```

---

### Task 10: Dry-run test against golden fixture

**Files:** none modified — verification only

- [ ] **Step 1: Stage golden items into a fake fetch output**

Manually craft a `/tmp/golden_run.json` shaped like real script output but containing only the 15 golden items. (Can be derived from the real fetch in Task 9.)

- [ ] **Step 2: Run /aihot-pull against the golden file**

Run:
```
/aihot-pull --from-cards /tmp/golden_run.json --dry-run
```

This uses the `--from-cards` flag added to the slash command in Task 8, bypassing real fetch. The classifier still runs in Step 4 against the 15 golden items.

Compare the classifier's output to `golden-classification.json`. Tally manually:
- "Match" = classifier `primary_series` equals expected `primary_series`
- "Soft match" = expected `primary_series` appears in classifier's `also_relevant[]`
- "Miss" = neither

Target: ≥ 80% primary match across the 15 items. If lower, refine the classification prompt in `aihot-pull.md` (typically: add more keywords, sharpen the S3 disambiguation rule, tighten SKIP criteria).

- [ ] **Step 3: Iterate prompt until accuracy passes**

Each iteration:
- Edit `.claude/commands/aihot-pull.md` Step 4 rules
- Re-run dry-run against golden
- Commit only when accuracy ≥ 80%

```bash
git commit -m "fix(commands): 调优 aihot 分类 prompt（black-box accuracy <X> → <Y>）"
```

- [ ] **Step 4: Final commit checkpoint**

No revert needed (Task 10 used the proper `--from-cards` flag, not a temporary stub). Confirm:
```bash
git status
```
Expected: clean working tree if no further prompt edits, otherwise commit them.

---

### Phase 2 Acceptance Criteria

- [ ] `/aihot-pull --dry-run --since 7d` runs end-to-end through Step 5 without crashing, produces a triage table
- [ ] Classifier hits ≥ 80% on the golden fixture (Task 10)
- [ ] Selecting `none` exits cleanly without writing any raw/ files
- [ ] Selecting `all-high` from a real run writes the expected raw files with all required frontmatter fields
- [ ] Wiki drafts created have `status: draft` and `aihot_origin.drafted_by: aihot-pull`
- [ ] `wiki/log.md` has a new run entry with all required fields
- [ ] `raw/_cards/_history.jsonl` has new lines for each raw file written
- [ ] `raw/_cards/current/done.flag` and `wiki_drafted.flag` exist after a successful run
- [ ] Re-running `/aihot-pull` on the same window returns 0 candidates (dedup works)
- [ ] Hard gate works: with 11 `status: draft` files in wiki/, new high-confidence candidates get `wiki_status: deferred_draft_quota`

---

## Phase 3 — Bootstrap & Calibration (Tasks 11-12)

### Task 11: 30-day backfill run

**Files:** state changes only — raw/, wiki/, log

- [ ] **Step 1: Run backfill**

```
/aihot-pull --since 30d
```

Expected: 80-150 candidates after dedup. Triage carefully — do NOT select more than ~10 items. Goal is calibration data, not bulk ingestion.

- [ ] **Step 2: Commit the harvest**

```bash
git add raw/ wiki/
git commit -m "ingest: aihot 首次 30 天回填（<N> 条）"
```

- [ ] **Step 3: Snapshot the run for calibration log**

Save the triage output (or screenshot it). Note:
- Which items got misclassified
- Which got SKIP'd that you actually wanted
- Wiki draft quality (subjective)

---

### Task 12: Update Calibration Log in spec

**Files:**
- Modify: `docs/superpowers/specs/2026-05-07-aihot-ingest-pipeline-design.md`

- [ ] **Step 1: Append to the Calibration Log section**

At the bottom of the spec, replace `（待首次校准期后填充）` with your first entry:

```markdown
### 2026-05-07 run-1（30 天回填）
- 候选数: <N> / 入库: <M> / 起草 wiki: <D>
- LLM 错判:
  - "<title fragment>" 应为 <SX> 实判 <SY>，原因: <observation>
- 漏判（应入库但被 LLM 跳过）:
  - "<title fragment>" reason: <observation>
- prompt 调整:
  - <specific change made to .claude/commands/aihot-pull.md>
```

If you made prompt changes during this calibration, also update the live prompt in the slash command file.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-05-07-aihot-ingest-pipeline-design.md .claude/commands/aihot-pull.md
git commit -m "docs(spec): aihot 流水线首次校准记录"
```

---

### Phase 3 Acceptance Criteria

- [ ] At least one weekly run completed (`/aihot-pull --since 7d`) after the 30-day backfill
- [ ] Calibration Log has at least one entry
- [ ] Classifier still passes golden fixture at ≥ 80% after any prompt tuning
- [ ] `wiki/log.md` shows ≥ 2 distinct run dates (proves the pipeline runs more than once without breaking)

---

## Overall Acceptance: pipeline ready for weekly use

- [ ] All Phase 1, 2, 3 acceptance criteria met
- [ ] You've personally run `/aihot-pull --since 7d` once successfully without your hand on the keyboard except for triage selection
- [ ] At least one wiki draft produced by the pipeline has been promoted to `status: stable` after your review (proving the draft → review → stable flow works end-to-end)
