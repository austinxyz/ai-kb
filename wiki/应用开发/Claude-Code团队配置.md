---
title: Claude Code 团队配置（CLAUDE.md + Skills + Hooks）
category: 应用开发
tags: [Claude-Code, CLAUDE.md, Skills, Hooks, 团队配置, 自动化]
source: "[[raw/ai_usage/量化基本面研究团队的CLAUDE.md、Skills和Hooks实战配置指南.md]]"
updated: 2026-05-05
status: stable
---

## 定义
Claude Code 团队规模化使用的三层基础设施：**CLAUDE.md**（持久记忆/团队 DNA）+ **Skills**（可调用技能扩展）+ **Hooks**（确定性自动化钩子）；目标是把隐性知识显性化、把重复操作自动化，让多人使用体验一致、效率最大化。

## 核心要点
- **CLAUDE.md 三层作用域**：
  - 个人全局（`~/.claude/CLAUDE.md`）：所有项目通用偏好
  - 项目共享（`./CLAUDE.md`）：通过 Git 共享，团队 DNA 核心载体
  - 个人项目（`./CLAUDE.local.md`）：仅自己可见，加入 `.gitignore`（个人环境路径、API 端口等）
  - 进阶：`.claude/rules/` 路径规则，支持 `paths: src/factors/**/*.py` 按文件类型按需加载
  - 三条写作原则：控制在 200 行以内（过长消耗 context）、指令具体可验证（"type hints + docstring"而非"写好"）、定期 review 删冲突内容
- **Skills 两种内容类型**：
  - **Reference**（行业知识、数据字典）：Claude 自动加载，提供背景上下文
  - **Task**（回测报告、部署）：加 `disable-model-invocation: true`，防止 Claude 自行触发，需手动 `/skill-name` 调用
  - 辅助文件结构：`SKILL.md`（主指令）+ `template.md`（报告模板）+ `examples/`（示例输出）+ `scripts/`（分析脚本）
- **Hooks 四类关键应用**：
  - **PostToolUse 自动格式化**：Claude 编辑 `.py` 文件后自动跑 Black + isort，代码风格零分歧
  - **PreToolUse + exit 2 文件保护**：生产配置（`configs/prod_*`）、`.env`、核心引擎代码，Claude 无法修改
  - **Notification 任务完成通知**：长任务切去做别的，Claude 完成后弹桌面通知（osascript）
  - **SessionStart 压缩后注入上下文**：长对话被 compact 后自动重注入：当前 sprint 目标、benchmark 设置、数据截止日期
- **数据安全**：Team/Enterprise 版属于商业级（Claude for Work），对话数据不进入训练管道；Anthropic 是数据处理者，组织是数据控制者；CLAUDE.md 写代码规范不写实际持仓/API key
- **落地五步骤**：项目级 CLAUDE.md → rules/ 路径规则 → 团队 Skills → Hooks 自动化 → 个人 CLAUDE.local.md

## 与其他概念的关系
- [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development|SPDD]]：CLAUDE.md 是 SPDD 中"把 prompt 当一等交付制品"的持久化载体；Skills 对应 SPDD 的规模化治理层
- [[wiki/行业洞察/AI-PM速度文化|AI-PM 速度文化（Cat Wu）]]：evergreen launch room 的工程基础正是这套 CLAUDE.md + Skills + Hooks 配置
- [[wiki/应用开发/AutoResearch软件开发|AutoResearch 软件开发]]：program.md 是 CLAUDE.md 在自动化开发循环中的具体形式

## 参考来源
- [[raw/ai_usage/量化基本面研究团队的CLAUDE.md、Skills和Hooks实战配置指南.md|量化基本面研究团队 Claude Code 配置实战]]
