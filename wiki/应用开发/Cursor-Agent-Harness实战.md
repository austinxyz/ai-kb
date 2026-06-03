---
title: Cursor Agent Harness实战
category: 应用开发
tags: [Agent Harness, Cursor, 上下文管理, 多Agent]
source: "[[raw/dev_methodology/2026-05-05-Cursor-团队这篇-持续改进我们的-Agent-Harness-写的真不错-很实战-如何衡量-harness-的好坏-如何为不同模型定制-harness-中]]"
updated: 2026-05-16
status: stable
aihot_origin:
  aihot_id: "cmos0c9f803x9slrjv53m4oas"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Cursor 团队关于"持续改进 Agent Harness"的实战总结，阐述如何衡量 harness 好坏、为不同模型定制 harness，以及 AI 编程中上下文管理范式从"守卫式"向"动态获取式"的演进。

## 核心要点

- **核心命题**：模型能力决定上限，harness 设计决定实际表现
- **衡量体系**：离线基准 + 在线 A/B 测试 + 留存率 + LLM 判读，多维度综合评估
- **范式转变**：从"守卫式"（静态注入大量信息）→ "动态获取式"（赋予模型按需拉取上下文的权力）
- **模型定制**：不同模型对工具格式、Prompt 风格要求不同，harness 需重度定制
- **多 Agent 判断**：Cursor 团队认为 AI 编程未来是多 Agent 协作，harness 工程是核心竞争力
- **愿景驱动**：设计方向由长期愿景驱动，具体优化由实验闭环执行

## 与其他概念的关系

- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：Cursor 实战是 Harness 工程原则的最佳案例注解，两者应并读
- [[wiki/应用开发/Cursor团队Skills插件|Cursor 团队 Skills 插件]]：Skills 是 harness 的外层工具集，harness 研究是 Skills 设计的底层依据
- [[wiki/应用开发/Amp-Neo-长链路Coding-Agent|Amp Neo 长链路 Coding Agent]]：Amp Neo 的"默认允许所有操作"是动态获取式 harness 的极端形式

## 参考来源

- [[raw/dev_methodology/2026-05-05-Cursor-团队这篇-持续改进我们的-Agent-Harness-写的真不错-很实战-如何衡量-harness-的好坏-如何为不同模型定制-harness-中|Cursor Agent Harness 实战, 2026-05-05]]
