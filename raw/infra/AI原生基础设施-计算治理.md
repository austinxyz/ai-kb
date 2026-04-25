# AI 原生基础设施：为什么从计算治理出发

#resource #AI #Infra #治理 #FinOps

**来源：** [Compute Governance](https://jimmysong.io/book/ai-native-infra/compute-governance/)
**日期：** 2026-03-30
**分类：** 学习/Infra

---

## 摘要

核心挑战不是构建 AI 能力，而是将闭环治理制度化——使后果归因可追溯、策略可重写。应从"Consequence（后果）"而非"Intent（意图）"出发设计 AI 原生基础设施。

---

## 关键要点

- **五层架构的组织责任划分：**
  - Layer 1-2（计算/治理 & 上下文/状态）→ 基础设施团队
  - Layer 3-4（执行 & 意图/编排）→ 平台与应用团队
  - Layer 5（业务接口）→ 产品负责人

- **MCP 的正确位置**：属于 Layer 4（表达意图），但必须由 Layer 1 的治理层通过预算、隔离、计量来约束——否则成本和资源会失控

- **上下文即基础设施**：当长时运行状态成为成本决定因素（如 KV Cache），上下文/状态从应用细节上升为基础设施层，需要平台级显式管理

- **核心原则**：必须先建立算力和经济约束作为可执行的治理边界，再设计控制平面；不能把 AI 仅仅当作 API 形态的变化

---

## 涉及概念

[[AI-Native-Infrastructure]] · [[Three-Planes-Architecture]]

## 所属系列

[[AI原生基础设施系列-Jimmy-Song]]
