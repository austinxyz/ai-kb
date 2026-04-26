---
title: LLM Wiki Pattern
category: 应用开发
tags: [知识库, RAG, LLM, Obsidian, 方法论]
source: "[[raw/applications/karpathy-llm-wiki]]"
updated: 2026-04-25
status: stable
---

## 定义

LLM Wiki Pattern 是 Andrej Karpathy 提出的个人知识库构建方法：LLM 不是在查询时从原文检索，而是**持续维护一个结构化的 wiki**，让知识随时间复利积累。

## 核心要点

- **区别于 RAG**：RAG 每次查询都重新从原文推导；LLM Wiki 把知识编译一次、持续更新，查询读 wiki 而非原文
- **三层架构**：原始资料（不可变）→ wiki（LLM 维护）→ schema/CLAUDE.md（行为规范）
- **人机分工**：用户负责选题、提问、把关；LLM 负责摘要、交叉引用、维护一致性
- **两个特殊文件**：`index.md`（内容目录，每次 ingest 后更新）+ `log.md`（追加式操作日志）
- **三种操作**：Ingest（新资料入库）、Query（问答，好答案可存回 wiki）、Lint（健康检查）
- **工具链**：Obsidian（阅读/浏览）+ Claude Code（维护）+ qmd（可选全文搜索）

## 与其他概念的关系

- [[wiki/应用开发/RAG|RAG]]：LLM Wiki 是 RAG 的替代/补充，适合长期深度主题
- [[wiki/应用开发/00-MOC-应用开发|应用开发 MOC]]：本知识库本身就是对此模式的实践

## 参考来源

- [[raw/applications/karpathy-llm-wiki|Karpathy - LLM Wiki (2025)]]
