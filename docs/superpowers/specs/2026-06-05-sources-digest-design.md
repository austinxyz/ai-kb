# Sources Digest — 设计 spec

**日期**：2026-06-05
**状态**：approved（待用户复核）
**关联**：`raw/_sources.md`（人读源清单）、`scripts/aihot-daily.mjs`（现有日报）、aihot 远程 routine（`trig_01F4aVETEiPucA7LJz8atGo6`）

---

## 目标

对 `raw/_sources.md` 列的 AI 博客/官博源，每天拉新文章生成 digest，**并进现有 aihot 日报的同一个 Notion 子页**，每天随 aihot routine 自动运行。

深度：**标题 + 一句话摘要**（RSS description；不抓正文）。

---

## 架构（方案 A：解耦双脚本）

- `scripts/aihot-daily.mjs` **不改动**。
- 新增 `scripts/sources-digest.mjs` 独立产出"源博客新文" markdown。
- 远程 routine 依次跑两脚本 → agent 合并进同一个 `AI 日报 YYYY-MM-DD` Notion 子页。

理由：解耦，互不影响；源脚本可单独本地测；aihot（API 抓取）与源（RSS+scrape）两套逻辑分离，符合单一职责。

---

## 组件

### 1. 配置 `scripts/sources-feeds.json`

机器可读源清单（与人读的 `raw/_sources.md` 分开维护）。每条：

```json
{
  "name": "Andrej Karpathy",
  "type": "rss",
  "feedUrl": "https://karpathy.bearblog.dev/feed/"
}
```

scrape 类型额外带 `listUrl` + `selector`（CSS 选择器，定位文章链接）：

```json
{
  "name": "Anthropic",
  "type": "scrape",
  "listUrl": "https://www.anthropic.com/news",
  "selector": "a[href^='/news/']"
}
```

**首批源**：
- `rss`：Karpathy(bearblog)、Steipete、HuggingFace、Latent Space、Sergey Levine(Substack)、Google DeepMind
- `scrape`：Anthropic、OpenAI

feedUrl/selector 实现阶段验证落定（见风险）。

### 2. 脚本 `scripts/sources-digest.mjs`

抓取 + 渲染，仿 `aihot-daily.mjs` 的 CLI 风格（stdout markdown、`--json`、`--no-save`）。

**rss 源**：
- `https.get` 拉 feed → `fast-xml-parser` 解析（RSS + Atom 两种结构都要兼容）
- 取 `pubDate`/`updated` 在 **过去 48h** 窗口内的条目
- 抽 `title` + `link` + 一句话（`description`/`summary` 去 HTML 标签后截断 ~120 字）

**scrape 源**：
- `https.get` 拉列表页 HTML → `jsdom`（已是依赖）+ `selector` 抽 `title` + `link`
- 无 pubDate → 全列表抽出，靠 Notion 查重兜底；取前 N 条（如 8）避免整页倒灌
- link 相对路径补全为绝对 URL

**容错**：每源独立 try/catch，单源失败不炸全局 → 该源标记 `⚠️ 抓取失败: <err>`，继续其余源。

**渲染**：markdown 按源分组：
```
## 源博客新文 · YYYY-MM-DD

### Andrej Karpathy
- [标题](link) — 一句话摘要

### Anthropic ⚠️ 抓取失败: HTTP 403
```

### 3. 去重

- **窗口初筛**：rss 源按 48h pubDate 过滤。
- **Notion 查重**：agent 合并时读昨天 `AI 日报 YYYY-MM-DD` 子页已出现的 URL，跳过重复（尤其 scrape 源无 pubDate，依赖此步）。

### 4. Notion 输出

并进现有 `AI 日报 YYYY-MM-DD` 子页，**追加一节** `## 源博客新文`（aihot 五版块之后）。

### 5. allowlist（远程 env，需用户手配）

远程 cloud 出站白名单默认挡未知域。需在 claude.ai/code → routine → 环境设置 → Network access → Custom 加入各 feed/站域名：
- `karpathy.bearblog.dev`
- `steipete.me`
- `huggingface.co`
- `latent.space`
- `*.substack.com`（Sergey Levine）
- `deepmind.google`
- `anthropic.com` / `www.anthropic.com`
- `openai.com`

> ⚠️ 仅 web UI 可配，脚本/settings.json 无此字段；Claude 无法代配，需用户手加。

---

## 数据流

```
远程 routine (cron 30 0 * * *, 08:30 北京)
  ├─ node scripts/aihot-daily.mjs --no-save   → aihot 五版块 markdown
  └─ node scripts/sources-digest.mjs --no-save → 源博客新文 markdown
        ↓
  agent 合并 → 读昨天 Notion 子页查重 → 写入 AI 日报 YYYY-MM-DD 子页
```

---

## 错误处理

- 单源失败：try/catch per 源，标记 ⚠️ 不阻塞其余。
- 全脚本失败：非零退出码 + stderr（仿 aihot-daily），routine 中 aihot 部分仍独立可用。
- scrape 站改版导致 selector 失效：表现为该源 0 条或失败标记 → 人工更新 `sources-feeds.json` selector。

---

## 测试

- **单元**：feed 解析（RSS + Atom 样例 fixture）、48h 窗口过滤、scrape selector 抽取（HTML fixture）、相对链接补全。
- **集成**：本地跑 `node scripts/sources-digest.mjs` 对真实源，肉眼验证输出。
- fixture 放 `docs/superpowers/specs/sources-digest-fixtures/`（仿现有 `aihot-fixtures/`）。

---

## 风险 / 未决

1. **scrape 两站（Anthropic/OpenAI）改版易碎** → 单源容错 + ⚠️ 标记，不阻塞 aihot；selector 失效时人工更新配置。
2. **allowlist 需用户 web UI 手加 8 域** → Claude 无法代配，列清单交用户。
3. **feedUrl/selector 真实性待验** → 实现首步先逐源 curl 验证 feed 存活、selector 命中，再落 `sources-feeds.json`。
4. **routine 改造**：现有 aihot routine 要加跑第二个脚本 + 合并逻辑 → 实现末步在 web UI 改 routine 指令（或新建合并 routine）。

---

## YAGNI 排除

- 不抓正文、不做 LLM 精读摘要（用户选轻量档）。
- 不做 seen-state 持久化文件（远程碰不到磁盘；用窗口+Notion 查重替代）。
- 不纳入备选池源（Meta/Mistral/xAI 等），首批只做个人博客 3 + 关键官博，跑通再扩。
