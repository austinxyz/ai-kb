---
title: REASONS Canvas
category: 应用开发
tags: [AI, 提示工程, 设计模式, 规格说明, SPDD]
source: "[[raw/sdlc/Structured-Prompt-Driven Development (SPDD)]]"
updated: 2026-04-28
status: stable
---

## 定义

REASONS Canvas 是 SPDD 方法论的核心组件——**一个七维结构化提示框架**，把一个 prompt 从 intent → design → execution → governance 串成可执行蓝图。它强迫提示作者在让 LLM 生成代码之前，把需求、领域模型、解决方案、系统结构、任务分解、复用规范与安全护栏全部说清楚，让 LLM 被**意图引导**而非靠**猜测**驱动。

## 核心要点

### 七个维度

**抽象层（intent & design）**

| 维度 | 全称 | 回答的问题 |
|------|------|------------|
| **R** | Requirements | 我们在解决什么问题？DoD（完成定义）是什么？ |
| **E** | Entities | 领域实体与关系是什么？ |
| **A** | Approach | 用什么策略满足需求？ |
| **S** | Structure | 变更落在系统的什么位置？涉及哪些组件与依赖？ |

**执行层（execution）**

| 维度 | 全称 | 回答的问题 |
|------|------|------------|
| **O** | Operations | 把抽象策略拆成具体可测的实现步骤（精确到方法签名、参数类型、执行步骤） |

**治理层（common standards）**

| 维度 | 全称 | 回答的问题 |
|------|------|------------|
| **N** | Norms | 横切的工程规范（命名、可观测性、防御式编码等） |
| **S** | Safeguards | 不可妥协的边界（不变量、性能上限、安全规则等） |

### 设计意图

- **不确定性左移**：在代码生成前对齐意图与边界
- **单一可审件**：评审者只需推理一个完整制品，无需在散落的聊天记录与片段 diff 中切换
- **可治理**：所有 prompt 走相同结构 → 用相同方式治理
- **复利效应**：领域知识与设计决策在每个 prompt 中累积，跨迭代沉淀团队心智

### 三个层次的对应关系

```
为什么做（Why） ────► R, E       （问题与世界模型）
怎么做（How）   ────► A, S       （策略与位置）
做什么（What）  ────► O          （具体步骤）
怎么不出错      ────► N, S       （规范与护栏）
```

### 不要手改 Canvas 文件

SPDD 的硬规则：**永远不直接编辑结构化提示文件**，而是维护对话循环：
1. 识别差距（缺失要素或被误解的业务规则）
2. 通过对话向 AI 输入新意图
3. 让 AI 仅更新 Canvas 中受影响的部分

这保持了 prompt 的**生成可追溯**性。

## 与其他概念的关系

- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：REASONS Canvas 是 SPDD 方法的核心组件之一，与 SPDD 工作流配套使用
- [[wiki/应用开发/AI时代工程严谨性|AI时代工程严谨性]]：REASONS Canvas 把"严谨性上移至规格评审"的方向具体化为七维清单
- [[wiki/应用开发/中间循环|中间循环]]：Canvas 是中间循环工程师工作的具体制品（设计先于生成）

## 参考来源

- [[raw/sdlc/Structured-Prompt-Driven Development (SPDD)|Structured Prompt-Driven Development (SPDD), Wei Zhang & Jessie Xia, ThoughtWorks, 2026-04-28]]
