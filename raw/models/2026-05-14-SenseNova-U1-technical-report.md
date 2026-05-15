---
title: "SenseNova-U1 技术报告：前沿原生多模态模型构建全指南（38B-A3B MoE 开源）"
slug: 2026-05-14-SenseNova-U1-technical-report
fetched_at: 2026-05-14T08:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-13T05:24:00.000Z
aihot_tags: ["SenseNova-U1", "Native Multimodal Model", "MoE", "MoT", "Flow Matching", "Autoregressive", "SenseTime", "Open Source"]
aihot_starred: 0
aihot_summary: |
  商汤发布 SenseNova-U1 完整技术报告，是迄今最详细的前沿原生多模态模型（NMM）构建指南。核心五件套：1) 近无损视觉接口（无 VE、无 VAE）；2) 原生多模态统一建模；3) 自回归 + 像素空间 flow matching 联合训练；4) 原生 Mixture-of-Transformers 骨干；5) 6 阶段训练流程 + RL 后训练 + 蒸馏。同时开源 SenseNova-U1-A3B-MoT —— 38B-A3B MoE 主干上的原生统一模型，仅激活 3B 参数，速度极快。技术报告 + Daily Papers + 模型权重 + 代码 + Demo + Discord 全套放出。
aihot_recommendation_reason: |
  这是中国头部 AI 实验室第一次把"原生多模态模型怎么从头训"这条管线（含 6 阶段配方 + RL 后训练 + 蒸馏 + MoE on MoT 主干）完整公开。两个稀缺点：a) 原生 MoT 骨干（不是把 vision 适配到 LLM 上）；b) 联合 AR + 像素空间 flow matching 训练。任何在做 NMM 或者 unified model 的团队都应该精读。
source_url: "https://x.com/SenseTime_AI/status/2054446490420924558"
source_type: "twitter"
content_source: "twitter_thread_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S1_models"
  also_relevant: ["S3_infra"]
  confidence: "high"
wiki_status: drafted
wiki_target: "wiki/模型与技术/SenseNova-U1原生多模态.md"
---

# SenseNova-U1：原生多模态模型构建全指南

> 商汤 SenseTime (@SenseTime_AI) · 2026-05-13

## 原推全文

> "🔥 New week, New 𝗦𝗲𝗻𝘀𝗲𝗡𝗼𝘃𝗮-𝗨𝟭 Drop — and this one goes Deep!🔥
>
> 📄 𝗧𝗵𝗲 𝗳𝘂𝗹𝗹 𝗧𝗲𝗰𝗵𝗻𝗶𝗰𝗮𝗹 𝗥𝗲𝗽𝗼𝗿𝘁 𝗶𝘀 𝗢𝗨𝗧 — the most detailed disclosure yet of how to build a frontier Native Multimodal Model.
>
> Inside:
> ✨ Near-lossless visual interface (no VEs, no VAEs)
> ✨ Native Multimodal Unified Modeling
> ✨ Joint AR + pixel-space flow matching training
> ✨ Native Mixture-of-Transformers backbone
> ✨ 6-stage training recipe + RL post-training + distillation
>
> If you work on NMM, this is the playbook.
>
> 🤗 One more thing: 𝗦𝗲𝗻𝘀𝗲𝗡𝗼𝘃𝗮-𝗨𝟭-𝗔𝟯𝗕-𝗠𝗼𝗧 (𝟯𝟴𝗕-𝗔𝟯𝗕 𝗠𝗼𝗘) 𝘄𝗲𝗶𝗴𝗵𝘁𝘀 𝗮𝗿𝗲 𝗻𝗼𝘄 𝗼𝗽𝗲𝗻-𝘀𝗼𝘂𝗿𝗰𝗲𝗱 — a RARE native unified model on an MoE backbone (Only 3B active! Lightning Fast⚡)"

## 技术五件套

| 维度 | 内容 |
|------|------|
| 视觉接口 | **无 VE、无 VAE** —— 近无损（实质上把视觉直接喂进 token 流） |
| 建模范式 | **Native Multimodal Unified Modeling** —— 不是把 vision 适配到 LLM 上 |
| 训练目标 | **Joint AR + pixel-space flow matching** —— 自回归与像素空间流匹配联合 |
| 骨干网络 | **Native Mixture-of-Transformers (MoT)** —— 不是先训 LLM 再嫁接 |
| 训练流程 | **6 阶段配方 + RL 后训练 + 蒸馏** |

## 开源模型

- **SenseNova-U1-A3B-MoT**
  - 38B-A3B MoE（38B 总参，3B 激活）
  - 原生 MoT 骨干上的统一模型 —— 报告自称"稀有"组合
  - 激活参数仅 3B → 推理极快

## 资源链接

- 📄 Tech Report: https://t.co/XErg1bUAS8
- 🤗 Daily Papers: https://t.co/IGQ01dPpLs
- 🤗 Model Weights: https://t.co/GdqWqCNRpX
- 💻 Code: https://t.co/VQfh3IJFEu
- 🎮 Demo: https://t.co/unu7cr43Ud
- 👾 Discord: https://t.co/8MkRBA0Cmx

## 评论区

### @cyrilismyname
> "True multimodal is the future. No adapters and extra layers."

（其余评论以"期待"、"赞"为主，技术深度补充较少）

## 与已有 Wiki 的潜在交叉

- 暂无原生多模态相关 wiki 条目，本条 ingest 后建议新建：
  - `wiki/模型与技术/SenseNova-U1原生多模态.md`（已起 draft）
  - 后续可补 `wiki/模型与技术/原生多模态模型范式.md`（横向对比：原生 vs 适配范式）

## 来源

- 原推：https://x.com/SenseTime_AI/status/2054446490420924558
- 收集渠道：aihot.virxact.com 2026-05-14 日报 · 模型发布/更新 #3
- 评论拉取方式：opencli twitter thread
