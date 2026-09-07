---
title: Hermes / Slock：Agent 工程新范式
category: 应用开发
tags: [Hermes, Slock, Raft, 技能沉淀, 多Agent协同, Token效率, 本地模型, DeepSeek, Agent安全, 融资]
source: "[[raw/agent_engineering/2026-08-20-E249-token经济转点-OpenClaw-Hermes-本地自研Agent|E249 Token经济转点播客]]"
updated: 2026-08-20
status: stable
---

## 定义

2026 年中，Agent 工程从"科研能力竞赛"转入"工程落地"阶段：**Hermes**（Nous Research）用"技能沉淀"绕开长期记忆难题，**Slock/Raft**（钱宇超创立）用"无 Ego 多 Agent 群聊"实现群体智能涌现，而主讲人黄东旭进一步摸索出"本地开源模型干日常 + 云端顶级模型攻坚"的分层协作团队——三者共同标志着行业观念从 **Token Maxing**（无脑堆消耗）转向 **Token Efficient**（精打细算）。

## 核心要点

**Hermes：用技能沉淀绕开记忆难题**
- 不硬解决"完美长期记忆"，而是在 Agent Loop 里加入反思机制：任务成功后自动复盘，把步骤和经验封装成可复用的"技能（Skill）"
- 下次遇到类似场景直接调用沉淀好的最佳实践，越用越顺手，Onboarding 和稳定性明显优于 [[wiki/应用开发/OpenClaw-百个Codex实例运营开源项目|OpenClaw]]
- 商业模式：作为流量入口，靠给模型厂商带 Token 消耗换折扣差价变现——**但这只是收入一部分**，规模化收入主要靠云托管付费订阅（见下）

**Hermes 背景与融资（第 2 来源补充）**
- 发布于 2026-02-25，与 OpenClaw 爆火同期——更准确的定位是 **Nous Research 直接对标 OpenClaw 做的竞品**，而非单纯"因记忆差才迁移"
- 2023 年成立，创始人 Jeffrey Quesnelle、Karan Malhotra、Ryan Teknium、Shivani Mitra；GitHub star 10-21 万区间，MIT 开源，多平台覆盖（Telegram/Discord/Slack/WhatsApp/Signal/Email/CLI）
- **2026-07 融资**：估值 **$1.5B**，Robot Ventures 领投 $75M+，此前已融 $70M（投资人含 Paradigm、Balaji Srinivasan）
- **商业模式**：开源自部署免费 + 云托管付费订阅 **$20-200/月**
- **技术精确化**：Memory 存小型持久事实（常驻上下文），Skill 存长流程（按需加载）；6 月新增 `/learn` 命令——从目录/URL/对话/笔记直接生成技能，不用手写 SKILL.md，是 [[wiki/应用开发/Token浪费与多模型路由|Karpathy 提出的 SKILL.md 省钱思路]]的自动化升级；改动先 `write_approval` 暂存待人工审核，非完全无监督自学

**Hermes 的安全批评（播客未提及的视角）**
- 核心论断：**"可以被安全使用，但默认不安全"**——持久内存 + 无人值守调度组合是最大风险，坏的执行会因为"记得住"而重复发生
- 记忆库本身成为敏感数据资产；企业威胁建模列出四类攻击面：技能市场供应链投毒、记忆注入攻击、多 provider 凭证泄露面、MCP server 信任边界
- 终端/文件访问与宿主同 OS 用户运行，攻击面随记忆和技能库越丰富而越大
- **核心张力**：能力和攻击面是同一件事的两面。Hermes 选择"深度持久化"换能力，Slock 选择"频道隔离上下文"换安全——是同一问题的两种相反工程取舍

**Slock（后改名 Raft）：无 Ego 群体审查**
- 前 Kimi CLI 负责人钱宇超创立，相当于 Agent 版 Slack：多个不同模型驱动的 Agent 放进同一频道，彼此**不共享内部上下文**，只看频道公开发言，避免上下文膨胀
- 核心机制：指定负责人，其余 Agent 轮番挑刺；大模型没有 Ego，被反驳不会抵触，直接认同并深挖，直到"谁也挑不出更多毛病"才停
- 实测案例：审查分布式数据库 db9 复杂改动，10 个顶级 Agent 互相纠偏，深度远超单模型 one-shot——群体智能涌现
- **代价**：Token 消耗 10 倍以上暴涨，黄东旭高峰期一天烧 10 亿 Token、三四百美金账单——这是他转向 Token Efficient 范式的直接催化剂

**本地 + 云端分层协作团队**
- 本地：Mac Studio 跑 DeepSeek V4 Flash，30 token/s，满载一天电费约 $1，成本趋零后放开跑以前"舍不得用付费 API"的重活（批量总结 CVPR/NeurIPS 几百篇论文）
- 云端：本地 Agent 团队卡在专家级 bug 时，先写"为什么解不了"报告，甩给云端顶级模型（如 Fable 5）单点突破
- 云端账单从爆表回落到每月两三百美金

## 三个观念转折点

| 转折点 | 内容 |
|---|---|
| ① OpenClaw 出现 | 标志"模型科研时代"转向"Agent 工程应用时代"——一周 vibe coding 就能手搓实用系统 |
| ② 超级模型（Fable 5）发布 | 颠覆"三个臭皮匠"式开会观念——以前 10 个 Agent 在 Slock 里解不开、写报告认输的地狱级 bug，Fable 5 one-shot 直接精准解决 |
| ③ 实用级开源模型爆发（DeepSeek V4 Flash、GLM-5.2）| 能力逼近第一梯队且能本地跑，解锁大量"因 API 太贵不敢做"的重复性工作 |

**转变前后对比**：之前无脑用最贵闭源模型、不信任单点模型故靠多 Agent 开会兜底质量；现在讲究 ROI，顶级模型可以 one-shot，关注重心从模型底层能力转向 Agent 软件工程（记忆/上下文管理/可观测性中间件），团队组织变成"本地便宜员工 + 云端顶级专家"分层协作。

## 与其他概念的关系

- [[wiki/应用开发/OpenClaw-百个Codex实例运营开源项目|OpenClaw：百个 Codex 实例运营开源项目]]：OpenClaw 记忆弱、Token 消耗大的缺陷，是迁移到 Hermes 的直接原因
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：Slock 的"频道隔离上下文+群体挑刺"和 Harness Engineering 中"扇出-验证-再扇出"的动态工作流是同一类模式的不同实现
- [[wiki/应用开发/Token浪费与多模型路由|Token 浪费与多模型路由（Karpathy）]]：Karpathy 讲的是个人开发者级的省钱五件套（context 管理+多模型路由），本条目的"本地+云端分层"是同一逻辑在 Agent 团队组织层面的延伸
- [[wiki/应用开发/Agentic-Workflow-Token效率|Agentic Workflow Token 效率]]：GitHub 的企业级 Token 审计方法论，与本条目"Token Maxing → Token Efficient"的行业级观念转变互为印证

## 参考来源

- [[raw/agent_engineering/2026-08-20-E249-token经济转点-OpenClaw-Hermes-本地自研Agent|E249｜Token经济转点：OpenClaw、Hermes到本地自研的Agent进化之路]]
- [[raw/agent_engineering/2026-08-20-Hermes-Agent-融资与安全批评|Hermes Agent：背景、融资与安全批评]]
