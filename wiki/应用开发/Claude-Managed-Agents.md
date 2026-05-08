---
title: Claude Managed Agents
category: 应用开发
tags: [Agent, Anthropic, Memory, Multi-Agent, Outcomes]
source: "[[raw/agent_engineering/2026-05-06-new-in-claude-managed-agents-dreaming-outcomes-and-multiagent-orchestration]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmoua1os000lgslm0y9qvbma4"
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
Anthropic 在 Claude Platform 上推出的托管 Agent 平台，2026 年 5 月 5 日同时上线 Dreaming（research preview）+ Outcomes / Multiagent Orchestration / Webhooks（public beta），把 Agent 从"完成单次任务"演化为"跨会话自我改进 + 自评估自纠正 + 主从分工并行"。

## 核心要点
- **Dreaming（自我改进）**：定时 review 历史 session 与 memory store，提取 pattern、curate memory；可全自动落库或人工 review 后落库。能浮现单 agent 看不到的：反复犯的错、agent 之间收敛出的 workflow、团队共享的偏好。Memory（运行中捕获）+ Dreaming（会话之间整理）= 长期记忆系统。
- **Outcomes（自评估）**：开发者写 rubric 定义"success looks like"，独立 grader 在自己 context 中评分（不被 agent 推理污染），不达标就指出问题让 agent 重做。内部 benchmark：标准 prompting loop 上叠加 outcomes，最难任务收益最大，整体最高 +10 个点；docx 文件生成 task success +8.4%、pptx +10.1%。可结合 webhook：定 outcome → run → 完成时回调通知。
- **Multiagent Orchestration（编排）**：lead agent 拆任务给若干 specialist subagent，每个 sub 有独立 model / prompt / tools；共享 filesystem，event 持久化、agent 记得自己做过什么；lead 可中途 check-back；Claude Console 可追踪每一步——哪个 agent 何时做了什么、为什么。例：lead 跑 investigation，subagent 同时翻 deploy history、error log、metrics、support ticket。
- **客户案例数据**：Harvey（法律长文起草 / 文档生成）用 dreaming 让 agent 跨 session 记 filetype workaround 与 tool pattern，completion rate 提升约 6×。Netflix 平台团队用 multiagent 并行分析数百次 build 的 log，把跨数千 application 的 recurring issue 浮现出来。Spiral（Every 旗下）lead 跑 Haiku 接需求与追问、subagent 跑 Opus 起草，多稿并行；用 outcomes 按 Every 编辑原则 + 用户 voice（两者都从 memory 拉）评分，过 bar 才返回。Wisedocs 把文档质检 review 速度提升 50% 同时保对齐内部 guideline。
- **架构含义**：Lead/Sub 模型按 cost 分层（Haiku 接驳 + Opus 创作）成为新默认模式；rubric grader 独立 context 是关键设计——避免与 producer 的链路相互污染。
- **接入路径**：Dreaming 需 request access；Outcomes / Multiagent / Memory 已是 public beta；通过 Claude Console 部署。

## 与其他概念的关系
- [[wiki/应用开发/Agent-Memory统一框架|Agent Memory 统一框架]]：Dreaming 实质是"提取 + 管理"两个组件的产品化——session-level capture 是 Memory，inter-session refinement 是 Dreaming。
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：Multiagent + Outcomes 把"独立验证"和"团队规则"两条 harness 原则做成平台 primitive，开发者不用自建。
- [[wiki/应用开发/Prompt-Caching工程|Prompt Caching 工程]]：lead/sub 跨模型协同时按 Claude Code 团队建议——用 hand-off message 而非 mid-session 切模型，否则缓存全废。

## 参考来源
- [[raw/agent_engineering/2026-05-06-new-in-claude-managed-agents-dreaming-outcomes-and-multiagent-orchestration|New in Claude Managed Agents: dreaming, outcomes, and multiagent orchestration]]
