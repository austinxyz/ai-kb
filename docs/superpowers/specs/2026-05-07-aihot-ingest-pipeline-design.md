---
title: aihot.virxact.com → raw → wiki Ingest Pipeline
date: 2026-05-07
status: approved
related:
  - C:/Users/lorra/projects/blogs/docs/superpowers/specs/2026-05-06-blog-content-strategy-design.md
---

# aihot.virxact.com → raw → wiki Ingest Pipeline

## 背景与目标

昨天定下的 blog 内容战略（见 related spec）确定了 4 个系列：

- **Series 1** — AI Native Infrastructure
- **Series 2** — Dev Methodology in the AI Era
- **Series 3** — Engineering Roles in the AI Era
- **Series 4** — Agent Engineering

仅靠个人经验输出 blog 容易题材枯竭。需要一条**外部高质量信息 → 系列分类 → raw/ → wiki/**
的持续供给链路，把别人的实践沉淀为自己 blog 的素材库。

选定信息源：[aihot.virxact.com](https://aihot.virxact.com/)。该站点对 AI 业内文章/论文/Twitter
帖/公众号文做了一轮编辑筛选，每条带 **标题 / 摘要 / 推荐理由 / 标签 / 精选数 / 源链接**。
标签体系（智能体 / 编码 / 部署/工程 / 论文/研究 / 现象/趋势 / 安全/对齐 / 产品更新）跟我们的
4 个系列匹配度高。

### 目标（用户场景）

> 我每周一次，跑一个命令，看到上周 aihot 上跟我 4 个系列相关的 20-30 篇候选，
> 勾选感兴趣的，让流水线自动抓原文 + 落 raw/，高置信的还顺手起草成 wiki draft，
> 一两个月后我开始写下一篇 blog 时，wiki/ 已经有不少结构化素材可引用。

### 非目标

- 不做全自动 cron — 编辑判断必须有人在环
- 不做实时推送 / 通知
- 不为 aihot 之外的源做适配（未来可能扩展，本期不设计）
- 不做生产级数据管道（无数据库、无监控、无告警）

---

## 关键决策摘要（用户确认过）

| 决策 | 选择 |
|------|------|
| 自动化级别 | 半自动 + 人工 triage |
| raw/ 落什么 | 深抓原文全文 + 保留 aihot 卡片作为元数据 |
| 分类策略 | 多标签 + 可跨系列（一篇文章可同属 Series 1 + Series 4）|
| 节奏 | 每周一次 |
| 候选容量 | 每次 20-30 个 |
| raw → wiki | 高置信项自动起草 wiki（status: draft），其他停在 raw |
| 实施方案 | 薄抓取层（Node 脚本）+ Claude skill 编排 |

---

## §1 — 目录结构 & 命名

### 仓库变更

```
ai/
├── scripts/
│   └── aihot-fetch.mjs              # 唯一的代码 (Node ESM)
├── .claude/
│   └── commands/
│       └── aihot-pull.md            # /aihot-pull slash command
├── raw/
│   ├── ai_native_infra/             # 新建：Series 1（对齐 wiki/AI基础设施）
│   ├── dev_methodology/             # 新建：Series 2（对齐 wiki/应用开发 一部分）
│   ├── engineering_roles/           # 新建：Series 3（对齐 wiki/行业洞察 一部分）
│   ├── agent_engineering/           # 新建：Series 4（对齐 wiki/模型与技术 + 部分 应用开发）
│   ├── industry_insight/            # 新建：兜底桶（S0 / 不属于任一系列但有长期价值）
│   ├── _cards/                      # 新建：临时区，最近一次 run 的候选元数据 (JSON)
│   │   ├── current/                 # 当前 run 的工作目录（覆盖式）
│   │   │   ├── items.json           # Step 1 输出
│   │   │   ├── classification.json  # Step 4 输出
│   │   │   ├── done.flag            # Step 6 完成后写
│   │   │   └── wiki_drafted.flag    # Step 7 完成后写
│   │   ├── _archive/                # done.flag 的 run 在下次启动时归档进来
│   │   └── _history.jsonl           # dedup 用的全量历史索引（每行一条）
│   ├── ai_usage/                    # 保留：现有目录不动
│   ├── applications/                # 保留：现有目录不动
│   ├── sdlc/                        # 保留：现有目录不动
│   ├── agents/                      # 保留：现有目录不动
│   └── others/                      # 保留：现有目录不动
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-07-aihot-ingest-pipeline-design.md  # 本文件
```

### 设计原则

1. **新增 5 个按系列命名的目录**，不动现有 5 个目录。
   - 现有 raw/ 是按"内容类型"分类的（sdlc / agents / ai_usage…）
   - 本流水线按 blog **系列**驱动
   - 两套语义混用会打架，因此互不重叠：旧资料留原位置，流水线产物只进新建系列目录

2. **`raw/_cards/current/` 是临时工作区**，不是正式 raw 内容。
   - 每次 /aihot-pull 把卡片元数据写在这里
   - triage 后被选中的卡片才会被深抓并写入对应系列目录
   - 用户确认不会同时跑两个 run，因此用 `current/` 覆盖式而非 run-id 子目录

3. **文件名规则**：`raw/<series>/YYYY-MM-DD-<slug>.md`
   - 日期前缀使用 `aihot_published_at`（不是 `fetched_at`），按发布时间排序更直观
   - slug 生成规则见 §4

4. **`scripts/` 是新增目录**，仓库目前没有。
   - 用 Node ESM `.mjs`，零依赖优先（用 `node:fetch`，不引 axios）
   - 仅在 Playwright 兜底场景下才引入依赖，且独立放 `scripts/aihot-fetch/` 子项目避免污染主仓库

---

## §2 — `aihot-fetch.mjs` 抓取策略 + 数据契约

**职责边界**：脚本只做一件事——把 aihot 上 [now − N 天] 内的卡片列表提取成 JSON。
不做分类、不抓原文、不写 raw/。所有 LLM 相关的事都在 skill 里。

### 抓取方式（默认 + fallback）

aihot 在 2026-05-08 之后**直接提供公开 REST API**（`https://aihot.virxact.com/agent` 文档），匿名免费、字段完整、`nextCursor` 分页、文档化。第一版 spec 写的三级 fallback 仅留 RSC scrape 作历史 fallback。

```
默认：公开 REST API（2026-05-08 起）
  GET /api/public/feed?mode=selected&since=<ISO>&take=100[&cursor=<nextCursor>]
  零依赖、字段全（含 duplicateCount/duplicateSources），是 aihot 自己的 OpenAPI 端点

Fallback：RSC payload scrape（v1 实现）
  fetch /all?page=N → 提取 self.__next_f.push 里的 JSON
  AIHOT_BACKEND=rsc 环境变量切回去；原始 v1 解析逻辑全部保留

Last resort：Playwright headless
  仅当上面两条都失败才考虑；第一版 spec 设计但从未触发
```

**实现策略**：默认 API；脚本通过 `process.env.AIHOT_BACKEND` 选 `'api' | 'rsc'`。
两条路径输出字段统一（同一个 `toContractItem` 映射），下游 dedup/triage/Step6 不感知 backend 差别。

**注意**：API selected 集合 ≈ 站点数据库层的 `aiSelected=true` 全量；RSC `/all?page=*` 是站点首页排序后的子集。两者通常**不完全对齐**（实测 30d 窗口 API 800 / RSC 356 / 交集 39）。这两个集合都属合法的 `aiSelected=true` 子集，只是排序/分页策略不同。

### 数据契约（脚本 stdout 输出）

```json
{
  "fetched_at": "2026-05-07T13:30:00+08:00",
  "window": { "since": "2026-04-30", "until": "2026-05-07" },
  "source": "aihot.virxact.com",
  "fetch_method": "public_api | paginated_all | fixture",
  "curated_only": true,
  "items": [
    {
      "aihot_id": "<aihot 内部稳定 ID>",
      "aihot_url": "",
      "title": "OpenAI Codex 进入 Chrome",
      "summary": "从终端跑进 Chrome，不接管浏览器，对前端开发是…",
      "recommendation_reason": "<aihot 编辑的推荐理由>",
      "tags": ["编码", "产品更新"],
      "starred_count": 75,
      "published_at": "2026-05-07T04:10:00+08:00",
      "source_url": "https://twitter.com/openai/status/...",
      "source_type": "twitter",
      "aiSelected": true,
      "duplicate_count": 0,
      "duplicate_sources": []
    }
  ],
  "errors": []
}
```

### 字段约定

| 字段 | 说明 |
|------|------|
| `aihot_id` | 站点内部稳定 ID（不是 URL 哈希）。dedup 主键 |
| `aihot_url` | 始终空字符串。aihot 是聚合站，**没有内部详情页**，卡片直接跳到 `source_url` |
| `source_type` | 由脚本根据 source_url domain 推导。规则见下方 |
| `duplicate_count` | API 返回的同主题文章计数；可作为 dedup 增强信号（>1 说明 aihot 自己已识别为重复主题） |
| `duplicate_sources` | API 返回的重复来源域名列表；triage 时可用于人工判重 |
| 时间戳 | 统一 ISO 8601 + 本地时区 (+08:00)，避免后续解析歧义 |
| `errors[]` | 非致命问题（某条卡片字段缺失等），跳过但记录 |

### `source_type` 推导规则

按顺序匹配 `source_url` 的 hostname，第一个命中的赢：

```
hostname 含 "twitter.com" 或 "x.com"           → twitter
hostname 含 "mp.weixin.qq.com"                 → wechat
hostname 含 "github.com" 或 "github.io"        → github
hostname 含 "arxiv.org"                         → arxiv
hostname 含 "youtube.com" 或 "youtu.be"        → youtube
其他所有                                         → blog
```

注：`other` 留作未来扩展（例如 podcast、HN 等），第一版不主动用，所有未识别的归 `blog`
让 WebFetch 试一次。

### CLI 接口

```bash
node scripts/aihot-fetch.mjs --since 7d                    # 默认 7 天，走公开 API
node scripts/aihot-fetch.mjs --since 14d --limit 50        # 显式参数
node scripts/aihot-fetch.mjs --since 7d > out.json         # 重定向便于调试
node scripts/aihot-fetch.mjs --from-fixture path/to.json   # 测试模式（见 §6）
AIHOT_BACKEND=rsc node scripts/aihot-fetch.mjs --since 7d  # 切回 RSC scrape fallback
node scripts/aihot-fetch.mjs --since 7d --all              # mode=all：含非 aiSelected 项
```

### 退出码

- `0` — 成功
- `1` — 致命错误（网络/解析全失败）
- `2` — 部分成功（errors[] 非空但有数据）

### 不做的事（明确划出范围）

- **不做去重**：脚本每次返回窗口内全部卡片。dedup 由 skill 在拿到 JSON 后跟 `_history.jsonl` + 现有 raw 对比完成。脚本无状态。
- **不调 LLM**：保持脚本 deterministic，纯解析逻辑。
- **不写文件**：只往 stdout 输出。slash command 决定写不写。

---

## §3 — Slash command 执行步骤 + LLM 分类逻辑

### 关键澄清：没有"外部 LLM 调用"

`/aihot-pull` 是 markdown 文件（`.claude/commands/aihot-pull.md`），里面是给 Claude 的指令。
分类、triage、dedup 判断都是当时执行命令的 Claude 实例自己做，不需要额外 API key、
不需要付费调用。WebFetch 也是 Claude 自带工具。"LLM 分类" = 在 prompt 里写清楚分类
规则，Claude 边读 JSON 边输出 markdown 表格。

### 7 步执行流

```
Step 1: 调脚本拿 JSON
  Bash: node scripts/aihot-fetch.mjs --since ${ARG_SINCE:-7d}
  捕获 stdout，解析为 items[]
  写到 raw/_cards/current/items.json（崩溃恢复用）

Step 2: 加载 dedup 状态
  • 读 raw/_cards/_history.jsonl（每行一个已处理过的 aihot_id + 归一化键）
  • Glob raw/**/*.md，提取 frontmatter 里 aihot_id 字段
  • 合并成 seen_ids set + seen_norm_keys set

Step 3: 本地过滤
  对 items[] 逐条：
    - 若 aihot_id ∈ seen_ids → 跳过
    - 若 normalize(title)+aihot_url ∈ seen_norm_keys → 跳过
    - 否则进入候选队列

Step 4: LLM 分类（单批 inline 处理）
  对剩余 N 条，按下方 prompt 规则一次性输出 JSON 数组
  写到 raw/_cards/current/classification.json

Step 5: 渲染 triage 表
  Markdown 表 + 编号，按 primary_series 分组显示
  接受的用户输入语法：
    • 数字列表："1,3,5-8"（混合单数和区间）
    • "all-high"：选中所有 confidence == high 的条目
    • "all-S4"：选中所有 primary_series == S4_agent 的条目（其他系列同理）
    • "none"：跳过本次入库（直接进 Step 7 的 archive 流程，不写 raw）
  此时 session 中断 → 下次 /aihot-pull --resume 可恢复

Step 6: 深抓 + 写 raw
  对用户选中的每条：
    a. 按 source_type 选抓取策略（见下表）
    b. 抓到正文 markdown
    c. 写 raw/<series>/YYYY-MM-DD-<slug>.md（frontmatter 见 §4）
    d. 追加 _history.jsonl
  完成后写 raw/_cards/current/done.flag

Step 7: 高置信项起草 wiki + 更新日志
  对 Step 6 写下的每个 raw 文件，按下表设置 wiki_status：

  ┌────────────────────────────────────┬─────────────────────────────────────────┐
  │ 条件                                │ wiki_status + 行为                       │
  ├────────────────────────────────────┼─────────────────────────────────────────┤
  │ confidence != high                 │ low_confidence_skipped；不起草          │
  │ content_source != original_full    │ not_eligible_summary_only；不起草       │
  │ confidence == high                 │ 用 LLM 跟 wiki/index.md 对比：           │
  │   AND content_source == full       │   有冲突 → conflict_skipped + 填        │
  │                                    │     wiki_conflict_with                  │
  │                                    │   无冲突 → drafted；创建 wiki/<分类>/    │
  │                                    │     <title>.md (status: draft)          │
  └────────────────────────────────────┴─────────────────────────────────────────┘

  更新 wiki/log.md 追加本次 run 摘要
  写 raw/_cards/current/wiki_drafted.flag
```

### 按 source_type 的深抓策略表

| source_type | 抓取手段 | 失败兜底 |
|------------|---------|---------|
| blog (任意域名) | WebFetch | 标记 `content_source: aihot_summary_only`、`fetch_status: failed` |
| github | WebFetch（README/issue/PR）| 同上 |
| arxiv | WebFetch（abstract 页）| abstract 已够，PDF 不抓 |
| twitter / x | WebFetch（公开 thread）| 大概率失败，**直接降级为只存 aihot 摘要+链接**，不视作 fetch_failed |
| wechat (mp.weixin.qq.com) | WebFetch | WeChat 经常反爬，按 twitter 同样降级 |
| youtube | 不抓视频，抓视频描述/简介 via WebFetch | 失败则只存元数据 |
| other | WebFetch 试一次 | 失败按 twitter 同样降级 |

**关键设计**：抓不到原文不是 fatal，raw/ 里的卡片元数据本身有价值。但 frontmatter
必须诚实标记 `content_source: original_full | aihot_summary_only`，让起草 blog 时
一眼看出哪些是从原文挖的、哪些是二手摘要。

### 分类 prompt（嵌入 slash command 文件）

````
你是这个 ai 知识库的分类器。给定一组 aihot 卡片（JSON），按下列规则输出分类决策。

四个目标系列：
- S1_infra: AI Native 基础设施层。关键词：K8s、IaC、Terraform、控制平面、调度、
  GPU、平台工程、SRE、计算治理、可观测性
- S2_methodology: AI 时代的开发方法论。关键词：Vibe coding、SDD、Spec、Claude Code
  用法、Agile + AI、提示工程、harness、工作流
- S3_roles: AI 时代工程师角色变迁。关键词：PM、EM、Architect、Senior Dev、Junior、
  招聘、组织变革、岗位被替代
- S4_agent: Agent 工程。关键词：Agent 架构、记忆、tool use、planner、multi-agent、
  autonomous loop、MCP

兜底桶：
- S0_industry: 行业洞察、思维模型、宏观趋势、不属于上面四类但有长期价值的内容

判定标准：
- primary_series：这篇内容如果用一句话概括，最契合哪个系列？只能选一个。
- also_relevant：列出其他相关系列（可空，可多个）。
  例：一篇关于 Agent Runtime on K8s 的文章 primary=S4_agent, also_relevant=[S1_infra]
- confidence：
  · high = 内容跟系列核心议题直接相关，且适合作为 blog 引用素材（有数据/有观点/有案例）
  · medium = 相关但偏边缘（产品 release notes、片段性评论）
  · low = 沾边但很弱
- skip_reason: 如果你认为应该跳过，写明原因

特别注意 Series 3 (S3_roles)：aihot 没有"角色"标签，需要看正文/标题判断是否在
讨论"AI 时代某个工程角色应该做什么"。常见错判：把"AI Codex 出新版"判成 S3，
错。它属于 S2 或纯 SKIP。

输出 JSON 数组，包在 ```json ... ``` 围栏里，不要任何解释文字：
[{ "aihot_id": "...", "primary_series": "...", "also_relevant": [...],
   "confidence": "...", "skip_reason": "..." }]

输出之前先在心里扫一遍：每条记录都有 aihot_id / primary_series / confidence 三个
必填字段吗？没有就重新生成那条。
````

---

## §4 — Frontmatter Schema

### raw/ 文件 frontmatter

```yaml
---
# ── 文件本身 ────────────────────────────────
title: "Mixture of Agents: Enhancing LLM Capabilities"
slug: 2026-05-07-mixture-of-agents
fetched_at: 2026-05-07T13:30:00+08:00

# ── aihot 来源元数据（dedup 主键 + 兜底键）────
aihot_id: "abc123def"
aihot_url: https://aihot.virxact.com/post/abc123def
aihot_published_at: 2026-05-07T04:10:00+08:00
aihot_tags: [智能体, 论文/研究]
aihot_starred: 75
aihot_summary: |
  …aihot 编辑写的中文摘要（原样保留）
aihot_recommendation_reason: |
  …推荐理由（原样保留，最有价值的二次素材）

# ── 原始来源 ───────────────────────────────
source_url: https://arxiv.org/abs/...
source_type: arxiv
content_source: original_full          # original_full | aihot_summary_only
fetch_status: ok                       # ok | failed | skipped_by_source_type
fetch_error: null                       # 抓失败时填错误信息

# ── 分类结果（来自 §3 的 LLM 判断）────────────
classification:
  primary_series: S4_agent
  also_relevant: [S2_methodology]
  confidence: high

# ── wiki 起草状态 ──────────────────────────
wiki_status: drafted                   # drafted | conflict_skipped | low_confidence_skipped | not_eligible_summary_only
wiki_target: wiki/模型与技术/Mixture-of-Agents.md
wiki_conflict_with: null                # 若 conflict_skipped，填冲突的现有 wiki path
---

<原文正文 markdown，content_source=original_full 时填，否则留空只靠 frontmatter 元数据>
```

### wiki/ draft frontmatter（在现有 schema 上加 1 个字段）

现有 schema：`title / category / tags / source / updated / status`。新增 `aihot_origin`：

```yaml
---
title: Mixture of Agents
category: 模型与技术
tags: [agent, multi-agent, llm-ensemble]
source: "[[raw/agent_engineering/2026-05-07-mixture-of-agents]]"
updated: 2026-05-07
status: draft                          # 自动起草必须是 draft，待 review 后改 stable

# ── 新增：标记来自流水线 ─────────────────
aihot_origin:
  aihot_id: "abc123def"
  aihot_url: https://aihot.virxact.com/post/abc123def
  series: S4_agent
  drafted_by: aihot-pull                # 标记自动生成，便于以后批量 lint
  drafted_at: 2026-05-07
---
```

### 系列 → wiki category 默认映射

LLM 起草 wiki 时按下表选 category，**允许覆盖**（某篇 Agent 文章可能其实属于 应用开发）：

| primary_series | 默认 wiki category |
|----------------|------------------|
| S1_infra | AI基础设施 |
| S2_methodology | 应用开发 |
| S3_roles | 行业洞察 |
| S4_agent | 模型与技术（默认）/ 应用开发（如果偏实战代码） |
| S0_industry | 行业洞察 |

### Slug 生成规则

```
1. 如果 title 全 ASCII：lowercase → 保留 a-z 0-9 → 空格转 -
   "Mixture of Agents: Enhancing LLM" → mixture-of-agents-enhancing-llm

2. 如果 title 含中文：保留汉字 + 字母数字 → 标点空格转 -
   "Karpathy 的 LLM Wiki 实验" → Karpathy-的-LLM-Wiki-实验

3. 长度截断 80 字符（不含日期前缀）

4. 最终：raw/<series>/YYYY-MM-DD-<slug>.md
   日期用 aihot_published_at 而非 fetched_at
```

### 关键约束

- **`status: draft` 不可绕过**——自动起草的 wiki 不允许直接写 `stable`。这是质量闸门。
  用户 review 后手动改 `stable`，并删掉 `aihot_origin.drafted_by` 字段（表示已亲自审过）。
- **`aihot_id` 是 dedup 真理来源**。aihot 改 ID 体系时归一化兜底键继续工作
  （normalize = 去标点+小写+去空白的标题 + aihot_url）。
- **`content_source` 必填**——区分"读过原文"和"只看过摘要"的关键。引用前者放心，
  引用后者要先回去读原文。

---

## §5 — 错误处理 & 中断恢复

### 失败矩阵

| # | 失败点 | 触发条件 | 处理策略 |
|---|--------|---------|---------|
| 1 | `aihot-fetch.mjs` 网络/解析全失败 | aihot 站点宕机 / 改版 / DNS 挂 | 脚本退出码 1，stderr 打印诊断；slash command 立即停在 Step 1，不进入分类。**不要**重试——需要人看错误判断 |
| 2 | `aihot-fetch.mjs` 部分失败 | 大多数卡片解析正常，少数字段缺失 | 脚本退出码 2，items[] 里缺字段的卡片仍输出但带 `partial: true`，errors[] 累计计数。slash command 看到 exitCode=2 时，把"部分失败"作为告警显示给用户，但流程继续 |
| 3 | LLM 分类输出不是合法 JSON | Claude 抽风、被 prompt 扰乱 | slash command 解析失败时**重试一次**（带"上次输出无法解析为 JSON，请只输出 JSON 数组"的修正 prompt）。第二次仍失败则停在 Step 4，把原始输出留到 `raw/_cards/current/_failed_classification.txt` 让人手工修 |
| 4 | WebFetch 抓原文失败 | 网络超时 / 403 / paywall / Twitter 公开链接被限流 | **降级而非失败**：raw 文件照样写，但 `content_source: aihot_summary_only`、`fetch_status: failed`、`fetch_error: <错误信息>`。Step 6 继续处理下一条。Step 7 起草 wiki 时**仅在 `content_source == original_full` 的项里挑高置信项**——只有摘要的不会被起草成 wiki draft（避免把二手摘要包装成"知识"）|
| 5 | wiki draft 冲突 | LLM 发现已有同主题 wiki 条目 | 不创建 draft。raw 文件 frontmatter 写 `wiki_status: conflict_skipped`、`wiki_conflict_with: <现有 wiki path>`。在 wiki/log.md 记录冲突列表 |

### 中断恢复

最常见场景：Step 5 triage 阶段思考要不要选某条，临时关了 Claude Code，回来想接着处理。

**`raw/_cards/current/` 是恢复关键。**

```
Step 1 拿到 JSON 后写 raw/_cards/current/items.json
Step 2-4 dedup + 分类完成后写 classification.json 到同目录
Step 5 triage 等待用户输入时，session 中断 → 什么都不丢

重新 /aihot-pull --resume 会读 raw/_cards/current/，跳过 Step 1-4 直接显示 triage 表

Step 6 选中并写完 raw/<series>/ 后，写 done.flag
Step 7 起草 wiki 后追加 wiki_drafted.flag

下次运行 /aihot-pull（不带 --resume）时：
  - 若 raw/_cards/current/ 有 done.flag：归档进 raw/_cards/_archive/<timestamp>/
    并把新增 dedup 键合并进 _history.jsonl，然后清空 current/
  - 若没有 done.flag：提示用户"上次 run 未完成，--resume 继续，或 --discard 丢弃"
```

### LLM 分类的鲁棒性补丁

§3 的分类 prompt 在 Step 4 实际执行时，slash command 会强制 LLM 把输出包在
`` ```json ... ``` `` 围栏里，并在 prompt 末尾加自检语句。Claude 自己跟自己做最后
一道校验，不需要外部 schema validator。

### wiki/log.md 日志规范

每次 /aihot-pull 末尾必追加一条，**即便没有任何文件被入库**。空 run 也要记，
便于后续看时间线：

```markdown
## [2026-05-07] aihot-pull --since 7d | 候选 24 / 入库 7 / 起草 wiki 3
- run-id: 2026-05-07T13:30
- 入库:
  - raw/agent_engineering/2026-05-07-mixture-of-agents.md (S4, original_full)
  - raw/ai_native_infra/2026-05-06-k8s-gpu-scheduling.md (S1, original_full)
- 起草 wiki draft:
  - wiki/模型与技术/Mixture-of-Agents.md
- 冲突跳过:
  - "RAG with vector DB" ↔ wiki/应用开发/Agentic-RAG.md
- 抓取降级（content_source=aihot_summary_only）:
  - raw/agent_engineering/2026-05-04-some-x-thread.md (twitter, fetch_failed)
- LLM 建议跳过: 17 条（产品更新 12 / 主题肤浅 5）
```

---

## §6 — 测试 / 首次启用 / 维护

### 测试策略

| 层级 | 测什么 | 怎么测 |
|------|--------|--------|
| **`aihot-fetch.mjs` 单元** | 三种抓取路径的解析逻辑 | `scripts/aihot-fetch.test/fixtures/` 放三组 fixture：(a) 真实 `__NEXT_DATA__` 的 HTML 片段、(b) 模拟 API 响应 JSON、(c) Playwright 页面 HTML 快照。脚本提供 `--from-fixture <path>` 模式跳过网络。Node 自带 `node:test` 跑断言：契约字段在、source_type 推导正确、时间戳 ISO 格式 |
| **`aihot-fetch.mjs` 集成** | 真打 aihot 一次 | `scripts/aihot-fetch.smoke.mjs` 跑一次真实 fetch 验证 `items.length > 0` 和契约字段。**手动跑**，不上 CI（避免给 aihot 持续打流量）。每月跑一次 + 每次怀疑站点改版时跑 |
| **slash command dry-run** | 流水线骨架不跑深抓和写文件 | `/aihot-pull --dry-run` 跑完 Step 1-5 到 triage 表停下，不接受用户输入也不写任何 raw/wiki。预览 LLM 分类质量 |
| **分类 prompt 黄金集** | LLM 分类对我们这套语义的稳定性 | `docs/superpowers/specs/aihot-fixtures/golden-classification.json` 放 ~15 条人工标注好 primary_series 的 aihot 卡片。每次改分类 prompt 后跑 dry-run 比对，准确率掉 10% 以上要警觉。**手工运行的回归测试**，不上 CI |
| **wiki dedup 路径** | 高置信冲突识别 | 跑 dry-run 后人工核对 Step 7 的冲突列表是否合理。前 4 周收集偏差，调 prompt |

**明确不做的测试**：

- 不做 E2E 自动测试。核心是 LLM 判断，自动化 E2E 价值低、维护贵
- 不做覆盖率指标。脚本逻辑简单到 ~150 行；wiki 分类是判断题不是工程题
- 不写 mock LLM 的测试——等于测 prompt 串，无意义

### 首次启用流程

```
1. 安装：
   - 确认 node >= 20
   - 不需要 npm install（脚本零依赖）；Playwright 兜底再单独建子项目
   - 创建目录：
     mkdir -p raw/_cards/current raw/_cards/_archive
     mkdir -p raw/{ai_native_infra,dev_methodology,engineering_roles,agent_engineering,industry_insight}
     touch raw/_cards/_history.jsonl

2. 探站（一次性）：
   - 写 aihot-fetch.mjs 之前手动开 DevTools Network 看 aihot 主页的 XHR/fetch
   - 优先记下试探 1（__NEXT_DATA__）能不能找到，找到就完工 80%
   - 把发现写进 scripts/aihot-fetch.notes.md（实现细节笔记）

3. 第一次跑：
   /aihot-pull --since 30d   # 初始填充 30 天
   预期 80-150 个候选；triage 时只勾最确定的，建议初次只入 5-10 条
   目的：用真实数据校准分类 prompt，发现哪些标签经常被误判

4. 校准期（前 2-4 周）：
   每周一次 /aihot-pull --since 7d
   每次 triage 后 5 分钟回看：
     - LLM 把哪些条判错系列了？
     - 哪些被 LLM 跳过的其实想要？
     - 高置信起草的 wiki，质量过得去吗？
   把这些观察记到本 spec 末尾的 "Calibration Log" 章节，每次校准都更新分类 prompt
```

### 维护信号矩阵

aihot 站改版几乎肯定会发生。维护信号 + 应对：

| 信号 | 含义 | 行动 |
|------|------|------|
| `aihot-fetch.mjs` 退出码 1，stderr 说 "`__NEXT_DATA__` 找不到了" | 试探 1 失效，但试探 2/3 没自动接管 | 手动重跑探站，找新 API 端点，改脚本，跑 fixture 单测确认无回归 |
| 退出码 2 持续，errors[] 同一字段缺失 | 卡片结构变了 | 改字段映射，加 fixture |
| LLM 黄金集准确率 < 70% | 主题分布漂移 | 调 prompt 关键词列表，更新 fixture |
| 连续两次 /aihot-pull 入库 0 条 | 分类太严 / aihot 没新内容 / 审美升级 | 看 wiki/log.md 的"LLM 建议跳过"比例，决定调 confidence 门槛还是放宽 |

**无需主动维护的**：

- `aihot-fetch.mjs` 的依赖（零依赖）
- frontmatter schema（向前兼容设计：新增字段 OK，不删字段）
- 现有 raw/wiki 目录（流水线只在新建的系列目录里写）

### 风险登记

| # | 风险 | 影响 | 应对 |
|---|------|------|------|
| 1 | Twitter / WeChat 抓不到原文，raw 大部分是二手摘要 | 长期下来 wiki/ 起草的素材变浅 | 第 2 周校准时统计 `content_source: aihot_summary_only` 占比。超过 50% 时，考虑为 X 单独走另一条路（手贴 thread 文本作为 fallback）|
| 2 | LLM 分类 drift（Claude 模型升级后行为变化） | 黄金集准确率漂移 | 每次升级模型后跑一次 dry-run + 黄金集比对（10 分钟成本）|
| 3 | wiki/ 被 draft 淹没 | 高置信门槛松了，wiki/ 堆满 status:draft 没时间审 | **硬性闸门**：wiki/ 中 `status: draft` 数量 > 10 时，下次 /aihot-pull 拒绝起草新 draft，强制先清理 |

---

## Calibration Log

每次 /aihot-pull 后的校准观察记录（首次跑后开始填）。

格式：

```
### YYYY-MM-DD run-N
- 候选数: X / 入库: Y / 起草 wiki: Z
- LLM 错判:
  - "<标题片段>" 应为 SX 实判 SY，原因: ...
- 漏判（应入库但被 LLM 跳过）:
  - "<标题片段>" reason: ...
- prompt 调整:
  - <具体改了哪条规则>
```

（待首次校准期后填充）
