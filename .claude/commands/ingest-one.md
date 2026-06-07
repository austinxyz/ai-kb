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
