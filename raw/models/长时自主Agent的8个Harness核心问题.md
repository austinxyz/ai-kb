# 长时自主 Agent 的 8 个 Harness 核心问题

#resource #AI #AgenticAI #Harness

**来源：** [sysls (@systematicls) - OpenForage 创始人](https://x.com/systematicls/status/2038241033755168959)
**日期：** 2026-03-30
**分类：** 学习/AI-ML

---

## 摘要

所有 Harness 设计本质上都在对抗两类问题：**agent 偷懒（走捷径）** 或 **agent 犯蠢（做错事）**。本文系统梳理了长时自主系统中 agent 在三个阶段的 8 种失败模式，并给出具体的 Harness 设计对策。

---

## 关键要点

**任务前（Pre-Task）**
- **① 上下文没吃够**：任务开始前信息不完整或互相矛盾，需系统性预检

**规划阶段（Planning）**
- **② 上下文不完整**：选错攻击路径，根源是对齐问题（误解用户意图）
- **③ 短期思维**：只求能跑，技术债越滚越大；对策：提醒 agent 像创始人思考，或让多个 agent 竞选更可维护的方案

**任务执行（Task）**
- **④ 上下文焦虑（Context Anxiety）**：随着 token 消耗，agent 越来越急于结束会话；对策：session handoff + 高保真上下文压缩
- **⑤ 偏离计划（Planning Stickiness）**：做了 A' 而非 A，下游代码全部围绕 A' 生长，形成级联错误；对策：尽早、频繁验证
- **⑥ 复杂度恐惧（Complexity Fear）**：遇到大任务写 stub 应付或直接宣布超出范围；根源来自 RL 训练，复杂任务惩罚更重；对策：拆成 ≤100 行的子任务串联

**任务后（Post-Task）**
- **⑦ 验证偷懒（Verification Laziness）**：写弱测试、给 A' 写测试却宣称 A 工作正常；对策：用独立的、拥有新鲜上下文的专用 verification agent
- **⑧ 熵最大化（Entropy Maximization）**：修改函数行为但不更新文档，100 次后仓库完全不可维护；对策：每次长会话结束后，派专用 agent 清理矛盾、删除死代码

---

## 核心洞察

> Agent 心理就是照着人类自己的样子长出来的——生产力方法对 agent 同样有效。把复杂问题拆成最小启动步骤，是对人、对 agent 都奏效的解法。

**Algorithmic Contract**：可以让一个专用 agent 只负责监控每个 session 是否满足约定的行为契约（contract），拉起独立 agent 验证任务是否真正 done。

---

## 涉及概念

[[Model+Harness]] · [[Agentic-Thinking]] · [[Context-Anxiety]] · [[Session-Handoff]]

## 我的想法

