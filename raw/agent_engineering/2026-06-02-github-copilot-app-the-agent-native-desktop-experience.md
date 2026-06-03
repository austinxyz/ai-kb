---
title: "GitHub Copilot 应用：智能体原生桌面体验（GitHub Copilot App: The Agent-Native Desktop Experience）"
slug: 2026-06-02-github-copilot-app-the-agent-native-desktop-experience
fetched_at: 2026-06-03T06:55:09Z
aihot_id: "aihot-daily:2026-06-03:产品发布更新:7"
aihot_url: ""
aihot_published_at: 2026-06-02T00:00:00Z
aihot_tags: [GitHub Copilot, agent-native, multi-agent, sandbox, SDK]
aihot_starred: 0
aihot_summary: |
  在微软 Build 2026 大会上，GitHub 发布了新的工具和更新，并将 Copilot 应用定位为"智能体原生的桌面体验"。其核心目标是让 AI 智能体能够以用户已经习惯的方式进行工作。
aihot_recommendation_reason: |
  GitHub 官方对 agent-native 开发环境的完整产品化：My Work 仪表盘、Canvas 双向工作面、Agent Merge、本地/云沙箱、分级代码审查、多语言 SDK GA。Agent 工程实战素材，可与 Claude Code 动态工作流横向对比。
source_url: https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience
source_type: blog
content_source: original_full
fetch_status: ok
fetch_error: null
classification:
  primary_series: S4_agent
  also_relevant: [S2_methodology]
  confidence: high
wiki_status: drafted
wiki_target: wiki/应用开发/GitHub-Copilot-Agent-Native桌面.md
---

# GitHub Copilot App: The Agent-Native Desktop Experience

## Overview

GitHub introduced the GitHub Copilot app at Microsoft Build 2026, positioning it as a control center for agent-native development. The platform addresses challenges in agentic workflows by consolidating multiple parallel agent sessions into one unified interface.

## Key Features

### My Work Dashboard
The app provides a centralized view displaying active sessions, issues, pull requests, and background automations across connected repositories. Each session operates in its own isolated git worktree, preventing agents from interfering with each other.

### Canvas Interface
Canvases function as bidirectional work surfaces where developers and agents collaborate. Rather than scrolling through chat history, developers can see visible work—plans, pull requests, terminal sessions—that agents update in real-time while humans maintain steering capability.

### Agent Merge
This feature automates pull request progression through review cycles and CI checks. Users define automation boundaries: whether Copilot should resolve CI failures, address feedback, or merge when conditions are satisfied.

### Sandboxing
Both cloud and local sandbox environments allow agents to execute code safely:
- **Local sandboxes**: Isolated environments on the machine with restricted filesystem and network access
- **Cloud sandboxes**: Ephemeral Linux environments hosted by GitHub, enabling device-agnostic session continuation

### Code Review at Scale
Copilot code review now offers "medium tier review" routing to higher-reasoning models. Organizations can configure review intensity per repository, optimizing cost and model deployment for risk levels.

### Extended SDK Support
The GitHub Copilot SDK is now generally available across Node.js/TypeScript, Python, Go, .NET, Rust, and Java, enabling teams to build custom internal tools on the same agentic runtime.

### CLI Enhancements
The redesigned Copilot CLI includes tabbed navigation, on-device voice input, and scheduled task automation through the `/every` command.

## Availability

The app is in technical preview for existing Copilot Pro, Pro+, Business, and Enterprise subscribers. Copilot Max is available as an upgrade for high-volume users.
