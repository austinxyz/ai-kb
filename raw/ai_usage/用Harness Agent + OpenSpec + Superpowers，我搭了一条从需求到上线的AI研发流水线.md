# 你的AI还停留在“问答模式”？我已经让它像一支正规军一样协作：定规范、守纪律、分角色，从需求到上线全自动。

---

## 引言：为什么你的AI只能写函数，而我的AI能完成整个项目？

2026年，**Harness Agent** 是 GitHub 上最火的概念——OpenClaw（27.9万🌟）、DeerFlow（6万🌟）、agency-agents（6万🌟）等现象级项目都属于这一范畴。

但大多数人只是把 Harness 当作“高级 Prompt 集合”，真正用它搭建**端到端研发流水线**的却很少。

本文要解决的就是这个问题：用三个开源工具——**Harness Agent（多角色协作层）**、**OpenSpec（规范层）** 和 **Superpowers（纪律层）**——构建一条从 **“需求→规范→设计→开发→验收→上线”** 的全自动 AI 研发流水线。

让 AI 从“临时工”升级为“常驻军团”。

---

### 方案核心：三层整合

|层次|工具|职责|
|---|---|---|
|**协作层**|Harness Agent（以 agency-agents 为例）|分配“谁来做”：140+ 专业 Agent 并行工作|
|**规范层**|OpenSpec|定义“做什么”：需求、验收条件、任务拆分|
|**纪律层**|Superpowers|规范“怎么做”：TDD、代码审查、强制验证|

> 把 Harness Agent 放在第一位，是因为它是整个流水线的“躯干”——负责调度所有角色。OpenSpec 提供“大脑”（规范），Superpowers 提供“纪律”（流程），三者合在一起，才是一个完整的工程化 AI 团队。

---

## 一、工具清单与环境准备

### 1.1 Harness Agent：140+ 数字员工，各司其职

Harness Agent 本质上是一个“AI 角色商店”，包含 **140 多个预定义的 Agent**（项目经理、后端、前端、QA、安全工程师……）。

每个 Agent 有独立的系统提示词和工具权限，可以并行执行任务。

**本方案使用 agency-agents 作为 Harness 实现**（你也可以换成 DeerFlow 或 OpenClaw）。

**安装**：

bash

git clone https://github.com/msitarzewski/agency-agents.gitcd agency-agents./scripts/install.sh

**常用 Agent**：

|Agent|职责|
|---|---|
|PM Agent|拆解需求、跟踪任务进度、验收|
|Backend Developer|实现 API、数据库逻辑|
|Frontend Developer|实现 UI 组件|
|QA / Tester|编写测试用例、执行回归|
|Code Reviewer|审查代码规范和安全性|
|DevOps Engineer|构建、部署、监控|

### 1.2 OpenSpec：让 AI 理解需求边界

OpenSpec 是一个轻量级规范驱动开发工具，它通过结构化的 Markdown 文件，将需求、设计和任务拆解成 AI 精准可执行的“说明书”。

**安装**：

bash

npminstall-g @fission-ai/openspec@latest

**初始化项目**：

bash

cd your-projectopenspec init

### 1.3 Superpowers：强制 AI 遵守工程纪律

Superpowers 是一套 AI 行为约束技能集。它会在 AI 执行任何任务前，主动检查是否存在适用的技能，并严格遵循技能定义的步骤。

**安装**：

bash

git clone https://github.com/obra/superpowers.git ~/.claude/skills/superpowers

**核心技能**：

|技能|作用|
|---|---|
|`test-driven-development`|强制先写测试再写实现|
|`requesting-code-review`|代码提交前自动请求审查|
|`verification-before-completion`|完成任务前对照验收条件自检|
|`systematic-debugging`|按科学流程定位 bug|

---

## 二、整合架构：薄编排 + 统一入口

我们不直接修改这三个工具的内部代码，而是用一个 **Skill 作为薄编排层** 统一调度它们。

我将这个 Skill 命名为 `spec-driven-development`。

**架构示意图**：

text

用户 → spec-driven-development (唯一入口)          ├─→ 调用 OpenSpec 命令（生成 proposal/specs/tasks）          ├─→ 加载 Superpowers 技能（TDD、审查、验证）          └─→ 调用 Harness Agent 分派角色（PM、后端、前端、QA 等并行）

### 完整 Skill 内容（可直接复制保存）

将以下内容保存为 `.claude/skills/spec-driven-development/SKILL.md`：

markdown

---name: spec-driven-developmentdescription: 规范驱动全链路开发。整合 Harness Agent、OpenSpec、Superpowers，从需求到交付全自动。---# 规范驱动全链路开发工作流## 核心原则本 Skill 是薄编排层：- Harness Agent 管“谁来做”（角色分工、并行协作）- OpenSpec 管“做什么”（规范、提案、验收）- Superpowers 管“怎么做”（TDD、审查、调试）## 工作流命令### /sdd-propose <change-name>1. 执行 `/opsx:propose <change-name>`（OpenSpec）2. 生成 `proposal.md`（目标/非目标/影响范围）3. 调用 `superpowers:brainstorming` 评估可行性### /sdd-design1. 若需要，执行 `/opsx:design <change-name>` 生成 `design.md`2. 调用 `superpowers:writing-plans` 细化实施方案### /sdd-plan1. 根据 `tasks.md` 模板拆分具体任务2. 调用 Harness Agent 中的 PM Agent，将任务按角色分派（Backend/Frontend/QA/DevOps）3. 为每个任务标注所需的 Superpowers 技能### /sdd-execute1. PM Agent 启动，监控整体进度2. 并行执行（后端 + 前端 + QA）：- 每个开发任务必须加载 `superpowers:test-driven-development`- 每个任务完成后加载 `superpowers:verification-before-completion`- 每个 PR 自动触发 `superpowers:requesting-code-review`3. 所有任务完成后，PM Agent 汇总状态### /sdd-verify1. 执行 `/opsx:verify <change-name>`（OpenSpec）2. 逐条验证 `specs/*.md` 中的 GIVEN/WHEN/THEN 场景3. QA Agent 输出验收报告### /sdd-ship1. PM Agent 确认需求达成2. 执行 `/opsx:archive <change-name>`（OpenSpec）3. DevOps Agent 触发部署（若配置 CI/CD）4. 发送完成通知

---

## 三、实战：从需求到上线，全流程演示

用一个真实功能来走通这条流水线：**“给后台管理系统的订单列表增加导出 Excel 功能，仅管理员可导出”**。

### 环境速览

- 已安装 OpenSpec、Superpowers、agency-agents
    
- 项目根目录已执行 `openspec init`
    
- AI 工具已加载 `spec-driven-development` Skill
    

---

### 阶段 1：提案（定义目标）

**用户输入**：

text

/sdd-propose order-export

**AI 执行**：调用 OpenSpec 创建变更目录，生成 `proposal.md`，提示用户填写。

**最终 proposal.md 核心内容**：

markdown

# 变更提案：订单导出功能## 目标为管理员提供订单数据导出能力，支持 Excel 格式。## 非目标本期不含 CSV/PDF 导出，不含导出历史查询。## 影响范围- 后端：新增导出用的 Controller、Service、权限校验- 前端：订单管理页面增加“导出”按钮

---

### 阶段 2：设计（细化方案）

**用户输入**：

text

/sdd-design

**AI 执行**：

- 调用 OpenSpec 生成 `design.md`（技术选型：ExcelJS 库、RBAC 中间件）
    
- 调用 `superpowers:writing-plans` 拆解实施步骤
    
- 生成 `specs/order-export/spec.md`，包含验收场景：
    

markdown

# 需求规格：订单导出## REQ-EXP-001：仅管理员可导出### 场景：非管理员尝试导出- GIVEN 登录用户角色为 "VIEWER"- WHEN 调用导出接口- THEN 返回 403 权限不足## REQ-EXP-002：导出数据格式正确### 场景：正常导出- GIVEN 存在 3 条订单记录- WHEN 管理员点击导出- THEN 返回 Excel 文件，包含 3 行数据 + 表头

---

### 阶段 3：计划（拆任务 + 分派角色）

**用户输入**：

text

/sdd-plan

**AI 执行**：PM Agent 根据 `tasks.md` 模板生成具体任务，并通过 Harness Agent 分派给不同角色。

|任务|描述|负责 Agent|所需技能|
|---|---|---|---|
|T1|后端实现权限校验中间件|Backend|TDD|
|T2|实现订单查询服务（分页/筛选）|Backend|TDD|
|T3|实现 Excel 生成服务|Backend|TDD|
|T4|前端添加导出按钮 + 调用 API|Frontend|code-review|
|T5|编写单元测试（权限/导出逻辑）|QA|TDD|
|T6|编写集成测试（完整流程）|QA|systematic-debugging|

---

### 阶段 4：执行（并行开发）

**用户输入**：

text

/sdd-execute

**AI 执行**：

- PM Agent 启动监控
    
- **Harness Agent 驱动多角色并行**：
    

- Backend Agent 按 TDD 开发：先写测试 → 实现代码 → 重构
    
- Frontend Agent 同步实现 UI，完成后自动请求 Code Review
    
- QA Agent 编写接口自动化测试
    

- 每个 Task 完成后自动加载 `verification-before-completion` 自检
    
- 所有 Task 完成后，PM Agent 汇总状态
    

**实测耗时**（本案例）：

- 后端开发：**4 分钟**
    
- 前端开发：**2 分钟**
    
- 测试编写：**3 分钟**
    
- **总并行时间**：约 **6 分钟**（非串行累加）
    

---

### 阶段 5：验收（验证是否符合规格）

**用户输入**：

text

/sdd-verify

**AI 执行**：

1. 执行 `/opsx:verify order-export`
    
2. 逐条验证 spec.md 中的 GIVEN/WHEN/THEN 场景
    
3. QA Agent 输出验收报告：
    

markdown

## 验收结果- REQ-EXP-001 ✅ PASS (非管理员返回 403)- REQ-EXP-002 ✅ PASS (导出的 Excel 包含正确数据)- 单元测试覆盖率：92%- 集成测试通过率：100%

---

### 阶段 6：交付（上线归档）

**用户输入**：

text

/sdd-ship

**AI 执行**：

1. PM Agent 确认所有需求达成
    
2. 执行 `/opsx:archive order-export` 归档变更
    
3. DevOps Agent 触发自动构建并部署到预发布环境
    
4. 发送完成通知（Slack/钉钉）
    

> **至此，一个完整的功能从需求到上线，全程由 Harness 驱动的 AI 军团自动完成。人工参与内容仅为：输入 4 条命令（/sdd-propose、/sdd-design、/sdd-plan、/sdd-execute）。**

---

## 四、效果对比：单 AI vs Harness AI 军团

|维度|传统单次对话式 AI|本方案（三层整合）|
|---|---|---|
|需求理解|依赖反复描述，易跑偏|OpenSpec 结构化管理，可验收|
|测试覆盖率|常被忽略|Superpowers 强制 TDD，**≥90%**|
|代码审查|几乎没有|每个 task 自动触发 review|
|并行度|串行，一个任务做完再下一个|Harness 驱动多 Agent 并行|
|交付质量|不可控，经常返工|验收场景驱动，首次通过率大幅提升|
|人工介入|需求、编码、测试、调试全流程|仅需启动命令和确认关键决策|

---

## 五、快速上手指南（30 分钟内跑通）

### 前置条件

- Node.js 18+
    
- Git
    
- 任一支持自定义 Skill 的 AI 编程工具（推荐 Claude Code 或 Cursor）
    

### 一键安装

bash

# 1. 安装 OpenSpecnpminstall-g @fission-ai/openspec@latest# 2. 在项目中初始化cd your-projectopenspec init# 3. 安装 Superpowersgit clone https://github.com/obra/superpowers.git ~/.claude/skills/superpowers# 4. 安装 Harness 实现（agency-agents）git clone https://github.com/msitarzewski/agency-agents.gitcd agency-agents./scripts/install.sh# 5. 创建 spec-driven-development Skill# 将上文 Skill 内容保存为 ~/.claude/skills/spec-driven-development/SKILL.md

### 验证成功

在 AI 工具中输入：

text

/sdd-propose test-change

若能正常生成 `openspec/changes/test-change/` 目录，说明整合成功。

---

## 六、常见问题与避坑

**Q1：OpenSpec 命令报错“找不到 openspec”？**  
A：确认已全局安装，并在项目根目录执行过 `openspec init`。

**Q2：Superpowers 技能不生效？**  
A：检查技能目录是否在 AI 工具的技能搜索路径下。Claude Code 默认读取 `~/.claude/skills/`，Cursor 需在设置中配置。

**Q3：Harness Agent（agency-agents）没有被调用？**  
A：安装脚本执行后，需要重启 AI 工具。部分环境需手动将角色文件复制到项目 `.claude/agents/` 下。

**Q4：并行执行时文件冲突怎么办？**  
A：agency-agents 已内置资源锁机制，对同一文件的写操作会排队执行。若仍有冲突，可以在 `tasks.md` 中显式标注“彼此独立”的任务再并行。

---

## 结语：从“对话式 AI”到“Harness 军团式 AI”

本文的三层整合方案，本质上是将现代软件工程的最佳实践（规范驱动开发、测试驱动开发、角色专职协作）**强制注入 Harness Agent 的工作流中**。

它不会让你立刻成为 10 倍速开发者，但它会保证：**每一次 AI 产出的代码，都是经过规范、测试和审查的合格产品**。

如果你对 Harness Agent 感兴趣，这套流水线就是最好的实战起点。

与其争论“AI 会不会取代程序员”，不如先用 Harness 建立一支纪律严明的数字化军团。

---

> **资源链接**
> 
> - Harness 实现（agency-agents）：github.com/msitarzewski/agency-agents
>     
> - OpenSpec 官方文档：github.com/fission-ai/openspec
>     
> - Superpowers 仓库：github.com/obra/superpowers
>     
> - 中文增强版（国内网络友好）：gitee.com/liu123zhi/agency-agents-zh
>     

_本文基于实际工程实践撰写，可声明原创，欢迎转载但请注明出处。_