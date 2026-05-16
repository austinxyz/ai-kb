---
title: AI助手身份层（USER.md / MEMORY.md / SOUL.md）
category: 应用开发
tags: [AI助手, 身份持久化, 提示工程, SOUL.md]
source: "[[raw/dev_methodology/2026-05-02-http-x-com-i-article-2050590821553258496]]"
updated: 2026-05-16
status: draft
aihot_origin:
  aihot_id: "cmoohl3wl0odvsll93vi0ewky"
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

通过 USER.md、MEMORY.md、SOUL.md 等文本文件构建的可迁移 AI 助手"身份层"，使助手的记忆、性格与协作关系独立于底层模型供应商，即使更换模型引擎核心身份依然延续。

## 核心要点

- **问题根源**：更换底层模型（如 Claude → GPT）后助手风格突变，失去长期协作的熟悉感
- **五层身份结构**：USER.md（用户信息）→ MEMORY.md（历史记忆）→ SOUL.md（性格/价值观）→ 工具习惯 → 关系定位
- **SOUL.md 是核心**：记录助手的语言风格、思维偏好、反应模式，是"性格"的载体
- **可迁移性**：所有文件为纯文本，换模型时直接注入新模型上下文，身份立即恢复
- **实践意义**：真正的"个人 AI"不依赖某家模型，而依赖这套身份描述文件

## 与其他概念的关系

- [[wiki/应用开发/Harper-Reed-LLM-Codegen-Workflow|Harper Reed LLM Codegen Workflow]]：Harper Reed 的 CONTEXT.md 是同类思路——用文件将上下文固化，AI 助手身份层是其扩展到"性格层"的进一步延伸
- [[wiki/应用开发/Boris-Cherny-AI编码工作流|Boris Cherny AI编码工作流]]：Boris 维护单一知识库文件记录 Claude 错误，是简化版记忆层实践

## 参考来源

- [[raw/dev_methodology/2026-05-02-http-x-com-i-article-2050590821553258496|AI助手身份层 SOUL.md, 2026-05-02]]
