---
title: AI-PM 速度文化（Cat Wu · Anthropic）
category: 行业洞察
tags: [产品经理, AI时代, 速度文化, Anthropic, 产品品味]
source: "[[raw/sdlc/Cat Wu 面试了几百个 PM 候选人，几乎没人答对一个问题：AI 产品经理到底应该干什么？.md]]"
updated: 2026-05-05
status: stable
---

## 定义
Cat Wu（Anthropic Claude Code & Cowork 产品负责人）在 Lenny's Podcast 揭示的 AI 原生 PM 模式：功能交付周期从 6 个月压缩到 1 天，核心能力不再是多季度路线图对齐，而是**缩短"有想法 → 用户拿到产品"的时间**；衡量 PM 价值的稀缺技能变为 **product taste（产品品味）**。

## 核心要点
- **速度文化机制**：三件事共同支撑"一天出一个功能"——①清晰定义核心用户和目标场景；②**research preview 机制**（明确声明早期实验、收集反馈、可能不永久支持），将发布门槛从"完美"降至"有价值"；③**evergreen launch room**（常设跨职能快速响应频道，文档/PMM/DevRel 直接入场，次日即可对外宣传）
- **PRD 的变体**：每周 metrics readout 替代季度规划；team principles 文档（核心用户是谁、做什么取舍）替代 PRD；只有特别模糊或重大基础设施项目才写一页纸 PRD
- **"恰好正确程度的 AGI 信仰"**：最难的技能——既不能太 AGI pilled（忽略当前模型边界）也不能太保守（下次模型升级措手不及）；识别信号：**用户如何突破现有产品的极限**，从中判断方向并灵活调整
- **角色融合**：Anthropic 选择大量招有 product taste 的工程师而非多招 PM；最高效模式是工程师自主从用户反馈到周末发布全链路，几乎不需要 PM；PM 价值收窄至：跨职能流水线搭建 + 定义核心任务开箱即用标准 + 产品品味判断
- **Claude 产品矩阵使用场景**：CLI（最全功能，代码任务优先）→ Desktop（前端开发+实时预览）→ Web/Mobile（随时启动）→ Cowork（非代码输出：文档/Slide/邮件，需先接入 Calendar/Slack/Gmail/Drive）
- **Claude 性格护城河**：低 ego（被纠错不辩解）+ 积极正面（无从下手时主动起步），被定义为"让人觉得能量好的同事"
- **路线图终点**：单任务成功率 → 多任务并行 → Agent 矩阵（50-100 个 Claude 并发）

## 与其他概念的关系
- [[wiki/行业洞察/AI时代PM物种替换|AI 时代 PM 物种替换]]：Cat Wu 的实践印证 Builder PM 的定义——有工程背景、亲手构建、缩短发布链路
- [[wiki/行业洞察/ADLC|ADLC]]：Anthropic evergreen launch room 是 ADLC 持续反馈循环在产品发布侧的具体实现
- [[wiki/应用开发/Claude-Code团队配置|Claude Code 团队配置]]：CLAUDE.md + Skills + Hooks 正是 Cat Wu 所说"搭建发布流水线"的工程层落地

## 参考来源
- [[raw/sdlc/Cat Wu 面试了几百个 PM 候选人，几乎没人答对一个问题：AI 产品经理到底应该干什么？.md|Cat Wu Lenny's Podcast 深度解读]]
