---
title: Harness Engineering 深挖（Agentic AI Summit Plenary, Aug 1）
source: "https://www.youtube.com/watch?v=gKdeLQd_LIQ"
date: 2026-08-02
tags: [harness-engineering, agent, software-engineering, ryan-leopollo]
---

### Harness Engineering 深挖

---

#### Harness 是什么

**确定性基础设施**，包裹在概率性 LLM 外面，把模型变成可靠的 Agent。

模型提供"智能"，Harness 提供"计算机科学"。

---

#### Harness 的组成部件

| 组件 | 作用 |
|------|------|
| **工具 & API** | 让 Agent 能操作外部世界（浏览器、CLI、计算机控制）|
| **上下文 & 知识** | 组织知识、非功能需求、业务目标——让 Agent 知道"好"长什么样 |
| **护栏 & 沙盒（"强笼子"）** | 规则执行、类型检查、沙盒——防止 Agent"作弊"或误操作 |
| **记忆系统** | 状态存储、工作 trace、从历史学习 |
| **教练 & 反馈** | 人类提供目标/约束/方向，引导 Agent 长周期运行 |

---

#### 具体实现架构

**Ryan Leopollo（Google）— "Double-Click"分解法**
- 把复杂任务不断细分，直到模型能可靠处理的粒度
- 再重新组装成更高层能力

**NVIDIA（John Cohen）— 对象化 Agent**
- Agent 建模为 **Python 对象**
- 用 `...` 省略号符号指示 LLM "在这里填代码"
- Agent 可以**动态修改自己的方法**、存储内部状态
- 本质：软件实时改写自己

**Lambda Lab API（Sean）— "第二大脑"**
- 开源实验追踪器
- 用 API 模拟人类研究工具：notebook（文档）、白板（排行榜）、签到表（任务队列）
- 确保 Agent 系统化记录工作

**Replit（Catasta）— Trace 驱动演化**
- 分析数百万条生产 trace
- 聚类找异常 → LLM 诊断失败 → 自动生成 PR 修复 harness
- Harness 自我改进

---

#### 团队结构和日常工作的变化

**"禁止手写代码"令（2025 年 6 月起）**
- Leopollo 团队唯一被允许的活动：让 Agent 完成任务

**人的角色变成"极度严苛的管理者"**
- 不再实现功能，而是监控 **时间和注意力**
- 发现自己在哪里介入（审查垃圾输出/纠正计划）→ 工程化 harness，让 Agent 不再重犯

**"What" 取代 "How"**
- 工程师定义高层目标
- 从任务里"提取隐性选择"，提前给 Agent 作为方向

**"走上复杂度阶梯"**
- Agent 能力路径：单工具调用 → commit → PR → 完整功能 → 整个产品
- 日常工作 = 不断打磨 harness，推动 Agent 走上更高阶梯

---

**核心洞察**：Harness Engineering 是**软件工程从手艺变管理**的核心机制——工程师的价值不在于写代码，而在于知道在哪里、如何约束和引导 Agent。

---

### 背景：软件工程演化全图

（来自同场 Plenary 其他演讲者）

| 预测 | 说话人 |
|------|--------|
| **Prompt 工程会消失**，Agent 直接理解意图，不再需要精心构造提示词 | Catasta（Replit）|
| **80% 现有软件应用会消失**，被 Agent 即时构建的定制功能取代 | Steinberger（OpenAI）|
| AI 最终将决定**什么东西值得被构建** | Dawn Song |
| 人类角色变成**"极度严苛的管理者"**——监控 Agent 时间和注意力，提取隐性决策 | 多位演讲者 |
