# Claude Code 源码分析：Agentic Harness 设计的尽头

#resource #AI #AgenticAI #ClaudeCode #Harness

**来源：** PaperAgent（微信公众号）
**日期：** 2026-04-01
**分类：** 学习/AI-ML

---

## 摘要

作者通过分析 Claude Code 意外泄露的 4756 个源文件，深入拆解其 Agentic Harness 架构。核心结论：Claude Code 的竞争力不在模型本身，而在于将 prompt 编排、工具执行、权限管控、Agent 调度、上下文管理全部制度化、工程化的完整 Harness 系统。

## 关键要点

- **Prompt Assembly Architecture**：`getSystemPrompt()` 不是静态文本，而是动静分离的可编排运行时资源——静态部分适合 cache，动态部分按需注入，有明确的 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`
- **行为制度化**：好习惯不交给模型即兴发挥，写进规则强制执行；blast radius 思维将破坏范围写入行为准则
- **上下文是稀缺资源**：fork path 共享父线程 prompt cache，skill 按需注入，function result clearing，compact/transcript/resume 机制
- **Agent 专业化分工**：Explore Agent（纯读）、Plan Agent（纯规划）、Verification Agent（主动找茬，输出 PASS/FAIL/PARTIAL），不用万能 Worker
- **工具执行 Pipeline**：不是直调函数，PreToolUse hooks 可改写输入、拦截权限，PostToolUse 可注入额外上下文
- **Skill 是 prompt-native workflow package**：markdown prompt bundle + frontmatter metadata + 声明 allowed-tools，按需注入

## 涉及概念

[[Model+Harness]] · [[Prompt Assembly Architecture]] · [[Agent专业化分工]]

## 我的想法

