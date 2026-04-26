# AI-Native Infrastructure（AI 原生基础设施）

#concept #AI #Infra

> 以模型/Agent 为执行主体、算力为稀缺资产、不确定性为常态，为模型行为、算力稀缺和不确定性提供可治理、可度量、可演化系统边界的基础设施体系。

---

## 三大前提

| 前提 | 含义 |
|------|------|
| **Model-as-Actor** | 模型不是可替换的 API，而是真正的执行主体 |
| **Compute-as-Scarcity** | GPU 和互联网络是核心稀缺资源，需像资产一样管理 |
| **Uncertainty-by-Default** | 行为和资源消耗高度不可预测，必须纳入系统设计 |

---

## 三平面+一循环架构

```
Intent Plane（意图层）
  API、Agent 工作流
        ↓
Execution Plane（执行层）
  训练、推理、运行时
        ↓
Governance Plane（治理层）
  GPU 编排、预算控制
        ↓
    闭环反馈 ←─────────
```

---

## 与传统云基础设施的区别

- 传统基础设施：假设行为可预测，资源按需分配
- AI 原生基础设施：不确定性是常态，需要将治理机制嵌入系统边界本身

---

## 相关资料

- [[AI原生基础设施系列-Jimmy-Song]] — 完整系列索引（8章）
- [[什么是AI原生基础设施]] — Ch1：核心定义与三大前提
- [[AI原生基础设施-参考架构]] — Ch2：三平面+一循环一页架构
- [[AI原生基础设施-计算治理]] — Ch3：从 Consequence 出发的设计原则
- [[AI原生基础设施-指标与预算]] — Ch4：ATEM 框架
- [[AI原生基础设施-组织与文化]] — Ch5：三个失效假设与运营模型
- [[AI原生基础设施-迁移路线图]] — Ch6：三条路径 + 90 天计划

## 关联概念

[[Model+Harness]] · [[Agentic-Thinking]] · [[Three-Planes-Architecture]]
