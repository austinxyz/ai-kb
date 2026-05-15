---
title: Interrogatory LLM（审问式 LLM）
category: 应用开发
tags: [LLM, Context Engineering, Prompt Engineering, Agentic AI]
source: "[[raw/agent_engineering/2026-05-14-InterrogatoryLLM-martinfowler]]"
updated: 2026-05-14
status: stable
---

## 定义

让 LLM 扮演"采访者"，通过逐一提问的方式从人类身上萃取信息，将结果整理成结构化 context 文档，供后续 LLM session 使用。

## 核心要点

- **单问约束**：每轮只问一个问题（Harper Reed 原则），实践中需频繁提醒 LLM 遵守，否则容易连珠炮提问
- **两种用法**：
  - **正向**：LLM 采访人类 → 生成 context 文档 → 喂给另一个 LLM 执行任务（如功能设计）
  - **反向**：把已有文档交给 LLM → 它采访领域专家核查准确性（代替专家自己阅读审查）
- **可叠加**：先用一个 interrogatory LLM 建文档，再用另一个采访第二位专家做复核，链式使用
- **降低写作门槛**：对写作困难的人，对话比写文档更自然，产出不完美但总比没有强
- **跨 session**：采访完成后生成 context report，通常在新 session（可换模型）中使用

## 与其他概念的关系

- [[wiki/应用开发/Harper-Reed-LLM-Codegen-Workflow|Harper Reed LLM Codegen 工作流]]：单问约束的原始出处，Fowler 所引用的"第一个让我看到这个方法合理描述"的文章
- [[wiki/应用开发/Prompt-Caching工程|Prompt Caching 工程]]：interrogatory LLM 产出的 context report 往往是长静态前缀，适合 prompt caching
- [[wiki/应用开发/Claude-Managed-Agents|Claude Managed Agents]]：Dreaming 能力（跨会话记忆提炼）与本模式可以组合，让 LLM 在采访后自动沉淀知识
- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：REASONS Canvas 可以作为 interrogatory LLM 的采访框架，指导它该问哪些维度

## 参考来源

- [[raw/agent_engineering/2026-05-14-InterrogatoryLLM-martinfowler|InterrogatoryLLM - Martin Fowler bliki, 2026-05-14]]
- [[raw/agent_engineering/2025-02-16-harper-reed-llm-codegen-workflow|Harper Reed LLM Codegen Workflow, 2025-02-16]]（单问约束原始出处）
