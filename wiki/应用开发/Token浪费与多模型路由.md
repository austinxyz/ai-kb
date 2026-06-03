---
title: Token 浪费与多模型路由（Karpathy）
category: 应用开发
tags: [token-efficiency, prompt-cache, model-routing, kimi, opus, haiku, skill-md, vibe-coding]
source: "[[raw/dev_methodology/2026-05-12-Karpathy-90percent-token-waste]]"
updated: 2026-06-03
status: stable
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S2_methodology
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-13
---

## 定义
Andrej Karpathy 提出的"AI coding 账单 90% 浪费在不必要 context 上"清单及其工程化对策。核心论断——**12 个月后拉开开发者月费 $200 vs $4000 的不是技术更牛，而是 context 与 routing 玩得明白**。Vibe Coding 时代的开发者税不是花在算力上，而是花在"懒得做 context 管理"和"懒得做模型路由"上。

## 核心要点 · 6 类典型浪费（高级工程师已经彻底不干的事）

1. **盲塞整个仓库**：50 个文件丢进 prompt 改 30 行代码，一轮 **$1.20** token 你根本不读
2. **Opus 跑小活**：用 Opus 跑 lint / format / 改名——Haiku 两分钱搞定，**贵了 30 倍**
3. **Retry 重发 repo**：agent 每次 retry 把整个 repo 重新发，**成本翻 5 倍**
4. **默认 Sonnet**：Kimi 2.6 在大部分 coding 任务质量近似，**价格只有 1/6**
5. **"以防万一"全塞**：8 万 token 实际 3000 就够
6. **每 session 从零重建知识**：写一个 SKILL.md 就能省下大把钱

## 核心要点 · 5 步省钱组合拳

1. **严格管 context**——精准片段而非整 repo
2. **稳定前缀全开 prompt cache**——cache hit 是省钱的杠杆
3. **多模型路由**——Kimi 2.6 主力，Opus 只留 **10% 关键任务**
4. **重复工作沉淀 SKILL.md**——避免每次重建知识
5. **先 profile 工具调用再优化 prompt**——盲优化等于浪费

## 评论区可施工技巧

### @vaesmall · 预检步骤可省 40%
**发之前让 Agent 先评估"当前上下文够不够"**——多一步预检，能省 **40%** Token。

### @Banderhu1980 · 渐进上下文策略
**先只给报错堆栈 + 相关文件片段，跑通再逐步加上下文。**

## 一句话总结

> 12 个月后，拉开开发者月费 **$200 vs $4000** 的，不是谁技术更牛，而是谁把 **context 和 routing 玩得明白**。

## 与其他概念的关系
- [[wiki/应用开发/Prompt-Caching工程|Prompt Caching 工程]]：Claude Code 团队复盘的"前缀匹配 → 静态在前动态在后"是本条目第 2 步的具体技术——本条目把"开 cache"列为五件套之一，前者讲清楚怎么开。
- [[wiki/应用开发/Claude-Code团队配置|Claude Code 团队配置]]：CLAUDE.md 三层作用域 + Skills（Reference vs Task）+ Hooks——SKILL.md 在团队级是 Claude Code Skills 的统一表达。
- [[wiki/应用开发/Agentic-Workflow-Token效率|Agentic Workflow Token 效率]]：GitHub 工程化方法（日志埋点 + ET 指标 + MCP 工具修剪 + gh CLI 替换）是企业级的同主题——本条目是个人开发者级的版本。
- [[wiki/模型与技术/Claude-Opus-4.7-Fast-Mode|Claude Opus 4.7 Fast Mode]]：Fast Mode 与多模型路由的关系——Fast Mode 是"在 Opus 内省"的轴，路由是"在多家模型间省"的轴，两者叠加才是最省。
- [[wiki/应用开发/AI-Agent-PR审查|AI Agent PR 审查]]："agent ghosting"红旗与本条目第 3 条（retry 重发整 repo）同源——agent 失控的成本与 token 浪费的成本是一体两面。

## 参考来源
- [[raw/dev_methodology/2026-05-12-Karpathy-90percent-token-waste|Karpathy 观点 + Berry Xia 转述 + 社区评论]]
