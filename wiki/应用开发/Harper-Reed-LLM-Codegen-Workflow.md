---
title: Harper Reed LLM Codegen 工作流
category: 应用开发
tags: [LLM, Codegen, Workflow, Spec-Driven, Aider, Repomix]
source: "[[raw/agent_engineering/2025-02-16-harper-reed-llm-codegen-workflow]]"
updated: 2026-05-14
status: stable
---

## 定义

Harper Reed 提出的 LLM 辅助编程三步离散循环：打磨 spec → 规划计划 → 执行代码生成。单问约束（每次只问一个问题）是 [[wiki/应用开发/Interrogatory-LLM|Interrogatory LLM]] 技术的原始出处。

## 核心要点

- **三步流程（Greenfield）**：
  1. **Idea Honing**：用对话式 LLM 逐问打磨，开场 prompt：`"Ask me one question at a time so we can develop a thorough, step-by-step spec"` → 输出 `spec.md`
  2. **Planning**：换推理模型（o1/o3/r1），要求拆成可迭代小块 → 输出 `prompt_plan.md` + `todo.md`
  3. **Execution**：用 Aider/Cursor/Claude.ai 执行，每步之间测试验证

- **单问约束是核心**：每轮只问一个问题，防止 LLM 连珠炮式提问压垮用户，被 Martin Fowler 引用为该技术的发现来源

- **Non-Greenfield（存量代码）**：用 Repomix 生成代码库 bundle 注入 LLM，配合 Mise 任务集合（`LLM:generate_code_review`、`LLM:generate_missing_tests` 等）做代码审查/Issue 生成/测试补全

- **离散循环**：Planning → Execution → Testing 每轮独立，不混用；Aider 始终在新 branch 操作

- **工作流时效性**：作者自注 `"This is working well NOW, it will probably not work in 2 weeks"`——方法论随模型迭代快速过时

## 关键 Prompt 模板

```
# Step 1 开场
Ask me one question at a time so we can develop a thorough, step-by-step spec

# Step 1 收尾
can you compile our findings into a comprehensive, developer-ready specification?

# Step 2 规划
Break it down into small, iterative chunks that build on each other

# 代码审查
You are a senior developer. Your job is to do a thorough code review of this code.

# Issue 生成
write out the top issues that you see with the code. Do Not Hallucinate.
```

## 与其他概念的关系

- [[wiki/应用开发/Interrogatory-LLM|Interrogatory LLM]]：本文是单问约束技术的原始出处，Fowler 在该文中引用 Harper Reed
- [[wiki/应用开发/Spec驱动开发|Spec 驱动开发]]：Step 1 输出的 `spec.md` 本质是 spec-driven 开发的起点
- [[wiki/应用开发/Agentic-Workflow-Token效率|Agentic Workflow Token 效率]]：Repomix bundle + ignore 规则压缩 token 是同类思路

## 参考来源

- [[raw/agent_engineering/2025-02-16-harper-reed-llm-codegen-workflow|Harper Reed LLM Codegen Workflow, 2025-02-16]]
- 被引用于：[[raw/agent_engineering/2026-05-14-InterrogatoryLLM-martinfowler|Martin Fowler · Interrogatory LLM, 2026-05-14]]
