# CE + Superpowers 三模型实测：Opus 4.6 / Kimi K2.5 / GLM-5 工程化实践对比

#resource #AI #AgenticAI #AIcoding #ClaudeCode

**来源：** 陆徐洲（硅基鹿鸣，微信公众号）
**日期：** 2026-04-02
**分类：** 工作/技术开发/AI

---

## 摘要

作者将 Compound Engineering（CE）和 Superpowers 组合使用，用 Opus 4.6、Kimi K2.5、GLM-5 三个模型跑同一个全栈项目（AI 知识库问答系统），完整记录各阶段表现差异。核心结论：Superpowers 管纪律，CE 管能力，两者层次不同不构成替代。

## 关键要点

- **两者分工**：Superpowers 是 Harness 层（hooks + 技能强制约束工程纪律）；CE 是 Skill Pack 层（多代理 review + 知识沉淀，prompt 级建议）
- **推荐组合方式**：brainstorming → Superpowers；技术计划 → CE plan；代码实现 → Superpowers TDD；代码审查 → CE review；知识沉淀 → CE compound
- **三模型规划阶段对比**：Opus 4.6 全局到局部追问、有风险分析和回退策略；Kimi K2.5 思路接近 Opus 但指令遵循差（自动跳过 CE review 阶段）；GLM-5 局部到整体提问、指令遵循好但架构深度弱
- **CE 知识沉淀机制（/ce:compound）**：review 完成后自动提取踩坑、模式、关键发现，存入 `docs/solutions/`；第二轮 plan 时 learnings-researcher 自动引用，设计决策主动避坑
- **成本权衡**：CE review 12 个代理并行烧 token 猛；brainstorming、TDD 阶段国产模型完全够用，可按阶段混用降本

## 涉及概念

[[Compound-Engineering]] · [[Model+Harness]] · [[Spec驱动开发]]

## 我的想法

