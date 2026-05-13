---
title: Claude Opus 4.7 Fast Mode
category: 模型与技术
tags: [claude, opus, fast-mode, anthropic, agent-latency, calibration]
source: "[[raw/models/2026-05-12-Claude-Opus-4.7-Fast-Mode-research-preview]]"
updated: 2026-05-12
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S0_industry
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-13
---

## 定义
Anthropic 在 2026-05-12 通过 API 和 Claude Code 同步开放 Claude Opus 4.7 Fast Mode 的 research preview。Fast Mode 是 Opus 系列在标准模型之上提供的低延迟变体——4.6 时代已被实践验证能显著改善 agentic workflow 的 QoL（@chronocat88：延迟下降直接决定"什么任务可以放进 loop"）。最值得关注的不是 token/s，而是"calibration-under-load"——@jatingargiitk 一针见血指出：speed 是 setting，**calibrated-under-load 才是 product decision**；GPT 类一年前就 fast 了，失败模式从来不是延迟，是 confidently wrong outputs at high tps。

## 核心要点
- **可用渠道**：API + Claude Code（**同步开放**，无需等待单独 release）
- **状态**：**research preview**——不保证稳定，可能有 calibration regression 或输出风格漂移；**生产 workflow 不建议立刻切**
- **价格悬念尚未解决**：Opus 4.6 fast mode 为 **6× base price**，4.7 是否延续——社区 @RobertDMellish / @plunderstruck 两次提问，Anthropic 未公开答复
- **关键判据不是速度而是 calibration**：在 agent loop 里使用时，要监测的是 "**是否变得自信地胡说**"，而不是"快了几倍"
- **典型失败模式不是延迟**：GPT-class 早已 fast，问题从未是 latency，**始终是 high tps 下的 confidently wrong outputs**
- **Opus 4.6 时代用户实证（@chronocat88）**：fast mode 是 agentic workflow 的最大 QoL 升级——延迟下降直接决定"什么任务可以放进 loop"；4.7 fast mode 在已验证方向上继续推
- **使用方式**：本知识库当前对话用的就是这个模型，Claude Code 中可通过 `/fast` 切换
- **下一个待观察的事**：Anthropic 官方文档何时贴出 fast vs base 的 quality regression 数据；社区独立测评结果

## 与其他概念的关系
- [[wiki/应用开发/Prompt-Caching工程|Prompt Caching 工程]]：Claude Code 团队复盘强调"切模型废缓存"——Fast Mode 与标准 Opus 是不同的缓存键，切换会失效；启用 fast 时要重做缓存策略
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：calibration-under-load 本质是 harness 中 observation 设计的另一面——快了的 agent 必须配相应的 validation 强度才能在 harness 里稳定产出
- [[wiki/行业洞察/AI急诊诊断超越医生|AI 急诊诊断超越医生]]：在 high-stakes 场景下，calibration regression 就是人命——fast mode 是否 safe-to-use 不只是技术问题
- [[wiki/应用开发/AI Agent PR审查|AI Agent PR 审查]]：fast 模式下"自信但错"是 5 红旗里的"幻觉正确性"加倍——审查强度要相应提升

## 参考来源
- [[raw/models/2026-05-12-Claude-Opus-4.7-Fast-Mode-research-preview|Claude Devs 原推 + 社区评论延展]]
