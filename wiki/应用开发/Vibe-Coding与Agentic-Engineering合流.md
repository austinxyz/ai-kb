---
title: Vibe Coding 与 Agentic Engineering 合流
category: 应用开发
tags: [Vibe-Coding, Agentic-Engineering, Simon-Willison, 信任边界, 软件评估]
source: "[[raw/dev_methodology/2026-05-06-vibe-coding-and-agentic-engineering-are-getting-closer-than-i-d-like]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmou5llmo00glslnd1jw5lh8r"
  aihot_url: ""
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
Simon Willison 在 Heavybit High Leverage Podcast Ep. #9 中坦承的反直觉观察：他自己原本严格区分的两种 AI 编程范式——"vibe coding"（不审代码、用了再说）与"agentic engineering"（专业工程师全程负责）——在自己的生产级开发里已经合流；他为生产级 API 用 Claude Code 写完代码后已经不再 review，只把 agent 当成"半黑箱团队"使用。

## 核心要点
- **原来的分野**：vibe coding 是"不看代码"——非程序员要个东西、给个东西，能用就用，不能用就再 prompt。Simon 此前主张：vibe coding 适合个人工具（bug 只伤自己）；给别人用的软件要走 agentic engineering，因为别人会被你的烂 bug 伤。
- **合流的诚实自白**：Simon 原话——"the problem is that as the coding agents get more reliable, I'm not reviewing every line of code that they write anymore, even for my production level stuff"。他知道让 Claude Code 写一个跑 SQL 输出 JSON 的 endpoint + 自动测试 + 文档"它就是会做对"，于是直接用，但有伦理负担：没 review 的代码上生产真的负责吗？
- **新心智模型——半黑箱团队**：Simon 把 agent 类比成大公司里别的团队交付的服务——"image resize service"，他不会读它每行代码，只会用文档调用、跑出 bug 再去 dig。问题是别的团队有职业声誉与问责，Claude Code 没有。
- **正常化偏差风险**：每次 agent 默默写对一次代码，下一次"在错误的时刻盲目信任"的概率就增加一点——Simon 引用 normalization of deviance 概念警告自己。
- **软件评估失效**：旧时代"100 commit + 漂亮 readme + 完整测试"是用心维护的信号；现在 30 分钟就能 spit out 长得一模一样的项目。Simon 现在最看重的信号是"作者真的用过这个东西连续两周"——vibe coded 但天天用 ＞ 看似精心但没人用。
- **整个 SDLC 重排**：从 200 行/天到 2000 行/天后，下游和上游都崩了。引 Jenny Wen（Anthropic 设计 leader）观点：旧 design process 假设"工程师花 3 个月做错就完蛋"，但当构建成本骤降 10× 后，design 流程也可以 riskier、更快试错。
- **职业不焦虑的理由**：与 agent 的对话对绝大多数人是"moon language"；这些工具是"existing experience 的 amplifier"。Simon 引 Matthew Yglesias："I don't want to vibecode—I want professionally managed software companies to use AI coding assistance to make better/cheaper software products"——也承认 enterprise 不会信任没被两家大客户跑过 6 个月的 CRM。

## 与其他概念的关系
- [[wiki/应用开发/AI-Agent-PR审查|AI Agent PR 审查]]：本文是"我也不 review 了"的诚实自白，AI Agent PR 审查是"还要 review"的操作清单——一对镜像。
- [[wiki/应用开发/AI时代工程严谨性|AI 时代工程严谨性]]：合流暴露的正是工程纪律未能跟上工具能力的速度。
- [[wiki/应用开发/中间循环|中间循环]]：信任的让渡发生在中间循环——agent 产出与人类放行之间的监督层。
- [[wiki/行业洞察/认知债务|认知债务]]：不 review 即合并的代码以及"看似精心维护"的视觉欺骗，都是认知债务的复利源头。

## 参考来源
- [[raw/dev_methodology/2026-05-06-vibe-coding-and-agentic-engineering-are-getting-closer-than-i-d-like|Vibe coding and agentic engineering are getting closer than I'd like]]
