---
title: 企业级 RAG 架构
category: 应用开发
tags: [RAG, 企业知识库, LLM-Wiki, 知识图谱, 受控schema]
source: "[[raw/applications/Karpathy的LLM Wiki + 3.5 万Star的Graphify：企业级 RAG 缺的真是知识图谱？.md]]"
updated: 2026-05-05
status: stable
---

## 定义
企业级 RAG 与个人知识库的最佳实践存在本质差异：个人知识库适合 LLM Wiki 的自由预编译风格，企业知识库真正缺的不是酷炫工具，而是**受控 schema、结构化字段、条款级原文引用、权限边界和可复跑评测**；知识图谱（如 Graphify）在代码场景有结构兜底，在业务文档场景必须辅以业务 schema 才能可靠。

## 核心要点
- **LLM Wiki 对企业的价值**：知识预编译思路值得借鉴——ingest 时先生成 source summary / entity page / synthesis page，高频复杂问题提前整理成综合页，避免每次查询从零开始推理；但不能原样当生产方案（引用颗粒度不够细、无权限/审计机制、结构可控性依赖 AGENTS.md 质量）
- **Graphify 的定位**：代码场景中利用 tree-sitter 抽取显式调用关系，输出 graph.html / graph.json / GRAPH_REPORT.md，适合做**代码库摸底工具**；71.5x token reduction 是上下文节省而非准确率提升；文档场景关系高度业务化，不能靠自动抽取
- **三方案实测对比**（30 份合同 × 48 题）：

  | 方案 | 测试范围 | 答案准确率 | 核心问题 |
  |------|---------|-----------|---------|
  | 基础向量 RAG | 30 份合同 24 题 | 25% | 跨合同/全局统计/主补关系不稳 |
  | LLM Wiki | 5 份 demo 10 题 | 100% | 不是全量生产方案 |
  | 受控 schema + 关系表 | 30 份合同 24 题 | 100% | 需要维护 schema 和结构化表 |

- **五层企业知识库架构**：
  1. 文件解析（Word/PDF/扫描件，保留页码/标题/表格位置）
  2. 结构化字段抽取（合同编号/客户/金额/日期/质保期，入 SQLite）
  3. 条款索引 + 受控图谱（条款级 chunk + metadata + schema 关系，关系必须有来源）
  4. 问答层（权限过滤→条件筛选→混合检索→答案生成，答案引用原文）
  5. 评测与审计（测试集/引用检查/权限检查/人工复核，结果反推系统问题）
- **企业版 LLM Wiki 降维用法**：只把高频复杂问题提前整理成综合页（有来源 + 有结构化字段回链），不是全量编译；原文合同/字段/风险事件变更后综合页需重新生成
- **四个工程障碍**：成本（合同越多预编译成本越高）、可控性（关系必须按 schema 抽取）、权限（客户/部门/角色边界）、合规审计（答案必须能回原文条款）

## 与其他概念的关系
- [[wiki/应用开发/LLM-Wiki-Pattern|LLM Wiki Pattern]]：Karpathy 个人知识库模式，企业级需在此基础上增加受控 schema 和审计层
- [[wiki/应用开发/Agentic-RAG|Agentic RAG]]：Agentic RAG 的自主检索循环可在五层架构的问答层中应用
- [[wiki/应用开发/Agent-Memory统一框架|Agent Memory 统一框架]]：企业知识库的综合页 / synthesis page 本质是 Agent Memory 的持久化知识层

## 参考来源
- [[raw/applications/Karpathy的LLM Wiki + 3.5 万Star的Graphify：企业级 RAG 缺的真是知识图谱？.md|LLM Wiki + Graphify 企业级实测]]
