---
title: SDD 规范驱动研发流水线
category: 应用开发
tags: [Harness Agent, OpenSpec, Superpowers, SDD, 规范驱动, 研发流水线]
source: "[[raw/ai_usage/用Harness Agent + OpenSpec + Superpowers，我搭了一条从需求到上线的AI研发流水线]]"
updated: 2026-06-20
status: stable
---

## 定义

三工具整合的 Spec-Driven Development（SDD）流水线：Harness Agent（协作层）+ OpenSpec（规范层）+ Superpowers（纪律层），实现需求→规范→设计→开发→验收→上线全自动，人工仅需输入 4 条命令。

## 核心要点

**三层架构**

| 层 | 工具 | 职责 |
|---|---|---|
| 协作层 | Harness Agent（agency-agents） | 谁来做：140+ 专业 Agent 并行 |
| 规范层 | OpenSpec | 做什么：结构化 Markdown 需求 / 验收条件 |
| 纪律层 | Superpowers | 怎么做：TDD / 代码审查 / 验证前自检 |

**六阶段工作流**（以 `spec-driven-development` Skill 统一入口）
1. `/sdd-propose` — OpenSpec 生成 proposal.md（目标/非目标/影响范围）
2. `/sdd-design` — 生成 design.md + GIVEN/WHEN/THEN 验收场景 spec.md
3. `/sdd-plan` — PM Agent 拆任务 + 按角色分派（Backend/Frontend/QA/DevOps）
4. `/sdd-execute` — 多 Agent 并行：Backend TDD / Frontend Code Review / QA 自动化测试；每 Task 完成自动 `verification-before-completion`
5. `/sdd-verify` — OpenSpec 逐条验证 GIVEN/WHEN/THEN
6. `/sdd-ship` — 归档 + DevOps Agent 触发部署

**实测效果**（订单导出功能案例）：后端 4min / 前端 2min / 测试 3min → 并行总耗时约 6min；单元测试覆盖率 92%

**关键设计原则**：薄编排（不修改三个工具内部代码，只写一个 Skill 作为调度层）；规范先行（spec 驱动执行，防止 AI 自由发挥导致漂移）

## 与其他概念的关系

- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：SDD 是 Harness 工程原则的具体实现
- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：同为规范驱动开发方法论，SPDD 侧重 prompt 治理，SDD 侧重多 Agent 执行层
- [[wiki/应用开发/AI时代工程严谨性|AI 时代工程严谨性]]：SDD 是"规格/测试/约束"三个严谨性方向的工程化落地
- [[wiki/应用开发/Claude-Code动态工作流|Claude Code 动态工作流]]：动态 harness 与 SDD 的静态 Skill 编排可组合

## 参考来源

- [[raw/ai_usage/用Harness Agent + OpenSpec + Superpowers，我搭了一条从需求到上线的AI研发流水线|SDD 流水线实战文章]]
