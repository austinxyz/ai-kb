---
title: Prompt Caching 工程
category: 应用开发
tags: [Prompt-Caching, Claude-Code, Anthropic, 延迟优化, 成本优化]
source: "[[raw/dev_methodology/2026-04-30-lessons-from-building-claude-code-prompt-caching-is-everything]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmolt11dh026esll9jvakjms4"
  aihot_url: ""
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
Claude Code 团队成员 Thariq Shihipar 总结的 prompt caching 工程实践集：Claude Code 的整个 harness 围绕 prompt caching 设计，团队对缓存命中率"像监控 uptime 一样"打 alert、低于阈值就 declare SEV——因为高缓存命中率不仅降本降延迟，还直接换来订阅计划更宽松的 rate limit。

## 核心要点
- **机制基础**：Anthropic 缓存按前缀匹配工作——从请求开始到 `cache_control` 断点全部缓存；前缀任何变动都让其后所有内容失效。"任何位置一改，后面整段全失效"是核心约束。
- **最佳提示结构（静态在前、动态在后）**：① Static system prompt + Tools（globally cached）→ ② CLAUDE.md（cached within a project）→ ③ Session context（cached within a session）→ ④ Conversation messages。Claude Code 历史踩过的坑：在 static system prompt 里塞 in-depth timestamp、tool 定义顺序非确定地洗牌、改 Agent tool 可调用的子 agent 列表——三种都炸过缓存。
- **用 message 传更新而非改 prompt**：信息过期（如时间、用户改了文件）时，绝不要改 system prompt；Claude Code 在下一条 user message 或 tool result 里加 `<system-reminder>` tag 注入更新信息。
- **不在会话中切换模型**：缓存按模型独立——100k token Opus 对话切到 Haiku 反而更贵，因为要给 Haiku 全量重建缓存。要切就用 subagent 走 hand-off：让 Opus 准备 hand-off message，再给 Haiku 子 agent 接着干（Claude Code 的 Explore agent 就是 Haiku）。
- **不增删工具**："tools 是 cached prefix 一部分"是反直觉点——按需暴露工具会破坏缓存。Plan Mode 的设计示范：不切换 tool set，而是把 EnterPlanMode/ExitPlanMode 做成两个工具，进入 plan mode 只发 system message 说明约束，工具集不变；副作用——agent 自己也能 call EnterPlanMode 自主进入 plan mode 而不破缓存。
- **Tool search 替代删除**：Claude Code 经常加载几十个 MCP 工具，全 schema 太贵，删又破缓存。解法是 `defer_loading`——发送轻量 stub（只有 tool name + `defer_loading: true`），模型通过 tool search "discover" 后才加载完整 schema；同顺序的 stub 始终在场，前缀稳定。
- **Cache-safe Compaction**：context 满后要 fork 出一个对话给 model 写 summary——天真做法是新起一个 system prompt + 无 tool 的 API call，但与父对话从第一个 token 起 prefix 全分叉，整段未缓存对话按全价收费（越长越贵）。Claude Code 的解法是用与父对话一字不差相同的 system prompt / user context / system context / tool definitions，只在末尾追加 compaction prompt 作为 new user message——API 视角看几乎和父对话最后一次请求一样，缓存前缀复用，只为 compaction prompt 本身付新 token。代价是要预留 compaction buffer（容纳 prompt + summary 输出 token）。Anthropic 已把这套 compaction 直接做进 API。
- **运维 5 条**：① 缓存按前缀匹配，整套系统都要绕这个约束设计；② 用 message 传 state，不用改 system prompt；③ 不增删工具、不切模型——用 tool 表达 state transition；④ 像监控 uptime 一样监控缓存命中率，几个百分点的 miss rate 显著影响成本与延迟；⑤ Fork 操作（compaction、summarization、skill execution）必须复用父 prefix 才能命中缓存。

## 与其他概念的关系
- [[wiki/应用开发/Agentic-Workflow-Token效率|Agentic Workflow Token 效率]]：缓存命中是 token 成本治理的核心杠杆，GitHub 团队 ET 公式中给 cache-read 0.1× 权重就是奖励缓存。
- [[wiki/应用开发/Claude-Code团队配置|Claude Code 团队配置]]：CLAUDE.md / Skills / Hooks 的层级化设计本质是为缓存稳定性服务。
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：缓存稳定性是 harness 中"工具集与上下文规则"的具体实现约束。
- [[wiki/应用开发/Claude-Managed-Agents|Claude Managed Agents]]：lead/sub 跨模型协同时按本工程实践——必须用 hand-off message 而非 mid-session 切模型。

## 参考来源
- [[raw/dev_methodology/2026-04-30-lessons-from-building-claude-code-prompt-caching-is-everything|Lessons from building Claude Code: Prompt caching is everything]]
