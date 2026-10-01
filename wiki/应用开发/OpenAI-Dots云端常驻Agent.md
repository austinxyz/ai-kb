---
title: OpenAI Dots：GPT-6 Astra驱动的云端常驻Agent
category: 应用开发
tags: [OpenAI, Dots, GPT-6-Astra, 云端Agent, computer-use, 常驻Agent, 多任务并行]
source: "[[raw/industry_insight/2026-10-01-OpenAI-Dots云端常驻Agent实测]]"
updated: 2026-10-01
status: draft
---

## 定义

OpenAI Dots 是 GPT-6 Astra 驱动的"work-first, always-on colleague"——拥有独立云端Linux电脑（含Blender/Godot等专业软件+4000多应用插件生态），对话结束后仍能后台自主推进任务，支持多任务真并行，区别于"对话结束即停止"的传统Agent。

## 核心要点

- **硬件/环境**：DL Linux云电脑，10GB内存/32GB硬盘，内置Chromium/Codex/Blender/Godot；可连4000+应用（Slack、Notion、Supabase等）
- **常驻后台**：对话结束后依然在云端继续推进任务，不是一次性问答
- **多任务真并行**：实测"Godot开发贪吃蛇"+"Blender建巨石阵"两个任务同时后台独立运行互不阻塞，最终并行产出
- **自主安装调用第三方工具**：能在云电脑上自己安装并操控Grok CLI/Codex CLI/Claude Code等第三方CLI完成综合开发
- **主动学习用户偏好**：自动分析用户历史GPT/Codex使用记录了解技术栈；空闲时主动自读已连接应用、记私密笔记
- **实测场景**：Godot游戏开发、Blender建模、Notion知识库检索+论文整理（筛出2026年新发QLoRA论文）、Supabase数据库操作、Cron定时任务
- **局限**：单一UP主实测，无官方信源交叉验证；非root权限；视频只测了基础场景

## 与其他概念的关系

- [[wiki/行业洞察/Claude自我设计-RSI起点|Claude自我设计：RSI起点]]：两者都在讨论"AI自主性"，但层次不同——RSI关心AI能否自主做AI研究/自我改进，Dots关心的是AI能否自主完成通用工作任务（开发/建模/检索）。Dots这类产品可以看作"Agent自主性连续谱"上比RSI更基础的一级坐标点：先有"能独立干活不用盯着"，再谈"能自己改进自己做研究"
- [[wiki/应用开发/企业Know-how存放谱系|企业 Know-how 存放谱系]]：Dots"自动分析用户历史使用记录了解偏好"+"空闲时主动自读已连接应用记私密笔记"，是该谱系②Harness/agent memory层的一个具体产品实现——不是外部RAG检索，是agent主动沉淀对用户偏好的理解，接近episodic/procedural memory范畴，值得跟踪这类"主动学习型常驻agent"是否成为企业Know-how捕获的新路径

## 参考来源

- [[raw/industry_insight/2026-10-01-OpenAI-Dots云端常驻Agent实测|OpenAI Dots：GPT-6 Astra驱动的云端常驻Agent实测, 2026-10-01]]
