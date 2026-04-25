# Compound Engineering（CE）

#concept #AI #AgenticAI #AIcoding

> 一句话定义：一套 AI 编码框架，核心理念是"每次开发都让下一次更容易"——通过多代理并行 review 和结构化知识沉淀，把每轮踩过的坑变成下一轮的自动参考。

---

## 核心原理

CE 解决的是 Vibe Coding 和 Spec-driven Development 都没完全解决的问题：**经验的跨会话复用**。AI 本身没有记忆，但 CE 通过 `/ce:compound` 命令在每轮结束后结构化提取经验，存入 `docs/solutions/`，下一轮 `plan` 阶段由 learnings-researcher 子代理自动检索引用。

```
开发 → review → compound（提取经验）→ 存储 → 下次 plan 自动引用
```

## 关键要素

- **多代理并行 review**：`/ce:review` 启动 12 个子代理，从安全、性能、架构、可维护性等维度同时审查代码
- **知识沉淀（/ce:compound）**：提取踩坑、模式、review 关键发现 → 结构化存入 `docs/solutions/`
- **与 Superpowers 的分工**：CE 是 Skill Pack 层（prompt 级建议，模型可不听）；Superpowers 是 Harness 层（hooks 强制执行，纪律性更强）
- **适用阶段**：技术 plan、代码 review、知识沉淀；不适合轻量任务（光安装就吃 36k token）

## 相关资料

- [[CE+Superpowers三模型实测]] — Opus 4.6 / Kimi K2.5 / GLM-5 完整实测，含知识沉淀跨轮复用的实际效果

## 关联概念

[[Model+Harness]] · [[Spec驱动开发]] · [[Vibe-Coding]]
