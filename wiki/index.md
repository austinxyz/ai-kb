---
title: AI 知识库
---

# AI 知识库 · 条目目录

AI 技术的结构化知识库。每次 ingest 后更新此文件。

## 分类导航

- [[wiki/模型与技术/00-MOC-模型与技术|模型与技术]] — 基础模型、推理、fine-tuning
- [[wiki/应用开发/00-MOC-应用开发|应用开发]] — Agentic 系统、RAG、工具调用
- [[wiki/AI基础设施/00-MOC-AI基础设施|AI基础设施]] — GPU、推理框架、MLOps
- [[wiki/行业洞察/00-MOC-行业洞察|行业洞察]] — 竞争格局、政策、趋势

## 条目目录

### 模型与技术

| 条目 | 摘要 | 来源数 |
|------|------|--------|
| [[wiki/模型与技术/OpenSeeker-v2\|OpenSeeker-v2]] | 纯学术 SFT + 10.6k 数据 30B 模型在 BrowseComp 等四基准超越工业级管线，质胜量 | 1 |


### 应用开发

| 条目 | 摘要 | 来源数 |
|------|------|--------|
| [[wiki/应用开发/LLM-Wiki-Pattern\|LLM Wiki Pattern]] | Karpathy 持久化知识库模式，区别于 RAG，wiki 随每次 ingest 复利积累 | 1 |
| [[wiki/应用开发/中间循环\|中间循环]] | AI 时代内循环与外循环之间新出现的监督性工程层，尚无行业命名 | 1 |
| [[wiki/应用开发/AI时代工程严谨性\|AI 时代工程严谨性]] | 工程纪律从代码转移到规格、测试、约束、风险映射、持续理解的 5 个方向 | 1 |
| [[wiki/应用开发/Harness-Engineering\|Harness Engineering]] | 让不稳定 AI Agent 在真实系统中可靠产出价值的工程框架，5 原则：验证/退出/最小权限/独立验证/团队规则 | 1 |
| [[wiki/应用开发/SPDD-Structured-Prompt-Driven-Development\|SPDD]] | ThoughtWorks 工程方法：把 prompt 当一等交付制品，REASONS Canvas + 闭环工作流，规模化治理 AI 输出 | 1 |
| [[wiki/应用开发/REASONS-Canvas\|REASONS Canvas]] | SPDD 的核心组件：七维结构化提示框架（需求/实体/方法/结构/操作/规范/护栏） | 1 |
| [[wiki/应用开发/Agent-Memory统一框架\|Agent Memory 统一框架]] | LLM Agent 长期记忆的模块化抽象：提取/管理/存储/检索 4 组件；层次化树状方法表现最佳 | 1 |
| [[wiki/应用开发/Agentic-RAG\|Agentic RAG]] | LLM 置于检索循环内部：自主分解查询、规划检索路径、自检缺口并循环补全，确信后才生成 | 1 |
| [[wiki/应用开发/企业级RAG架构\|企业级 RAG 架构]] | 个人知识库 vs 企业知识库：受控 schema + 结构化字段 + 条款级引用 + 权限 + 评测，五层最小可落地架构 | 1 |
| [[wiki/应用开发/AutoResearch软件开发\|AutoResearch 软件开发移植]] | Karpathy ML 循环 → 软件开发：多 Agent 交叉审核 + 5 维加权评分（≥9.0）+ 反馈驱动迭代，10 分钟完成中等 Issue | 1 |
| [[wiki/应用开发/Claude-Code团队配置\|Claude Code 团队配置]] | CLAUDE.md 三层作用域 + Skills（Reference vs Task）+ Hooks（格式化/文件保护/通知/Compact 注入），团队 AI 基础设施 | 1 |
| [[wiki/应用开发/AI-PPT工程化\|AI PPT 工程化]] | SVG 单页方案 + gpt-image-2 十步 pipeline（分析→大纲→独立 prompt→生图→备注→PPTX），可单页迭代的工程化流水线 | 1 |
| [[wiki/应用开发/Agentic-Workflow-Token效率\|Agentic Workflow Token 效率]] | GitHub 工程化方法：日志埋点 + ET 指标 + 删除未用 MCP + 用 gh CLI 替换 MCP，9/12 workflow 平均省 19-62% | 1 |
| [[wiki/应用开发/AI-Agent-PR审查\|AI Agent PR 审查]] | 5 大红旗：CI gaming、复用盲区、幻觉正确性、agent ghosting、不可信输入；10 分钟分级审查清单 | 1 |
| [[wiki/应用开发/Claude-Managed-Agents\|Claude Managed Agents]] | Dreaming（跨会话提炼记忆）+ Outcomes（rubric grader）+ Multiagent（lead/sub 编排）三件套，docx +8.4% pptx +10.1% | 1 |
| [[wiki/应用开发/Vibe-Coding与Agentic-Engineering合流\|Vibe Coding 与 Agentic Engineering 合流]] | Simon Willison：随 agent 可靠度上升，"不审 review" 从 vibe coding 蔓延到生产级，问责机制缺位 | 1 |
| [[wiki/应用开发/非技术-PM-Claude-Code上架App\|非技术 PM 用 Claude Code 上架 App]] | 十年 PM 6 周用 Claude Code 出 iOS 压力管理应用 Respiro：多 agent 并行 + 截图调试 + Apple 流程全程 Claude 引导 | 1 |
| [[wiki/应用开发/企业级AI-Agent部署\|企业级 AI Agent 部署]] | Anthropic 三支柱：跨越"agentic thinking divide"、员工技能转型、流程压缩；Claude Cowork 6 个月落地框架 | 1 |
| [[wiki/应用开发/Prompt-Caching工程\|Prompt Caching 工程]] | Claude Code 团队复盘：前缀匹配 → 静态在前动态在后；用 message 不用 system 改 prompt；切模型废缓存；compaction 也要继承前缀 | 1 |


### AI 基础设施

| 条目 | 摘要 | 来源数 |
|------|------|--------|
| [[wiki/AI基础设施/MCP\|MCP（模型上下文协议）]] | AI Agent 接入外部工具的通用标准协议，2025 年 OpenAI/Google/Microsoft 全部采用，捐赠 Linux 基金会 | 1 |
| [[wiki/AI基础设施/vLLM-V1迁移\|vLLM V0→V1 迁移]] | 在线 RL 迁移先修后端正确性：processed_logprobs + 显式关 prefix-cache/async-scheduling + clear_cache=False + fp32 lm_head | 1 |
| [[wiki/AI基础设施/MRC-超算网络协议\|MRC（Multipath Reliable Connection）]] | OpenAI×AMD×Broadcom×Intel×MS×NVIDIA 联合：多平面拓扑（10 万 GPU 仅 2 层交换机）+ 包喷洒 + SRv6 静态源路由，故障恢复微秒级 | 1 |
| [[wiki/AI基础设施/GPU冷启动-Peer权重传输\|GPU 冷启动与 Peer 权重传输]] | Runway NCCLBack：用 200-400 Gbps GPU 互联代替 2-10 Gbps 云存储下载，60× 加速；日省 347TB 流量、6500 推理分钟 | 1 |


### 行业洞察

| 条目 | 摘要 | 来源数 |
|------|------|--------|
| [[wiki/行业洞察/软件工程的未来-ThoughtWorks-2026\|软件工程的未来（ThoughtWorks 2026）]] | 闭门研讨会 8 大主题综合：严谨性转移、中间循环、智能体拓扑、认知债务等 | 1 |
| [[wiki/行业洞察/ADLC\|ADLC（智能体驱动开发生命周期）]] | SDLC → ADLC 的 6 大转变：并行执行、动态目标、全程测试、实时自修正、持续反馈 | 1 |
| [[wiki/行业洞察/AI时代PM物种替换\|AI 时代 PM 物种替换]] | Information Mover vs Builder：决定归属的是身份流动性，Fake Builder 承担双倍透支，Smiling Exhaustion 是成功状态真相 | 1 |
| [[wiki/行业洞察/AI-PM速度文化\|AI-PM 速度文化（Cat Wu）]] | Anthropic 功能周期从 6 个月压至 1 天：research preview + evergreen launch room + 恰好正确的 AGI 信仰 | 1 |
| [[wiki/行业洞察/认知债务\|认知债务]] | 技术债的新形态：系统复杂性与人类理解能力的差距，AI 加速开发后以复利积累 | 1 |
| [[wiki/行业洞察/思维模型-认识论\|思维模型·认识论]] | 第一性原理、演绎/归纳/溯因三角、证伪主义、范式转换——关于如何认识世界的基础模型 | 1 |
| [[wiki/行业洞察/思维模型-系统复杂性\|思维模型·系统与复杂性]] | 反馈回路、涌现、网络效应幂律、熵——理解复杂系统行为的四个核心模型 | 1 |
| [[wiki/行业洞察/思维模型-决策判断\|思维模型·决策与判断]] | 贝叶斯思维、前景理论、逆向思维、机会成本——系统性纠正直觉偏差的决策框架 | 1 |
| [[wiki/行业洞察/思维模型-演化适应\|思维模型·演化与适应]] | 自然选择、博弈论、路径依赖——系统在竞争与历史中演化的机制 | 1 |
| [[wiki/行业洞察/思维模型-人性社会\|思维模型·人性与社会]] | 激励机制、比较优势、社会建构、无意识——人类行为与制度的底层驱动 | 1 |
| [[wiki/行业洞察/思维模型-知识信息\|思维模型·知识与信息]] | 信息论、地图不是疆域、奥卡姆剃刀——关于知识本质与模型选择的元认知工具 | 1 |
| [[wiki/行业洞察/思维模型-尺度增长\|思维模型·尺度与增长]] | 复利/指数增长、规模效应、收益递减——人类线性直觉与非线性现实的鸿沟 | 1 |
| [[wiki/行业洞察/思维模型-战略行动\|思维模型·战略与行动]] | 杠杆点、边际思维、二阶思维——在复杂系统中选择高价值干预点的框架 | 1 |
| [[wiki/行业洞察/思维模型-认知局限\|思维模型·认知局限]] | 有限理性、认知偏差清单、邓宁-克鲁格——人类判断系统性失真的来源与对策 | 1 |
| [[wiki/行业洞察/思维模型-时间不确定性\|思维模型·时间与不确定性]] | 黑天鹅/肥尾、反脆弱、遍历性——生存优先于优化，集合平均≠时间平均 | 1 |
| [[wiki/行业洞察/思维模型-结构形式\|思维模型·结构与形式]] | 对称性与守恒定律、递归与分形——自然界深层结构的数学模式 | 1 |
| [[wiki/行业洞察/思维模型-元模型\|思维模型·元模型]] | 芒格多元格栅、辩证法——关于如何组合使用所有其他模型的模型之上的模型 | 1 |
| [[wiki/行业洞察/AI团队弹性与利用率\|AI 团队弹性与利用率]] | Tomer Tunguz：AI/人力比决策本质是韧性而非吞吐；3 人管 20 agent 走 1 人 = 33% 机构记忆损失，应保 70-90% 利用率 | 1 |


---

*由 Claude Code 维护，每次 ingest 后同步更新。*
