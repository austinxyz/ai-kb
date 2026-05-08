---
title: "OpenSeeker-v2: Pushing the Limits of Search Agents with Informative and High-Difficulty Trajectories"
slug: 2026-05-05-openseeker-v2-pushing-the-limits-of-search-agents-with-informative-and-high-diff
fetched_at: 2026-05-08T03:37:24.775Z
aihot_id: "cmotfjtor04upslv7b2f4sa2q"
aihot_url: ""
aihot_published_at: 2026-05-05T00:00:00.000Z
aihot_tags: ["Agent", "开源生态", "搜索", "论文/研究"]
aihot_starred: 72
aihot_summary: |
  本研究提出了一种仅通过监督微调（SFT）训练前沿搜索智能体的高效方法。该方法基于三项关键数据合成改进：扩展知识图谱规模、增加工具集以及进行严格的低步数过滤。仅使用1.06万条数据训练的OpenSeeker-v2，在四个基准测试中均取得了领先性能，全面超越了采用复杂CPT+SFT+RL流程训练的同类模型。这是首个由纯学术团队仅通过SFT实现的、在同等模型规模与范式下的顶尖搜索智能体，其模型权重将开源以促进社区研究。
aihot_recommendation_reason: |
  纯学术团队仅靠SFT和一万条数据，就在多个搜索基准上反超工业级管线，并且开源模型。这证明高质量数据比烧钱RL更关键，做Agent的朋友值得认真看。
source_url: "https://arxiv.org/abs/2605.04036"
source_type: "arxiv"
content_source: "original_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: []
  confidence: "high"
wiki_status: drafted
wiki_target: "wiki/模型与技术/OpenSeeker-v2.md"
---
# OpenSeeker-v2: Pushing the Limits of Search Agents with Informative and High-Difficulty Trajectories

**Authors**: Yuwen Du, Rui Ye, Shuo Tang, Keduan Huang, Xinyu Zhu, Yuzhu Cai, Siheng Chen

**Subjects**: Artificial Intelligence (cs.AI); Computation and Language (cs.CL)

## Abstract

Abstract:Deep search capabilities have become an indispensable competency for frontier Large Language Model (LLM) agents, yet their development remains dominated by industrial giants. The typical industry recipe involves a highly resource-intensive pipeline spanning pre-training, continual pre-training (CPT), supervised fine-tuning (SFT), and reinforcement learning (RL). In this report, we show that when fueled with informative and high-difficulty trajectories, a simple SFT approach could be surprisingly powerful for training frontier search agents. By introducing three simple data synthesis modifications: scaling knowledge graph size for richer exploration, expanding the tool set size for broader functionality, and strict low-step filtering, we establish a stronger baseline. Trained on merely 10.6k data points, our OpenSeeker-v2 achieves state-of-the-art performance across 4 benchmarks (30B-sized agents with ReAct paradigm): 46.0% on BrowseComp, 58.1% on BrowseComp-ZH, 34.6% on Humanity's Last Exam, and 78.0% on xbench, surpassing even Tongyi DeepResearch trained with heavy CPT+SFT+RL pipeline, which achieves 43.4%, 46.7%, 32.9%, and 75.0%, respectively. Notably, OpenSeeker-v2 represents the first state-of-the-art search agent within its model scale and paradigm to be developed by a purely academic team using only SFT. We are excited to open-source the OpenSeeker-v2 model weights and share our simple yet effective findings to make frontier search agent research more accessible to the community.

**arXiv URL**: https://arxiv.org/abs/2605.04036
