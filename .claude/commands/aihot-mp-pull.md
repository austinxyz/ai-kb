---
description: "[DEPRECATED 2026-05-08] aihot /mp 公众号爆文 — 上游需虚实传媒内部 SSO，匿名访问被关"
---

# ⚠️ DEPRECATED 2026-05-08

aihot.virxact.com/mp 在 2026-05-08 被关给匿名用户，需 `login.virxact.com` 登录，但该 SSO **仅限虚实传媒公司同事与签约博主**，外部用户拿不到账号。Playwright auth backend 因此走不通。

**保留这套代码**（fetcher / parser / playwright 后端 / 单测 / 这个 slash command）作为历史档案 —— 如果未来 aihot 暴露 `/api/public/mp` 公开端点或恢复匿名访问，删掉这个 banner 即可立即复活。

---

You are running the aihot-mp ingest pipeline (公众号爆文 list).

Spec note: mp items have **no summary, no tags, no recommendation reason**, and microsoft 微信 articles can NOT be body-extracted (anti-scrape captcha). This pipeline is intentionally minimal: list → user pick → write raw frontmatter (no body, no WebFetch, no LLM classify, no wiki draft).

Parse arguments from the user's invocation:
- `--since <window>` (default `30d`); accepted: `24h | 7d | 30d | 365d | all`. Numeric like `Nd` is normalized.
- `--resume` (skip Step 1, read `raw/_cards/current_mp/items.json`)
- `--dry-run` (run Step 1-4, stop before writing)
- `--from-fixture <path>` (read fixture HTML for parsing, skip network)
- `--limit <N>` (truncate after dedup; useful for testing)
- `--backend <name>` (`http` default; `playwright` to use authenticated session — needed since 2026-05-08 when aihot put /mp behind login wall)

## Pre-flight: login required for /mp (since 2026-05-08)

aihot.virxact.com/mp redirects anonymous users to /. To use this command you need a one-time signed-in session via Playwright:

```bash
node scripts/aihot-mp-fetch-playwright.mjs --login
```

This launches a headed Chromium → log in via the 登录 button → press ENTER in the terminal → session saved to `.aihot/storage-state.json` (gitignored). After that, runs use `--backend playwright` (or env `MP_BACKEND=playwright`) to reuse the saved session headlessly.

If you see "no storage state at .aihot/storage-state.json" or "session expired" errors at Step 1, re-run `--login`.

Run the 6 steps below. Stop and report on any error.

## Step 1: Fetch /mp

Working dir: `raw/_cards/current_mp/`. If `--from-fixture <path>`, run with that flag. If `--resume` AND `items.json` exists, skip to Step 2.

Otherwise:
- If `current_mp/done.flag` exists (stale completed run): archive first.
  ```bash
  mv raw/_cards/current_mp "raw/_cards/_archive/$(date +%Y-%m-%dT%H-%M-%S)-mp"
  mkdir -p raw/_cards/current_mp
  ```
- If `items.json` exists but no `done.flag`: ask user `--resume` vs `--discard` before continuing.

Run via Bash. Default backend is `http` (anonymous, will hit 307 since aihot's auth wall) — pass `--backend playwright` to use the saved auth session:

```bash
# preferred (authenticated)
node scripts/aihot-mp-fetch.mjs --since <since> --backend playwright

# legacy (broken since 2026-05-08, but kept for fixtures / future reopen)
node scripts/aihot-mp-fetch.mjs --since <since>
```

- Exit 1: stop, show stderr.
- Exit 2: warn user partial fetch, continue.
- Exit 0: proceed.

Save stdout to `raw/_cards/current_mp/items.json`.

## Step 2: Dedup

Build `seen_ids` from:
1. `raw/_cards/_history.jsonl` (shared with /aihot-pull — same site, same ID space)
2. Glob `raw/wechat_hotposts/**/*.md` and `raw/**/*.md` (excl. `raw/_cards/`); read `aihot_id` from frontmatter.

For each item in `items.json`:
- Drop if `aihot_id ∈ seen_ids`.
- Else keep.

Report dropped count.

## Step 3: Sort + render

**No LLM classification.** Just sort and display.

Default sort: `read_count` desc; ties broken by `anomaly_score` desc.

Render markdown (use TaskCreate / Bash node script — your choice). Format:

```
━━━ aihot /mp 公众号爆文 (since=<window>) ━━━
 #1   [10w+读] [1897赞 / 2635转] | 赛博禅心
       Anthropic 和 OpenAI，同一天成立合资公司
       2026-05-05 | https://mp.weixin.qq.com/...
 #2   [62k 读] [604 赞 / 3823 转] | AI寒武纪
       最新！Claude Code 创始人：编程已经解决了……
       ...
```

Cap visible list at 50 (top-50 by read). Note total available beyond cap.

末尾统计：`抓到 N / 已去重 M / 待选 K`。

If `--dry-run`: stop here, report and exit.

Otherwise prompt:

> 勾选要入库的编号。语法：
> - 数字列表：`1,3,5-8`
> - `top-N`：top N 条按 read_count
> - `account:<name>`：某个公众号全部（如 `account:量子位`）
> - `none`：跳过本次入库

Wait for user input. Parse to a set of `aihot_id`.

## Step 4: Validate selection

- If user enters `top-N`: pick first N items in current sort order.
- If `account:<name>`: filter by `account === <name>` (exact, after URL-decoding the slug).
- Numeric ranges: standard expand, then map row numbers to aihot_ids.
- `none`: skip to Step 6 archive only.

Report final selection count to user.

## Step 5: Write raw md files

For each selected item:

1. Slug:
   - All-ASCII title: lowercase, keep `[a-z0-9]`, spaces → `-`, truncate 80 chars.
   - Contains CJK: keep CJK + alnum, others → `-`, truncate 80 chars.
2. Filename: `<date>-<slug>.md` where date is from `published_at` interpreted as CST (UTC+8) date — but mp dates are already date-only and stored as UTC midnight, so just take the YYYY-MM-DD prefix as-is.
3. Path: `raw/wechat_hotposts/<filename>`. Create dir if needed.
4. Frontmatter (no body, just a link below):

```yaml
---
title: "<原标题>"
slug: <YYYY-MM-DD>-<slug>
fetched_at: <ISO>
aihot_id: "<id>"
aihot_url: ""
aihot_published_at: <ISO>
source_url: <url>
source_type: wechat
content_source: aihot_summary_only
fetch_status: skipped_by_source_type
fetch_error: null
mp_account: "<account>"
mp_account_slug: "<slug>"
mp_read_count: <int>
mp_like_count: <int>
mp_share_count: <int>
mp_anomaly_score: <int>
wiki_status: not_eligible_summary_only
---

> 📖 [在微信打开原文](<source_url>)
>
> 公众号：<account> · 阅读 <read_count> · 点赞 <like_count> · 转发 <share_count>
```

5. Append to `raw/_cards/_history.jsonl`:
   ```json
   {"aihot_id":"<id>","norm_key":"<normalize(title)>||<source_url>","raw_path":"<written path>","stream":"mp"}
   ```
   The `stream: "mp"` field distinguishes mp entries from /aihot-pull entries when reading history later.

After writes: `raw/_cards/current_mp/done.flag`.

## Step 6: Log + summary

Append to `wiki/log.md`:

```markdown
## [<YYYY-MM-DD>] aihot-mp-pull --since <since> | 候选 <N> / 入库 <M>
- run-id: <fetched_at>
- 入库:
  - <list of new raw paths with read/like counts>
- 顶部公众号: <top accounts by count>
```

Final report to user:
- N 个候选拉到、M 个去重丢掉
- L 个被你选中、写入 raw/wechat_hotposts/
- 任何错误

收尾："运行已记录到 wiki/log.md。这些都是仅含 metadata + 链接的书签，要看正文请点链接到微信。"

## Important rules

1. **不做 LLM 分类**：mp 没 summary/tags 信号弱
2. **不做 WebFetch**：微信反爬，直接放弃，不试
3. **不做 wiki draft**：内容不全，没法提炼要点
4. **共用 `_history.jsonl`**：跨流去重（如果同一篇也在 /aihot-pull 抓到过，再次出现会被 dedup 掉）
5. **slug 算法跟 /aihot-pull 一致**（CJK 友好、80 char 截断）
6. **raw 路径独立**：`raw/wechat_hotposts/`，不混在 S0-S4 五个分类目录里
