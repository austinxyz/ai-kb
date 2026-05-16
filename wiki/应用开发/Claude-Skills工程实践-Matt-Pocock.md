---
title: Claude Skills工程实践（Matt Pocock）
category: 应用开发
tags: [Claude Skills, 工程实践, TDD, 代码一致性]
source: "[[raw/dev_methodology/2026-05-03-解决真正工程问题的-Skills-Skills-For-Real-Engineers-作者-mattpocockuk-公开了自己-claude-目录中每天在用的]]"
updated: 2026-05-16
status: draft
aihot_origin:
  aihot_id: "cmopogquh0y1esll9cth65i6l"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

TypeScript 教育者 Matt Pocock 开源的 .claude/ 目录 Skills 集合，专门解决 AI 编程中对齐需求、维护一致性、建立测试反馈回路、对抗代码熵增四大工程痛点。

## 核心要点

- **需求对齐**：`/grill-me` 技能让 AI 在动工前反向拷问开发者，提前发现歧义
- **共享语言**：维护 CONTEXT.md 与 ADR（架构决策记录），建立人机之间的统一术语
- **测试反馈**：`/tdd` 和 `/diagnose` 技能建立快速测试与诊断回路，减少盲目重试
- **代码治理**：`/to-prd`、`/zoom-out` 对抗熵增，定期重新审视设计
- **三分类**：Skills 分为工程类（核心流程）、效率类（提速）、工具类（外部集成）

## 与其他概念的关系

- [[wiki/应用开发/Cursor团队Skills插件|Cursor 团队 Skills 插件]]：同为实战 Skills 集合，Cursor 偏 CI/CD 自动化，Matt Pocock 偏工程纪律与设计对齐
- [[wiki/应用开发/Claude-code工程纪律规范|Claude Code 工程纪律规范]]：grill-me 需求对齐与 Karpathy 的"先思考再编码"原则互补
- [[wiki/应用开发/Warp官方Skills开源|Warp 官方 Skills 开源]]：Warp 偏 DevOps/Infra，Matt Pocock 偏应用工程，两套 Skills 互补

## 参考来源

- [[raw/dev_methodology/2026-05-03-解决真正工程问题的-Skills-Skills-For-Real-Engineers-作者-mattpocockuk-公开了自己-claude-目录中每天在用的|Matt Pocock Skills For Real Engineers, 2026-05-03]]
