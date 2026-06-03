---
title: Sakana AI 指挥者模型：动态多 Agent 拓扑
category: 应用开发
tags: [多Agent, 强化学习, 动态拓扑, 推理扩展]
source: "[[raw/agent_engineering/2026-05-04-new-paper-from-sakana-ai-iclr-2026-a-7b-conductor-model-just-hit-sota-on-gpqa-di]]"
updated: 2026-05-16
status: stable
aihot_origin:
  aihot_id: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Sakana AI 在 ICLR 2026 提出的多 Agent 协作范式：用一个 7B「指挥者」模型通过强化学习专门学习为混合开源/闭源工作者 Agent 设计通信拓扑并生成精准指令，不直接解题，而是调度工作者发挥各自特长。

## 核心要点

- **职责分离**：指挥者不解题，只设计拓扑（哪些 Agent 参与、以何种通信结构协作）并为每个工作者生成针对性指令
- **随机化训练**：在随机化 Agent 池上训练后，推理时能适应任意 Agent 组合，无需重新训练
- **递归拓扑**：允许指挥者把自己也选为工作者时，系统形成递归结构，实现动态测试时扩展（test-time scaling）
- **SOTA 表现**：GPQA-Diamond 和 LiveCodeBench 达 SOTA；AIME25 和 GPQA-D 比最佳单体工作者提升约 3%（相当于前沿模型一个代际的改进），增益完全来自协同优化

## 与其他概念的关系

- [[wiki/应用开发/AutoResearch软件开发|AutoResearch 软件开发]]：同为多 Agent 交叉协作提升输出质量，AutoResearch 是固定角色轮换，Sakana 是动态拓扑
- [[wiki/应用开发/Claude-Managed-Agents|Claude Managed Agents]]：Multiagent 编排（lead/sub）与指挥者模型思路相近，区别在于指挥者本身通过 RL 训练而非规则硬编码
- [[wiki/AI基础设施/自适应并行推理-APR|自适应并行推理 APR]]：APR 是推理时自主决定并行分支，指挥者模型是显式角色协调，两者都属于推理时扩展范式

## 参考来源

- [[raw/agent_engineering/2026-05-04-new-paper-from-sakana-ai-iclr-2026-a-7b-conductor-model-just-hit-sota-on-gpqa-di|Sakana AI ICLR 2026 论文, 2026-05-04]]
