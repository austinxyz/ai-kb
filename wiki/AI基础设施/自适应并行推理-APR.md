---
title: 自适应并行推理 (Adaptive Parallel Reasoning, APR)
category: AI基础设施
tags: [inference-scaling, parallel-reasoning, kv-cache, rl-rewards, threadweaver]
source: "[[raw/ai_native_infra/2026-05-08-adaptive-parallel-reasoning-inference-scaling]]"
updated: 2026-05-09
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S1_infra
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-09
---

## 定义
让 LLM 在生成过程中由模型自主决定 **何时分支并行、并发多少线程、如何归并结果** 的推理范式（由 Pan et al. 2025 提出概念）。它将并行性写进模型的 control flow，缓解纯序列长 CoT 的 context-rot 与延迟线性增长，同时避开 BoN 类方法的冗余计算与 Tree-of-Thoughts 类方法对人工分解启发式的依赖。

## 核心要点
- **演进谱系（从固定并行到自适应控制）**：① 简单 fork-and-join：Self-consistency / 多数投票 与 Best-of-N（独立采样多条完整 trace，靠投票或 verifier 选答案），痛点是分支冗余。② 启发式结构化搜索：Tree / Graph / Skeleton of Thoughts 用 BFS/DFS + LLM 评估剪枝；MCTS 用 UCB 估值与扩展，依赖人工分解策略。③ 半固定并行：ParaThinker（两阶段：先并行多线程、后综合，引入 `<think_i>` 控制 token 与两阶段 attention mask）、GroupThink（多线程在 token 级互看部分结果、共享 KV cache）、Hogwild! Inference（多线程共用 KV cache、用 RoPE 拼接 KV 块、无显式协调协议）。④ APR：让模型自己决定何时并行、并行多少、如何归并——典型实现 ThreadWeaver、Multiverse、Parallel-R1、NPR。
- **APR 三个本质优势（相对前代）**：① 相对 Tree-of-Thoughts 不需要 domain-specific 分解启发式，RL 中模型从试错涌现出"边推下一步边自验证上一步"或"主路径 + 备份对冲"等难以人工设计的模式；② 相对 BoN 模型在分叉前已知道每个线程要做什么，能产出非重叠子任务，避免冗余；③ 相对所有非自适应方法，APR 可以选择 **不并行**——简单题直答（如 25+42），复杂题展开（如 Kakeya 集问题），按问题复杂度匹配并行度。
- **推理执行 = map-reduce 的 fork-join**：模型遇到子任务列表 → 各自 prefill 并独立 decode → 全部完成后聚合。聚合阶段的核心难题是 KV cache：独立线程从相同 position id 起始，简单拼接会产生非标准位置编码 + 非因果注意力模式，base 模型从未见过。
- **两大执行流派的分裂**：（A）**Multiverse / Parallel-R1 / NPR：改推理引擎复用 KV cache**——用 SGLang RadixAttention 把多请求组织成 radix tree 共享 prefix KV，归并阶段直接修改 page table 把不连续内存块拼成单条 KV cache 序列；代价是引擎要做非标准内存管理（指针易碎、batch size 受限）、训练时要用修改过的 attention mask 对齐分布。（B）**ThreadWeaver：客户端编排，引擎不动**——把所有分支文本拼成一条连续序列，让引擎做第二次 prefill 重算 KV；prefill 远比 decode 便宜，并且 conclusion 阶段是标准因果注意力，更易在已有引擎上落地、可与 sequential 模式混用。
- **训练数据：SFT 教语法、RL 教激励**：先用平行轨迹 SFT 让 base 模型学会输出特殊控制 token（base 模型 instruction-following 不足）。Parallel-R1 与 NPR 提出 SFT 主要起 format-following 作用、未必传授新推理能力，留作 open question。ThreadWeaver 训练时把平行轨迹组织成 prefix-tree 拍平为单条序列，叠加 ancestor-only attention mask（只让 thread 看到 prompt + 子任务，不互看也不看 conclusion），训练即推理对齐。
- **奖励设计 4 个迭代**：① 数线程数 → 模型 spawn 一堆短无用线程刷分；② 用没用并行的二元奖励 → 不必要时仍乱开线程；③ Parallel-R1 交替 schedule（20% 步数才奖励并行结构）→ 并行使用率 13.6% → 63%，但准确率几乎没动；④ ThreadWeaver 关键路径奖励 `1 − L_critical / L_total`（critical path = 因果依赖最长链 = 端到端 wall-clock），且 **由正确性闸控**：`R = 1(correct) + 1(correct) × parallelization_metric`——答错就不给并行奖励，避免模型用乱并行掩盖错误。
- **评估视角不统一**：Multiverse 与 ThreadWeaver 追求"序列 AR 模型水平的精度 + 更低延迟"；NPR 把序列回退视为失败，硬冲 100% Genuine Parallelism Rate；Parallel-R1 不在乎延迟，把 APR 当 RL 的探索 scaffold，提供 mid-training 多样性。模型规模差异也大：SFT on s1k 类难题用 Qwen2.5 32B，RL 因算力卡在 4B/8B。
- **Open questions**：① 推理时并行是真带来精度还是只在训练时充当探索 scaffold？Parallel-R1 暗示是后者（移除并行奖励 200 步后模型回归序列）；② 模型在自回归先验下倾向坍缩回序列，是奖励问题还是结构性冲突？③ 能否让训练感知推理时算力预算（hardware-aware 并行决策）？④ 当前并行结构都是 flat（深度=1），与 Recursive Language Models（RLMs）结合做 depth>1 的端到端 RL 是下一步。

## 与其他概念的关系
- [[wiki/AI基础设施/vLLM-V1迁移|vLLM-V1迁移]]：APR 的"改引擎派"（Multiverse）依赖 RadixAttention / page table 操作，本质是对在线推理引擎正确性边界的进一步压榨；vLLM V1 的迁移叙事直接相关（同样在博弈引擎修改 vs 客户端封装的取舍）。
- [[wiki/模型与技术/OpenSeeker-v2|OpenSeeker-v2]]：学术 SFT 搜索 agent 在多线程 / 多分支搜索上的工程经验，与 APR 在"如何把搜索变成模型自带能力而非外部脚手架"上同源。
- [[wiki/应用开发/Claude-Managed-Agents|Claude-Managed-Agents]]：multiagent 编排关心"何时分叉子代理、如何聚合"，APR 把这件事下沉到单模型 control flow，可视为 multiagent 的极端紧耦合形态。
- [[wiki/应用开发/Agentic-Workflow-Token效率|Agentic-Workflow-Token效率]]：critical path / total tokens 比值是 token 效率公式在并行场景下的延伸——序列时代用总 token 数算延迟，并行时代必须沿 critical path 算。

## 参考来源
- [[raw/ai_native_infra/2026-05-08-adaptive-parallel-reasoning-inference-scaling|Adaptive Parallel Reasoning: The Next Paradigm in Efficient Inference Scaling]]
