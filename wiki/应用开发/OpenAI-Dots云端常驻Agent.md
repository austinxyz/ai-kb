---
title: OpenAI Dots：GPT-6 Astra驱动的云端常驻Agent
category: 应用开发
tags: [OpenAI, Dots, GPT-6-Astra, 云端Agent, computer-use, 常驻Agent, 多任务并行, Muse, DevDay, Context权, Action权]
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

**第二信源补充——DevDay战略布局与Dot vs Muse对比**：

- **DevDay整体逻辑**：本次7个发布（Dot/Judge API/GPT-6.1/Codex Cloud/Shared Workspaces/Plugins等）都围绕Dot展开，核心是把ChatGPT从聊天框升维成7×24托管的AI操作系统；闭环逻辑是"模型做推理大脑→Dot常驻调用云端工具执行→成果沉淀到Shared Space"
- **Dot vs Muse（Meta）对比**：Muse定位大众消费品（C端查询消费，1500+连接器，硬件生态成熟如蓝牙/智能眼镜），短板是处理不了复杂生产环境交互；Dot定位高质量生产执行系统（B端重度场景，Harness框架能力强，安全边界稳定），短板是语音延迟、连接器不够顺滑、缺乏成熟C端变现生态。实测对比：配置飞书API密钥任务中，**Muse提示无法配置，Dot成功完成跨系统CLI密钥配置**——是具体可验证的能力差距案例
- **三层核心权利分析框架**（可复用于分析其他Agent产品布局）：Context权（锁定用户长记忆/历史偏好，提高迁移成本）、Action权（代用户执行操作的资格）、Transaction权（流量入口+商业闭环）
- **"中立生态位"判断**：对比国内大厂绑定自家APP（阿里绑淘宝/腾讯绑微信）或亚马逊封杀Muse购物Action，OpenAI作为纯AI原生公司能更自由跨平台连接第三方应用

## 与其他概念的关系

- [[wiki/行业洞察/Claude自我设计-RSI起点|Claude自我设计：RSI起点]]：两者都在讨论"AI自主性"，但层次不同——RSI关心AI能否自主做AI研究/自我改进，Dots关心的是AI能否自主完成通用工作任务（开发/建模/检索）。Dots这类产品可以看作"Agent自主性连续谱"上比RSI更基础的一级坐标点：先有"能独立干活不用盯着"，再谈"能自己改进自己做研究"
- [[wiki/应用开发/企业Know-how存放谱系|企业 Know-how 存放谱系]]：Dots"自动分析用户历史使用记录了解偏好"+"空闲时主动自读已连接应用记私密笔记"，是该谱系②Harness/agent memory层的一个具体产品实现——不是外部RAG检索，是agent主动沉淀对用户偏好的理解，接近episodic/procedural memory范畴，值得跟踪这类"主动学习型常驻agent"是否成为企业Know-how捕获的新路径
- [[wiki/应用开发/Omarchy4-OS级Agent入口|Omarchy 4：把Agent提升为操作系统级一等公民]]：两者都在抢"默认Agent入口"这个位置，路线相反——Dots是云端托管常驻，Omarchy是本地OS级提升Agent地位；Omarchy在Action权（代执行操作的资格）上给出了操作系统层面的实现路径，与Dots的云端路径形成对照
- [[wiki/应用开发/荣耀MagicOS11-YOYO-Harness商用落地|荣耀MagicOS 11：行业首个系统级Agent Harness商用落地]]：三方共同构成"抢占默认Agent入口"的三条路线（云端托管/本地Linux OS/手机OS），荣耀的"意图驱动替代点击驱动"与Dots的Context/Action权框架是同一命题在不同终端形态上的平行发展

## 参考来源

- [[raw/industry_insight/2026-10-01-OpenAI-Dots云端常驻Agent实测|OpenAI Dots：GPT-6 Astra驱动的云端常驻Agent实测, 2026-10-01]]
- [[raw/industry_insight/2026-10-01-Dot-vs-Muse-OpenAI-DevDay战略布局|实测Dot后，才看懂OpenAI这次DevDay的布局：Dot vs Muse, 2026-10-01]]
