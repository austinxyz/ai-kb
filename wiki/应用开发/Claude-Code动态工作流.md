---
title: Claude Code 动态工作流（Dynamic Workflows）
category: 应用开发
tags: [Claude Code, multi-agent, workflow, harness, 编排]
source: "[[raw/agent_engineering/2026-06-02-a-harness-for-every-task-dynamic-workflows-in-claude-code]]"
updated: 2026-06-03
status: draft
aihot_origin:
  aihot_id: "aihot-daily:2026-06-03:产品发布更新:1"
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-06-03
---

## 定义

Claude Code 的动态工作流让模型在运行时即兴编写"为单一任务量身定制"的多 Agent harness：执行带特殊函数的 JavaScript 文件，生成并协调拥有独立上下文窗口的子 Agent，对抗长任务中的智能惰性、自我偏好、目标漂移三种失效模式。

## 核心要点

- **三大失效模式**：Agentic laziness（复杂任务过早收手）、Self-preferential bias（验证时偏好自己产出）、Goal drift（多轮后丢失原始目标）
- **六种编排模式**：classify-and-act（按分类路由）、fan-out-and-synthesize（拆分→并行→合并）、adversarial verification（独立 Agent 对照标准验证）、generate-and-filter（多想法按 rubric 过滤）、tournament（不同方法竞争，两两评判）、loop-until-done（循环至停止条件）
- **典型用例**：迁移/重构、深度研究、深度验证（逐条事实核查）、大规模排序、根因调查（多假设对证据检验）、规模化 triage
- **边界**：新功能、token 消耗更高，只适合复杂高价值任务；常规编码不需要多审查者或重编排
- **配套技巧**：详细 prompt + 指定模式、配合 `/goal` `/loop`、设显式 token 预算、经 `~/.claude/workflows` 或 skills 保存复用

## 与其他概念的关系

- [[wiki/模型与技术/Claude Code源码分析-Agentic Harness设计|Claude Code 源码分析·Agentic Harness 设计]]：动态工作流是 harness 从静态走向"运行时按任务自造"的演进
- [[wiki/模型与技术/长时自主Agent的8个Harness核心问题|长时自主 Agent 的 8 个 Harness 核心问题]]：三大失效模式正是长任务 harness 要解决的核心痛点
- [[wiki/应用开发/Sakana-AI-指挥者模型多Agent拓扑|Sakana AI 指挥者模型多 Agent 拓扑]]：同为多 Agent 拓扑思路，Sakana 用专门 Conductor 模型选组合，动态工作流由主模型即兴编排
- [[wiki/应用开发/AutoResearch软件开发|AutoResearch 软件开发移植]]：fan-out + 加权评分 + 反馈迭代是动态工作流 fan-out-and-synthesize / tournament 模式的具体实例
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：adversarial verification 与"独立验证"原则同源

## 参考来源

- [[raw/agent_engineering/2026-06-02-a-harness-for-every-task-dynamic-workflows-in-claude-code|A Harness for Every Task: Dynamic Workflows in Claude Code（Anthropic 官方 blog）]]
