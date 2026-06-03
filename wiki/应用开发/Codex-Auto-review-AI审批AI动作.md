---
title: Codex Auto-review：AI 审批 AI 动作
category: 应用开发
tags: [Agent治理, 自动审批, 安全, OpenAI]
source: "[[raw/agent_engineering/2026-05-04-OpenAI-Codex-新模式-Auto-review-在-频繁打扰人类-和-完全放权-之间-引入第三种治理范式-用一个独立-AI-Agent-替代人类-来审]]"
updated: 2026-05-16
status: stable
aihot_origin:
  aihot_id: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

OpenAI Codex 推出的第三种 Agent 治理范式：在「频繁打扰人类」与「完全放权」之间，引入独立 AI 子代理作为审批者，评估主 Agent 的越界动作后自动放行或拒绝，将人类打扰频率降低约 200 倍。

## 核心要点

- **三种治理范式**：①频繁人工审批（慢、打扰多）→ ②完全放权（快、风险高）→ ③Auto-review（AI 子代理审批，折中）
- **审批逻辑**：Auto-review 子代理接收「计划动作 + 近期上下文」，评估用户意图、运行环境、安全策略、动作影响后决策
- **拒绝后自我修正**：拒绝时提供理由，超过一半情况主 Agent 能自行找到更安全的替代方案
- **实测效果**：自动批准率 99.1%，有效拦截多数攻击
- **已知局限**：非确定性安全保证，无法防御策略性欺骗（adversarial LLM），是安全与速度的折中，不是银弹

## 与其他概念的关系

- [[wiki/应用开发/Codex-安全治理四层架构|Codex 安全治理四层架构]]：Auto-review 是四层架构的第二层，本条目深入展开其工作原理
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：Auto-review 是「独立验证机制」原则的具体落地——用 Agent 审查 Agent 的动作
- [[wiki/应用开发/AI-Agent-PR审查|AI Agent PR 审查]]：PR 审查是事后审计代码产出，Auto-review 是实时审计动作执行，同为 agent-policing-agent 模式

## 参考来源

- [[raw/agent_engineering/2026-05-04-OpenAI-Codex-新模式-Auto-review-在-频繁打扰人类-和-完全放权-之间-引入第三种治理范式-用一个独立-AI-Agent-替代人类-来审|OpenAI Codex Auto-review, 2026-05-04]]
