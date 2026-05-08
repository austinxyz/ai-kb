---
title: "NEW paper from Sakana AI (ICLR 2026).

A 7B Conductor model just hit SOTA on GPQA-Diamond and LiveCo..."
slug: 2026-05-04-new-paper-from-sakana-ai-iclr-2026-a-7b-conductor-model-just-hit-sota-on-gpqa-di
fetched_at: 2026-05-08T03:37:24.775Z
aihot_id: "cmorbmje400czslhfgs1xl62y"
aihot_url: ""
aihot_published_at: 2026-05-04T14:23:13.000Z
aihot_tags: ["Agent", "arXiv", "MCP/工具调用", "推理", "论文/研究"]
aihot_starred: 71
aihot_summary: |
  Sakana AI在ICLR 2026上发表研究，提出一个仅70亿参数的“指挥者”模型。该模型不直接解决问题，而是通过强化学习训练，专注于为混合开源与闭源模型的工作者智能体设计通信拓扑结构，并为每个工作者生成精准指令以发挥其特长。经随机化智能体池训练后，它能在推理时适应任意智能体组合。其关键创新在于，当允许指挥模型将自己也选为工作者时，系统会形成递归拓扑，实现动态测试时扩展。该模型在GPQA-Diamond和LiveCodeBench上达到SOTA水平，在AIME25和GPQA-D上的性能比最佳单体工作者提升约3%，这相当于前沿模型一个代际的改进幅度，且增益完全来源于协同优化。
aihot_recommendation_reason: |
  Sakana AI 这篇 ICLR 论文把 Agent 之间的通信拓扑和提示词一起做成可训练的，协调本身变成模型，做多 Agent 系统的人真该重新想想架构了。
source_url: "https://x.com/omarsar0/status/2051306659021242635"
source_type: "twitter"
content_source: "aihot_summary_only"
fetch_status: "skipped_by_source_type"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: []
  confidence: "high"
wiki_status: not_eligible_summary_only
---
