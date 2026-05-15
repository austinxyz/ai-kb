---
title: "Claude 电脑与浏览器使用的最佳实践（Anthropic 官方）"
slug: 2026-05-14-Claude-computer-browser-use-best-practices
fetched_at: 2026-05-14T08:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-14T00:00:00.000Z
aihot_tags: ["Claude Computer Use", "Browser Use", "Claude 4.6", "Opus 4.7", "Screenshot", "Thinking Budget", "Anthropic"]
aihot_starred: 0
aihot_summary: |
  Claude 官方为 4.6 系列与 Opus 4.7 给出电脑/浏览器使用的工程参数：分辨率（4.6 起步 1280x720，Opus 4.7 起步 1080p）、API 截图上限（4.6：长边 1568 / 1.15MP；Opus 4.7：长边 2576 / 3.75MP）、坐标缩放公式、文本指令放图前、模型选型（Sonnet 4.6 机械精准 / Opus 4.7 推理强 / Haiku 4.5 延迟低）、thinking effort（4.6 medium 甜点，Opus 4.7 high）、dense UI 开 enable_zoom、computer_20251124 工具自带 prompt injection 分类器零额外延迟。
aihot_recommendation_reason: |
  这是 Anthropic 官方第一次把 Computer Use 的工程参数（分辨率上限、缩放公式、thinking 默认值）一次性说清。任何在做 Claude 操作浏览器/电脑的 Agent 都必读 —— 不按这套参数走，点击偏移就是物理性的。
source_url: "https://claude.com/blog/best-practices-for-computer-and-browser-use-with-claude"
source_type: "blog_official"
content_source: "webfetch_anthropic_blog"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: ["S2_methodology"]
  confidence: "high"
wiki_status: drafted
wiki_target: "wiki/应用开发/Claude-Computer-Use最佳实践.md"
---

# Claude 电脑与浏览器使用的最佳实践

> Anthropic 官方 Blog · 2026-05-14 · 针对 Claude 4.6 系列和 Opus 4.7

## 截图分辨率（地基决定上限）

**起始推荐**
- Claude 4.6 系列：**1280×720**
- Opus 4.7：**1080p**

**API 内部上限（超出会被降采样 → 模型看到的是糊图 → 点击必偏）**

| 模型 | 长边上限 | 总像素上限 |
|------|---------|-----------|
| Claude 4.6 系列 | 1568 px | 1.15 MP |
| Opus 4.7 | 2576 px | 3.75 MP |

发图前先把截图缩到上限以内，是提升点击准确性最有效的一步。

## 坐标回缩公式

API 返回坐标是在它看到的缩放后图上的，要还原到屏幕坐标：

```python
screen_x = int(api_returned_x * (screen_w / display_w))
screen_y = int(api_returned_y * (screen_h / display_h))
```

## 内容顺序

消息数组里 **文本指令放在图片之前** —— 点击准确性更高。

## 模型选型

- **Sonnet 4.6**：机械执行精准，对重度降采样最鲁棒
- **Opus 4.7**：点击表现"大致追平 Sonnet 4.6"，但推理更强 → 多步骤任务首选
- **Haiku 4.5**：延迟优先时用

## Thinking Effort 默认值

- **Claude 4.6 系列**：**medium** 是甜点位 —— "接近 high 的成功率，但只用一半的 output token"
- **Opus 4.7**：**high** —— "给模型足够推理空间规划多步交互，token 用量并不显著增加"

## 密集 UI 处理

UI 元素小、密时启用 zoom：

```json
{"enable_zoom": true}
```

## Prompt Injection 防御

使用官方 `computer_20251124` 工具时自动启用内置分类器：
- **零额外延迟**
- **零额外费用**

高风险动作仍需 human-in-the-loop 二次确认。

## 来源

- 官方 Blog：https://claude.com/blog/best-practices-for-computer-and-browser-use-with-claude
- 收集渠道：aihot.virxact.com 2026-05-14 日报 · 技巧与观点 #4
