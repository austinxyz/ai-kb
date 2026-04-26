

#resource #AI #AgenticAI #ClaudeCode #上下文工程

**来源：** 微信公众号（锦康灵感铺），参考 [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
**扩展阅读：** [上下文工程实践](https://github.com/WakeUp-Jin/Practical-Guide-to-Context-Engineering)
**日期：** 2026-03-30
**分类：** 学习/AI-ML

---

## 摘要

黑客马拉松冠军 Claude Code 配置的核心设计哲学：**不强制流程化，只提供必要的最小条件，最大化模型自主性**。围绕四个核心问题构建：跨会话记忆、持续学习、项目可维护性、子智能体编排。

---

## 四大核心模式

### 一、跨会话共享内存

多次上下文压缩会稀释关键决策信息。需要独立的会话临时文件保存：
1. 哪些方法有效（有证据）
2. 哪些方法无效（已试过）
3. 哪些方法未试
4. 哪些工作未完成

**三个 Hook 实现自动化：**

| Hook | 时机 | 作用 |
|------|------|------|
| `PreCompact Hook` | 上下文压缩前 | 将重要状态保存至文件 |
| `SessionComplete Hook` | 会话结束时 | 持久化学习成果或初始化文件 |
| `SessionStart Hook` | 新会话启动 | 自动加载先前上下文，输出文件路径 |

---

### 二、持续学习并更新记忆

**两类文件的本质区别：**

| | 学习记录文件（Learn Skill） | 会话记录文件（Session Tmp） |
|---|---|---|
| **范围** | 全局、永久、抽象 | 局部、临时、具体 |
| **目的** | 避免重复犯错，积累经验 | 跨会话的连续性 |
| **路径** | `/.claude/skills/learned/` | `/.claude/sessions/` |
| **例子** | "工具参数必填项尽量少" | "已创建 database_query 工具基础定义" |

触发方式：Hook 自动执行（Stop/SessionEnd/PostToolUse）或 `/learn` 命令手动触发。

---

### 三、提高项目可维护性

**3.1 基于检查点的评估**（适合有明确里程碑的线性工作流）

```
开始(/checkpoint create) → 实现 → 验证(/checkpoint verify)
```
- `create`：运行快速检查 → git stash/commit → 记录 SHA 到日志
- `verify`：取出 SHA → 运行 git diff + 测试 → 输出报告（新增文件、修改文件、测试通过率、覆盖率）

> 设计亮点：只提供最小必要条件"SHA"，具体如何 diff 和测试完全由模型自主决定，保留自主性。

**3.2 持续评估**（适合探索性重构、无明确里程碑的长会话）

每 N 分钟或重大变更后：运行测试套件 → 输出报告 → 判断合格/修复

**3.3 冗余代码清理**

工具：`knip`（未使用导出/文件）、`depcheck`（未使用依赖）、`ts-prune`（未使用 TS 导出）

风险分级：
- `SAFE`：测试文件、未使用工具
- `CAUTION`：API 路由、组件
- `DANGER`：配置文件、主入口

流程：**测试 → 删除 → 测试**，任一失败则回滚。

**3.4 代码地图（CodeMap）**

作为 AI 了解代码库的入口，用少量 Token 掌握全局面貌。文档要精简，持续更新。

---

### 四、子智能体使用方式

**子智能体的核心问题**：编排器有子智能体缺乏的语义上下文，摘要常遗漏关键细节。

**4.1 循环验证调用**（最多 3 轮）
- 主智能体评估 → 不合格则提出新检索任务 → 子智能体继续检索
- 任务格式："具体问题 + 更广泛目标"，扩大检索面积

**4.2 编排智能体**
- 每个 Agent 接收明确输入、生成明确输出，输出成为下一阶段输入
- Agent 间使用 `/clear` 保持上下文新鲜度
- 中间输出存储在文件中（非仅内存）
- 支持自定义调用顺序：`/orchestrate custom "architect,tdd-guide,code-reviewer" "任务"`

---

## 文件结构速查

```
agents/          # 子智能体（planner/architect/code-reviewer/security-reviewer...）
skills/          # 技能（coding-standards/backend-patterns/verification-loop...）
commands/        # 命令（/tdd /plan /checkpoint /verify /learn /orchestrate...）
rules/           # 始终遵循的规则（security/testing/git-workflow/agents...）
hooks/           # 基于触发器的自动化（PreToolUse/PostToolUse/Stop...）
scripts/hooks/   # Hook 实现脚本（session-start/session-end/pre-compact...）
contexts/        # 动态系统提示注入（dev/review/research 模式）
```

---

## 涉及概念

[[Model+Harness]] · [[长时自主Agent的8个Harness核心问题]] · [[Agentic-Thinking]]

## 我的想法

