---
title: AI-Native 工程组织实践（Fiona Fung）
category: 行业洞察
tags: [工程组织, JIT规划, 代码审查分工, 角色变迁, dogfood, Claude Code]
source: "[[raw/engineering_roles/2026-06-03-running-an-ai-native-engineering-org]]"
updated: 2026-06-03
status: draft
aihot_origin:
  aihot_id: "aihot-daily:2026-06-03:技巧与观点:4"
  aihot_url: ""
  series: S3_roles
  drafted_by: aihot-pull
  drafted_at: 2026-06-03
---

## 定义

Claude Code/Cowork 工程总监 Fiona Fung 复盘：当智能体编程成为默认工作方式后，工程流程、团队结构与角色边界如何重构——瓶颈从"写代码"迁移到验证、审查与安全判断。

## 核心要点

- **规划转 JIT**：六个月路线图三个月即过时；改为原型 + 内部用户反馈 + 快速迭代，而非大量前期规划
- **上下文"先问 Claude"**：不再找原作者，直接向 Claude 提问；尽量自动化（如每早自动汇总客户反馈）
- **代码审查 Trust but Verify**：Claude 管风格/lint/查 bug/生成测试；人类专注法律审查、安全敏感代码、产品决策、设计品味
- **角色边界模糊**：PM 大量写代码、工程师做设计与内容；招聘看重"有产品感的创造者"+ "深系统专长工程师"；纯吞吐量不再关键（模型管量）
- **三条团队原则**：① 死磕 dogfood（全员每日用 Claude Code）② 团队扁平（经理先做 IC 理解工程现实）③ 杀掉过时流程（明确授权质疑/废除旧工作流）
- **三个度量**：onboarding 上手时长（首周交付真实代码）、PR 周期时长（暴露规模瓶颈）、Claude 辅助提交占比（已成默认，无辅助提交变罕见）

## 与其他概念的关系

- [[wiki/行业洞察/Anthropic-AI军队组织架构|Anthropic AI 军队组织架构]]：本文是该"AI 有机体"组织形态在工程团队层面的落地操作手册
- [[wiki/行业洞察/AI-PM速度文化|AI-PM 速度文化（Cat Wu）]]：JIT 规划 + research preview 与本文同一速度文化的不同切面
- [[wiki/行业洞察/AI编码已解决-Boris-Cherny观点|AI编码已解决（Boris Cherny）]]：瓶颈从写代码迁移到审查/集成的判断在此被组织流程证实
- [[wiki/行业洞察/ADLC|ADLC（智能体驱动开发生命周期）]]：本文的流程变革是 ADLC 6 大转变的真实组织样本
- [[wiki/应用开发/中间循环|中间循环]]：人类聚焦的"验证/审查/安全"正是新出现的监督性工程层

## 参考来源

- [[raw/engineering_roles/2026-06-03-running-an-ai-native-engineering-org|Running an AI-Native Engineering Org（Claude 官方 blog · Fiona Fung）]]
