---
title: Agentic Workflow Token 效率
category: 应用开发
tags: [Agent, Token优化, MCP, GitHub, CI/CD]
source: "[[raw/agent_engineering/2026-05-08-improving-token-efficiency-in-github-agentic-workflows]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmow4cvtv02o8slcx9yafds3n"
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
GitHub 团队在 2026 年 4 月对自身生产 Agentic Workflows 的 token 消耗进行系统化埋点、审计与优化的工程方法论：通过 API 代理统一日志、用 Effective Tokens 指标归一化模型成本，并由两个 agent（Daily Token Auditor + Daily Token Optimizer）日常巡检自身 workflow，把可确定的步骤从 LLM 推理循环中拿走。

## 核心要点
- **统一日志层**：通过零密钥安全代理把 Claude CLI、Copilot CLI、Codex CLI 三种 agent 框架的 API 调用归一化为 `token-usage.jsonl`，每条记录含 input/output/cache-read/cache-write/model/provider/timestamp。
- **Effective Tokens 公式**：`ET = m × (1.0×I + 0.1×C + 4.0×O)`；m 为模型乘数（Haiku 0.25×、Sonnet 1.0×、Opus 5.0×），output 4× 因为最贵，cache-read 0.1× 因为命中价格极低；让 10% ET 减少真等于 10% 成本下降。
- **MCP 工具裁剪**：GitHub MCP 注册 40 个工具，每次请求多 10–15 KB schema；smoke-test 中删未用工具单调用减少 8–12 KB，每 run 省数千 tokens。Glossary Maintainer 案例中一个 `search_repositories` 工具一次 run 调 342 次（占 58% 工具调用），属纯浪费。
- **MCP → gh CLI 替换**：把 PR diff、文件内容、review 评论等数据获取从 MCP 工具调用换成 `gh pr diff` 等确定性 HTTP 请求；两种策略：pre-agentic 预下载（`gh` 命令先把数据落到 workspace 文件供 agent 读）和 in-agent CLI 代理替换（透明 HTTP 代理路由 `gh` 流量、不暴露 token）。
- **实测收益**：Auto-Triage Issues 在 109 次 post-fix run 上稳降 62%（按 6.8 次/天频次合计省 7.8 M ET）、Daily Compiler Quality −19%、Community Attribution −37%、Security Guard −43%、Smoke Claude −59%（删 MCP 工具 + 切 Haiku 模型）；12 个 workflow 中 9 个收到优化建议。
- **失败模式与反例**：Daily Syntax Error Quality 因 bash allowlist 只允许相对路径 glob，但 workflow 把测试文件 cp 到 `/tmp/` 后调 `gh aw compile *`，每次 compile 被沙箱拦截，agent 陷入 64-turn 手动读源码死循环；一行配置修复消除整圈。Contribution Check 反而 +5% ET——因为后期 workload 从 41% 小 PR 转向 65% 大 PR，output token +14%（4× 权重放大），证明短窗口比较易被 workload shift 误导。
- **下一步**：从 workflow-level 转向 system-level（识别 episode：上下文收集/重试/合成）和 portfolio-level（多 workflow 共享中间产物缓存，避免重复读取同一 PR diff），并把 monolithic agent 拆成多 subagent 用更便宜模型分工。

## 与其他概念的关系
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：把"agent harness"中的工具集与控制面当成可观测、可优化的工程对象，token 优化是 harness engineering 的成本子集。
- [[wiki/AI基础设施/MCP|MCP（模型上下文协议）]]：揭示 MCP 工具注册的隐性成本（schema 入 prompt 即占 token），为 MCP 服务设计提出"按需暴露"的反例教训。
- [[wiki/应用开发/Prompt-Caching工程|Prompt Caching 工程]]：ET 公式中给 cache-read 0.1× 权重，本质上奖励 prompt 缓存命中；与 Claude Code 团队的缓存设计哲学一致。

## 参考来源
- [[raw/agent_engineering/2026-05-08-improving-token-efficiency-in-github-agentic-workflows|Improving token efficiency in GitHub Agentic Workflows]]
