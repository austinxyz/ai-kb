---
title: "搜索垫图法：让 Codex/AI 画对生僻事实（藏师傅 PPT Skill 实战）"
slug: 2026-05-14-search-reference-image-for-AI-image-gen
fetched_at: 2026-05-14T08:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-14T01:30:00.000Z
aihot_tags: ["AI 绘图", "Codex", "PPT Skill", "Reference Image", "Workflow", "Prompt Engineering"]
aihot_starred: 0
aihot_summary: |
  歸藏（@op7418）实战分享：用 Codex 生成涉及生僻事实的配图（如云南"甲马符"这类 GPT 不知道的题材），先让 AI 搜索相关图片当参考，再基于参考生成新图。同时解决两个问题：事实真实性 + 高清/比例合规。kankan916033 升级版总结：这不只是生图技巧，是一套内容生产 Workflow：先找事实 → 再给参考 → 再生成 → 最后校验。mengling_ai 补：该法在 LoRA reference 上同样有效，细节更准。
aihot_recommendation_reason: |
  这条不大但很有杠杆 —— 把"AI 凭空画 vs AI 基于事实画"这条线划清楚。对 AI 配图（PPT、知识库插图、文档配图）特别有用，是个能立刻复用的小 SKILL。
source_url: "https://x.com/op7418/status/2054491392261632448"
source_type: "twitter"
content_source: "twitter_thread_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S2_methodology"
  also_relevant: ["S4_agent"]
  confidence: "high"
wiki_status: candidate
wiki_target: ""
---

# 搜索垫图法：让 AI 画对生僻事实

> 歸藏 (@op7418) · 2026-05-14

## 原推

> "用藏师傅的 PPT Skill 让 Codex 配图的技巧
>
> 涉及到一些非常生僻的事实你怕 Codex 画的图有问题的时候，可以让他搜索相关图片，然后基于搜索的图片生成新的图片
>
> 这样既可以保证真实性，又可以生成符合比例要求和高清的图片
>
> 比如云南这种甲马符 GPT 肯定是不知道长啥样的，但是垫图之后他能画的很好。"

## 核心做法

```
prompt: "先搜索 <生僻事实> 的相关图片 → 选一张作为参考 → 基于参考生成 <我想要的版本>"
```

两个收益同时拿到：
1. **事实真实性** —— AI 不再凭空脑补
2. **高清 + 比例合规** —— 生成的是新图，不受参考图原始分辨率/比例约束

## 评论区高质量补充

### @kankan916033 — 这是一套 Workflow，不只是技巧
> "用搜索垫图提升 AI 绘画准确性 …… 它是一套内容生产 Workflow：
> - 先找事实
> - 再给参考
> - 再生成
> - 最后校验
>
> AI 生成内容要想靠谱，不能只靠一句 prompt。"

适用问题域：地域文化 / 冷门符号 / 特定建筑 / 具体人物风格 —— 模型最容易"想当然"的几类。

### @mengling_ai — 同样适用于 LoRA reference
> "垫图这招用在 LoRA reference 上也一样，搜一张接近的垫进去，细节准很多"

### @listudio
> "这个思路挺稳。先找真图再生成，AI 最怕的就是'想当然'"

### @HaichaoZ — 配套工具
> Starry Slides Skill：和这套垫图法配合，让生成的 PPT 可直接编辑

## 与已有 Wiki 的潜在交叉

- `wiki/应用开发/AI-PPT工程化.md` —— 配图阶段可补充"搜索垫图法"作为子模式
- 可能新建：`wiki/应用开发/AI生图Workflow.md`（待沉淀，先找事实→给参考→生成→校验）

## 来源

- 原推：https://x.com/op7418/status/2054491392261632448
- 收集渠道：aihot.virxact.com 2026-05-14 日报 · 技巧与观点 #8
- 评论拉取方式：opencli twitter thread
