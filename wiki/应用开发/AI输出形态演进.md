---
title: AI 输出形态演进
category: 应用开发
tags: [output-modality, html-output, multimodal, ui-as-intelligence, neural-video]
source: "[[raw/industry_insight/2026-05-12-AI输出形态从文本到神经视频]]"
updated: 2026-05-12
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S0_industry
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-13
---

## 定义
AI 系统的产出形态正沿"原始文本 → Markdown → HTML → 交互式神经视频/模拟"路径演进。核心论断是"信息的结构与呈现方式本身已经成为 AI 智能层的一部分"——同一份正确答案，不同形态的呈现等价于不同密度的智能。**人类偏好用音频输入，但视觉是更理想的 AI 输出**（大脑约 1/3 皮层专司视觉处理）。

## 核心要点
- **当下可施工技巧**：让 LLM 以 **HTML 格式输出**而非默认 Markdown——HTML 能给出更丰富的视觉布局 + 交互性，**信息密度跃升一级**
- **Markdown 是 lossy 的**：损失格式、布局、交互——把 Markdown 当默认是"用 1990 年代纯文本邮件思维使用 AI"
- **演进谱系**：原始文本 → Markdown → HTML → **交互式神经视频 / 模拟**
- **理论根据**：大脑 1/3 皮层专司视觉处理——人类偏好音频"输入"但**视觉是更理想的"输出"**
- **产业信号一致**：2026-05-13 日报上半区三条产品发布都在押这条线
  - 谷歌用 AI 重塑鼠标指针交互（@demishassabis）
  - Mira Murati 的 Thinking Machines 原生多模态"交互模型"（200ms 前台 + 后台推理双层架构）
  - Codex 计算机使用（跨应用后台工作）
- **二分模型**：早期 AI 竞争集中在"生成内容是否正确"，下一阶段竞争将集中在"内容如何承载/呈现"——**生成正确答案趋同后，竞争迁移到怎么把答案给人**
- **隐含产品判断**：纯文本 chat 接口的产品形态可能即将被"答案 + 动态 UI"替代；做 chat-only 的产品在 18-24 个月内会被边缘化

## 与其他概念的关系
- [[wiki/应用开发/AI-PPT工程化|AI PPT 工程化]]：把 PPT 视为"非 Markdown 的高密度输出"是本条目演进谱系的早期案例——SVG 单页 + gpt-image-2 是从 Markdown 跳到 HTML/SVG 的产品化路径。
- [[wiki/应用开发/Claude-Managed-Agents|Claude Managed Agents]]：docx +8.4% / pptx +10.1% 的改进恰恰发生在"非纯文本输出"上——验证了"输出形态承载智能"的命题。
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：harness 的 5 原则中"observation 设计"在这里有了新含义——agent 的输出形态本身是 observation 设计的一部分。
- [[wiki/应用开发/中间循环|中间循环]]：中间循环的人监督负担一部分可以转嫁到"更好的输出形态"上——更清晰的可视化 = 更低的监督成本。

## 参考来源
- [[raw/industry_insight/2026-05-12-AI输出形态从文本到神经视频|硅基流动原推 + aihot 延展]]
