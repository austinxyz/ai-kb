---
title: "psql_bm25s：让 PostgreSQL 多智能体检索提速 23 倍（开源）"
slug: 2026-05-14-psql_bm25s-23x-faster-postgres-retrieval
fetched_at: 2026-05-14T08:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-14T03:00:00.000Z
aihot_tags: ["BM25", "PostgreSQL", "Multi-Agent Retrieval", "pg_search", "Production RAG", "Open Source"]
aihot_starred: 0
aihot_summary: |
  Emad Mostaque 团队为多智能体生产级 PostgreSQL 检索开源了 psql_bm25s —— 原生 PostgreSQL access method，精确 BM25 检索，标准基准比 pg_search 快约 23 倍。定位：从单 agent SQLite (QMD) 升级到多 agent production 时 PostgreSQL 是好选择但不够"snappy"，BM25 把这个短板补上，使检索不再是性能瓶颈与成本负担。下一个瓶颈转向 query formulation（Chahatxsharma 评论）。
aihot_recommendation_reason: |
  企业级 RAG 架构里，"单 agent SQLite → 多 agent Postgres" 是一条清晰的产线升级路径。psql_bm25s 是这条路径上的标志性工具。值得记一笔，作为 BM25 在 Postgres 上落地的实战参考点。
source_url: "https://x.com/EMostaque/status/2054587062033043799"
source_type: "twitter"
content_source: "twitter_thread_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S3_infra"
  also_relevant: ["S4_agent"]
  confidence: "high"
wiki_status: candidate
wiki_target: ""
---

# psql_bm25s：Postgres 多智能体检索提速 23 倍

> Emad Mostaque (@EMostaque) · 2026-05-14

## 原推

> "When you want to move from single agent SQLite on something like QMD, PostgreSQL is a great choice for multi agent and production quality, but not as snappy.
>
> So we made it much more snappy with BM25 & open sourced it.
>
> More soon for planetary scale sovereign agents"

## 关键事实

- **psql_bm25s** —— 原生 PostgreSQL access method
- 精确 BM25 检索（lexical，TF/IDF 加权）
- 标准基准 **比 pg_search 快约 23 倍**
- 开源
- 目标场景：单 agent SQLite → 多 agent 生产质量的升级路径

## 评论区高质量补充

### @Chahatxsharma — 瓶颈外移
> "23x over pg_search 不是小差距。如果检索不再是瓶颈，下一个约束就转移到 agent 如何决定检索什么 —— **query formulation 变成了贵的那一步**。"

### @yasha1971 — 速度 ≠ 正确性
> "BM25 是 lexical 但仍然是概率性的：词频、IDF 权重、打分。**快速 lexical 检索不等于精确检索**。下一个该问的问题不是'23 倍快了多少'，而是'怎么验证结果真的在那里，逐字节'。检索速度问题解决了，检索确定性还没。"

### @EviOutside
> "single-agent sqlite → multi-agent postgres 是一条很干净的递进路径"

### @LLMpsycho
> "SQLite 是单个大脑，Postgres 是委员会，BM25 是咖啡。"

## 与已有 Wiki 的潜在交叉

- `wiki/应用开发/企业级RAG架构.md` —— 生产 RAG 的"受控 schema + BM25 + 评测"层
- `wiki/应用开发/Agentic-RAG.md` —— 检索瓶颈外移后，query formulation 成为新焦点
- 可能新建：`wiki/AI基础设施/Postgres-Agent检索栈.md`（待沉淀）

## 来源

- 原推：https://x.com/EMostaque/status/2054587062033043799
- 收集渠道：aihot.virxact.com 2026-05-14 日报 · 技巧与观点 #7
- 评论拉取方式：opencli twitter thread
