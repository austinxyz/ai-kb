# `/ingest-one` — 单条手挑入库 · 设计 spec

**日期**：2026-06-07
**状态**：approved（待用户复核）
**关联**：`.claude/commands/aihot-pull.md`（复用 Step6/7 规则）、`.claude/commands/aihot-daily.md`（Notion 日报来源）、`CLAUDE.md` Ingest 工作流、`docs/superpowers/specs/2026-06-05-sources-digest-design.md`（前门，未来源）

---

## 目标

把**用户手挑的单条内容**（来自 Notion aihot 日报 / 热门博主 / 权威官博 / 随手链接）抓正文 → 写入 `raw/` → 交互式提炼入 `wiki/`。

固化现有"轻量流"：用户已在 Notion 看过日报、只挑一条时，绕开 `aihot-pull` 的批量 fetch+triage 重流程，直接单条入库。

**定位**：`aihot-pull` 是批量沉淀（fetch API + 去重 + LLM 批分类 + triage 表 + 批写）；`/ingest-one` 是单条手挑（已选定 → 抓 → 入库）。两者互补。

---

## 架构：两层

```
┌─ 发现层（前门，把新内容推到 Notion 日报）────────────┐
│  • aihot-daily        ✅ 已自动（远程 routine 08:30）  │
│  • sources-digest     📐 已 spec 未实现（博主+官博）   │
└──────────────────────────────────────────────────┘
              ↓  用户早上扫 Notion，指一条
┌─ 入库层（后门，单条 → 知识库）──────────────────────┐
│  • /ingest-one  ← 本 spec                            │
│    输入: 「6月5 模型版块第3条」 或 标题+链接          │
│    复用 aihot-pull Step6/7 的 slug/目录/frontmatter   │
└──────────────────────────────────────────────────┘
```

**核心洞察**：入库后半段（`{title, url} → WebFetch → 写 raw → 入 wiki`）**源无关**。Notion 日报、博主、官博、随手链接共用同一套逻辑。"结合热门博主+权威官网"不是再写抓取器，而是不同前门喂同一个 `/ingest-one`。

---

## 形态 & 命名

- **类型**：slash command，`.claude/commands/ingest-one.md`，纯 prompt 驱动。无新 `.mjs` 脚本——逻辑借 WebFetch + 文件工具 + Notion MCP。
- **命名**：`/ingest-one`。
- **同族对齐**：与 `aihot-pull` / `aihot-daily` / `aihot-mp-pull` 同为 `.claude/commands/` 下 command，显式调用。

---

## 输入解析

两种 arg 形态：

### 1. 直给（manual / blog / 官博）
```
/ingest-one <标题> <url>
/ingest-one <url>          # 仅链接，标题抓取后从正文取
```
直接进抓取。

### 2. Notion 定位（aihot 日报）
```
/ingest-one 6月5 模型版块第3条
/ingest-one 2026-06-05 第3条
```
步骤：
1. 解析日期（`6月5` / `2026-06-05` 均接受 → 归一 `YYYY-MM-DD`，年份缺省取当前年）。
2. `notion-search` 找子页「AI 日报 `<YYYY-MM-DD>`」。
3. `notion-fetch` 读该子页 → 解析五版块结构（版块标题 + 编号条目，每条带 title + summary + sourceUrl，见 `aihot-daily.mjs:88-95` 渲染格式）。
4. 按"版块 + 序号"定位到目标条，拿 `sourceUrl`。

### 消歧（关键）
- aihot-daily 每版块编号**各自从 1 重起**（`aihot-daily.mjs:90`）→ 仅说"第3条"跨版块重号。
- **规则**：
  - 版块已指明（如"模型版块第3条"）→ 直接定位。
  - 版块未指明 → 列出该天全部版块的编号清单，请用户选。
- **防错挑**：命中后**先回显标题**（"找到：`<标题>` — `<url>`，确认抓取？"）再进抓取。

### Notion 找不到
- 该日子页不存在 / 该条序号越界 → 停，报错，列可选项（可用日期 或 该天可选条目）。

---

## 抓取 + 写 raw

### source_type 判定（按 url 域名，复用 aihot-pull Step6）
| 域名特征 | source_type | 抓取行为 |
|---------|-------------|---------|
| arxiv.org | arxiv | WebFetch 正文 |
| github.com | github | WebFetch 正文 |
| youtube/youtu.be | youtube | WebFetch 正文 |
| 其他 http(s) | blog | WebFetch 正文 |
| twitter/x.com | twitter | 跳抓，summary_only |
| mp.weixin / wechat | wechat | 跳抓，summary_only |

WebFetch prompt：`提取文章正文为干净 markdown。保留代码块、列表、标题。去掉导航/广告/评论/订阅提示。中文内容保留中文。`

### 去重
- 计算 `norm_key = normalize(title) + "||" + source_url`（normalize 同 aihot-pull Step2：lowercase、去空白、留 alnum+CJK）。
- 比对：
  1. `raw/_cards/_history.jsonl` 每行的 `aihot_id` / `norm_key`。
  2. `raw/**/*.md`（排除 `raw/_cards/`）frontmatter 的 `source_url` + title。
- **撞了** → **警告 + 问用户**是否仍写（显示已存在的 raw 路径）。用户确认才继续。

### slug / 目录 / 文件名（复用 aihot-pull Step6）
- **slug**：
  - 全 ASCII 标题：`toLowerCase()` → 留 `[a-z0-9]` → 空格转 `-` → 截断 80。
  - 含中文：留汉字+字母数字 → 其他转 `-` → 截断 80。
- **系列 → 目录**：
  - S1_infra → `raw/ai_native_infra/`
  - S2_methodology → `raw/dev_methodology/`
  - S3_roles → `raw/engineering_roles/`
  - S4_agent → `raw/agent_engineering/`
  - S0_industry → `raw/industry_insight/`
- **分类**：单条 inline 判定（非批量 LLM），输出 `primary_series` + `also_relevant` + `confidence`，规则同 aihot-pull Step4。
- **文件名**：`<YYYY-MM-DD>-<slug>.md`。日期取来源发布日（aihot 条目有 published_at 时用其 CST 日期；否则用当日）。

### raw frontmatter（通用 schema + origin 块）
```yaml
---
title: "<原标题>"
slug: <YYYY-MM-DD>-<slug>
source_url: <url>
source_type: <arxiv | github | blog | youtube | twitter | wechat>
fetched_at: <ISO 8601>
content_source: <original_full | summary_only>
fetch_status: <ok | failed | skipped>
fetch_error: <null | string>
classification:
  primary_series: <S0_industry | S1_infra | S2_methodology | S3_roles | S4_agent>
  also_relevant: [<...>]
  confidence: <high | medium | low>
origin:
  type: <aihot | blog | manual>
  # type == aihot:
  notion_date: <YYYY-MM-DD>
  section: <版块名>
  aihot_url: ""
  # type == blog:
  blog_name: <源名>
  # type == manual: 仅 type 字段
---

<正文 when content_source == original_full, 否则空>
```

### history 追加
写完追加一行到 `raw/_cards/_history.jsonl`：
```json
{"aihot_id": null, "norm_key": "<norm_key>", "raw_path": "<written path>", "origin": "<aihot|blog|manual>"}
```
（`aihot_id` 仅 aihot 来源且能取到时填，否则 null。保持与 aihot-pull 去重状态共享。）

---

## wiki 入库

### 主路径（CLAUDE.md Ingest 式交互）
1. 抓完 raw → 跟用户**讨论关键要点**。
2. 写/**更新** `wiki/<分类>/` 条目（可新建，也可并入已有条目；4 段结构：定义/核心要点/关系/参考来源）。
3. 更新 `wiki/index.md`（对应分类表格加/改条目）。
4. 追加 `wiki/log.md`：
   ```markdown
   ## [YYYY-MM-DD] ingest-one | <资料名>
   - 存入：raw/<path>
   - 新建/更新条目：wiki/<path>
   - 来源：<origin.type>
   ```

`primary_series` → wiki category 默认映射（LLM 可覆盖）：
- S1_infra → `AI基础设施`
- S2_methodology → `应用开发`
- S3_roles → `行业洞察`
- S4_agent → `模型与技术`（默认）/ `应用开发`（偏实战代码）
- S0_industry → `行业洞察`

### 深度变体（Luwei 模式，按需触发）
该条**高价值或有争议**时，提议走深度分析（CLAUDE.md "Ingest 深度分析变体"）：
1. 读一手源 → 跑结构化 Claude 分析对话。
2. transcript 存产物：默认 `chat/`（进 git 公开）；含私人战略观点 → `output/`（gitignore 私有）。
3. wiki 条目蒸馏结论 + 末尾链回 transcript（`分析过程见 [[chat/<文件>]]`）。
4. 争议话题：wiki 条目记**分歧矩阵**（谁乐观/谁审慎/理由）。
5. transcript frontmatter 按 CLAUDE.md 约定（`type: analysis` 等）。

### draft 配额
- `wiki/**` 中 `status: draft` 数量 >10 → **提醒一句**（"wiki 已有 X 个 draft，建议抽空清理"），**不强拦**。手挑量小，配额非硬闸门。

---

## 错误处理

- **抓取失败**：`fetch_status: failed`、`fetch_error: <错误>`、正文留空，**仍写 raw**（占位，可后补正文）。提示用户。
- **twitter/wechat**：`fetch_status: skipped`、`content_source: summary_only`，正文空，frontmatter 带 Notion summary（若来自 aihot）。
- **Notion 定位失败**：停、报错、列可选（可用日期 / 该天条目）。
- **去重命中**：警告 + 问，用户拒则中止本条。

---

## 测试

- **source_type 判定**：各域名 → 正确类型 + 抓取行为。
- **slug 生成**：全 ASCII / 含中文 / 超长截断。
- **去重**：norm_key 计算、history 命中、raw frontmatter 命中。
- **Notion 定位解析**：fixture 日报子页 → 版块+序号 → 正确 url；消歧（重号、版块缺省、越界）。
- **raw frontmatter**：三种 origin.type 的字段形状正确。

测试 fixture 放 `docs/superpowers/specs/ingest-one-fixtures/`（仿现有 `aihot-fixtures/`）。

> 注：command 是 prompt 驱动、无独立 `.mjs`，纯逻辑单测有限。可测的是抽出的纯函数（若实现时把 slug/source_type/norm_key 抽成共享 `.mjs` util 供 aihot-pull 与 ingest-one 复用）——见下"复用建议"。

---

## 复用建议（实现期决定）

aihot-pull 现把 slug / source_type / normalize / 系列→目录映射写在命令 prompt 里。`/ingest-one` 复用这些规则。两个选项：
- **A. prompt 内重述**：command md 里直接写规则（与 aihot-pull 各持一份，简单但易漂移）。
- **B. 抽共享 util**：把 slug/source_type/normalize/dir-map 抽成 `scripts/ingest-lib.mjs`，aihot-pull 与 ingest-one 都引；可单测。

倾向 **B**（消除两份规则漂移 + 可测），但属实现细节，留 plan 阶段定。

---

## YAGNI 排除

- **不做批量**（"6月5 第2、5条"多条）——证明需要再加。单条够覆盖真实用法。
- **不做 sources-digest**——独立 spec（前门），本 spec 只管后门入库。两者按顺序：先 ingest-one，再 sources-digest。
- **不做自动 wiki 起草闸门体系**（aihot-pull 那套 confidence/content_source 多闸门）——手挑条目已判定值得，走交互式。
- **不持久化额外 seen-state**——复用 `_history.jsonl`。
```
