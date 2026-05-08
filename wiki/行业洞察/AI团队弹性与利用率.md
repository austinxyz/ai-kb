---
title: AI 团队弹性与利用率
category: 行业洞察
tags: [团队结构, AI/人力比, 韧性, Tomer-Tunguz, Operations-Research]
source: "[[raw/engineering_roles/2026-05-05-when-everyone-is-a-key-person-in-your-company]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmot09eed01arslv7otdp0vv3"
  aihot_url: ""
  series: S3_roles
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
风险投资人 Tomer Tunguz 用制造业运筹学的 70–90% 利用率法则警示初创公司：随 AI/人力比上升、团队规模收缩，单人离职带来的"机构记忆"损失非线性放大；选择 AI 比例的核心权衡变量是 resiliency 而非 throughput。两篇同主题文章（*When Everyone Is a Key Person in Your Company* 与 *Optimizing Software Factories*）同日发出，互为镜像。

## 核心要点
- **韧性数学**：20 人工程团队走 1 人是 5% headcount 损失，剩 19 人吸收工作；3 人管 20 个 autonomous agent 团队走 1 人是 33% 损失——agent 不会 resign，但"训练 / prompt / 校验 / 调试 agent fleet"的 institutional memory 随人走光。
- **三种配比模型**：① **10/90**（10% AI、90% labor）：典型中期 startup 工程预算 ≈ 20 个工程师 + Copilot/Cursor/inference 一层，传统 hierarchy，人类 code review 是瓶颈，org chart 熟悉。② **50/50**：同预算只能养 12 工程师 + agent fleet，工程师转 solution architect / problem decomposer / prompt designer，manager span of control 拓宽（agent 不需要 standup）。③ **90/10**：3 个工程师居中操控自主 agent 星座，做 generate / review / test / deploy / monitor / optimize；no managers, no hierarchy, no redundancy。
- **制造业类比**：工厂经验法则是跑 70–90% utilization；100% 时一次故障级联到 missed deadline / burned team / lost customer。"slack 不是浪费，是让系统稳健的 feature。"工程团队不是工厂，但同一逻辑成立——3 人扛 agent 编排即等同 100% 利用率。
- **核心权衡**：AI/labor ratio 决策的本质不是 throughput 而是 resiliency。
- **现阶段建议**：大多数初创公司不应过早押注 90/10 模式——没有冗余、没有缓冲、关键人离职即组织失忆。
- **同主题双篇**：*When Everyone Is a Key Person* 用人事损失叙事；*Optimizing Software Factories* 用工厂运筹叙事，论点一致——后篇结论"Most startups should not make that bet yet"。

## 与其他概念的关系
- [[wiki/行业洞察/ADLC|ADLC（智能体驱动开发生命周期）]]：ADLC 描述了 agent 接管后工作流如何转变；本条目补上"接管之后团队结构的弹性约束"。
- [[wiki/行业洞察/AI时代PM物种替换|AI 时代 PM 物种替换]]：同样在讨论 AI 时代角色与人数重新分配，本条目聚焦工程团队的人数与冗余维度。
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：harness 把单个 agent 工程化；团队层面还需要弹性策略避免编排知识单点故障。

## 参考来源
- [[raw/engineering_roles/2026-05-05-when-everyone-is-a-key-person-in-your-company|When Everyone Is a Key Person in Your Company]]
- [[raw/engineering_roles/2026-05-05-optimizing-software-factories|Optimizing Software Factories]]
