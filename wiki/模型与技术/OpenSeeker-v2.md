---
title: OpenSeeker-v2
category: 模型与技术
tags: [Search-Agent, SFT, ReAct, 数据合成, 开源]
source: "[[raw/agent_engineering/2026-05-05-openseeker-v2-pushing-the-limits-of-search-agents-with-informative-and-high-diff]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmotfjtor04upslv7b2f4sa2q"
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
OpenSeeker-v2 是 Yuwen Du 等人（上海交大方向团队）发布的 30B 规模深度搜索智能体，在四个搜索 benchmark 上达到同规模 ReAct 范式的 SOTA，且首个由纯学术团队仅靠监督微调（SFT）+ 1.06 万条精选轨迹做到——反超采用 CPT+SFT+RL 工业级管线训练的同规模模型。

## 核心要点
- **核心论点**：当数据"informative + high-difficulty"时，简单 SFT 就能训出前沿搜索 agent；不需要预训练 → CPT → SFT → RL 的工业重型管线。
- **数据合成三改进**：① 扩大 knowledge graph 规模带来更丰富 exploration；② 扩大 tool set 规模带来更广 functionality 覆盖；③ 严格的低步数过滤（strict low-step filtering）保留高密度信息轨迹。
- **训练量**：仅用 10.6k 数据点。
- **基准成绩对比 Tongyi DeepResearch（30B + ReAct）**：BrowseComp 46.0% vs 43.4%；BrowseComp-ZH 58.1% vs 46.7%（差 11.4 个点）；Humanity's Last Exam 34.6% vs 32.9%；xbench 78.0% vs 75.0%。四个 benchmark 全部反超对方更重的 CPT+SFT+RL pipeline。
- **学术里程碑**：同等模型规模与训练范式下，首个由纯学术团队达成 SOTA 的搜索 agent。
- **方法论价值**：把"信息量大、难度高"的轨迹作为主要训练信号，证明数据 quality 比 pipeline complexity 更关键。
- **开源承诺**：模型权重将开源，便于社区复现与扩展。
- **作者**：Yuwen Du, Rui Ye, Shuo Tang, Keduan Huang, Xinyu Zhu, Yuzhu Cai, Siheng Chen；arXiv 2605.04036。

## 与其他概念的关系
- [[wiki/应用开发/Agentic-RAG|Agentic RAG]]：搜索智能体是 Agentic RAG 中"自主分解查询、规划检索"能力的训练方法学基础。
- [[wiki/应用开发/AutoResearch软件开发|AutoResearch 软件开发移植]]：AutoResearch 类系统的底层就是搜索 agent——本工作给出训练它的轻量路线。

## 参考来源
- [[raw/agent_engineering/2026-05-05-openseeker-v2-pushing-the-limits-of-search-agents-with-informative-and-high-diff|OpenSeeker-v2: Pushing the Limits of Search Agents with Informative and High-Difficulty Trajectories]]
