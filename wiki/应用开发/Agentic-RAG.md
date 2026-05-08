---
title: Agentic RAG
category: 应用开发
tags: [RAG, Agentic, 检索增强生成, LLM, 智能体架构]
source: "[[raw/sdlc/Agent Architecture.md]]"
updated: 2026-05-05
status: stable
---

## 定义
Agentic RAG 是将 LLM 放入检索循环内部的智能检索模式——Agent 自主分解查询、规划检索路径、自检上下文缺口并循环补全，直到确信后才生成答案；区别于标准 RAG 的一次性"嵌入查询→取块→生成"。

## 核心要点
- **标准 RAG 的问题**：embed query → 取 chunk → 生成，一次命中；检索遗漏则答案直接出错，无法自我修复
- **Agentic RAG 工作流**：
  1. Agent 将查询分解为子任务
  2. 规划检索哪些源、以什么顺序
  3. 检索 → 推理 → 自检上下文完整性
  4. 存在缺口则循环回步骤 2
  5. 确信信息充分后才生成最终答案
- **核心转变**：不只是检索，而是自主决定何时检索、检索什么——直到确信
- **适用场景**：多步查询、动态数据、高风险答案（任何一次检索会失败的场景）

## 与其他概念的关系
- [[wiki/应用开发/Agent-Memory统一框架|Agent Memory 统一框架]]：记忆层为 Agentic RAG 提供跨会话的持久化上下文
- [[wiki/AI基础设施/MCP|MCP]]：Agentic RAG 的检索源可通过 MCP 统一接入外部数据系统
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：Agentic RAG 的循环检索需要 Harness 提供退出条件和验证保障

## 参考来源
- [[raw/sdlc/Agent Architecture.md|Agent Architecture - LinkedIn 2026]]
