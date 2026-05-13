---
title: "Karpathy：90% 的人在白白浪费 Token（10 条高级工程师已不干的浪费行为）"
slug: 2026-05-12-Karpathy-90percent-token-waste
fetched_at: 2026-05-13T05:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-12T23:13:43.000Z
aihot_tags: ["Karpathy", "Token 效率", "多模型路由", "Prompt Cache", "SKILL.md", "Kimi", "Opus", "Haiku"]
aihot_starred: 11
aihot_summary: |
  Karpathy 指出 AI coding 账单 90% 浪费在不必要的 context 上：50 文件塞改 30 行、用 Opus 跑 lint/format/改名、agent 每次 retry 重发整 repo、默认 Sonnet 而非 Kimi 2.6（质量近似但价格 1/6）、"以防万一"塞全部文件、每次从头重建知识。省钱组合拳：严管 context + 前缀全开 prompt cache + 多模型路由（Kimi 2.6 主力 / Opus 10% 关键任务）+ 重复工作沉淀 SKILL.md + 先 profile 再优化 prompt。
aihot_recommendation_reason: |
  Karpathy 把"Vibe Coding 时代的开发者税"明算了：12 个月后拉开月费 $200 vs $4000 的不是技术更牛，是 context 和 routing 玩得明白。每个重度用 AI 写代码的开发者都该量化自己的浪费率。
source_url: "https://x.com/berryxia/status/2054339265103065156"
source_type: "twitter"
content_source: "twitter_tweet_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S2_methodology"
  also_relevant: ["S4_agent"]
  confidence: "high"
wiki_status: drafted
wiki_target: "wiki/应用开发/Token浪费与多模型路由.md"
---
# Karpathy：90% 的人在白白浪费 Token

> 原推 · @berryxia 转 @DeRonin_ 转 Andrej Karpathy · 2026-05-12

> "你 AI coding 账单的 90% 其实都花在了发一些根本不需要的 context 上。"

## 10 条高级工程师已经彻底不干的浪费行为（挑了最常见的）

1. **自动把 50 个文件全塞进去改 30 行代码**，一轮下来 **$1.20** token 你根本不会去读
2. **拿 Opus 跑 lint / 格式化 / 改名**这种小活——Haiku 两分钱就能搞定，**贵了 30×**
3. **agent 每次 retry 把整个 repo 重新发一遍**，成本直接**翻 5×**
4. **默认用 Sonnet**——Kimi 2.6 在大部分 coding 任务上质量差不多，**价格只有 1/6**
5. **"以防万一"把文件全扔进 prompt**——8 万 token 实际 3000 就够
6. **每次 session 让 agent 从头重建知识**——写一个 SKILL.md 就能省下大把钱

## 真正省钱又能把事做好的组合拳

- **严格管 context**（精准片段而非整 repo）
- 稳定前缀全开 **prompt cache**
- **多模型路由**：Kimi 2.6 当主力，Opus 只留 **10% 关键任务**
- 重复工作做成 **SKILL.md** 文件
- **每次先 profile 工具调用再优化 prompt**

## Karpathy 一句话总结

> 12 个月后，拉开开发者月花费 **$200 和 $4000** 差距的，不是谁技术更牛，而是谁把 **context 和 routing 玩得更明白**。

## 评论区高质量补充

### @vaesmall — 预检步骤可省 40%
测了两周，最骚的是有人把整个代码库塞 prompt 让 AI 分析 bug——**连 node_modules 都读了一遍**。建议加一步：**发之前让 Agent 自己先评估"当前上下文够不够"**。这一步能省 **40%** 的 Token。

### @Banderhu1980 — 渐进上下文策略
省钱套路：**先只给报错堆栈和相关文件片段，跑通再逐步加上下文。**

## 来源

- 原推：https://x.com/berryxia/status/2054339265103065156
- 作者：Berry Xia (@berryxia)，转 @DeRonin_ 转 Andrej Karpathy
- 收集渠道：aihot.virxact.com 2026-05-13 日报 · 技巧与观点 #1
- 评论拉取方式：opencli twitter thread
