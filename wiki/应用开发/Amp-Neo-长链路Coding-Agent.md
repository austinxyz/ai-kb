---
title: Amp Neo：长链路Coding Agent
category: 应用开发
tags: [Amp, Coding Agent, 长链路, Plugin API]
source: "[[raw/dev_methodology/2026-05-07-2026-年的-Coding-Agent-应该是什么样-Amp-新版-CLI-Neo-发布-AmpCode-https-ampcode-com-news-neo]]"
updated: 2026-05-16
status: draft
aihot_origin:
  aihot_id: "cmouvkjiq00ansl44ppklky75"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Amp 发布的新一代 CLI 工具 Neo，标志 Coding Agent 从"陪伴式"转向"长链路"新范式：减少人工介入、支持随处运行与远程触发，核心是让 Agent 真正替人完成任务而非辅助人工作。

## 核心要点

- **范式转变**：从"陪你写代码"（人主导、AI 配合）→ "替你干完活"（AI 主导、人审查）
- **远程编排**：本地线程可被远程控制触发，实现真正的异步任务分发
- **自动上下文压缩**：淘汰手动上下文管理，Agent 自主维护长任务上下文
- **Plugin API**：扩展工具与交互接口，允许第三方接入
- **权限模型反转**：默认允许所有操作，安全控制权移交插件系统（而非逐步请求权限）
- **性能提升**：CPU 与内存占用显著下降，适合长时间后台运行

## 与其他概念的关系

- [[wiki/应用开发/Cursor-Agent-Harness实战|Cursor Agent Harness实战]]：两者都在推进 Agent 自主度——Amp 通过权限反转，Cursor 通过动态上下文获取
- [[wiki/应用开发/OpenClaw-百个Codex实例运营开源项目|OpenClaw 百个 Codex 实例]]：OpenClaw 是长链路 Agent 在开源运营场景的实践，Amp Neo 是工具层的对应产品形态
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：权限模型反转是 harness 设计哲学的重大突破——从限制式到授权式

## 参考来源

- [[raw/dev_methodology/2026-05-07-2026-年的-Coding-Agent-应该是什么样-Amp-新版-CLI-Neo-发布-AmpCode-https-ampcode-com-news-neo|Amp Neo 长链路 Coding Agent, 2026-05-07]]
