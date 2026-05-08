---
title: ADLC（智能体驱动开发生命周期）
category: 行业洞察
tags: [ADLC, SDLC, Agentic, 软件工程, 开发流程]
source: "[[raw/sdlc/ADLC.md]]"
updated: 2026-05-05
status: stable
---

## 定义
ADLC（Agent Development Lifecycle）是以 AI Agent 替代人工驱动软件开发全生命周期各阶段的新范式，与传统 SDLC 的核心区别在于：并行执行、动态目标、持续反馈回路。

## 核心要点
- **驱动力**：人工手动执行 → Agent 自主跨阶段执行
- **规划**：固定锁定范围 → 目标和 PRD 随 Agent 学习动态演进
- **开发速度**：顺序交接 → 多个子 Agent 并行处理独立任务
- **测试**：设计后的独立阶段 → Agent 在编码全程持续运行测试
- **适应性**：中途变更破坏全局 → Agent 实时重新规划自我修正
- **反馈循环**：项目末复盘 → Agent 监控线上性能并主动检测异常

实证案例：Rakuten 让 Claude Code 在 7 小时内自主完成跨 1250 万行代码的复杂实现；Wiz、CRED 等团队执行速度翻倍。

采用 ADLC 的 5 条入门最佳实践：
1. 从测试阶段开始自动化（风险最低、回报最高的切入点）
2. 学会为 Agent 编写清晰的 PRD 和 Skills
3. 引入并行子 Agent，把大任务拆成 3 个并行工作流
4. 改变 review 习惯——停止逐行 review，转向审查结果和边缘案例
5. 在循环中内置反馈——设置 live 监控让 Agent 先于你发现漂移

## 与其他概念的关系
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：ADLC 中让 Agent 在真实系统可靠产出的工程框架
- [[wiki/应用开发/中间循环|中间循环]]：ADLC 中人类监督层的具体体现
- [[wiki/行业洞察/软件工程的未来-ThoughtWorks-2026|软件工程的未来（ThoughtWorks 2026）]]：同主题的宏观洞察
- [[wiki/AI基础设施/MCP|MCP]]：ADLC 中 Agent 接入外部工具的标准协议

## 参考来源
- [[raw/sdlc/ADLC.md|ADLC - LinkedIn（Rakesh Gohel）]]
