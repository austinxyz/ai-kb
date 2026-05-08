---
description: 抓 aihot.virxact.com 精选条目，按 4 个 blog 系列分类、triage、写入 raw/，高置信项起草 wiki draft
argument-hint: [--since 3d] [--resume] [--dry-run] [--from-cards <path>]
---

You are running the aihot ingest pipeline. Spec: `docs/superpowers/specs/2026-05-07-aihot-ingest-pipeline-design.md`. Plan: `docs/superpowers/plans/2026-05-07-aihot-ingest-pipeline.md`.

User invoked: `/aihot-pull $ARGUMENTS`

Parse arguments from $ARGUMENTS (default `--since 3d` when not specified):
- `--since <Nd>` (e.g. `3d`, `7d`)
- `--resume` (skip Step 1-4, read `raw/_cards/current/`)
- `--dry-run` (run Step 1-5, stop before writing anything)
- `--from-cards <path>` (skip Step 1, read items.json from given path; for fixture testing)

Execute the 7 steps below in order. Stop and report on any error.

## Step 1: Fetch from aihot

If `--from-cards <path>`: copy that file to `raw/_cards/current/items.json`. Skip to Step 2.

If `--resume` AND `raw/_cards/current/items.json` exists: skip to Step 2.

Otherwise: check `raw/_cards/current/done.flag`.
- If exists (stale completed run): archive first.
  ```bash
  mv raw/_cards/current "raw/_cards/_archive/$(date +%Y-%m-%dT%H-%M-%S)"
  mkdir -p raw/_cards/current
  ```
- If `items.json` exists but no `done.flag`: ask the user whether to `--resume` or `--discard` (delete current/ contents) before continuing.

Run via Bash:
```bash
node scripts/aihot-fetch.mjs --since <since>
```

- Exit code 1: stop. Show stderr to user. Suggest re-probing the site.
- Exit code 2: warn user about partial fetch. Continue.
- Exit code 0: proceed.

Save stdout to `raw/_cards/current/items.json`.

## Step 2: Load dedup state

Build two sets — `seen_ids` and `seen_norm_keys`:

1. Read `raw/_cards/_history.jsonl` line-by-line. Each line is JSON `{"aihot_id": "...", "norm_key": "...", "raw_path": "..."}`. Add `aihot_id` to `seen_ids`, `norm_key` to `seen_norm_keys`.

2. Glob `raw/**/*.md` (excluding files under `raw/_cards/`). For each match, read frontmatter; if it has `aihot_id`, add to `seen_ids`; if it has both `title` and `source_url`, compute `norm_key = normalize(title) + "||" + source_url` and add to `seen_norm_keys`.

Normalization function:
```
normalize(title) = title.toLowerCase()
  .replace(/\s+/g, '')         // strip all whitespace
  .replace(/[^\w一-鿿]/g, '')   // keep only alnum + CJK
```

## Step 3: Local filter

For each item in `items.json`:
- If `aihot_id ∈ seen_ids`: drop, count as "已处理".
- Else compute `norm_key = normalize(title) + "||" + source_url`. If `norm_key ∈ seen_norm_keys`: drop, count as "已处理".
- Else: keep.

Report dropped count to user.

## Step 4: LLM classification

Classify the kept items in a single batch using the rules below. Save to `raw/_cards/current/classification.json` as a JSON array.

### Classification rules

四个目标系列：

- **S1_infra** — AI Native 基础设施层。
  关键词：K8s、IaC、Terraform、控制平面、调度、GPU、平台工程、SRE、计算治理、可观测性、Service Mesh、AI 平台

- **S2_methodology** — AI 时代的开发方法论。
  关键词：Vibe coding、SDD、Spec、Claude Code 用法、Agile + AI、提示工程、harness、工作流、AI 编程实践、IDE/工具配置

- **S3_roles** — AI 时代工程师角色变迁。
  关键词：PM、EM、Architect、Senior Dev、Junior、招聘、组织变革、岗位被替代、能力升级路径、产业人才趋势

- **S4_agent** — Agent 工程。
  关键词：Agent 架构、Agent 记忆、tool use、planner、multi-agent、autonomous loop、MCP、function calling、agent harness 设计

兜底桶：

- **S0_industry** — 行业洞察、思维模型、宏观趋势。不属于上面四类但有长期价值的内容。

### Per-item output schema

对每条候选输出一个对象：

```json
{
  "aihot_id": "<id>",
  "primary_series": "S1_infra | S2_methodology | S3_roles | S4_agent | S0_industry | SKIP",
  "also_relevant": ["<other series>", ...],
  "confidence": "high | medium | low",
  "skip_reason": "<reason if SKIP, else null>"
}
```

判定准则：

- `primary_series`：一句话概括最契合哪个系列？只能选一个。
- `also_relevant`：其他相关系列（可空，可多个）。例：Agent Runtime on K8s → primary=S4_agent, also_relevant=[S1_infra]
- `confidence`：
  - `high` = 跟系列核心议题直接相关，适合作为 blog 引用素材（有数据/有观点/有案例）
  - `medium` = 相关但偏边缘
  - `low` = 沾边但很弱
- `skip_reason`：应该跳过则写明（产品广告、过度肤浅、纯发布通告、重复主题等）；否则 `null`

特别注意 S3_roles：aihot 没有"角色"标签，需要看正文/标题判断是否在讨论"AI 时代某个工程角色应该做什么"。常见错判："AI Codex 出新版" 不是 S3，应是 S2 或纯 SKIP。

输出整个 JSON 数组，包在 ` ```json ... ``` ` 围栏里，不要任何解释文字。

输出之前先在心里扫一遍：每条记录都有 `aihot_id` / `primary_series` / `confidence` 三个必填字段吗？没有就重新生成那条。

如果 JSON 解析失败：用修正 prompt 重试一次（"上次输出无法解析为 JSON，请只输出 JSON 数组"）。第二次仍失败：把原始输出写到 `raw/_cards/current/_failed_classification.txt`，停下，报告给用户。

## Step 5: Triage UI

渲染 markdown 表，按 `primary_series` 分组。每组内按 confidence 排序（high → medium → low）：

```
━━━ Series 4 — Agent Engineering ━━━
 #1  [high]  Mixture of Agents：用 LLM ensemble 做 multi-agent
      tags: 智能体, 论文/研究  |  source: arxiv  |  starred: 80
      推荐理由: <截 80 字>
 #2  [med]   X 帖：…

━━━ Series 1 — AI Native Infra ━━━
 #5  [high]  …

━━━ Series 0 — 行业洞察（兜底）━━━
 #11 [low]   …

━━━ SKIP（LLM 建议跳过）━━━
 #20 ―     产品发布通告，不构成素材
```

末尾给出统计：`原始 N / 已去重 M / 进入 triage K / 其中 SKIP J`。

如果 `--dry-run`：停在这里，报告给用户即可。

否则提示用户：

> 勾选要入库的编号。语法：
> - 数字列表："1,3,5-8"（混合单数和区间）
> - "all-high"：所有 confidence == high
> - "all-S4"（或 S1/S2/S3/S0）：某系列所有
> - "none"：跳过本次入库（直接进 Step 7 归档流程，不写 raw）

等用户输入。解析为一个 `aihot_id` set。

## Step 6: 深抓 + 写 raw

对用户选中的每条 (按 selection 顺序处理)：

1. 从 `items.json` 取 item，从 `classification.json` 取分类。
2. 按 `source_type` 决定抓取行为：
   - `arxiv` / `github` / `blog` / `youtube`: 用 WebFetch 抓 `source_url`，prompt = "提取文章正文为干净 markdown。保留代码块、列表、标题。去掉导航/广告/评论/订阅提示。如内容是中文则保留中文。"
   - `twitter` / `wechat`: 跳过 WebFetch（成功率低）。设 `content_source: aihot_summary_only`、`fetch_status: skipped_by_source_type`。
3. 抓取成功：`content_source: original_full`、`fetch_status: ok`。正文放在 frontmatter 后面。
4. 抓取失败：`content_source: aihot_summary_only`、`fetch_status: failed`、`fetch_error: <错误>`。正文留空。
5. 计算 slug：
   - 全 ASCII 标题：`toLowerCase()` → 保留 `[a-z0-9]` → 空格转 `-` → 截断 80 字符
   - 含中文：保留汉字 + 字母数字 → 其他字符转 `-` → 截断 80 字符
6. 系列 → 目录映射：
   - S1_infra → `raw/ai_native_infra/`
   - S2_methodology → `raw/dev_methodology/`
   - S3_roles → `raw/engineering_roles/`
   - S4_agent → `raw/agent_engineering/`
   - S0_industry → `raw/industry_insight/`
7. 文件名：`<YYYY-MM-DD>-<slug>.md`，日期取 `aihot_published_at` 的 CST 日期（UTC + 8）。
8. Frontmatter（不写 `wiki_status` / `wiki_target` / `wiki_conflict_with` —— 由 Step 7 追加）：

```yaml
---
title: "<原标题>"
slug: <YYYY-MM-DD>-<slug>
fetched_at: <ISO 8601>
aihot_id: "<id>"
aihot_url: ""
aihot_published_at: <ISO>
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
fetch_error: <null | string>
classification:
  primary_series: <series>
  also_relevant: [<...>]
  confidence: <high | medium | low>
---

<article body when content_source == original_full, otherwise empty>
```

9. 追加一行到 `raw/_cards/_history.jsonl`：
```json
{"aihot_id":"<id>","norm_key":"<norm_key>","raw_path":"<written path>"}
```

全部写完后写空标记：`raw/_cards/current/done.flag`（内容是 ISO 时间戳）。

## Step 7: 条件起草 wiki + 日志

**硬性闸门**：先 `glob wiki/**/*.md`，过滤 frontmatter `status: draft` 的文件，统计数量。
若 > 10：本次 run 拒绝起草任何 wiki draft。所有候选 raw 文件都标 `wiki_status: deferred_draft_quota`，不创建 wiki 文件。最后报告给用户："wiki/ 已有 X 个 draft，先清理再起草新的"。

否则按下表对每个 Step 6 写下的 raw 文件决定：

| 条件 | 行为 |
|------|------|
| `confidence != high` | `wiki_status: low_confidence_skipped`；不起草 |
| `content_source != original_full` | `wiki_status: not_eligible_summary_only`；不起草 |
| `confidence == high` AND `content_source == original_full`：读 `wiki/index.md` 找同主题条目 |  |
| ↳ 找到冲突 | `wiki_status: conflict_skipped`；填 `wiki_conflict_with: <现有 wiki path>` |
| ↳ 无冲突 | `wiki_status: drafted`；创建 `wiki/<分类>/<title>.md` (status: draft) |

`primary_series` → wiki category 默认映射（允许 LLM 判断后覆盖）：

- S1_infra → `AI基础设施`
- S2_methodology → `应用开发`
- S3_roles → `行业洞察`
- S4_agent → `模型与技术`（默认）/ `应用开发`（如果偏实战代码）
- S0_industry → `行业洞察`

Wiki draft frontmatter（扩展现有 schema）：

```yaml
---
title: <短标题>
category: <mapped category>
tags: [<derived tags>]
source: "[[raw/<series_dir>/<filename without .md>]]"
updated: <YYYY-MM-DD>
status: draft
aihot_origin:
  aihot_id: "<id>"
  aihot_url: ""
  series: <primary_series>
  drafted_by: aihot-pull
  drafted_at: <YYYY-MM-DD>
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

更新每个 raw 文件的 frontmatter 以追加最终的 `wiki_status` / `wiki_target` / `wiki_conflict_with`。

追加日志到 `wiki/log.md`（即使 0 入库也要记）：

```markdown
## [<YYYY-MM-DD>] aihot-pull --since <since> | 候选 <N> / 入库 <M> / 起草 wiki <D>
- run-id: <fetched_at>
- 入库:
  - <list of new raw paths with (series, content_source)>
- 起草 wiki draft:
  - <list of new wiki paths>
- 冲突跳过:
  - "<title>" ↔ <conflicting wiki path>
- 抓取降级（content_source=aihot_summary_only）:
  - <list with reason>
- LLM 建议跳过: <count> 条（top 跳过原因 1 / 跳过原因 2）
```

写空标记：`raw/_cards/current/wiki_drafted.flag`。

## 终态报告

汇总给用户：

- N 个候选拉到、M 个去重丢掉、K 个 LLM 建议跳过
- L 个被你选中、写入 raw/
- D 个 wiki draft 创建、C 个冲突跳过、S 个因仅有摘要不起草
- 任何错误

收尾："运行已记录到 wiki/log.md。`status: draft` 的 wiki 条目请抽时间 review。"
