# AI 原生基础设施：一页参考架构

#resource #AI #Infra #架构

**来源：** [One-Page Reference Architecture](https://jimmysong.io/book/ai-native-infra/reference-architecture/)
**日期：** 2026-03-30
**分类：** 学习/Infra

---

## 摘要

用三个互联平面 + 一个治理闭环来描述 AI 原生基础设施的完整架构。AI 原生 vs "AI 就绪"的分水岭：资源后果是否可度量、可治理。

---

## 关键要点

- **Intent Plane（意图层）**：推理/训练 API、MCP/工具协议、Agent 工作流、策略即意图（预算/配额/合规）
- **Execution Plane（执行层）**：训练、推理服务、状态/上下文服务、Token 计量与资源追踪的可观测性
- **Governance Plane（治理层）**：核心差异化所在——预算、隔离策略、拓扑感知调度、风险/合规控制

**治理闭环四步（最小实现）：**

| 步骤 | 含义 |
|------|------|
| **Admission（准入）** | 在入口处将意图与策略绑定 |
| **Translation（翻译）** | 将意图转化为可执行计划 |
| **Metering（计量）** | 跨 Token、GPU、网络、存储的端到端归因 |
| **Enforcement（执行）** | 基于预算/风险触发降级、限速、抢占 |

---

## 涉及概念

[[AI-Native-Infrastructure]] · [[Three-Planes-Architecture]]

## 所属系列

[[AI原生基础设施系列-Jimmy-Song]]
