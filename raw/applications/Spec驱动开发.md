# Spec 驱动开发（Spec-driven Development）

#concept #AI #AIcoding #开发范式

> 一句话定义：在让 AI 写代码之前，先让 AI 帮你写结构化的规格说明书（Spec），以"规范先于代码"解决 Vibe Coding 的失控问题。

---

## 核心原理

Vibe Coding 缺少一个约束层——在 AI 和最终代码之间，没有持久化的工程意图表达。Spec-driven Development 的核心主张：

```
Think → Spec → Code → Test
先想清楚 → 写清楚 → 再执行
```

Spec 成为所有后续 AI 对话的锚点，不管换哪个会话、哪个 AI，约束条件都在那里。

## 关键要素

**有效 Spec 的五要素：**
1. 目标陈述：要解决什么问题，成功标准
2. 边界定义：明确做什么和不做什么（Not-scope 往往更重要）
3. 设计决策：关键技术选型和原因
4. 接口契约：输入输出格式和约束
5. 测试场景：正常路径、异常路径、边界条件

**spec-kit 五阶段：** 宪法（Constitution）→ 规范（Specification）→ 计划（Plan）→ 任务（Tasks）→ 实现（Implementation）

**适用判断：** 代码生命周期越长、错误代价越高 → 越值得 Spec 约束

## 相关资料

- [[小米内部spec-kit规格驱动编程实践]] — 小米内部落地详解，含完整工具链使用流程

## 关联概念

[[Vibe-Coding]] · [[Model+Harness]] · [[AI编程范式演化]]
