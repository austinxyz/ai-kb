# Hermes Agent：背景、融资与安全批评

**整理日期**：2026-08-20
**来源**：多篇新闻/文档综合整理（见文末），无单一原文

---

## 基本背景

- **发布日期**：2026-02-25，与 OpenClaw 爆火同期——更准确的定位是 **Nous Research 直接对标 OpenClaw 做的竞品**，而非播客里说的纯粹"因为记忆差才迁移"
- **团队**：2023 年成立，创始人 Jeffrey Quesnelle、Karan Malhotra、Ryan Teknium、Shivani Mitra
- **规模**：GitHub star 10.5万～21.4万（不同来源口径不一），MIT 协议全开源，是今年增速最快的开源 Agent 框架之一
- **多平台**：Telegram、Discord、Slack、WhatsApp、Signal、Email、CLI，一个 Agent 一份记忆跨所有平台
- **8/3 发布 "Herald Release"**：约 3650 commits、1400 merged PR、5200 文件变更（相对 v0.19.0）

## 融资

- 2026-07 敲定新一轮，**估值 $1.5B**，Robot Ventures 领投，至少 $75M，USV 等参与
- 此前已融 $70M，投资人含 Paradigm、North Island Ventures、Delphi Ventures、OSS Capital、**Balaji Srinivasan**
- **商业模式**：开源版免费自部署 + 云托管付费版（**$20-200/月**分级订阅）。播客提到的"靠 Token 差价变现"只是收入的一部分，真正规模化的是 SaaS 订阅

## 技术细节（比播客更精确）

- **Memory vs Skill 的区分**：Memory 存小型持久事实（应始终在上下文里）；Skill 存长流程（只在相关时加载）
- **`/learn` 命令**（2026-06 新增）：从目录/URL/对话/笔记直接生成可复用技能，不用手写 SKILL.md——是 Karpathy 提出的"写 SKILL.md 省钱"思路的自动化升级
- **consent-aware learning loop**：改动先暂存（`write_approval`）待人工审核，再写入未来会话，不是完全无监督自学

## 安全批评（播客完全未提及的视角）

核心论断：**"Hermes Agent 可以被安全使用，但默认不安全。"**

- **持久内存 + 无人值守调度的组合是最大风险**：能在无人监督下自主行动，且记得自己干过什么——意味着一次坏的执行会重复发生
- 记忆库本身成为**敏感数据资产**：不只是"AI 会不会犯错"，"存了什么"本身就需要当作需要保护的数据
- Repello AI 企业威胁建模列出四类攻击面：
  1. 技能市场供应链投毒
  2. 通过检索上下文的记忆注入攻击
  3. 多 provider 适配器的凭证泄露面
  4. MCP server 信任边界
- 直接终端/文件访问运行在和宿主同一 OS 用户下——"always-on agent 不该一上来就给无限制的主机访问"

**核心张力**：能力和攻击面是同一件事的两面——记忆/技能库沉淀得越丰富，模型越"聪明"，攻击面也越大。这与 Slock 的"频道隔离上下文"设计选择了相反的方向（Hermes 选深度持久化，Slock 选隔离）。

---

## 来源

- [TechCrunch: Hermes agent maker Nous Research in talks for $1.5B valuation](https://techcrunch.com/2026/07/13/hermes-agent-maker-nous-research-in-talks-for-new-funding-at-1-5b-valuation/)
- [Hermes Agent 官方文档 - Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Hermes Agent 官方文档 - Memory](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)
- [MarkTechPost: /learn 命令发布](https://www.marktechpost.com/2026/06/24/nous-research-adds-learn-to-hermes-agents-skills-system-capturing-workflows-as-slash-commands-without-hand-writing-skill-md/)
- [Repello AI: Hermes Agent Security Threat Model](https://repello.ai/blog/hermes-agent-security)
- [Layer3Labs: Is Hermes Agent Safe for Business?](https://www.layer3labs.io/guides/is-hermes-agent-safe-for-business)
- [GitHub: NousResearch/hermes-agent Releases](https://github.com/NousResearch/hermes-agent/releases)
