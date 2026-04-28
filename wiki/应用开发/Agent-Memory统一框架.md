---
title: Agent Memory 统一框架
category: 应用开发
tags: [AI, Agent, 长期记忆, 综述, RAG, 树状记忆, 分层存储]
source: "[[raw/agents/近期，不错的LLM Agent统一记忆框架综述]]"
updated: 2026-04-28
status: stable
---

## 定义

LLM Agent 长期记忆机制的**模块化统一抽象框架**——把现有各种 Agent Memory 方法归纳为 4 个核心组件（Information Extraction / Memory Management / Memory Storage / Information Retrieval），便于系统对比与复现。论文标题：*Memory in the LLM Era: Modular Architectures and Strategies in a Unified Framework*。

核心动机：避免"naive long-context prompting"的窗口溢出、token 成本高、推理延迟、相关证据难定位等问题，让系统**主动维护记忆**而不是每次重读全部历史。

## 核心要点

### 四个核心组件

#### 1. Information Extraction（记什么？）

决定哪些内容进入记忆系统，三类方法：

| 类型 | 描述 |
|------|------|
| 直接归档 | 原样保存交互历史 |
| 总结式提取 | LLM 生成摘要后入库 |
| 基于图的提取 | 抽取实体与关系构建知识图 |

#### 2. Memory Management（怎么维护？）

新旧记忆的融合、演化、遗忘——五类操作：

- **连接**：相关经验之间建立链接
- **整合**：碎片记忆合并成更高层次单元
- **迁移**：在不同记忆层级之间移动（如短期 → 长期）
- **更新**：覆盖已有记忆中的过时内容
- **过滤**：剔除无用信息

#### 3. Memory Storage（存在哪里）

两个维度：

| 维度 | 选项 |
|------|------|
| **组织结构** | 扁平式（JSON、队列）/ 层级式（长短期、树结构） |
| **表示方式** | 向量存储 / 图存储 |

#### 4. Information Retrieval（怎么取回？）

| 类型 | 机制 | 典型算法 |
|------|------|---------|
| 词汇匹配 | 精确匹配实体、名称、关键词 | BM25、Jaccard |
| 向量检索 | 向量相似度 | 余弦相似度 + ANN |
| 结构检索 | 利用图/树的显式连接 | 邻居扩展、图遍历 |
| LLM 辅助检索 | 让 LLM 参与判断相关性 | LLM-as-retriever |

### 实验：统一复现 10 个代表性方法

**数据集**：
- **LOCOMO**：人类长期对话记忆——单跳、多跳、时间推理、开放域知识
- **LONGMEMEVAL**：用户与 AI 长期交互——信息提取、多会话推理、知识更新、时间推理

**实验维度**：整体性能、token 消耗、性能-成本权衡、上下文扩展性、证据位置敏感性、不同底层 LLM 下的表现。

### 五大关键发现

1. **层次化/树状方法表现突出**（MemTree、MemoryOS、MemOS）：多层结构能同时保留高层摘要和底层证据，更适合复杂长期任务

2. **粗粒度反而更好**：把多轮对话作为一个整体处理可显著降低 token 消耗，且记忆效果不一定下降，可能提升

3. **上下文扩展会普遍退化**：当上下文规模扩展到 200%，几乎所有方法都性能下降；**有明确层次管理的方法更稳定**

4. **证据位置敏感性**：关键证据位于早期会话时，许多方法易被后续信息干扰、检索失败

5. **依赖底层 LLM 能力**：从 Qwen2.5-7B → 72B 多数方法显著提升——记忆架构无法弥补底层推理短板

### 新 SOTA 算法（论文提出）

基于发现，组合：
- **MemTree / MemOS** 的**树状组织能力**（高层摘要 + 底层证据）
- **MemoryOS** 的**分层存储架构**（短期/长期分离）

得到一个低 token 开销的新 Agent Memory 框架。

## 与其他概念的关系

- [[wiki/应用开发/LLM-Wiki-Pattern|LLM Wiki Pattern]]：两者都解决"如何让 LLM 跨会话保留知识"，但路径迥异：
  - LLM Wiki Pattern = **人工维护**的结构化知识库，每次 ingest 显式更新
  - Agent Memory = **自动化**的记忆机制（自动提取/管理/检索）
  - 二者可互补：Wiki 适合稳定可复用的知识，Agent Memory 适合动态对话状态
- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：SPDD 的 prompt 资产库与 Agent Memory 的"记忆持久化"思想有共性——都把"用过即弃"变成"持续累积"

## 参考来源

- [[raw/agents/近期，不错的LLM Agent统一记忆框架综述|近期，不错的 LLM Agent 统一记忆框架综述（PaperToday，2026）]]
- 论文：*Memory in the LLM Era: Modular Architectures and Strategies in a Unified Framework*
