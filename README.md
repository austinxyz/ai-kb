# AI 知识库

AI 技术知识的三层结构化知识库（公开）。基于 Karpathy LLM Wiki Pattern——原始资料随时间积累 → wiki 条目随每次 ingest 复利精炼。

## 三层结构

| 目录 | 入库 | 内容 |
|------|------|------|
| `raw/` | ✅ | 最新文章、论文、技术报告（公开内容）|
| `wiki/` | ✅ | 提炼后的知识条目，统一 frontmatter + 4 段固定结构 |
| `output/` | ❌ gitignored | 个人学习感想、未整理笔记 |

## raw/ 子目录约定

5 个分类目录（4 主系列 + 1 兜底），由 `/aihot-pull` 自动归类：

| 目录 | 系列 | 主题 |
|---|---|---|
| `raw/agent_engineering/` | **S4_agent** | Agent 架构、记忆、tool use、planner、multi-agent、MCP、harness 设计 |
| `raw/dev_methodology/` | **S2_methodology** | AI 时代开发方法论、Vibe coding、SDD、Claude Code/Codex 用法、prompt 工程 |
| `raw/ai_native_infra/` | **S1_infra** | AI Native 基础设施层（K8s、GPU、推理引擎、网络协议、平台工程）|
| `raw/engineering_roles/` | **S3_roles** | AI 时代工程师角色变迁、PM/EM/Architect、组织变革、人才趋势 |
| `raw/industry_insight/` | **S0_industry** | 兜底：行业洞察、宏观趋势、思维模型；不属上 4 类但有长期价值的内容 |

另有：

- `raw/wechat_hotposts/` — `/aihot-mp-pull` 写入的微信公众号爆文书签（**已 DEPRECATED**，aihot 把 /mp 关给匿名用户）
- `raw/_cards/_history.jsonl` — 跨流去重日志，每行记录 `{aihot_id, norm_key, raw_path, stream}`
- `raw/_cards/current/`、`raw/_cards/current_mp/` — gitignored，pipeline 临时工作区

## 工作流（三种 aihot 接入）

### 1. `/aihot-daily` — 早上 30 秒扫一眼

```bash
/aihot-daily               # 最新日报（北京时间 08:00 生成）
/aihot-daily 2026-05-08    # 指定日期
/aihot-daily --list 14     # 看最近 14 天的日报清单
/aihot-daily --no-save     # 单次跳过本地归档
```

调 aihot 公开端点 `/api/public/daily`，渲染 5 版块（模型发布/产品发布/行业动态/论文研究/技巧与观点）到终端，每条带标题 + 一句摘要 + 来源 + 原文 URL。**不入库、不分类、不起 wiki**。

每次自动把渲染版存到 `daily/aihot/<日期>.md`（gitignored，幂等：upstream 同 `generatedAt` 跳过，重新生成则覆盖）。

### 2. daily-save — 看到值得留的，单条入库

读完 daily 后用 "**版块-编号**" 格式告诉 Claude（如 `产品-5`、`技巧与观点-7`）：

1. 重抓 daily JSON 拿到那条的 source_url
2. **正文**：blog/arxiv/github → `aihot-extract.mjs` (readability + turndown) 抓全文；twitter/wechat → 跳过抓取（反爬）
3. **分类**：LLM 归到 S0-S4 五系列
4. 写 `raw/<series_dir>/<日期>-<slug>.md`，frontmatter 含 `ingest_method: aihot-daily-save`、`ingest_source: daily YYYY-MM-DD · 版块 #N`
5. 追加 `_history.jsonl`（stream=`daily-save`），跨流去重
6. 默认**不**起 wiki draft —— 单条入库 ROI 不高，要起明确说

### 3. `/aihot-pull` — 大批量沉淀

```bash
/aihot-pull --since 7d     # 主流：每周一次，~130 候选
/aihot-pull --since 3d     # 节奏紧
/aihot-pull --since 30d    # 首次回填
/aihot-pull --resume       # 复用 raw/_cards/current/ 跳过 fetch
/aihot-pull --dry-run      # 跑到 triage 表停下，不写任何文件
```

7 步流水线：

1. **Fetch** — `aihot-fetch.mjs` 调 `/api/public/feed?mode=selected&since=<since>`（默认 backend；`AIHOT_BACKEND=rsc` 切回旧 RSC 抓页 fallback）
2. **Dedup** — `_history.jsonl` + `raw/**/*.md` frontmatter 双源去重
3. **LLM 分类** — 子代理把每条归到 S0-S4 或 SKIP，含 `confidence` 与 `also_relevant`
4. **Triage UI** — 按系列分组，按 confidence 排序展示；用户挑编号
5. **WebFetch + 写 raw** — 选中条目用 `aihot-extract.mjs` 抓正文（twitter/wechat 跳过），写到对应分类目录
6. **条件起 wiki draft** — 硬性闸门 ">10 个 status:draft 拒绝"；通过则对 `confidence==high && content_source==original_full` 的条目起草，与现有 wiki 索引做主题冲突检查
7. **更新 index + log** — `wiki/index.md` 加行，`wiki/log.md` 追加 run 记录

## Wiki 条目 schema

每个 `wiki/<分类>/*.md` 必须有统一 frontmatter：

```yaml
---
title: <条目名称>
category: <模型与技术 | 应用开发 | AI基础设施 | 行业洞察>
tags: [tag1, tag2, ...]
source: "[[raw/<series_dir>/<filename without .md>]]"
updated: YYYY-MM-DD
status: <draft | stable | outdated>
---
```

正文 4 段固定结构：

```markdown
## 定义
一句话说清楚这是什么。

## 核心要点
- 带具体数据/方法名/案例的要点（不要"提供训练流程"这种空话）

## 与其他概念的关系
- [[wiki/<分类>/相关条目|相关条目]]：关系说明

## 参考来源
- [[raw/<series_dir>/<filename>|来源标题]]
```

## Wiki 起草 → review → 标 stable 流程

```
status: draft   ← 自动起草后默认状态（pipeline 写入或 daily-save 起 wiki 时）
   ↓ 你 review、补充、修正
status: stable  ← 接受、可对外发布
   ↓ 时间久了，事实/链接/数据过期
status: outdated ← 标记需重写或合并
```

工具：

- `scripts/wiki-promote-drafts.mjs` 批量把 `draft` 改成 `stable`（不改其他字段）
- `wiki/index.md` 是手工维护的总索引；起新 draft 时同步加一行
- `wiki/log.md` 是按时间倒序的 ingest 日志，记录每次 run、入库、起草、冲突、deprecation 决策

闸门：

- `/aihot-pull` 起新 draft 前 glob 一遍 `wiki/**/*.md status: draft` 数量，**> 10 拒绝**起新 draft（避免积压）
- 想恢复起 draft：先把现有 draft review + promote 到 stable

## WikiLinks（Quartz 兼容）

带路径的 wikilink 必须写完整路径：

- ✅ `[[wiki/应用开发/RAG|RAG]]`
- ❌ `[[RAG]]`、`[[应用开发/RAG]]`

## Slash command 速查

| Command | 用途 | 副作用 |
|---|---|---|
| `/aihot-daily [<date>]` | 终端 30 秒扫日报 | `daily/aihot/<date>.md` 本地缓存（gitignored）|
| `/aihot-pull --since Nd` | 大批量 triage + 入库 + 起 wiki draft | 多个 raw 文件 + 可能多个 wiki draft + index/log 更新 |
| `/aihot-mp-pull` | ⚠️ **DEPRECATED 2026-05-08** | aihot /mp 改为内部 SSO 限定 |

## 工程脚本

| 脚本 | 作用 |
|---|---|
| `scripts/aihot-fetch.mjs` | 公开 API + RSC scrape 双 backend |
| `scripts/aihot-mp-fetch.mjs` | DEPRECATED |
| `scripts/aihot-mp-fetch-playwright.mjs` | DEPRECATED |
| `scripts/aihot-daily.mjs` | 拉日报渲染 + 自动归档 |
| `scripts/aihot-extract.mjs` | https + jsdom + readability + turndown，抓正文（带 Sec-Fetch-* 绕 Cloudflare 严格站）|
| `scripts/aihot-dedup.mjs` | 构建跨源去重集合 |
| `scripts/aihot-triage.mjs` | triage UI 渲染 |
| `scripts/aihot-prepare-write.mjs` | 选中条目准备元数据 |
| `scripts/aihot-write-raw.mjs` | 写 raw md 文件 |
| `scripts/aihot-finalize.mjs` | 收尾：raw frontmatter wiki_status 更新 + index + log |
| `scripts/wiki-promote-drafts.mjs` | 批量 draft → stable |

## 测试

```bash
node --test scripts/aihot-fetch.test/parse.test.mjs
```

43/43：parser / API client / mp parser / daily renderer 单测覆盖（fixture-based，不打真站）。

## Git 行为

- 推送前确认 `output/` / `node_modules/` / `daily/` / `.aihot/` 不在 staged
- `raw/_cards/current{,_mp}/` 也 gitignored（pipeline 临时工作区，每次 run 重生成）

## 发布

通过 `austin-second-brain` Quartz Hub 发布到内网 NAS，路径：`/ai/`。
