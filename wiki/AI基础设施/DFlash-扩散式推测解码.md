---
title: DFlash：扩散式推测解码
category: AI基础设施
tags: [推理加速, 扩散模型, TPU, Google]
source: "[[raw/ai_native_infra/2026-05-05-Google-这一波操作-最让人意外的是-Google直接把LLM推理里最顽固的autoregressive瓶颈干掉了-他们和UCSD合作推出的DFlash-D]]"
updated: 2026-05-16
status: draft
aihot_origin:
  aihot_id: ""
  series: S1_infra
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Google 与 UCSD 合作推出的扩散式推测解码技术，在 Google Cloud TPU 上实现 3.13 倍无损推理加速，通过一次推测生成多个 token 打破传统自回归串行瓶颈。

## 核心要点

- **突破点**：传统自回归解码逐 token 串行生成 → DFlash 一次推测生成多个 token，大幅提升并行度
- **硬件协同**：专门针对 Google Cloud TPU 优化，是硬件与算法的联合优化
- **实测加速**：3.13 倍无损（不损失输出质量）推理加速
- **影响链**：云端推理成本下降 → 实时 Agent / 长上下文应用更可行 → 本地部署门槛降低
- **竞争维度迁移**：大模型推理竞争从模型参数量转向系统级优化

## 与其他概念的关系

- [[wiki/AI基础设施/自适应并行推理-APR|自适应并行推理 APR]]：APR 在逻辑层并行推理分支，DFlash 在 token 生成层并行解码，两者互补
- [[wiki/AI基础设施/GPU冷启动-Peer权重传输|GPU 冷启动与 Peer 权重传输]]：同属推理基础设施优化，降低推理整体成本的不同切入点

## 参考来源

- [[raw/ai_native_infra/2026-05-05-Google-这一波操作-最让人意外的是-Google直接把LLM推理里最顽固的autoregressive瓶颈干掉了-他们和UCSD合作推出的DFlash-D|Google DFlash 推理加速, 2026-05-05]]
