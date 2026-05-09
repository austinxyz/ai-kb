---
title: Codex 安全治理四层架构
category: 应用开发
tags: [agent-security, codex, sandbox, opentelemetry, enterprise-deployment]
source: "[[raw/agent_engineering/2026-05-08-running-codex-safely-at-openai]]"
updated: 2026-05-09
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-09
---

## 定义
OpenAI 内部部署 Codex 编码代理时所采用的工程化安全治理框架，由 sandbox + approval、Auto-review 子代理、managed network policy、agent-native OpenTelemetry 四层防护组成，目标是在企业环境下让低风险动作丝滑通过、高风险动作显式停下，并保留可审计的代理原生遥测。

## 核心要点
- **第一层 sandbox + approval（静态边界 + 显式确认）**：sandbox 定义技术执行边界（可写路径、是否能联网、受保护路径），approval policy 决定何时必须停下来征求用户许可（典型场景：超出 sandbox 范围）；用户可以一次性批准，也可以批准本会话同类操作。两者协同，sandbox 设地板，approval 处理越界。
- **第二层 Auto-review 子代理（routine 自动放行）**：把"计划动作 + 近期上下文"发给一个 auto-approval 子代理，由它自动放行低风险请求，避免每个例行动作都打断主代理；高风险或可能有副作用的动作仍然回退给人工。这是 agent-policing-agent 模式，让常规工程任务保持流畅。
- **第三层 managed network policy（出网白名单）**：Codex 默认不开放任意外部访问。预期目的地放行、明确拒绝目的地拦截、未知域名要审批。配合 CLI 与 MCP OAuth 凭证存入 OS keyring、强制走 ChatGPT Enterprise workspace 登录、命令也分级（常见无害命令免审、危险命令必审或拦截），把 agent 紧紧绑在 workspace-级控制面之内。
- **第四层 agent-native OpenTelemetry（语义级审计）**：传统安全日志只能回答"发生了什么"（进程启动、文件变更、网络连接尝试），但回答不了"为什么"。Codex 通过 OpenTelemetry 导出 user prompts、tool approval decisions、tool execution results、MCP server usage、network proxy allow/deny 等事件，再叠加 OpenAI Compliance Platform 的活动日志，让安全团队拿到 agent 视角而不是进程视角。
- **AI 安全分流代理 (AI security triage agent) 闭环**：端点检测发出可疑告警时，分流代理从 Codex 日志拉出原始请求、工具活动、审批决策、工具结果、网络策略决策，组合还原意图，然后把分析结果交给安全团队，区分"预期行为 / 良性误操作 / 真正需要升级的事件"。安全代理用安全代理日志来判另一个代理——是这套架构的关键闭环。
- **配置分发遵循三层 enforcement**：cloud-managed requirements + macOS managed preferences + 本地 requirements files；admin 强制下发的 requirements 用户无法绕过，但仍可按团队/用户组/环境分桶测试不同配置；策略一致地覆盖 desktop app、CLI、IDE 扩展。
- **同一份遥测同时驱动安全与运营**：日志既用于检测异常，也用于度量内部采用度——哪些工具/MCP 被使用、网络 sandbox 拦截/弹审批的频率、哪些场景还要调参，并可集中到 SIEM 与合规系统。安全 telemetry = 产品 analytics，是这套设计的副产品收益。

## 与其他概念的关系
- [[wiki/应用开发/Harness-Engineering|Harness-Engineering]]：Codex 这套四层防护是 harness engineering 的企业安全侧实例——sandbox 与 approval 对应 harness 中的"action space 限制"，OpenTelemetry 对应"observation 设计"，是 agent-as-product 的工程兜底。
- [[wiki/应用开发/Claude-Code团队配置|Claude-Code团队配置]]：同属 IDE-级 coding agent 的团队治理，Codex 通过 macOS managed preferences + cloud requirements 集中下发策略，Claude Code 通过 CLAUDE.md / Skills / Hooks 做团队配置；二者解决同一问题（让 agent 在团队基线内运行），路径不同。
- [[wiki/应用开发/AI-Agent-PR审查|AI-Agent-PR审查]]：Auto-review 子代理是"用 agent 审查 agent 动作"的实例——同样的 agent-policing-agent 模式可见于 PR 审查的 5 红旗框架，差别在于一个治在线动作、一个治代码产出。
- [[wiki/应用开发/Claude-Managed-Agents|Claude-Managed-Agents]]：managed agents 同样涉及 outcomes 与 multi-agent 协作，本条目可视为企业自建的 managed Codex 等价物，外层加了合规与遥测要求。
- [[wiki/行业洞察/ADLC|ADLC]]：智能体驱动开发生命周期需要安全护栏才能落地，本条目给出生产级护栏的具体形态。

## 参考来源
- [[raw/agent_engineering/2026-05-08-running-codex-safely-at-openai|Running Codex safely at OpenAI]]
