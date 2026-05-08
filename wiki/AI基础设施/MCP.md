---
title: MCP（模型上下文协议）
category: AI基础设施
tags: [MCP, 协议标准, Agent, 工具集成, 互操作性]
source: "[[raw/sdlc/Agent Architecture.md]]"
updated: 2026-05-05
status: stable
---

## 定义
MCP（Model Context Protocol）是 AI Agent 接入外部工具的通用标准协议，取代每个工具都需要定制集成代码的旧模式；2025 年被 OpenAI、Google、Microsoft 全部采用并捐赠给 Linux 基金会，成为行业事实标准。

## 核心要点
- **旧模式的问题**：每新增一个工具 = 从头编写一套定制集成代码，无法复用
- **MCP 工作流**：
  1. 查询进入 MCP Client
  2. Client 选择正确的 MCP Server
  3. LLM 路由请求至目标 Server
  4. Server 执行并响应
  5. 结果通过统一协议返回
- **标准化里程碑**：2025 年 OpenAI、Google、Microsoft 全部采用；捐赠给 Linux 基金会；月均 SDK 下载量超 9700 万
- **适用场景**：Agent 需要接入外部工具（数据库、API、文件系统等），不想为每个工具重建集成

## 与其他概念的关系
- [[wiki/应用开发/Agentic-RAG|Agentic RAG]]：Agentic RAG 的动态检索可通过 MCP 统一管理外部数据源
- [[wiki/行业洞察/ADLC|ADLC]]：ADLC 中 Agent 跨工具自主执行依赖 MCP 的标准化连接
- [[wiki/AI基础设施/什么是AI原生基础设施|AI 原生基础设施]]：MCP 是 AI 原生基础设施工具层的核心互操作组件

## 参考来源
- [[raw/sdlc/Agent Architecture.md|Agent Architecture - LinkedIn 2026]]
