# 什么是 AI 原生基础设施（AI-Native Infrastructure）

#resource #AI #Infra #云计算

**来源：** [Jimmy Song - AI Native Infra](https://jimmysong.io/book/ai-native-infra/definition/)
**日期：** 2026-03-29
**分类：** 学习/Infra

---

## 摘要

Jimmy Song 对 AI 原生基础设施的系统性定义：以模型/Agent 为执行主体、算力为稀缺资产、不确定性为常态的基础设施体系。其本质不是"更快的推理"或"更便宜的 GPU"，而是为模型行为、算力稀缺和不确定性提供**可治理、可度量、可演化的系统边界**。

---

## 关键要点

- **三大前提：** Model-as-Actor（模型作为执行主体）、Compute-as-Scarcity（算力作为稀缺资源）、Uncertainty-by-Default（不确定性是常态而非异常）
- **三平面+一循环架构：** Intent Plane（API 和 Agent 工作流）→ Execution Plane（训练、推理、运行时）→ Governance Plane（GPU 编排和预算控制），三者通过闭环机制连接
- **治理核心：** 把 GPU 和 Token 作为一等资源对待，实施基于预算的策略、行为可观测性和风险治理框架
- **区别于传统云基础设施：** 传统基础设施假设行为可预测，AI 原生基础设施必须将不确定性纳入系统设计本身

---

## 涉及概念

[[AI-Native-Infrastructure]] · [[Model-as-Actor]] · [[Compute-as-Scarcity]] · [[Three-Planes-Architecture]]

## 我的想法

