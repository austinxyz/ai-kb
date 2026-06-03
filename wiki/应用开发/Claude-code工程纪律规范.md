---
title: Claude Code工程纪律规范（Karpathy CLAUDE.md）
category: 应用开发
tags: [CLAUDE.md, 工程纪律, Karpathy, AI编码规范]
source: "[[raw/dev_methodology/2026-05-04-Claude-code有时候会替你做错误假设-不主动要求澄清-该反驳时不反驳-敷衍迎合奉承你-有人把-Karpathy-对-AI-写代码常见问题的观察-整理成一]]"
updated: 2026-05-16
status: stable
aihot_origin:
  aihot_id: "cmor9h7w301ubslruffpfctl1"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

基于 Karpathy 对 AI 编程工具常见问题的观察，整理成可直接放入项目的 CLAUDE.md 规范文档，用四条核心原则约束 AI 的"默默假设"、"过度自信"、"无效重构"等行为。

## 核心要点

- **原则一：编码前先思考**：AI 必须梳理并澄清歧义，而非直接动手
- **原则二：最简实现**：优先用最少代码满足需求，拒绝过度设计
- **原则三：精准修改**：仅改动与需求直接相关的代码，不顺手重构
- **原则四：可验证目标**：为每个任务设定明确、可检验的完成标准
- **问题背景**：Claude Code 常见的"敷衍迎合"、"自动假设"、"爱脑补"正是这四条原则要解决的

## 与其他概念的关系

- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：CLAUDE.md 是 harness 原则的具体体现——规范引导 AI 行为，而非依赖 AI 自我约束
- [[wiki/应用开发/Claude-Skills工程实践-Matt-Pocock|Claude Skills工程实践（Matt Pocock）]]：两者互补——CLAUDE.md 设定行为边界，Skills 提供具体工作流工具
- [[wiki/应用开发/Harper-Reed-LLM-Codegen-Workflow|Harper Reed LLM Codegen Workflow]]：Harper Reed 的单问题约束与"先思考"原则同源，都在减少 AI 的随意发散

## 参考来源

- [[raw/dev_methodology/2026-05-04-Claude-code有时候会替你做错误假设-不主动要求澄清-该反驳时不反驳-敷衍迎合奉承你-有人把-Karpathy-对-AI-写代码常见问题的观察-整理成一|Karpathy CLAUDE.md 工程纪律, 2026-05-04]]
