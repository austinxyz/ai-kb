---
title: AutoResearch 软件开发移植
category: 应用开发
tags: [AutoResearch, 多Agent, 自动化开发, 代码质量, 反馈驱动迭代]
source: "[[raw/sdlc/我把 Karpathy 的 AutoResearch 搬到了软件开发领域，效果炸了.md]]"
updated: 2026-05-05
status: stable
---

## 定义
将 Karpathy 的 ML AutoResearch 循环（`program.md` 规则 + 单 GPU 跑实验 + val loss 改善才 commit + 否则 git revert）迁移到软件开发领域，核心改进：**多 Agent 交叉审核**（Codex/Claude 轮流实现+审核）+ **5 维度量化评分**（≥9.0 才合并）+ **反馈驱动下一轮**（上轮审核结论传入下轮 prompt）；实测 10 分钟完成中等复杂 Issue，全程零人工干预。

## 核心要点
- **三大改进 vs 原版**：
  - 原版单 Agent 自审 → **多 Agent 交叉审核**：A 实现 B 审，B 实现 A 审，不同模型盲区不同
  - val loss 单一 metric → **5 维度加权评分**：正确性 35% + 测试 25% + 代码质量 20% + 安全 10% + 性能 10%，≥9.0 通过
  - 每轮独立上下文 → **反馈驱动**：审核具体问题传入下一轮 Agent prompt，针对性改进而非盲目重试
- **四阶段工作流**：
  1. Phase 1（环境准备，秒级）：读取 program.md、获取 Issue、创建 branch
  2. Phase 2（核心迭代，全自动）：Codex/Claude 轮流实现→测试→审核→评分→反馈循环
  3. Phase 3（达标后）：自动 commit + PR + merge
  4. Phase 4（归档）：写入 results.tsv 和 log.md
- **Issue 选择策略**：排除 wontfix/duplicate/blocked/已有 PR；优先级 = 基础权重(15) + 标签权重(critical 100 > high 50 > medium 20) + 类型权重(bug 30 > feature 20) + 时间因子（陈年 +15）
- **终止条件**：评分 ≥9.0 自动 PR；连续失败 ≥3 次停止；超过最大迭代次数（默认 42 轮）
- **program.md 的作用**：Agent 权限边界 + 代码规范 + 测试规范，是系统所有行为的约束来源；是"给 Agent 的团队章程"
- **与类似项目对比**：
  - Ralph Wiggum（`while true; do cat PROMPT.md | claude; done`）：单 Agent 自循环，无外部审核视角
  - Karpathy AutoResearch：ML 场景，val loss 客观，可全自主；git revert 硬性保护
  - 达尔文.skill：Skill 优化，需人工确认；8 维评分
  - 本项目：软件开发，多 Agent 软性保护，保留关键节点人工介入能力

## 与其他概念的关系
- [[wiki/应用开发/LLM-Wiki-Pattern|LLM Wiki Pattern]]：AutoResearch 的 log.md 和 program.md 与 LLM Wiki 的 log.md 和 AGENTS.md 同构——都是"给 Agent 的规则 + 操作记录"的持久化配对
- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：program.md 是 SPDD 中"把 prompt 当一等交付制品"的典型实例
- [[wiki/行业洞察/ADLC|ADLC]]：AutoResearch 闭环是 ADLC 持续反馈、自主执行的具体实现

## 参考来源
- [[raw/sdlc/我把 Karpathy 的 AutoResearch 搬到了软件开发领域，效果炸了.md|AutoResearch 软件开发移植 - 实战案例]]
