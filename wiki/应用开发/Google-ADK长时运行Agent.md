---
title: Google ADK 长时运行 Agent
category: 应用开发
tags: [google-adk, long-running-agent, state-machine, persistent-session, cloud-run, hr-onboarding]
source: "[[raw/agent_engineering/2026-05-13-Google-ADK-long-running-agents]]"
updated: 2026-05-13
status: stable
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-13
---

## 定义
Google Agent Development Kit (ADK) 提供的工程范式，用于构建跨天 / 跨周的企业级长时运行 agent（HR 入职、发票纠纷、销售触点等"idle time 主导"的工作流）。核心命题是 **stateless chatbot 模式在长流程上必然崩溃**——必须用**显式状态机 + 持久 session 存储 + 多 agent 委托**取代"无限增长的对话历史"，让 agent state 显式、持久、且与原始聊天历史解耦。

## 核心要点 · stateless 在长流程崩溃的三种方式
- **Prompt context pollution**：几百轮对话后被无关 chatter 淹没，模型混乱当前步骤
- **Token cost explosion**：每次推理重放两周对话历史，预算爆炸
- **Reasoning hallucinations over idle time**：暂停 3 天后恢复，模型"记得"从未发生的批准、跳过假设已完成的步骤

> **修复不是更大的 context window，而是根本不同的架构。**

## 核心要点 · 三个架构跃迁（demo 与生产的分界）
1. **持久内存 schema** 取代向量库里塞原始 JSON——状态显式且 schema 化
2. **事件驱动的休眠门**（event-driven dormancy gates）取代主动轮询/阻塞线程——idle 期间真正"睡"
3. **多 agent 委托** 取代 monolithic 单 prompt agent——子流程交给专用 sub-agent

## 核心要点 · 显式状态机替代对话历史
```python
class OnboardingStep:
    START / WELCOME_SENT / DOCUMENTS_SIGNED /
    IT_PROVISIONED / HARDWARE_DELIVERED / COMPLETED
```
- System prompt 通过 `{current_step}` 直接插值——模型看到的是**当前状态**而非"回放历史"
- 每个 tool 调用通过 `ToolContext.state` **原子更新 checkpoint**——容器崩溃后重启即续

## 核心要点 · 部署栈
- 框架：**Agent Development Kit (ADK)** · adk.dev
- CLI：`uv tool install google-agents-cli`
- 运行时：**Cloud Run**（scale-to-zero 友好）+ **SQLite 持久 session**
- 教程实例：**New Hire Onboarding Coordinator** — HR 入职 5 步 + 多个 idle 门 + IT sub-agent 委托
- 源码：[GoogleCloudPlatform/generative-ai · new-hire-onboarding](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/agents/adk/new-hire-onboarding)

## 与其他概念的关系
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：本条目是 harness engineering 在"企业长流程"维度的具体落地——状态机 = action space 约束，ToolContext.state = observation 设计，event-driven dormancy = escape hatch
- [[wiki/应用开发/AI一人公司路线图|AI 一人公司路线图]]：本条目是路线图第 3 步"接 MCP 工具链"之后的下一步演进——工具链 → 持久工作流 → 跨天跨周自主运行
- [[wiki/应用开发/Claude-Managed-Agents|Claude Managed Agents]]：Anthropic 的 dreaming / outcomes / multiagent 三件套与 ADK 的状态机 / 持久 session / 多 agent 委托在功能上是同构的——两条不同路径解决"agent 不能只活在单次对话里"
- [[wiki/应用开发/Codex-安全治理四层架构|Codex 安全治理四层架构]]：长时运行 agent 需要持续遥测——OpenTelemetry 风格的事件日志是本条目演进的下一站

## 参考来源
- [[raw/agent_engineering/2026-05-13-Google-ADK-long-running-agents|Eric Dong / Google Developers Blog]]
