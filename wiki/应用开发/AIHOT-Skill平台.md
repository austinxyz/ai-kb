---
title: AIHOT Skill 平台
category: 应用开发
tags: [AIHOT, Skill, RSS, API, AI日报, 信息聚合]
source: "[[raw/others/装了这个AI热点Skill之后，你再也不需要自己去刷AI新闻了]]"
updated: 2026-06-20
status: stable
---

## 定义

AIHOT（aihot.virxact.com）是 AI 热点聚合平台，开放 Skill / RSS / API 三种接入方式，让 Agent 可直接查询 AI 行业日报、精选动态和全量信息，无需手动刷新闻。

## 核心要点

**三种接入方式**
- **Skill**：`帮我安装这个 skill：https://aihot.virxact.com/aihot-skill/`；支持 Claude Code、Codex、OpenClaw、Hermers 等所有兼容 Skill 协议的 Agent
- **RSS**：精选动态 / 全部 AI 动态 / AI 日报三个 Feed，适合 Feedly/Inoreader 用户
- **API**：开放给需集成到内部系统的开发者，有 OpenAPI 文档

**Skill 四大能力**
1. **AI 日报**：北京时间每日 08:00 自动生成，五版块（模型/产品/行业/论文/技巧），每条含中文标题 + 一句摘要 + 来源 + 原文链接；说"给我今天的 AI 日报"即触发
2. **精选模式**：默认模式，从全量信息中筛选高价值条目，时间流展示
3. **时间窗口 + 分类查询**：支持按五大分类 + 最长 7 天时间窗口查询；"最近 3 天所有 AI 产品发布"等自然语言即可
4. **关键词搜索**：实时检索，信息时效优于模型训练数据

**与 `/aihot-daily` 的关系**：本项目的 `/aihot-daily` Skill 即基于此平台构建；原始 Skill 来自 AIHOT 官方，我们在项目中封装为 Notion 日报场景

## 与其他概念的关系

- [[wiki/应用开发/Claude-Skills工程实践-Matt-Pocock|Claude Skills 工程实践]]：Skill 作为 Agent 能力扩展的基础范式
- [[wiki/应用开发/Warp官方Skills开源|Warp 官方 Skills 开源]]：同类 Skill 开放生态中的另一案例

## 参考来源

- [[raw/others/装了这个AI热点Skill之后，你再也不需要自己去刷AI新闻了|AIHOT Skill 介绍文章]]
