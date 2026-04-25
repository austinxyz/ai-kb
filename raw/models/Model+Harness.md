# Model + Harness

#concept #AI #AgenticAI

> 智能体时代的核心范式：模型（Model）本身不再是唯一竞争力，围绕模型的完整执行环境（Harness）才是决定胜负的关键。

---

## 核心原理

传统范式是训练一个更好的模型。智能体范式下，模型被嵌入到一个更大的系统中：

```
Model + Harness = Agent System
```

**Harness 的构成：**
- 工具服务器（Tool Servers）
- 浏览器、终端、搜索引擎
- 执行沙盒（Execution Sandbox）
- API 层
- 内存系统（Memory System）
- 编排框架（Orchestration Framework）

Harness 不再是静态的验证器，而是训练系统的有机组成部分。

---

## 为什么 Harness 是竞争壁垒

| 推理时代 | 智能体时代 |
|---------|-----------|
| 更好的 RL 算法 | 更好的环境设计 |
| 更强的反馈信号 | 更紧的训练-服务集成 |
| 更可扩展的训练管道 | 更强的 Harness 工程能力 |

---

## 关键挑战

- **训练与推理解耦：** 不解耦则 rollout 吞吐量崩溃，GPU 利用率骤降
- **奖励黑客（Reward Hacking）：** 有工具访问权时，模型可能学会作弊（查答案、利用日志漏洞）
- **环境质量：** 稳定性、真实感、覆盖度、抗利用性

---

## 实践层：Harness 需要解决的 8 类 Agent 失败模式

Agent 在三个阶段会系统性地犯蠢或偷懒：

| 阶段 | 失败模式 | 对策 |
|------|---------|------|
| 任务前 | 上下文不完整 | 系统性预检信息完整性 |
| 规划 | 短期思维、对齐偏差 | 提醒"像创始人思考"；多方案竞选 |
| 执行 | 上下文焦虑、偏离计划、复杂度恐惧 | Session handoff；频繁验证；拆成 ≤100 行子任务 |
| 任务后 | 验证偷懒、熵最大化 | 独立 verification agent；专用清理 agent |

---

## 相关资料

- [[从推理思考到智能体思考]] — 林俊旸，提出 Model+Harness 范式转变
- [[长时自主Agent的8个Harness核心问题]] — sysls，8 种 agent 失败模式的实践总结
- [[Claude Code源码分析-Agentic Harness设计]] — 从 Claude Code 4756 个源文件拆解 Harness 工程化实践
- [[中国AI公司如何学习Claude Code架构]] — 极客公园，产品策略视角分析 Claude Code 架构可借鉴之处
- [[CE+Superpowers三模型实测]] — CE（知识沉淀/多代理review）与 Superpowers 组合实测，三模型对比

## 关联概念

[[Agentic-Thinking]] · [[Agentic-RL]] · [[Multi-Agent-Architecture]] · [[Reward-Hacking]]
