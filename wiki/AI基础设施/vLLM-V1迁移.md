---
title: vLLM V0 → V1 迁移
category: AI基础设施
tags: [vLLM, RL, 推理, logprobs, ServiceNow]
source: "[[raw/ai_native_infra/2026-05-07-vllm-v0-to-v1-correctness-before-corrections-in-rl]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmoug22sy00eeslbajec354qh"
  aihot_url: ""
  series: S1_infra
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
ServiceNow PipelineRL 团队在把 vLLM 从 0.8.5（V0 参考）迁到 0.18.1（V1）时的 in-line RL 训练对齐复盘：核心方法论是"Correctness Before Corrections"——先修后端 logprob 语义与运行时 default 让 V1 与 V0 trainer 指标重合，再考虑要不要给 RL 目标加 importance sampling 之类的修正。

## 核心要点
- **背景与症状**：PipelineRL 用 vLLM 做 rollout 生成，trainer 用返回的 token logprobs 算 policy ratio、KL、clip rate、entropy、reward。GSPO 训练的初次 V1 run 在 `clamp_log_ratio_new_old_indicator`、`kl_new_old`、`entropy`、`reward` 上立刻偏离 V0 baseline；同样的失配也会在 PPO/GRPO 等任何把 rollout logprobs 写进目标的系统中浮现。
- **修复 1：logprob 语义**：V1 默认返回 raw model output 的 logprobs（在 temperature scaling、penalty、top-k/top-p 之前），而 PipelineRL 期待 sampler 实际使用的 processed 分布。设 `logprobs-mode=processed_logprobs` 后 mean policy ratio 立刻贴回 1.0，但 clip rate / KL 仍未对齐。
- **修复 2：runtime defaults**：V1 在 0.18.1 默认开启 prefix caching 与 async scheduling，与 V0 路径不同；在线 RL + 频繁权重更新场景下，prefix-cache hit 可能复用 weight-update 之前算出的状态。修复方式是显式禁用：`enable-prefix-caching: false`、`async-scheduling: false`，并把 `disable-cascade-attn` 这类 ad-hoc kwarg 从 launch 时传参移入正式 parity recipe。
- **修复 3：inflight weight updates**：V0 行为是 engine boundary block → load weights → resume，不显式失效缓存。V1 对应写法是 `await engine.pause_generation(mode="keep", clear_cache=False)` + `collective_rpc_async("receive_weight_update", ...)` + `resume_generation()`；`mode="keep"` 比 `wait`/`abort` 更接近原 inflight 模型，`clear_cache=False` 匹配 V0 wrapper 的 cache 保留行为。
- **修复 4：fp32 lm_head**：trainer 用 fp32 做最终 projection，rollout backend 也必须如此；与 MiniMax-M1 技术报告（arXiv 2506.13585）观察到的 train/inference token-prob 失配同源（他们也通过把 LM head 切到 fp32 修复），ScaleRL 论文（arXiv 2510.13786）后来把 fp32 logits/head 写进 RL recipe ablation。
- **方法论分层**：先把可能因素分三层——semantic mismatch（语义）、inference-path mismatch（运行时）、objective mismatch（RL 目标），先排除前两层；过早怀疑第三层会让 objective-side correction（如 truncated importance sampling）掩盖 inference 错误，使训练曲线无法解读。
- **诊断信号 lag**：rollout 权重落后 trainer 多少步是有用的运行时指标——初次 V1 run 后期 lag 持续增大，修正后回归 V0 水平。
- **后续清理（已确认 parity 后才做）**：保留 rollout 时刻的 behavior-policy logprobs，optimization 时重算 trainer-side old-policy logprobs，分离 backend-mismatch correction 与 policy-update ratio，并跟踪 ESS 等 correction 项的诊断指标。

## 与其他概念的关系
- [[wiki/AI基础设施/GPU冷启动-Peer权重传输|GPU 冷启动与 Peer 权重传输]]：同样在权重更新边界遇到 cache 一致性问题（NCCLBack 用 mesh hash 隔离、vLLM 用 `clear_cache=False` 匹配 V0），都是在线 RL 基础设施常见雷区。
- [[wiki/AI基础设施/MCP|MCP（模型上下文协议）]]：远端关系不强，但同属"运行时 default 对正确性敏感"案例集。

## 参考来源
- [[raw/ai_native_infra/2026-05-07-vllm-v0-to-v1-correctness-before-corrections-in-rl|vLLM V0 to V1: Correctness Before Corrections in RL]]
