---
title: "Claude Code 团队实践：智能体编程如何重塑工程组织与流程（Running an AI-Native Engineering Org）"
slug: 2026-06-03-running-an-ai-native-engineering-org
fetched_at: 2026-06-03T06:57:29Z
aihot_id: "aihot-daily:2026-06-03:技巧与观点:4"
aihot_url: ""
aihot_published_at: 2026-06-03T00:00:00Z
aihot_tags: [Claude Code, 工程组织, JIT规划, 代码审查, 角色变迁]
aihot_starred: 0
aihot_summary: |
  在 Code w/ Claude SF 2026 活动上，Claude Code 工程团队分享了将智能体编程设为默认工作方式后带来的流程与结构变革。核心变化包括：规划转向即时（JIT）模式，强调快速原型与反馈；上下文收集变为"先问 Claude"；代码审查中 Claude 处理风格与测试，人工专注于法律、安全等专业判断。新范式下，工程瓶颈从编写代码转向验证、审查与安全。
aihot_recommendation_reason: |
  Anthropic 工程总监 Fiona Fung 一手复盘 AI-native 工程组织：JIT 规划、Ask-Claude-First、人机代码审查分工、角色边界模糊、三条团队原则、三个度量指标。S3 角色变迁顶级素材。
source_url: https://claude.com/blog/running-an-ai-native-engineering-org
source_type: blog
content_source: original_full
fetch_status: ok
fetch_error: null
classification:
  primary_series: S3_roles
  also_relevant: [S2_methodology]
  confidence: high
wiki_status: drafted
wiki_target: wiki/行业洞察/AI-Native工程组织实践.md
---

# Running an AI-Native Engineering Org

**Published:** June 3, 2026 | **Reading time:** 5 min

## Overview

Fiona Fung, Director of Engineering for Claude Code and Claude Cowork, discusses how engineering processes and team structure evolved when agentic coding became the default workflow.

## Key Shifts in Engineering Processes

### Planning: Just-in-Time (JIT) Approach
Traditional six-month roadmaps became obsolete within three months. The new model emphasizes prototyping, gathering internal user feedback, and rapid iteration rather than extensive pre-planning.

### Context Gathering: Ask Claude First
Instead of finding the original code author, teams now ask Claude contextual questions directly. The process includes automation wherever possible—like having Claude summarize customer feedback automatically each morning.

### Code Review: Trust but Verify
Claude handles style checks, linting, bug detection, and test generation. Human reviewers focus on domain expertise: legal review, security-sensitive code, product decisions, and design taste.

### Team Composition: Blurred Roles
- Product managers now code extensively
- Engineers take on design and content work
- Hiring emphasizes creative builders with product sense and engineers with deep systems expertise
- Raw throughput is less critical since models handle volume

## Core Team Principles

1. **Relentlessly dogfood your product** – All team members use Claude Code daily
2. **Keep the team flat** – Managers start as individual contributors to understand engineering realities
3. **Kill obsolete processes** – Team members have explicit permission to question and eliminate outdated workflows

## Success Metrics to Track

- **Onboarding ramp time** – Engineers shipping real code within their first week
- **PR cycle time** – Faster turnaround reveals scaling bottlenecks
- **Claude-assisted commits** – Default mode; non-assisted commits became rare

## Recommendation

Identify your team's most expensive or dreaded workflow and ask: Does it still serve its purpose? Can it be automated or eliminated entirely?
