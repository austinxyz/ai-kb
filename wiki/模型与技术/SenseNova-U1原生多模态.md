---
title: SenseNova-U1 原生多模态
category: 模型与技术
tags: [sensenova-u1, native-multimodal, moe, mot, flow-matching, autoregressive, sensetime, open-source]
source: "[[raw/models/2026-05-14-SenseNova-U1-technical-report]]"
updated: 2026-05-14
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S1_models
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-14
---

## 定义
商汤在 2026-05-13 发布的 SenseNova-U1 完整技术报告及开源模型 SenseNova-U1-A3B-MoT（38B 总参 / 3B 激活 MoE）。这是中国头部 AI 实验室第一次把"**原生多模态模型（NMM）从头怎么训**"这条完整管线公开——包括视觉接口、统一建模、训练目标、骨干网络、训练流程五件套。核心命题与主流路线不同：**不是把 vision 适配到已有 LLM 上，而是从骨干开始就原生统一多模态**。

## 核心要点 · 技术五件套
| 维度 | SenseNova-U1 选择 | 与主流路线对比 |
|------|------------------|---------------|
| 视觉接口 | **无 VE、无 VAE**，近无损 | 主流：CLIP/SigLIP encoder + projector |
| 建模范式 | **Native Multimodal Unified Modeling** | 主流：text-first LLM + vision adapter |
| 训练目标 | **Joint AR + pixel-space flow matching** | 主流：单一 AR 或 diffusion |
| 骨干网络 | **Native Mixture-of-Transformers (MoT)** | 主流：dense Transformer 或 MoE-on-LLM |
| 训练流程 | **6 阶段配方 + RL 后训练 + 蒸馏** | 主流：pretrain + SFT + RLHF |

## 核心要点 · 开源模型规格
- **SenseNova-U1-A3B-MoT**
  - 38B 总参，**3B 激活**（A3B MoE）
  - **原生 MoT 主干**上的统一模型——团队自称"稀有组合"
  - 推理极快（仅 3B active）
- 完整资源：Tech Report + Daily Papers + Weights + Code + Demo + Discord 一次性放出

## 核心要点 · 为什么"原生"是关键
1. **VE/VAE 是有损接口**——传统 vision encoder 把图压成 fixed dim embedding，丢失像素级细节；NMM 把视觉直接喂进 token 流
2. **Adapter 范式是迁就**——把 vision 接到 LLM 上意味着 backbone 早就为 text 优化好了，vision 永远是二等公民
3. **Joint AR + flow matching** ——文本走 AR、像素走 flow，两个目标在同一 backbone 上联合训练，统一表达空间从一开始就被强制学习
4. **MoT 不是 MoE-on-LLM**——专家组在 Transformer 层就分化模态特化，而不是事后挂载

## 与其他概念的关系
- [[wiki/模型与技术/OpenSeeker-v2|OpenSeeker-v2]]：两条不同路径回应"前沿模型如何被复现"——OpenSeeker-v2 走纯学术 SFT + 10.6k 高质量数据；SenseNova-U1 走完整从头训 + 6 阶段配方公开；两条路径都强调"配方比规模重要"
- [[wiki/应用开发/AI输出形态演进|AI 输出形态演进]]：输出形态从文本 → 视频 → 神经视频，前提是底层模型能"原生"理解和生成多模态——NMM 是这条链路的基础层
- [[wiki/AI基础设施/MCP|MCP（模型上下文协议）]]：NMM 让模型本体多模态——MCP 让外部工具多模态；两者解决的是同一问题的"内"和"外"

## 参考来源
- [[raw/models/2026-05-14-SenseNova-U1-technical-report|SenseTime 原推 + Tech Report 索引]]
