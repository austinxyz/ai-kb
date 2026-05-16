---
title: OpenSquilla：多模型智能路由降本
category: 应用开发
tags: [多模型路由, 成本优化, Agent, 开源]
source: "[[raw/agent_engineering/2026-05-15-你敢把-Opus-和-GPT-接入到小龙虾里跑吗-反正我是不敢-跑不起-但是不接入这些顶级模型-有些复杂任务-国产模型真的搞不定-发现一个以前不知道的团队做的开]]"
updated: 2026-05-16
status: draft
aihot_origin:
  aihot_id: "cmp71k78q06p8slnzvgf8b9x8"
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

开源项目 OpenSquilla：通过智能路由将简单任务分配给廉价模型、复杂任务调用 Opus 等顶级模型，在保持接近最优性能（0.9251 分 vs OpenClaw 基准）的同时将成本从 $6 降至 $0.68（约 10 倍）。

## 核心要点

- **核心路由逻辑**：任务复杂度分类 → 简单任务走国产/廉价模型，复杂任务走 Opus/GPT → 成本 $6→$0.68
- **四层记忆结构**：模拟人脑认知的层次化记忆，支持跨任务上下文保留
- **工具按需加载**：支持 16 种工具按需加载，减少上下文膨胀
- **三档沙箱安全防护**：代码执行安全分级管控
- **统一接入**：兼容 OpenAI、Claude、Gemini、DeepSeek 等 20+ 模型；支持网页、CLI、Slack、飞书等平台

## 与其他概念的关系

- [[wiki/应用开发/Token浪费与多模型路由|Token 浪费与多模型路由（Karpathy）]]：Karpathy 指出路由是省钱核心，OpenSquilla 是该思路的开源实现
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：路由层本身是一种 harness——限制顶级模型只用于必要任务，控制爆炸半径与成本

## 参考来源

- [[raw/agent_engineering/2026-05-15-你敢把-Opus-和-GPT-接入到小龙虾里跑吗-反正我是不敢-跑不起-但是不接入这些顶级模型-有些复杂任务-国产模型真的搞不定-发现一个以前不知道的团队做的开|OpenSquilla 智能路由, 2026-05-15]]
