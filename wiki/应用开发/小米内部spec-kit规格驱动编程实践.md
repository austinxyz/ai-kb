# 小米内部真实落地的 AI 编程新范式：spec-kit 规格驱动编程

#resource #AI #AgenticAI #AIcoding #开发范式

**来源：** 微信公众号（AI软件产品经理）
**日期：** 2026-04-02
**分类：** 工作/技术开发/AI

---

## 摘要

本文详解 GitHub 开源工具 spec-kit（79k stars）在小米内部的落地实践。Spec-driven Development（规格驱动编程）是对 Vibe Coding 的系统性升级，核心是"先让 AI 写 Spec，再让 AI 写代码"，通过五阶段流程（宪法→规范→计划→任务→实现）解决上下文衰减、意图模糊和可验证性缺失三大问题。

## 关键要点

- **Vibe Coding 的三大缺陷**：上下文衰减（项目大后 AI 记忆漂移）、意图模糊级联放大（每次偏差积累）、可验证性缺失（"感觉对了"≠质量保证）
- **Spec 五阶段**：宪法（Constitution）→ 规范（Specification）→ 计划（Plan）→ 任务（Tasks）→ 实现（Implementation）
- **Constitution 是整个工具链的"基本法"**：一次定义技术栈、命名规范、安全红线，后续所有 AI 生成内容自动遵循
- **选择判断依据**：代码生命周期 × 错误代价；周期越长、代价越高 → 越需要 Spec 约束；原型/个人工具 → Vibe Coding 仍有效
- **有效 Spec 的五要素**：目标陈述、边界定义（Not-scope 往往比 Scope 更重要）、设计决策、接口契约、测试场景
- **与传统方式对比**：返工率低（需求先澄清）、文档与代码同步（每阶段有 .md 输出）；代价是启动慢、Token 消耗更多

## 涉及概念

[[Spec驱动开发]] · [[Vibe-Coding]] · [[AI编程范式演化]]

## 我的想法

