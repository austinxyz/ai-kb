---
title: Boris Cherny AI编码工作流
category: 应用开发
tags: [Boris Cherny, Claude Code, 并行实例, 知识库]
source: "[[raw/dev_methodology/2026-05-06-这个创造了Claude-Code的男人Boris-Cherny大神-完整公开了自己的工作流-并直播演示了一半的编码工作在手机上完成-不是回消息-是同时跑5到10]]"
updated: 2026-05-16
status: stable
aihot_origin:
  aihot_id: "cmotwjqgz007wslu90ocpeqe5"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Claude Code 创造者 Boris Cherny 公开的三条反直觉 AI 编码原则：用最贵的模型反而省钱、单一纯文本知识库形成长期记忆、始终让 AI 看到运行结果，并在手机上并行运行 5-10 个 Claude 实例。

## 核心要点

- **用最贵的模型**：一次清晰规划省去笨模型的反复试错，整体 token 消耗反而更少
- **单一知识库文件**：纯文本记录 Claude 的每次错误，每周更新，形成持续进化的长期记忆
- **始终看运行结果**：Claude 必须执行并渲染代码结果，而非仅看静态代码
- **并行多实例**：手机上同时启动 5-10 个 Claude 实例，规划模式制定方案后并行执行
- **自 2025.11 起未手写代码**：Boris 本人的工作方式是纯 AI 委托模式

## 与其他概念的关系

- [[wiki/应用开发/OpenClaw-百个Codex实例运营开源项目|OpenClaw 百个 Codex 实例]]：OpenClaw 在开源运营层面实践了类似的大规模并行实例思路
- [[wiki/应用开发/AI助手身份层|AI 助手身份层]]：Boris 的"单一知识库文件"是简化版的 MEMORY.md 实践
- [[wiki/行业洞察/Anthropic-AI军队组织架构|Anthropic AI 军队组织架构]]：Boris 个人工作流是 Anthropic 组织层面 AI 军队模式的缩影

## 参考来源

- [[raw/dev_methodology/2026-05-06-这个创造了Claude-Code的男人Boris-Cherny大神-完整公开了自己的工作流-并直播演示了一半的编码工作在手机上完成-不是回消息-是同时跑5到10|Boris Cherny AI 编码工作流, 2026-05-06]]
