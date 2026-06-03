# CLAUDE.md

本文件指导 Claude Code 在 `ai` 知识库中的工作方式。

## 项目核心概念

三层知识库：**原始资料 → 提炼知识 → 个人感想**。

| 目录 | 入库 | 内容性质 |
|------|------|---------|
| `raw/` | ✅ | 最新文章、论文、技术报告（公开内容）|
| `wiki/` | ✅ | 提炼后的知识条目，带统一 frontmatter |
| `output/` | ❌ `.gitignore` | 个人学习感想、未整理笔记（不公开）|

## Wiki 条目 Schema

每个 `wiki/<分类>/*.md` 必须有统一 frontmatter：

```yaml
---
title: <条目名称>
category: <模型与技术 | 应用开发 | AI基础设施 | 行业洞察>
tags: [tag1, tag2]
source: "[[raw/<分类>/来源文件名]]"
updated: YYYY-MM-DD
status: <draft | stable | outdated>
---
```

正文使用4段固定结构：

```markdown
## 定义
一句话说清楚这是什么。

## 核心要点
- 要点1
- 要点2

## 与其他概念的关系
- [[wiki/<分类>/相关条目|相关条目]]：关系说明

## 参考来源
- [[raw/<分类>/来源文件|来源文件]]
```

## 命名约定

- 文件名：英文优先（`RAG.md`、`Transformer.md`）
- 用连字符 `-` 替代空格
- MOC 页命名：`00-MOC-<分类>.md`

## WikiLinks（Quartz 兼容）

带路径的 wikilink 必须写完整路径：
- 正确：`[[wiki/应用开发/RAG|RAG]]`
- 错误：`[[RAG]]`、`[[应用开发/RAG]]`

## raw/ 子目录约定

- `raw/<series_dir>/`：`/aihot-pull` 写入的 5 个系列目录（`agent_engineering`、`dev_methodology`、`ai_native_infra`、`engineering_roles`、`industry_insight`）
- `raw/wechat_hotposts/`：`/aihot-mp-pull` 写入的微信公众号爆文书签（仅含 metadata + 链接，无正文 —— 微信反爬挡住；该 slash command 已 DEPRECATED 2026-05-08）
- `raw/_cards/`：抓取流水的临时工作区（`current/`, `current_mp/`, `_archive/`, `_history.jsonl`）；不进 wiki 引用

## aihot 三个 slash command（用途分工）

- `/aihot-daily [<date>]` — 终端阅读 AI 日报，不入库（早上 30 秒扫五版块场景）
- `/aihot-pull --since 7d` — triage + 入库 raw + 起 wiki draft（沉淀工作流，不应每天跑）
- `/aihot-mp-pull` — DEPRECATED（aihot 把 /mp 关给匿名用户）

## 工作流（Karpathy LLM Wiki Pattern）

### Ingest（新资料入库）

当用户说"处理 X 文章"或把文件放入 `raw/`：

1. 读取原文，与用户讨论关键要点
2. 在 `wiki/<分类>/` 创建或更新相关条目（可能涉及多个）
3. 更新 `wiki/index.md`，在对应分类表格加入新条目
4. 在 `wiki/log.md` 末尾追加一条记录：
   ```
   ## [YYYY-MM-DD] ingest | 资料名
   - 存入：raw/xxx
   - 新建/更新条目：wiki/xxx
   ```

### Ingest 深度分析变体（Luwei 模式）

来源：Luwei/Controversy 的"一手源 + 把 Claude 对话当分析入口"套路——对话记录是一等公民产物，保留**推理与分歧**，不只存磨平后的结论。

**何时启用**：源**高价值或有争议**时（普通资料走上面标准 Ingest 即可）。

**步骤**：
1. 读一手源 → 跑一段**结构化 Claude 分析对话**。
2. 把 transcript 存成产物：
   - 默认 → `chat/`（**进 git，公开**，对标 Luwei 的 chat/）。
   - 若含**私人战略观点** → `output/`（gitignore，私有）。
3. 照常写/更新 `wiki/<分类>/` 条目（蒸馏结论），条目末尾**链回** transcript（`分析过程见 [[chat/<文件>]]`）。
4. 争议话题：在 wiki 条目里显式记**分歧矩阵**（谁乐观/谁审慎/各自理由）。
5. 照标准 Ingest 收尾：更新 `wiki/index.md` + 在 `wiki/log.md` 追加记录。

**transcript frontmatter 约定**：
```yaml
---
type: analysis
source: "<一手源 URL 或 raw/ 路径>"
topic: <主题>
date: YYYY-MM-DD
wiki_entry: "[[wiki/<分类>/<条目>]]"
controversy: <true|false>
---
```

### Query（提问）

当用户提问：

1. 先读 `wiki/index.md` 定位相关条目
2. 读取相关 wiki 页面综合回答
3. 若答案有长期价值，询问用户是否存为新 wiki 条目
4. 若存，同步更新 `wiki/index.md` 和 `wiki/log.md`

### Lint（健康检查）

当用户说"检查 wiki"：

检查并报告：
- 有没有条目互相矛盾
- 有没有孤立页面（无入站链接）
- 有没有 raw/ 里提到但 wiki 里没有专页的概念
- `wiki/index.md` 是否与实际条目同步

## Git 行为

推送前确认 output/ 不在 staged 列表：
```bash
git status | grep output/ && echo "⚠️ 停止：output/ 不应入库"
```
