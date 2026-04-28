---
title: SPDD（Structured Prompt-Driven Development）
category: 应用开发
tags: [AI, 提示工程, 工程方法, 规格驱动, 提示资产, ThoughtWorks]
source: "[[raw/sdlc/Structured-Prompt-Driven Development (SPDD)]]"
updated: 2026-04-28
status: stable
---

## 定义

SPDD（结构化提示驱动开发）是 ThoughtWorks 内部 IT 团队提出的工程方法论，**把提示词当作一等交付制品**——和代码一样进入版本控制、评审、复用与持续演进。它通过 REASONS Canvas（七维结构化提示）和闭环工作流，把 AI 辅助从"个人效率"提升为"组织级可治理能力"。

核心信念：**当现实与代码偏离时，先改提示，再改代码。**

## 核心要点

### 解决的根本问题

AI 编码助手提升了个人编码速度，但系统级吞吐并未自动提升——好比"开法拉利走泥路"。新摩擦点：
- 模糊需求被快速变成代码，误解随规模放大
- 评审需处理更多变更，不一致更易引入
- "生成"≠"对齐"，集成与测试问题增多
- 变更体量上升后，生产风险更难推理

SPDD 的回答不是"如何生成更多代码"，而是**让 AI 生成的变更可治理、可评审、可复用**。

### 两大核心组件

**1. REASONS Canvas**（七维提示结构，详见 [[wiki/应用开发/REASONS-Canvas|REASONS Canvas]]）
- 抽象层（intent & design）：R-Requirements / E-Entities / A-Approach / S-Structure
- 执行层（execution）：O-Operations
- 治理层（common standards）：N-Norms / S-Safeguards

**2. SPDD 工作流（闭环）**
- 在迭代内：逻辑修正先改 prompt → 再生成代码；重构先改代码 → 再 sync 回 prompt
- 跨迭代：累积的 prompt 资产（领域模型、设计决策、规范等）成为下一次增强的起点

### 工作流的关键命令（openspdd 工具）

| 命令 | 类型 | 用途 |
|------|------|------|
| `/spdd-story` | 可选 | 按 INVEST 原则把大需求拆为可独立交付的用户故事 |
| `/spdd-analysis` | 核心 | 提取领域关键词、扫描相关代码、产出策略性分析（领域概念 / 风险 / 设计方向） |
| `/spdd-reasons-canvas` | 核心 | 生成完整 REASONS Canvas——从高层理由到方法级 Operations |
| `/spdd-generate` | 核心 | 按 Operations 顺序逐任务生成代码，严守 Norms 与 Safeguards |
| `/spdd-api-test` | 可选 | 生成基于 cURL 的 API 测试脚本（覆盖正常/边界/错误场景） |
| `/spdd-prompt-update` | 核心 | 需求变化时增量更新 Canvas（requirements → prompt → code） |
| `/spdd-sync` | 核心 | 代码侧变更（重构、修复）回写到 Canvas（code → prompt） |

### 三大核心技能（开发者价值的迁移方向）

**技能 1：Abstraction first（设计先于生成）**
- 在生成代码之前，明确有哪些对象、它们如何协作、边界在哪
- 缺乏抽象 → AI 在实现细节上狂奔，但结构散架

**技能 2：Alignment（写代码前锁定意图）**
- 把"做什么 / 不做什么"显式化，约定标准与硬约束
- 否则得到"快产出 + 慢返工"

**技能 3：Iterative Review（把输出变成受控循环）**
- AI 辅助应像工程过程，不是一次性草稿
- 缺乏纪律的迭代要么不停打补丁直到方案漂移，要么反复重启失控

### SPDD vs Spec-Driven Development（SDD）

二者起点相同（先写规格，再让模型实现），SPDD 的差异：
- **Prompt 是被维护的制品**，不是用一次就丢
- **从需求规格到工程规格**：REASONS Canvas 不仅写"要做什么"，还覆盖方法、结构、规范、安全护栏，给 LLM 一个**实现边界**而非仅目标
- **同步而非交接**：prompt 与 code 双向同步，不漂移
- **可重复的团队治理**：重点不是"更详细的规格"，而是团队治理 AI 输出的一致方式
- Birgitta Böckeler 将其归类为 **spec-anchored 方法**

### 适用性评级（5 星推荐 → 1 星不适用）

| 评级 | 场景 |
|------|------|
| ★★★★★ | 标准化批量交付（高重复业务逻辑、需要长期可维护性） |
| ★★★★★ | 高合规与硬约束（金融核心、多渠道部署） |
| ★★★★☆ | 团队协作与可审计性 |
| ★★★★☆ | 跨服务/跨语言一致性的复杂重构 |
| ★★☆☆☆ | 救火热修、探索性 spike、一次性脚本 |
| ★☆☆☆☆ | 上下文黑洞（领域不清、规则不明）、纯创意/视觉任务 |

### ROI 矩阵

| 收益 | 影响 | 速度 | 来源 |
|------|------|------|------|
| 确定性 | 高 | 即时 | 精确规格大幅降低幻觉与"创造性解读" |
| 可追溯性 | 高 | 即时 | 每个有意义的变更都能溯源到结构化提示 |
| 评审更快 | 高 | 短期 | 代码"生而合规"，评审聚焦逻辑与设计 |
| 可解释性 | 中高 | 渐进 | 意图与行为以自然语言可见，认知负荷降低 |
| 安全演进 | 高 | 长期 | 边界清晰 + 步进式实现 → 改动风险可控 |

### 前期投入

| 领域 | 门槛 | 性质 |
|------|------|------|
| 心智转变 | 高 | 持续培训："设计先于编码" |
| 资深专家 | 中高 | 每个特性都需要能把业务规则转为干净抽象的工程师 |
| 自动化工具 | 中 | 没有工具会撞到吞吐天花板，需要 openspdd 这类 CLI |

## 与其他概念的关系

- [[wiki/应用开发/REASONS-Canvas|REASONS Canvas]]：SPDD 的核心组件之一，七维结构化提示框架
- [[wiki/应用开发/中间循环|中间循环]]：SPDD 是中间循环（监督性工程层）的一个具体方法落地——把"引导智能体、维持架构一致性"工程化
- [[wiki/应用开发/AI时代工程严谨性|AI时代工程严谨性]]：SPDD 是"方向 1：上移至规格说明评审"的具体实践——prompt 即受治理的工程规格
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：共享"把判断工程化"思想；SPDD 通过 REASONS Canvas 把判断编码进 prompt 资产
- [[wiki/应用开发/LLM-Wiki-Pattern|LLM Wiki Pattern]]：SPDD 的 prompt 资产库与 Wiki Pattern 的"复利积累"思想一致——成功模式沉淀为可复用资产

## 参考来源

- [[raw/sdlc/Structured-Prompt-Driven Development (SPDD)|Structured Prompt-Driven Development (SPDD), Wei Zhang & Jessie Xia, ThoughtWorks, 2026-04-28]]
- 配套开源工具：[openspdd](https://github.com/gszhangwei/open-spdd) / [token-billing 示例项目](https://github.com/gszhangwei/token-billing)
