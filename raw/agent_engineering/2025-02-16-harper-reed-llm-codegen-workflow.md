---
title: "My LLM Codegen Workflow atm"
slug: 2025-02-16-harper-reed-llm-codegen-workflow
fetched_at: 2026-05-14T00:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2025-02-16T00:00:00.000Z
aihot_tags: ["LLM", "Codegen", "Workflow", "Aider", "Repomix", "Spec-Driven", "Interrogatory LLM"]
aihot_starred: 0
aihot_summary: |
  Harper Reed 的 LLM 辅助编程三步流程：① 用对话式 LLM（每次一问）打磨 spec.md；② 用推理模型（o1/o3/r1）生成 prompt_plan.md + todo.md；③ 用 Aider/Cursor/Claude.ai 执行。单问约束（Ask me one question at a time）是 Interrogatory LLM 技术的原始出处，被 Martin Fowler 引用。
aihot_recommendation_reason: |
  这是 Martin Fowler《Interrogatory LLM》中"第一个让我看到这个方法合理描述"的原始来源。单问约束的出处和完整的 greenfield/legacy 两条工作流在这里。
source_url: "https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/"
source_type: "blog_personal"
content_source: "webfetch_manual"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: ["S2_methodology"]
  confidence: "high"
wiki_status: "pending"
wiki_target: ""
---

# My LLM Codegen Workflow atm

> Harper Reed · harper.blog · February 16, 2025
> Word count: 3,062 | Reading time: 15 min

**tl;dr**: Brainstorm spec, then plan a plan, then execute using LLM codegen. Discrete loops. Then magic.

---

## Greenfield 开发：三步流程

### Step 1: Idea Honing（打磨想法 → spec.md）

使用对话式 LLM（ChatGPT 4o/o3）

开场 prompt：
> "Ask me one question at a time so we can develop a thorough, step-by-step spec"

目标：与 LLM 对话，逐问逐答，最终生成一份开发者可直接使用的规格文档。

收尾 prompt：
> "can you compile our findings into a comprehensive, developer-ready specification?"

输出：`spec.md`

### Step 2: Planning（规划 → prompt_plan.md + todo.md）

使用推理模型（o1、o3、r1）

两种 prompt 策略：
- **TDD Prompt**：强调测试驱动开发
- **Non-TDD Prompt**：通用实现路径

核心指令：
> "Break it down into small, iterative chunks that build on each other"

附加请求：
> "Can you make a `todo.md` that I can use as a checklist?"

输出：`prompt_plan.md` + `todo.md`

### Step 3: Execution（执行）

工具选项：
- GitHub Copilot Workspace
- Aider
- Cursor
- Claude Engineer
- Sweep.dev
- ChatGPT
- Claude.ai
- Repomix

**Claude.ai 执行方式**（手动结对）：
- 开发者负责初始样板和工具配置
- 迭代提交 prompt
- 遇到卡顿时使用 Repomix 注入上下文
- 每步之间测试验证

**Aider 执行方式**（自动化）：
- 最少人工干预
- 自动跑测试和 debug
- 始终在新 branch 操作：`always make sure you are on a new branch for aider work`

---

## Non-Greenfield（存量代码迭代）

主要工具：Repomix + Mise（任务运行器）

Mise 任务集合示例：
- `LLM:clean_bundles` — 通过 Repomix 生成 bundle
- `LLM:copy_buffer_bundle` — 复制 bundle 到剪贴板
- `LLM:generate_code_review`
- `LLM:generate_github_issues`
- `LLM:generate_issue_prompts`
- `LLM:generate_missing_tests`
- `LLM:generate_readme`

具体 prompt 模板：

代码审查：
> "You are a senior developer. Your job is to do a thorough code review of this code."

GitHub Issue 生成：
> "write out the top issues that you see with the code. Do Not Hallucinate."

缺失测试：
> "write out a list of missing test cases, and code tests that should exist."

---

## 关键规则与技巧

1. **离散循环结构**：Planning → Execution → Testing，每轮独立
2. **Prompt 分隔**：用 markdown code tag 标记每个 prompt
3. **集成约束**：`no hanging or orphaned code that isn't integrated into a previous step`
4. **Token 超限处理**：编辑 ignore 规则压缩 `output.txt`
5. **分支策略**：Aider 工作始终在新 branch 上

---

## 作者观察与局限

- **单人工作流**：`the interfaces are all single player mode`，不适合团队协作
- **过度工程风险**：容易跑到 `over my skis`（失去掌控）
- **环境代价**：最担心电力消耗
- **工作流时效**：`This is working well NOW, it will probably not work in 2 weeks`

已完成项目类型：Scripts、Expo apps、Rust CLI、Python CLI、Cloud function managers、Todo list

作者成就：`My hack to-do list is empty because I built everything`

---

## 参考反驳资源

Ethan Mollick《Co-Intelligence: Living and Working with AI》

---

## 来源

- 原文：https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/
- 作者：Harper Reed（前 Obama campaign CTO）
- 发布日期：2025-02-16
- 引用自：Martin Fowler《Interrogatory LLM》(2026-05-14)，作为单问约束技术的原始出处
