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

## Git 行为

推送前确认 output/ 不在 staged 列表：
```bash
git status | grep output/ && echo "⚠️ 停止：output/ 不应入库"
```
