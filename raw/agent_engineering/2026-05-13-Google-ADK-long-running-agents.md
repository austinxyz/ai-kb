---
title: "Build Long-running AI Agents that Pause, Resume, and Never Lose Context with ADK"
slug: 2026-05-13-Google-ADK-long-running-agents
fetched_at: 2026-05-13T05:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-13T00:00:00.000Z
aihot_tags: ["Google ADK", "Long-running Agent", "Persistent State", "State Machine", "Cloud Run"]
aihot_starred: 0
aihot_summary: |
  Google 介绍如何用 Agent Development Kit (ADK) 构建跨天/周的企业级长时运行 agent（HR 入职、发票纠纷、销售触点等场景）。核心三跃迁：1) 持久内存 schema 取代向量库塞 JSON；2) 事件驱动的休眠门取代主动轮询/阻塞线程；3) 多 agent 委托取代单 prompt monolithic agent。教程实现 New Hire Onboarding Coordinator，显式状态机（START/WELCOME_SENT/.../COMPLETED）+ ToolContext.state 原子 checkpoint + Cloud Run / SQLite 持久 session。
aihot_recommendation_reason: |
  把"为什么 stateless chatbot 在长流程崩"明确拆成 3 个失败模式（prompt 污染 / token 爆炸 / idle 后幻觉），再给出"显式状态机替代对话历史"这一条干净的架构主张。是 [[wiki/应用开发/Harness-Engineering]] 在企业工作流上的具体落地实例，也是 [[wiki/应用开发/AI一人公司路线图]] 第 3 步"接 MCP 工具链"之后的工程演进路径。
source_url: "https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk"
source_type: "blog"
content_source: "original_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: ["S2_methodology"]
  confidence: "high"
wiki_status: drafted
wiki_target: "wiki/应用开发/Google-ADK长时运行Agent.md"
---
# Build Long-running AI Agents that Pause, Resume, and Never Lose Context with ADK

> Google Developers Blog · Eric Dong（Developer Relations Engineer）· 2026-05-13

## 核心问题：stateless chatbot 撑不起企业工作流

真实企业流程很少在单次 API call 内结束：
- **HR 入职**跨 2 周
- **发票纠纷**数日等供应商回复
- **销售触点**跨多月

这些被 **idle time** 主导的流程，stateless chatbot 必然崩。

## Stateless 在长流程里崩的三种方式

1. **Prompt context pollution** — 几百轮对话后被无关 chatter 淹没，模型混乱当前步骤
2. **Token cost explosion** — 每次推理重放两周对话历史，预算爆炸
3. **Reasoning hallucinations over idle time** — 暂停 3 天后恢复，模型"记得"从未发生的批准、跳过假设已完成的步骤

> **"修复不是更大的 context window，而是根本不同的架构——agent state 必须显式、持久、和原始聊天历史解耦。"**

## 三个架构跃迁（demo 与生产的分界）

1. **持久内存 schema** 而非把原始 JSON 倒进向量库
2. **事件驱动的休眠门**（event-driven dormancy gates）而非主动轮询/阻塞线程
3. **多 agent 委托** 而非 monolithic 单 agent prompt

## 落地：New Hire Onboarding Coordinator Agent

### 显式状态机替代对话历史

```python
class OnboardingStep:
    START = "START"
    WELCOME_SENT = "WELCOME_SENT"
    DOCUMENTS_SIGNED = "DOCUMENTS_SIGNED"
    IT_PROVISIONED = "IT_PROVISIONED"
    HARDWARE_DELIVERED = "HARDWARE_DELIVERED"
    COMPLETED = "COMPLETED"
```

System prompt 直接插值 `{current_step}` / `{new_hire_details}` / `{pending_signals}`——模型每次看到的是**当前实际状态**，不靠回放历史。

### 工具调用 = 原子 checkpoint

```python
def send_welcome_packet(name, email, start_date, tool_context):
    state = tool_context.state
    state["new_hire_details"] = {"name": name, "email": email, "start_date": start_date}
    state["current_step"] = OnboardingStep.WELCOME_SENT
    state["pending_signals"] = ["document_signed"]
    return {"status": "success", ...}
```

每个 tool 调用通过 `ToolContext.state` **原子更新 checkpoint**——容器崩溃后，重启读 `current_step = WELCOME_SENT` 直接断点续传。

### 工作流（5 步 + 多个 idle 门）

1. HR 发欢迎包 + 文档链接
2. **Idle**：数日等员工签字
3. IT 配置邮箱 + Slack
4. **Idle**：数日等笔记本送达员工家
5. HR 发个性化第一天日程

## 部署栈

- 框架：**Agent Development Kit (ADK)** — https://adk.dev/
- CLI：`uv tool install google-agents-cli`
- 部署：**Cloud Run**（冷启动 / scale-to-zero 友好），SQLite 持久 session
- 源码：[GoogleCloudPlatform/generative-ai · new-hire-onboarding](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/agents/adk/new-hire-onboarding)

## 关联

- 与 [[wiki/应用开发/Harness-Engineering]] 是同构的——把不稳定的 agent 框死在显式状态机里
- 是 [[wiki/应用开发/AI一人公司路线图]] 第 3 步"接 MCP 工具链"之后的下一步演进——工具链 → 持久工作流
- 与 [[wiki/应用开发/Claude-Managed-Agents]] 在"长任务 + 多 agent"上指向同一终点，路径不同

## 来源

- 原文：https://developers.googleblog.com/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk
- 作者：Eric Dong（Google Developer Relations Engineer）
- 收集渠道：aihot.virxact.com 2026-05-13 日报 · 技巧与观点 #4
- 抓取方式：scripts/aihot-extract.mjs（Readability + Turndown）
