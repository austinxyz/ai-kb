---
title: OpenClaw：百个 Codex 实例运营开源项目
category: 应用开发
tags: [Full Agentic Pipeline, Codex, 开源运营, 自动化, local-first, 个人助理]
source: "[[raw/agent_engineering/2026-05-16-people-freaking-out-over-my-ai-spend-what-nobody-sees-part-of-what-excites-me-so]]"
updated: 2026-08-20
status: stable
aihot_origin:
  aihot_id: "cmp7gzh5x0abkslnz3k1vgqjz"
  series: S4_agent
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Peter（Steinberger）在 OpenClaw 项目中持续运行约 100 个 Codex 实例，自动化处理代码审查、Issue 去重、测试复现、任务创建、垃圾过滤、性能回归监控等全部日常开源运营工作，探索「Token 成本无关紧要」时代的软件构建方式。同一位作者也是 OpenClaw 本体——一款 local-first 开源个人助理 Agent——的创造者：花一星期 vibe coding 做出，此前 30 天已烧掉 130 万美金 Anthropic API 账单。

## 核心要点

- **自动化覆盖范围**：代码与安全审查、Issue 去重归类、自动复现复杂测试环境并录制验证视频、从会议讨论主动创建任务、过滤垃圾评论、监控性能回归
- **工具链**：clawpatch.ai 将代码库拆分为语义功能切片审查；Vercel DeepSec 做安全分析
- **核心前提**：Token 成本趋近零 → 运行 100 个实例的边际成本可接受 → 彻底替代人工重复劳动
- **组织效益**：极精简团队以极低边际成本高效运作大型开源项目

### OpenClaw 本体：个人助理产品（第 2 来源补充）

- **定位**：local-first 个人助理，非重度软件工程工具，用于过滤/自动回复邮件（拿不准的决策提示用户确认）、精选消化信息（抓 Hacker News/邮件订阅，先出摘要）
- **文化现象**：社区玩梗"养龙虾"（本地配置+相处迭代让它更懂自己）；爆火数天内社区做出 **MoltBook**——各家 OpenClaw 互相社交的产品，成为一场技术传播行为艺术
- **优点**：本地隐私保护到位，完全开源、传播力强
- **缺点**：一周 vibe coding 产物，配置复杂、稳定性差；记忆功能弱，靠不停 Compaction（对话压缩）应付，极耗 Token 且易记忆混乱、忘事——这个短板直接催生了 [[wiki/应用开发/Hermes-Slock-Agent工程新范式|Hermes 的技能沉淀机制]]作为替代方案

## 与其他概念的关系

- [[wiki/应用开发/AutoResearch软件开发|AutoResearch 软件开发]]：同为 full agentic pipeline，AutoResearch 关注代码生成迭代，OpenClaw 关注开源项目运营自动化
- [[wiki/应用开发/Codex-安全治理四层架构|Codex 安全治理四层架构]]：OpenClaw 是 Codex 大规模生产使用的案例，治理架构是其安全保障
- [[wiki/应用开发/Token浪费与多模型路由|Token 浪费与多模型路由（Karpathy）]]：作者选择反向操作——不惜 Token 成本跑 100 个实例，因其认为未来 Token 成本趋零
- [[wiki/应用开发/Hermes-Slock-Agent工程新范式|Hermes / Slock：Agent 工程新范式]]：OpenClaw 记忆弱、Token 消耗大的缺陷，是黄东旭迁移到 Hermes 的直接原因；两者是同一时期 Agent 产品演化的前后阶段

## 参考来源

- [[raw/agent_engineering/2026-05-16-people-freaking-out-over-my-ai-spend-what-nobody-sees-part-of-what-excites-me-so|OpenClaw 百个 Codex 实例, 2026-05-16]]
- [[raw/agent_engineering/2026-08-20-E249-token经济转点-OpenClaw-Hermes-本地自研Agent|E249 Token经济转点播客, 2026-08-20]]
