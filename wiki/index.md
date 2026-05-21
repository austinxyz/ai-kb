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
| [[wiki/模型与技术/Claude-Opus-4.7-Fast-Mode\|Claude Opus 4.7 Fast Mode]] | Anthropic API + Claude Code 同步开放 research preview；价格倍率未公布；calibration-under-load 是真正判据（不是 token/s）；4.6 时代已是 agent QoL 最大升级 | 1 |
| [[wiki/模型与技术/SenseNova-U1原生多模态\|SenseNova-U1 原生多模态]] | 商汤 NMM 完整 playbook：无 VE/VAE 视觉接口 + 原生 unified modeling + AR×flow matching 联合训练 + MoT 骨干 + 6 阶段配方；开源 38B-A3B MoE 仅激活 3B | 1 |


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
| [[wiki/应用开发/Codex-安全治理四层架构\|Codex 安全治理四层架构]] | OpenAI 内部部署四层防护：sandbox+approval / Auto-review 子代理 / managed network policy / agent-native OpenTelemetry；同一份遥测同时驱动安全与运营 | 1 |
| [[wiki/应用开发/AI一人公司路线图\|AI 一人公司路线图]] | 阿易 5 步法 + 3 反模式：选具体可重复任务 → prompt 写成 JD → 接 MCP 工具链 → 迭代 10 次 → 定时撒手；分发 > 构建，80 分能用就上 | 1 |
| [[wiki/应用开发/Token浪费与多模型路由\|Token 浪费与多模型路由（Karpathy）]] | AI coding 账单 90% 浪费在不必要 context；6 类典型浪费 + 5 步省钱组合拳；12 个月后拉开 $200 vs $4000 的不是技术是 routing | 1 |
| [[wiki/应用开发/AI输出形态演进\|AI 输出形态演进]] | 原始文本 → Markdown → HTML → 交互式神经视频；HTML 输出立即可施工；大脑 1/3 皮层主视觉；竞争从"答案对"迁移到"答案怎么给" | 1 |
| [[wiki/应用开发/Google-ADK长时运行Agent\|Google ADK 长时运行 Agent]] | Stateless chatbot 在长流程必崩（污染/爆炸/idle 后幻觉）；显式状态机 + 持久 session + 多 agent 委托替代对话历史；Cloud Run + SQLite 教程 | 1 |
| [[wiki/应用开发/Claude-Computer-Use最佳实践\|Claude Computer Use 最佳实践]] | 点击准确性是分辨率工程问题不是模型问题；4.6 起步 1280×720 上限 1568px/1.15MP，Opus 4.7 上限 2576px/3.75MP；坐标回缩公式 + thinking effort 默认值 + computer_20251124 自带 prompt injection 分类器零成本零延迟 | 1 |
| [[wiki/应用开发/Interrogatory-LLM\|Interrogatory LLM（审问式 LLM）]] | 让 LLM 采访人类生成 context 文档，或反向用 LLM 采访专家核查文档准确性；单问约束（每次只问一个）是关键规则；Martin Fowler 归纳 | 2 |
| [[wiki/应用开发/Harper-Reed-LLM-Codegen-Workflow\|Harper Reed LLM Codegen 工作流]] | Idea Honing→Planning→Execution 三步离散循环；单问约束原始出处；Repomix+Mise 处理存量代码；被 Fowler《Interrogatory LLM》引用 | 1 |
| [[wiki/应用开发/Sakana-AI-指挥者模型多Agent拓扑\|Sakana AI 指挥者模型多 Agent 拓扑]] | 7B Conductor 动态选取子 Agent 组合（专家 + 通才混合）GPQA Diamond 超越 GPT-4o；拓扑超越单一强模型的范式跨越 | 1 |
| [[wiki/应用开发/Codex-Auto-review-AI审批AI动作\|Codex Auto-review：AI 审批 AI 动作]] | OpenAI 第三种治理范式：独立 AI Sub-Agent 代替人类审批高风险 Codex 操作；与 full agentic / human-in-the-loop 形成三极治理谱系 | 1 |
| [[wiki/应用开发/Anthropic-金融Agent模板集\|Anthropic 金融 Agent 模板集]] | 10 款金融服务 Agent 模板：Skills/连接器/子 Agent 三层架构，M365 跨应用上下文，Opus 4.7 Vals AI 金融基准 64.37% 领先 | 1 |
| [[wiki/应用开发/MagenticLite与验证优先Agent\|MagenticLite 与验证优先 Agent]] | MSR 三件套：轻量多 Agent 框架 MagenticLite + 验证优先 Agent（先定可验证标准再执行）+ 智能体化 GitHub 工作流 | 1 |
| [[wiki/应用开发/OpenSquilla-多模型智能路由降本\|OpenSquilla 多模型智能路由降本]] | 路由简单任务走廉价模型、复杂走 Opus；成本 $6→$0.68（10×）；四层记忆 + 16 工具按需加载 + 三档沙箱；20+ 模型统一接入 | 1 |
| [[wiki/应用开发/OpenClaw-百个Codex实例运营开源项目\|OpenClaw 百个 Codex 实例运营开源项目]] | ~100 Codex 实例全自动开源运营：代码审查/Issue 去重/测试复现/任务创建/垃圾过滤/性能回归；token 趋零时代的极简团队模式 | 1 |
| [[wiki/应用开发/AI助手身份层\|AI 助手身份层（SOUL.md）]] | USER.md/MEMORY.md/SOUL.md 五层身份结构，性格独立于模型供应商，换"发动机"保留熟悉感 | 1 |
| [[wiki/应用开发/Claude-Skills工程实践-Matt-Pocock\|Claude Skills 工程实践（Matt Pocock）]] | grill-me 反向拷问 + 共享语言 CONTEXT.md/ADR + /tdd /diagnose 测试回路 + /zoom-out 抗熵增；三分类工程/效率/工具 | 1 |
| [[wiki/应用开发/Claude-code工程纪律规范\|Claude Code 工程纪律规范（Karpathy）]] | CLAUDE.md 四条核心：先思考澄清歧义 → 最简实现 → 精准修改 → 可验证目标；约束 AI "默默假设/过度自信/无效重构" | 1 |
| [[wiki/应用开发/Cursor团队Skills插件\|Cursor 团队 Skills 插件（cursor-team-kit）]] | 17 Skills + 1 Agent + 2 Rules；verify-this 把 debug 变成科学实验；ci-watcher 后台盯 CI；一句命令安装，自用背书 | 1 |
| [[wiki/应用开发/Cursor-Agent-Harness实战\|Cursor Agent Harness 实战]] | 模型决定上限 harness 决定表现；"守卫式→动态获取式"范式演进；离线 + 在线 A/B + 留存率三维衡量；未来是多 Agent 协作 | 1 |
| [[wiki/应用开发/Warp官方Skills开源\|Warp 官方 Skills 开源（oz-skills）]] | 15 个生产级技能（SEO 审计/Terraform/GitHub Issue 等）全开源；一条命令安装；Warp 内部每日提效实践的真实封装 | 1 |
| [[wiki/应用开发/Boris-Cherny-AI编码工作流\|Boris Cherny AI 编码工作流]] | 三反直觉原则：用最贵模型反而省钱 + 单一纯文本知识库记录错误 + 始终看运行结果；手机并行 5-10 个 Claude 实例 | 1 |
| [[wiki/应用开发/Amp-Neo-长链路Coding-Agent\|Amp Neo 长链路 Coding Agent]] | 陪伴式→长链路范式转变；远程编排 + 自动上下文压缩 + Plugin API；权限模型反转（默认允许），安全控制权移交插件 | 1 |


### AI 基础设施

| 条目 | 摘要 | 来源数 |
|------|------|--------|
| [[wiki/AI基础设施/MCP\|MCP（模型上下文协议）]] | AI Agent 接入外部工具的通用标准协议，2025 年 OpenAI/Google/Microsoft 全部采用，捐赠 Linux 基金会 | 1 |
| [[wiki/AI基础设施/vLLM-V1迁移\|vLLM V0→V1 迁移]] | 在线 RL 迁移先修后端正确性：processed_logprobs + 显式关 prefix-cache/async-scheduling + clear_cache=False + fp32 lm_head | 1 |
| [[wiki/AI基础设施/MRC-超算网络协议\|MRC（Multipath Reliable Connection）]] | OpenAI×AMD×Broadcom×Intel×MS×NVIDIA 联合：多平面拓扑（10 万 GPU 仅 2 层交换机）+ 包喷洒 + SRv6 静态源路由，故障恢复微秒级 | 1 |
| [[wiki/AI基础设施/自适应并行推理-APR\|自适应并行推理 (APR)]] | LLM 自主决定何时分支并行 / 多少线程 / 如何归并；演进谱系 BoN→ToT/MCTS→ParaThinker/GroupThink→APR (ThreadWeaver/Multiverse)；critical-path-by-correctness 奖励是关键 | 1 |
| [[wiki/AI基础设施/GPU冷启动-Peer权重传输\|GPU 冷启动与 Peer 权重传输]] | Runway NCCLBack：用 200-400 Gbps GPU 互联代替 2-10 Gbps 云存储下载，60× 加速；日省 347TB 流量、6500 推理分钟 | 1 |
| [[wiki/AI基础设施/DFlash-扩散式推测解码\|DFlash 扩散式推测解码]] | Google×UCSD：一次推测生成多 token 打破自回归串行瓶颈；TPU 联合优化；3.13× 无损推理加速；云端推理成本下降 | 1 |
| [[wiki/AI基础设施/ZCube推理网络架构\|ZCube 推理网络架构]] | 智谱+驭驯+清华 SIGCOMM 2025：扁平化拓扑消除 PD 分离结构性拥塞；省 1/3 交换机成本 + 推理吞吐 +15% + TTFT P99 -40.6% | 1 |


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
| [[wiki/行业洞察/Claude人格化\|Claude 人格化]] | Anthropic 多维度（命名/宪法/训练/同人）构建 Claude 人格；反馈循环不可逆，parasocial 期待是企业风险框架新空白；DALL·E 都把 Claude 画成人 | 1 |
| [[wiki/行业洞察/工程师简历建议-Lee-Robinson\|工程师简历建议（Lee Robinson）]] | Cursor 团队 11 条：一页 / 无照片 / GitHub 别装修 / 个人网站 / LinkedIn / 简历提 AI / 项目重质 / 求职信别用 AI / 展示爱好；AI 能生成的部分在贬值 | 1 |
| [[wiki/行业洞察/教育科技门槛归零\|教育科技门槛归零]] | 同等 3D 教育 App：2020 年 7 人 / 6 月 / $800k vs 2026 年 1 人 / 48h / $10；瓶颈从技术栈迁移到"懂学生在哪里会卡住"的课程设计 | 1 |
| [[wiki/行业洞察/AI急诊诊断超越医生\|AI 急诊诊断超越医生]] | 《Science》：一年多前的 o1 急诊诊断 67% > 医生 50-55%；优势在早期分诊；Boston ED 数据显示"医生 + AI"未优于"AI 单独"——copilot 假设被拆穿 | 1 |
| [[wiki/行业洞察/AI辅助研究复盘-Parameter-Golf\|AI 辅助研究复盘 · Parameter Golf]] | OpenAI 紧约束 ML 竞赛 8 周 2000+ 提交；agent 压低门槛但放大噪声；自建 Codex triage bot 过滤；未来竞赛规则必须为 agent 默认重做 | 1 |
| [[wiki/行业洞察/AI时代CTO人才迁移\|AI 时代 CTO 人才迁移]] | 多家独角兽 CTO 放弃高管岗转做 IC；权力从"管人数"→"接近模型"；个体工程师杠杆效应超越百人团队 | 1 |
| [[wiki/行业洞察/Claude自我设计-RSI起点\|Claude 自我设计：RSI 起点]] | Anthropic 工程师不再手写代码；Claude 参与设计 Claude；52 天 50+ 功能；人类角色从生产者→监督者；5% 开发者留核心 | 1 |
| [[wiki/行业洞察/AI编码已解决-Boris-Cherny观点\|AI 编码已解决（Boris Cherny）]] | TS/React 项目 AI 可写 100% 代码；人类转向指导/审查/集成；下一个瓶颈不是写代码而是审查和集成 | 1 |
| [[wiki/行业洞察/Anthropic-AI军队组织架构\|Anthropic AI 军队组织架构]] | 数百 AI Agent 在 Slack 协同；无秘密模型 Mythos；工程师增 4×但人均产出 +200%；竞争在谁先把公司改造成 AI 有机体 | 1 |
| [[wiki/行业洞察/AI替代与企业裁员-Coinbase案例\|AI 替代与企业裁员（Coinbase 案例）]] | 裁员 14% 700 人；AI 代码占比 40% 目标 50%+；管理层级压缩至 5 层；AI 原生小组实验；市场寒冬为主因 | 1 |
| [[wiki/行业洞察/AI时代技工vs-CS毕业生\|AI 时代技工 vs CS 毕业生（Jensen Huang）]] | 技工需求增长是白领 3×；机器人技术员 +107%；AI 职位就业 -16%；7 万亿数据中心需人力；建数据中心的技工才是赢家 | 1 |
| [[wiki/行业洞察/AI助手长链路文档损毁问题\|AI 助手长链路文档损毁问题]] | 微软论文：19 模型平均损坏 25% 文档；静默重大错误随时间累积；短期 demo 佳≠长链路可靠；产品需重新设计信任机制 | 1 |
| [[wiki/行业洞察/杨立昆LLM局限论与世界模型\|杨立昆 LLM 局限论与世界模型]] | LeCun 坚持 LLM 无法通向 AGI；AMI 押注世界模型；OpenAI/Anthropic 类比 Sun Microsystems；博士生应停研 LLM | 1 |


---

*由 Claude Code 维护，每次 ingest 后同步更新。*
