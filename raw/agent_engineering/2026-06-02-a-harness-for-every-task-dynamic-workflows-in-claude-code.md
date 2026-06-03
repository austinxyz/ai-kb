---
title: "Claude Code 新增动态工作流功能（A Harness for Every Task: Dynamic Workflows in Claude Code）"
slug: 2026-06-02-a-harness-for-every-task-dynamic-workflows-in-claude-code
fetched_at: 2026-06-03T06:30:25Z
aihot_id: "aihot-daily:2026-06-03:产品发布更新:1"
aihot_url: ""
aihot_published_at: 2026-06-02T00:00:00Z
aihot_tags: [Claude Code, multi-agent, workflow, harness]
aihot_starred: 0
aihot_summary: |
  Claude Code 新增动态工作流功能，允许模型在运行时即兴创建和协调多智能体框架来处理复杂任务。该功能通过执行特定的 JavaScript 文件来生成和协调拥有独立上下文窗口的子代理，可解决单一上下文窗口中长时间执行任务可能出现的智能惰性等问题。工作流适用于研究、安全分析、代码审查等场景，通常消耗更多 token，更适合高价值复杂任务，其最佳实践仍在演进。
aihot_recommendation_reason: |
  Anthropic 官方对 Claude Code dynamic workflows 的权威说明：定位、失败模式、六大编排模式、典型用例与边界。Agent harness 设计一手素材。
source_url: https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
source_type: blog
content_source: original_full
fetch_status: ok
fetch_error: null
classification:
  primary_series: S4_agent
  also_relevant: [S2_methodology]
  confidence: high
wiki_status: drafted
wiki_target: wiki/应用开发/Claude-Code动态工作流.md
---

# A Harness for Every Task: Dynamic Workflows in Claude Code

Claude Code now enables dynamic workflows, allowing Claude to write custom multi-agent harnesses tailored to specific tasks. Here's the essential guide:

## What Are Dynamic Workflows?

Dynamic workflows execute JavaScript files with special functions that spawn and coordinate subagents. Unlike static workflows that work for all edge cases, these are "custom-built for the task at hand." They help combat three failure modes:

- **Agentic laziness**: Claude stops prematurely on complex tasks
- **Self-preferential bias**: Tendency to prefer its own results when verifying
- **Goal drift**: Loss of fidelity to original objectives across many turns

## Common Patterns

**Classify-and-act**: Route tasks to different agents based on classification

**Fan-out-and-synthesize**: Split work into smaller steps, run agents on each, then merge results

**Adversarial verification**: Spawn separate agents to verify outputs against criteria

**Generate-and-filter**: Create multiple ideas, filter by rubric or verification

**Tournament**: Have agents compete using different approaches, judge pairwise

**Loop until done**: Spawn agents until stop conditions are met

## Key Use Cases

- **Migrations/refactors**: Break tasks into steps, spawn subagents for each
- **Deep research**: Fan-out searches, fetch sources, verify claims, synthesize reports
- **Deep verification**: Identify factual claims, spawn subagents to check each one
- **Sorting**: Use tournaments or pairwise comparisons for large-scale ranking
- **Root-cause investigation**: Generate independent hypotheses, test against evidence
- **Triage at scale**: Classify items, dedupe, and take action on backlogs

## When NOT to Use

Workflows are new and consume more tokens. They're best for complex, high-value tasks. Regular coding tasks typically don't need multiple reviewers or extensive orchestration.

## Tips

- Use detailed prompting with specific patterns
- Combine with `/goal` and `/loop` for repetitive tasks
- Set explicit token budgets
- Save and share via `~/.claude/workflows` or skills
