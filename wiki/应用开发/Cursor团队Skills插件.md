---
title: Cursor团队Skills插件（cursor-team-kit）
category: 应用开发
tags: [Cursor, Skills插件, CI/CD, 代码治理]
source: "[[raw/dev_methodology/2026-05-04-Cursor-官方团队自己在用的-CI-Code-Review-发版-测试-清理代码-周报等工作流的-Skills-打包成一个-Plugin-一句指令安装-ad]]"
updated: 2026-05-16
status: draft
aihot_origin:
  aihot_id: "cmoragvh00225slru1ru54n21"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Cursor 官方团队将内部用于构建 Cursor 产品的开发工作流打包为 `cursor-team-kit` 插件，包含 17 个核心 Skills、1 个 Agent 和 2 条 Rules，一句命令安装。

## 核心要点

- **安装方式**：`/add-plugin cursor-team-kit` 一句话完成
- **五大模块**：CI/合并循环自动化、PR 全流程管理、验证与测试（核心：`verify-this`）、总结复盘、代码治理
- **`verify-this`**：把 debug 变成科学实验——假设 → 测试 → 验证，减少盲目尝试
- **`ci-watcher` Agent**：后台监听 CI 状态，不需要人工盯盘
- **2条 Rules**：强制 TypeScript 代码风格规范
- **自用验证**：Cursor 团队用这套 Skills 构建自己的产品，本身是最强的可信度背书

## 与其他概念的关系

- [[wiki/应用开发/Cursor-Agent-Harness实战|Cursor Agent Harness实战]]：Skills 插件是 harness 外层工具，Harness 研究是 Skills 的底层架构依据
- [[wiki/应用开发/Warp官方Skills开源|Warp 官方 Skills 开源]]：Warp 偏 DevOps/Infra，Cursor 偏代码工程流程，两套组合可覆盖更广
- [[wiki/应用开发/Claude-Skills工程实践-Matt-Pocock|Claude Skills工程实践（Matt Pocock）]]：同为 Skills 集合，定位互补——Cursor 聚焦 CI/PR，Matt Pocock 聚焦设计对齐

## 参考来源

- [[raw/dev_methodology/2026-05-04-Cursor-官方团队自己在用的-CI-Code-Review-发版-测试-清理代码-周报等工作流的-Skills-打包成一个-Plugin-一句指令安装-ad|Cursor Team Kit Plugin, 2026-05-04]]
