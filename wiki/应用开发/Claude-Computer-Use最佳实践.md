---
title: Claude Computer Use 最佳实践
category: 应用开发
tags: [claude-computer-use, browser-use, claude-4.6, opus-4.7, screenshot-resolution, thinking-effort, prompt-injection]
source: "[[raw/agent_engineering/2026-05-14-Claude-computer-browser-use-best-practices]]"
updated: 2026-05-14
status: draft
aihot_origin:
  aihot_id: ""
  aihot_url: ""
  series: S4_agent
  drafted_by: aihot-daily-save
  drafted_at: 2026-05-14
---

## 定义
Anthropic 官方为 Claude 4.6 系列与 Opus 4.7 给出的电脑/浏览器使用工程参数手册。核心命题是 **点击准确性不是模型问题，是分辨率工程问题**——发图前如果不按 API 上限做缩放，模型看到的是降采样后的糊图，点击必然偏移；这是物理性的，不是 prompt 调出来的。

## 核心要点 · 截图分辨率（地基）
| 模型 | 起步分辨率 | API 长边上限 | 总像素上限 |
|------|-----------|-------------|-----------|
| Claude 4.6 系列 | 1280×720 | **1568 px** | **1.15 MP** |
| Opus 4.7 | 1080p | **2576 px** | **3.75 MP** |
| Haiku 4.5 | 延迟优先 | — | — |

> 超出上限会被 API 内部降采样——发图前自己缩好，是提升点击准确性最有效的一步。

## 核心要点 · 坐标回缩公式
```python
screen_x = int(api_returned_x * (screen_w / display_w))
screen_y = int(api_returned_y * (screen_h / display_h))
```
API 返回的是缩放后图上的坐标，必须用原始屏幕尺寸还原。

## 核心要点 · 工程细节四条
1. **文本指令放图前**——消息数组里 text 在 image 之前，点击准确性更高
2. **Thinking effort 默认值**：4.6 系列 **medium**（成功率接近 high，token 砍半）；Opus 4.7 **high**（推理空间换多步规划，token 不显著增加）
3. **密集 UI 开 zoom**：`{"enable_zoom": true}`
4. **Prompt injection 防御**：用 `computer_20251124` 官方工具时自带分类器——零额外延迟、零额外成本；高风险动作仍需 human-in-the-loop

## 核心要点 · 模型选型快速决策
- **Sonnet 4.6** → 重度降采样场景仍稳，机械执行精准
- **Opus 4.7** → 多步骤、强推理任务，点击与 Sonnet 4.6 持平
- **Haiku 4.5** → 延迟优先

## 与其他概念的关系
- [[wiki/应用开发/Claude-Managed-Agents|Claude Managed Agents]]：Managed Agents 的底层 action（点击/滚动/输入）必须在本条目参数下才能可靠落地
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：本条目是 harness 在"observation 设计"维度的官方参数——分辨率即 observation 保真度
- [[wiki/应用开发/Codex-安全治理四层架构|Codex 安全治理四层架构]]：computer_20251124 自带分类器是 Anthropic 版的"prompt injection 治理层"

## 参考来源
- [[raw/agent_engineering/2026-05-14-Claude-computer-browser-use-best-practices|Anthropic Blog · Computer & Browser Use Best Practices]]
