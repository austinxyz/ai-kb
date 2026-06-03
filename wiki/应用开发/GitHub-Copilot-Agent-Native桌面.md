---
title: GitHub Copilot 应用（Agent-Native 桌面）
category: 应用开发
tags: [GitHub Copilot, agent-native, multi-agent, sandbox, SDK, worktree]
source: "[[raw/agent_engineering/2026-06-02-github-copilot-app-the-agent-native-desktop-experience]]"
updated: 2026-06-03
status: draft
aihot_origin:
  aihot_id: "aihot-daily:2026-06-03:产品发布更新:7"
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-06-03
---

## 定义

GitHub 在 Build 2026 发布的桌面级 Copilot 应用，把"agent-native 开发"产品化为统一控制中心：将多个并行 Agent 会话、Issue、PR、后台自动化收拢到一个界面，每个会话跑在独立 git worktree 中互不干扰。

## 核心要点

- **My Work 仪表盘**：跨仓库集中展示活跃会话 / Issue / PR / 后台自动化；每个会话独占隔离 worktree，防 Agent 互相干扰
- **Canvas 双向工作面**：以可见的工作物（plan / PR / 终端）替代滚动聊天记录，Agent 实时更新、人类保留 steering
- **Agent Merge**：自动推进 PR 过 review 与 CI；用户定义自动化边界（是否自动修 CI 失败 / 回应反馈 / 达标即合并）
- **本地 + 云双沙箱**：本地受限文件系统与网络的隔离环境；云端临时 Linux 环境支持跨设备续跑
- **分级代码审查**："medium tier review" 路由到更高推理模型；按仓库配置审查强度，按风险优化成本与模型投放
- **SDK GA**：Copilot SDK 在 Node/TS、Python、Go、.NET、Rust、Java 全面可用，团队可在同一 agentic runtime 上自建内部工具
- **CLI 升级**：标签页导航、设备端语音输入、`/every` 计划任务自动化
- **可用性**：technical preview，面向 Pro/Pro+/Business/Enterprise；高用量用户可升 Copilot Max

## 与其他概念的关系

- [[wiki/应用开发/Claude-Code动态工作流|Claude Code 动态工作流]]：同为 agent-native 多 Agent 编排，Claude 由主模型运行时即兴造 harness，Copilot 走产品化固定 UI（仪表盘 + Canvas）
- [[wiki/应用开发/Codex-Auto-review-AI审批AI动作|Codex Auto-review：AI 审批 AI 动作]]：Agent Merge 的"达标自动合并"与 Codex 用 AI 子代理审批高风险动作同属 AI 自治治理
- [[wiki/应用开发/Amp-Neo-长链路Coding-Agent|Amp Neo 长链路 Coding Agent]]：远程编排 + Plugin API + 权限边界，与 Copilot 应用的会话编排 + SDK + 自动化边界思路一致
- [[wiki/应用开发/OpenClaw-百个Codex实例运营开源项目|OpenClaw 百个 Codex 实例运营]]：并行多 Agent 会话的极端实践，Copilot 用 worktree 隔离解决其同类干扰问题

## 参考来源

- [[raw/agent_engineering/2026-06-02-github-copilot-app-the-agent-native-desktop-experience|GitHub Copilot App: The Agent-Native Desktop Experience（GitHub 官方 blog）]]
