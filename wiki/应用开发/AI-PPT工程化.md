---
title: AI PPT 工程化
category: 应用开发
tags: [PPT, SVG, gpt-image-2, 工程化, 演示文稿]
source: "[[raw/ai_usage/gpt-image-2发布后，PPT最强skill.md]]"
updated: 2026-05-05
status: stable
---

## 定义
AI 生成 PPT 从"一键生成"向**工程化流水线**演进的方法论：核心不是单次生成能力，而是把 PPT 拆解为可审核、可单页迭代、可自动写备注、最终交付 `.pptx` 的**10 步可控流程**；SVG 方案和 gpt-image-2 pipeline 是当前两条主流路径。

## 核心要点
- **SVG 方案（轻量单页）**：将现有 PPT 页面截图发给多模态模型，让其描述布局/色块/文字位置关系，再用专业 SVG prompt 生成整页 SVG 代码，在 DeepSeek 等平台运行预览；解决排版构图时间（从 30 分钟→几十秒），后续对照 SVG 在 PPT 中微调即可；SVG 优于直接生成 PPT 的原因：精确控制坐标/颜色/层级，与模型擅长的结构化输出天然匹配
- **gpt-image-2 十步 pipeline（工程化全套）**：
  1. 输入资料（主题/Word/PPT/品牌图）
  2. 内容分析 → `analysis.md`（类型/受众/风格/页数）
  3. 方案确认（风格/页数/审核流程）
  4. 生成大纲 → `outline.md`（每页：标题+类型+叙事目标+关键内容+视觉方案+版式）
  5. 审核大纲（删冗余/调顺序/补商业闭环）
  6. 为每页生成独立 prompt → `prompts/NN-slide-xxx.md`
  7. gpt-image-2 批量生成整页图片（主通道连失 3 次才 fallback）
  8. 生成演讲人备注 → `speaker-notes.md`（中文口述稿，解释+价值+衔接）
  9. 合成为 PPTX（图片铺满 + 备注写入 PowerPoint 备注区）
  10. 单页迭代（改 prompt 重生单页/改备注/增删页面）
- **"直接让 AI 做 PPT"的根本问题**：一口气生成导致逻辑散/风格漂移/无法单页改；工程化方案把所有中间产物显式化（逻辑可控/视觉可控/结果可控/备注可控/迭代可控/交付可控）
- **实战优先级**：先把大纲做对 → 再把 prompt 做稳 → 批量生成第一版 → 挑 2-3 页重点改 → 最后合成 PPTX；结构决定质量，视觉其次，微调最后
- **三顿（sandun.cc）端到端工具**：自动跑"需求调研→资料搜集→大纲策划→生成策划稿→生成设计稿"全流程，内置固定提示词框架

## 与其他概念的关系
- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：gpt-image-2 pipeline 的 10 步流程是 SPDD "把 prompt 当一等交付制品"在创意工作中的应用——每页独立 prompt 文件是可版本控制的交付物
- [[wiki/应用开发/AutoResearch软件开发|AutoResearch 软件开发]]：PPT 的单页迭代（改 prompt → 重生 → merge）与 AutoResearch 的"只保留改进"循环同构

## 参考来源
- [[raw/ai_usage/gpt-image-2发布后，PPT最强skill.md|gpt-image-2 PPT 最强 skill - 工程化流水线]]
- [[raw/ai_usage/分享一个用AI写PPT的技巧.md|AI 写 PPT 技巧 - SVG 方案]]
