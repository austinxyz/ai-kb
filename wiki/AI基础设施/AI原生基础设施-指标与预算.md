# AI 原生基础设施：指标、预算与隔离

#resource #AI #Infra #治理 #可观测性

**来源：** [Metrics and Budget](https://jimmysong.io/book/ai-native-infra/metrics-budget-isolation/)
**日期：** 2026-03-30
**分类：** 学习/Infra

---

## 摘要

云原生到 AI 原生的核心转变：不确定性成为常态。传统基础设施假设行为确定，AI 工作负载有不可预测的执行路径、资源消耗和非线性后果。ATEM 框架是将不确定性工程化的五个治理机制。

---

## 关键要点

**四类不确定性来源：**

| 类型 | 表现 |
|------|------|
| **行为不确定** | Agent 任务分解和工具选择动态变化 |
| **需求不确定** | 并发峰值与长尾请求造成容量规划挑战 |
| **状态/上下文** | KV Cache 共享成为需要计量的关键基础设施资产 |
| **基础设施** | 网络/存储敏感性放大尾延迟问题 |

**ATEM 五大治理机制：**

1. **Admission Control（准入控制）**：在入口拒绝超出预算/策略的请求
2. **Translation（翻译）**：将意图转为带 fallback 的可约束执行计划
3. **Metering（计量）**：按租户和工具追踪 Token、GPU 时间、Cache 使用
4. **Enforcement（执行）**：预算超限时触发限速、降级或隔离
5. **Feedback Loops（反馈循环）**：基于成本指标迭代策略

> AI 原生基础设施的起点是将不确定性当作默认输入；目标是实现资源后果的闭环治理。

---

## 涉及概念

[[AI-Native-Infrastructure]] · [[Three-Planes-Architecture]]

## 所属系列

[[AI原生基础设施系列-Jimmy-Song]]
