---
title: Claude Code 命令速查
category: 应用开发
tags: [Claude Code, 命令, 快捷键, CLI, 工作流]
source: "[[raw/ai_usage/Claude Code 拥有 50 多个命令。大多数开发者只用到 5 个]]"
updated: 2026-06-20
status: stable
---

## 定义

Claude Code 50+ 命令的分层体系：CLI 启动标志 / 斜杠指令 / 快捷键三层，精通 15+ 命令的开发者交付速度比普通用户快 3-4 倍（2026 年 3 月数据）。

## 核心要点

**日常必用（Top 10）**
- `/init` — 创建 `CLAUDE.md`，项目长期记忆，一次写入免重复解释规范
- `/compact` — 上下文占 70-80% 时压缩，2026 年 2 月起秒级完成
- `/model` — 在 Sonnet（日常）/ Opus（架构）/ Haiku（体力活）间切换
- `/cost` — 实时监控 Token 消耗
- `/diff` — 提交前查看改动，拒绝开盲盒
- `/memory` — 会话内直接编辑 CLAUDE.md；`# 规则` 语法直接追加记忆
- `/resume` — 加载历史会话，可用自然语言定位（"去年 12 月那个"）

**进阶指令**
- `/btw` — Claude 执行中途插话，完成后自动回到任务（2026 年 3 月最受欢迎特性）
- `/plan` — 只读规划模式，先看方案再执行，防止 90% 事故
- `/todos` — 跨会话任务清单
- `/simplify` — 三并行 Agent 从安全/性能/规范三维代码审查（取代旧版 `/review`）

**CLI 标志**
- `claude --print "..."` — 单次查询后退出，适合脚本
- `claude -c` — 续上上次该目录会话
- `--dangerously-skip-permissions` — ⚠️ 仅受信任容器（Docker/CI）内使用

**快捷键**
- `Shift+Tab` — 循环切换正常 / 自动接受 / 规划模式
- `Esc Esc` — 呼出回滚菜单（可单独回滚代码保留对话）
- `! + 命令` — 会话内直接执行 Bash
- `@ + 路径` — 文件路径补全

## 与其他概念的关系

- [[wiki/应用开发/Claude-Code团队配置|Claude Code 团队配置]]：CLAUDE.md 的团队级用法，与 `/init` / `/memory` 命令深度关联
- [[wiki/应用开发/Claude-Code动态工作流|Claude Code 动态工作流]]：`/plan` 和多 Agent 编排的进阶用法

## 参考来源

- [[raw/ai_usage/Claude Code 拥有 50 多个命令。大多数开发者只用到 5 个|Claude Code 命令速查原文]]
