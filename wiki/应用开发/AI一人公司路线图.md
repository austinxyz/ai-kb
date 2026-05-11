---
title: AI 一人公司路线图
category: 应用开发
tags: [agent, solopreneur, mcp, business-model, prompt-engineering]
source: "[[raw/agent_engineering/2026-05-10-AI一人公司月入7万路线图]]"
updated: 2026-05-10
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-10
---

## 定义
阿易 AI Notes 基于 Dario Amodei "首个十亿美元一人公司即将出现" 预测，给出的普通人版本可执行路线图：用 AI Agent 在 7 个月内达到 10K MRR（月入约 7 万人民币）的 5 步方法 + 3 个反模式。核心命题——AI 一人公司不是"一个人成超人"，而是"AI 让原本需要团队协作的流程，变成一个人可以调度的系统"。

## 核心要点
- **第 1 步：选具体可重复任务**——不做通用 Agent。找你熟悉行业里最无聊、最繁琐、但**有人愿意付钱**的小事。判据是"窄、重复、有付费意愿"，三者缺一不可。
- **第 2 步：系统提示词写成岗位 JD**——不写"帮我写文案"，要写"你是 5 年经验的电商客服，负责回复亚马逊邮件，语气友好，解决率 95%"。把 AI 当员工，prompt 是 JD 不是 query。
- **第 3 步：接 MCP 工具链端到端**——让 Agent 真正能操作 Slack、邮箱、Google Drive、GitHub；不用人插手就完成整个工作流。这一步是从"prompt-based 试玩"到"production-grade 自动化"的分水岭。
- **第 4 步：迭代 10 次优化提示词**——失败不是 bug，是优化燃料。把每次失败归因到 prompt 而非 AI，逐步把"员工"训练得更聪明。
- **第 5 步：定时运行 + 撒手不管**——AI 工作 24 小时，创始人每周花 2 小时检查异常 + 收钱。真正的一人公司不是你每天工作 16 小时。
- **失败模式 1 · 构建容易分发难**：找 100 个付费用户比写 100 行 Agent 代码难得多。@BTCxiaoyu1 实证："抖音 8000 粉跑 AI cron 半年，生产成本压到几乎 0，但月付费愿意掏钱的真难找。"
- **失败模式 2 · 边缘 case 永远存在**：退款、合同纠纷、愤怒邮件——必须保留"人工兜底通道"，不要试图让 Agent 解决长尾。
- **失败模式 3 · 完美主义**：能用 80 分的 AI 解决问题就不等 100 分；过早追求完美导致永远不上线。
- **真正的能力栈是系统调度而非工具会用**（@peter131415 评论补充）：找付费痛点、流程拆解、让 AI 稳定交付——这三项才是 AI 一人公司的核心能力，不是"会多少工具"。

## 与其他概念的关系
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：5 步路线图本质是 harness engineering 的商业化变种——MCP 工具链是 action space、迭代提示词是 prompt-design、定时运行 + 异常检查是 observation + escape hatch。
- [[wiki/AI基础设施/MCP|MCP（模型上下文协议）]]：第 3 步明确要求接 MCP 工具链才能跨越"试玩"到"生产"的门槛——这是 MCP 在小微商业场景的最直接价值定位。
- [[wiki/应用开发/Claude-Code团队配置|Claude Code 团队配置]]：一人公司是极限版的"团队 AI 基础设施"——团队配置的 CLAUDE.md / Skills / Hooks 在一人公司里塌缩成"一份 system prompt + MCP 工具链 + 定时任务"。
- [[wiki/应用开发/中间循环|中间循环]]：第 5 步的"每周 2 小时检查异常"就是中间循环——一人公司创始人是中间循环的唯一操作员。
- [[wiki/行业洞察/AI团队弹性与利用率|AI 团队弹性与利用率]]：Tomer Tunguz 提示"3 人管 20 agent 走 1 人 = 33% 机构记忆损失"——一人公司天生就是 1 人 + N agent 的极端形态，机构记忆完全依赖创始人的笔记和 system prompt 版本。

## 参考来源
- [[raw/agent_engineering/2026-05-10-AI一人公司月入7万路线图|阿易 AI Notes 原推 + 社区评论]]
