# Wiki Log

追加式操作记录。格式：`## [YYYY-MM-DD] <类型> | <说明>`
类型：ingest / query / lint

---

## [2026-06-20] ingest | 6 条未入库 raw 文件批量处理

- 存入：`raw/ai_usage/Anthropic 官方发布：《创始人手册：打造 AI 原生初创公司》.md`
- 存入：`raw/ai_usage/Claude Code 拥有 50 多个命令。大多数开发者只用到 5 个.md`
- 存入：`raw/ai_usage/别再浪费你的20刀！这20 个 Claude 提示词才配得上.md`
- 存入：`raw/ai_usage/用Harness Agent + OpenSpec + Superpowers，我搭了一条从需求到上线的AI研发流水线.md`
- 存入：`raw/sdlc/Claude Code 创始人在红杉大会上的 7 个重要判断.md`
- 存入：`raw/others/装了这个AI热点Skill之后，你再也不需要自己去刷AI新闻了.md`
- 新建 wiki：
  - `wiki/行业洞察/Anthropic-AI原生创业手册.md` ← 创始人手册
  - `wiki/应用开发/Claude-Code-命令速查.md` ← Claude Code 50+ 命令体系
  - `wiki/应用开发/Claude-提示词工程20法.md` ← 20 个结构化提示词模板
  - `wiki/应用开发/SDD规范驱动研发流水线.md` ← Harness+OpenSpec+Superpowers 三层整合
  - `wiki/行业洞察/Boris-Cherny-红杉7判断.md` ← 红杉大会 7 大结构性判断
  - `wiki/应用开发/AIHOT-Skill平台.md` ← AIHOT Skill/RSS/API 接入
- 同步更新 index.md（应用开发 +4，行业洞察 +2）

---

## [2026-06-05] ingest | 订阅清单 raw/_sources.md

- 新建：`raw/_sources.md` —— AI 业内值得盯的源清单
- 内容：个人博客 3（Karpathy / Steipete / Sergey Levine）+ 企业官博 5（Anthropic / OpenAI / DeepMind / HuggingFace / Latent Space）+ 备选池
- 标注转载友好度（HF 最友好；实验室官博严，编译+原链；a16z 需授权）

---

## [2026-05-17] aihot-pull --since 3d | 候选 38 / 入库 4 / 起草 wiki 0

- run-id: 2026-05-18T05:08:10Z
- 入库（用户手选 技巧与观点 1,3,5,7）:
  - `raw/dev_methodology/2026-05-17-yao-weread-skill-wechat-reading-visualization.md` (S2_methodology, aihot_summary_only)
  - `raw/agent_engineering/2026-05-17-GBrain-Garry-Tan开源Agent终身记忆系统.md` (S4_agent, aihot_summary_only)
  - `raw/engineering_roles/2026-05-17-mustafa-suleyman-18-months-ai-automates-white-collar-work.md` (S3_roles, aihot_summary_only)
  - `raw/industry_insight/2026-05-17-gary-marcus-illusion-of-generative-ai-world-model-neuralsymbolic.md` (S0_industry, original_full — 手动 WebFetch，不在 aihot 窗口内)
- 起草 wiki draft: 0
  - 前 3 条：content_source=aihot_summary_only，不符合起草条件 → wiki_status: not_eligible_summary_only
  - Gary Marcus 条：content_source=original_full + confidence=high，但 wiki/ 现有 >23 个 draft (超过 10 条阈值) → wiki_status: deferred_draft_quota
- 抓取降级（aihot_summary_only）: 3 条（source_type=twitter，跳过 WebFetch）
- LLM 建议跳过: 未统计（本次仅处理用户手选 4 条）

---

## [2026-05-16] 批量起草 wiki | 23 条 raw 全部入库，起草 wiki 23 条

- 来源：用户指令"这些都要"，针对所有 wiki_status: not_eligible_summary_only 的 raw 文件
- 起草 wiki draft（23 条）:
  - `wiki/应用开发/Sakana-AI-指挥者模型多Agent拓扑.md` ← raw/agent_engineering/2026-05-04
  - `wiki/应用开发/Codex-Auto-review-AI审批AI动作.md` ← raw/agent_engineering/2026-05-04
  - `wiki/应用开发/Anthropic-金融Agent模板集.md` ← raw/agent_engineering/2026-05-06
  - `wiki/应用开发/MagenticLite与验证优先Agent.md` ← raw/agent_engineering/2026-05-15
  - `wiki/应用开发/OpenSquilla-多模型智能路由降本.md` ← raw/agent_engineering/2026-05-15
  - `wiki/应用开发/OpenClaw-百个Codex实例运营开源项目.md` ← raw/agent_engineering/2026-05-16
  - `wiki/AI基础设施/DFlash-扩散式推测解码.md` ← raw/ai_native_infra/2026-05-05
  - `wiki/应用开发/AI助手身份层.md` ← raw/dev_methodology/2026-05-02
  - `wiki/应用开发/Claude-Skills工程实践-Matt-Pocock.md` ← raw/dev_methodology/2026-05-03
  - `wiki/应用开发/Claude-code工程纪律规范.md` ← raw/dev_methodology/2026-05-04
  - `wiki/应用开发/Cursor团队Skills插件.md` ← raw/dev_methodology/2026-05-04
  - `wiki/应用开发/Cursor-Agent-Harness实战.md` ← raw/dev_methodology/2026-05-05
  - `wiki/应用开发/Warp官方Skills开源.md` ← raw/dev_methodology/2026-05-06
  - `wiki/应用开发/Boris-Cherny-AI编码工作流.md` ← raw/dev_methodology/2026-05-06
  - `wiki/应用开发/Amp-Neo-长链路Coding-Agent.md` ← raw/dev_methodology/2026-05-07
  - `wiki/行业洞察/AI时代CTO人才迁移.md` ← raw/engineering_roles/2026-05-02
  - `wiki/行业洞察/Claude自我设计-RSI起点.md` ← raw/engineering_roles/2026-05-05
  - `wiki/行业洞察/AI编码已解决-Boris-Cherny观点.md` ← raw/engineering_roles/2026-05-05
  - `wiki/行业洞察/Anthropic-AI军队组织架构.md` ← raw/engineering_roles/2026-05-06
  - `wiki/行业洞察/AI替代与企业裁员-Coinbase案例.md` ← raw/engineering_roles/2026-05-06
  - `wiki/行业洞察/AI时代技工vs-CS毕业生.md` ← raw/engineering_roles/2026-05-16
  - `wiki/行业洞察/AI助手长链路文档损毁问题.md` ← raw/industry_insight/2026-04-30
  - `wiki/行业洞察/杨立昆LLM局限论与世界模型.md` ← raw/industry_insight/2026-05-16
- 冲突跳过（1 条）:
  - "AI supercomputers MRC" ↔ wiki/AI基础设施/MRC-超算网络协议.md（已有同主题条目）
- 注：所有 raw 来源均为 aihot_summary_only，wiki 根据摘要起草

---

## [2026-05-15] aihot-pull --since 1d | 候选 28 / 入库 5 / 起草 wiki 0

- run-id: 2026-05-16T05:48:27Z
- 入库（用户手选，均为 Twitter/摘要模式）:
  - `raw/agent_engineering/2026-05-15-new-tools-models-repos-and-papers-out-of-microsoft-research-are-here-use-ai-and-.md` (S4_agent, aihot_summary_only)
  - `raw/agent_engineering/2026-05-16-people-freaking-out-over-my-ai-spend-what-nobody-sees-part-of-what-excites-me-so.md` (S4_agent, aihot_summary_only)
  - `raw/agent_engineering/2026-05-15-你敢把-Opus-和-GPT-接入到小龙虾里跑吗...md` (S4_agent, aihot_summary_only)
  - `raw/engineering_roles/2026-05-16-the-ceo-of-the-world-s-most-valuable-semiconductor-company-just-told-a-room-full.md` (S3_roles, aihot_summary_only)
  - `raw/industry_insight/2026-05-16-fun-interview-with-jacob-effron-on-the-unsupervised-learning-podcast.md` (S0_industry, aihot_summary_only)
- 起草 wiki draft: 0（全部 content_source=aihot_summary_only，不符合起草条件）
- LLM 建议跳过: 11 条（产品通告 / 发布广告 / 无实质内容）

---

## [2026-05-14] ingest | Interrogatory LLM · Martin Fowler + Harper Reed

- 存入：
  - `raw/agent_engineering/2026-05-14-InterrogatoryLLM-martinfowler.md`
  - `raw/agent_engineering/2025-02-16-harper-reed-llm-codegen-workflow.md`
- 新建条目：
  - `wiki/应用开发/Interrogatory-LLM.md`（审问式 LLM：单问约束 + 正向/反向两种用法 + 跨 session context 链路）
  - `wiki/应用开发/Harper-Reed-LLM-Codegen-Workflow.md`（三步离散循环 + 单问约束原始出处 + Repomix/Mise 存量代码工作流）
- 更新：
  - `wiki/应用开发/Interrogatory-LLM.md`（补充 Harper Reed 关联引用）
  - `wiki/index.md`（应用开发 +2）

---

## [2026-05-14] ingest | aihot 日报 3 条（技巧与观点 #4/#7/#8）

- 存入：
  - `raw/agent_engineering/2026-05-14-Claude-computer-browser-use-best-practices.md`（Anthropic 官方 Blog）
  - `raw/ai_native_infra/2026-05-14-psql_bm25s-23x-faster-postgres-retrieval.md`（EMostaque · psql_bm25s 开源）
  - `raw/dev_methodology/2026-05-14-search-reference-image-for-AI-image-gen.md`（op7418 · 搜索垫图法）
- 新建条目：
  - `wiki/应用开发/Claude-Computer-Use最佳实践.md`（分辨率上限/坐标回缩公式/thinking effort 默认值/prompt injection 分类器）
- 候选（wiki_status: candidate，未起 draft，待沉淀）：
  - psql_bm25s → 可补 `wiki/应用开发/企业级RAG架构.md` 或新建 `wiki/AI基础设施/Postgres-Agent检索栈.md`
  - 搜索垫图法 → 可补 `wiki/应用开发/AI-PPT工程化.md` 或新建 `wiki/应用开发/AI生图Workflow.md`
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-05-14] ingest | aihot 日报 2 条（模型发布 #2/#3）

- 存入：
  - `raw/models/2026-05-14-Krea-2-foundation-model-launch.md`（Krea AI 首个自研基础模型 + 限量访问码）
  - `raw/models/2026-05-14-SenseNova-U1-technical-report.md`（商汤原生多模态 NMM 完整技术报告 + 38B-A3B MoE 开源）
- 新建条目：
  - `wiki/模型与技术/SenseNova-U1原生多模态.md`（技术五件套 + 与主流适配范式对比 + MoT vs MoE-on-LLM）
- 候选：
  - Krea 2 → 公开技术信息不足以撑 4 段结构，待官方技术报告释出后再起 wiki；可考虑未来与 Midjourney/Flux/SD3 合并到 `wiki/模型与技术/图像基础模型对比.md`
- 更新：`wiki/index.md`（模型与技术 +1）

## [2026-04-28] ingest | LLM Agent 统一记忆框架综述（PaperToday）

- 存入：`raw/agents/近期，不错的LLM Agent统一记忆框架综述.md`
- 新建条目：`wiki/应用开发/Agent-Memory统一框架.md`（4 核心组件 + 5 大实验发现 + 新 SOTA）
- 更新条目（补交叉引用）：
  - `wiki/应用开发/LLM-Wiki-Pattern.md`（与自动化 Agent Memory 的人工/自动路径互补）
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-04-28] ingest | SPDD - Structured Prompt-Driven Development（ThoughtWorks）

- 存入：`raw/sdlc/Structured-Prompt-Driven Development (SPDD).md`
- 新建条目：
  - `wiki/应用开发/SPDD-Structured-Prompt-Driven-Development.md`（SPDD 方法论主条目：定义、ROI、适用性、三大核心技能）
  - `wiki/应用开发/REASONS-Canvas.md`（七维结构化提示框架：R/E/A/S/O/N/S）
- 更新条目（补交叉引用）：
  - `wiki/应用开发/中间循环.md`（SPDD 是中间循环的具体方法落地）
  - `wiki/应用开发/AI时代工程严谨性.md`（SPDD 是方向 1 的具体实践）
  - `wiki/应用开发/Harness-Engineering.md`（共享"把判断工程化"思想）
- 更新：`wiki/index.md`（应用开发 +2）

## [2026-04-25] ingest | Harness Engineering - AI Agent 时代的软件工程（Onebird）

- 存入：`raw/sdlc/Harness Engineering - AI Agent 时代的软件工程.md`
- 新建条目：`wiki/应用开发/Harness-Engineering.md`（Harness Engineering 定义与 5 原则）
- 更新条目：`wiki/应用开发/AI时代工程严谨性.md`（补充与 Harness 的交叉引用）
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-04-25] ingest | ThoughtWorks 闭门研讨——软件工程的未来

- 存入：`raw/sdlc/《软件工程的未来》：一篇来自ThoughtWorks的闭门研讨.md`
- 新建条目：
  - `wiki/行业洞察/软件工程的未来-ThoughtWorks-2026.md`（综合摘要）
  - `wiki/应用开发/中间循环.md`（最具先发优势的新概念）
  - `wiki/应用开发/AI时代工程严谨性.md`（严谨性转移的 5 个方向）
  - `wiki/行业洞察/认知债务.md`（技术债的新形态）
- 更新：`wiki/index.md`（应用开发 +2，行业洞察 +2）

## [2026-04-25] ingest | Karpathy - LLM Wiki Pattern

- 存入：`raw/applications/karpathy-llm-wiki.md`
- 新建条目：`wiki/应用开发/LLM-Wiki-Pattern.md`
- 更新：`wiki/index.md`（应用开发分类加入 LLM Wiki Pattern 条目）

## [2026-04-25] ingest | 人类思想史上的一些思维模型整理

- 存入：`raw/others/人类思想史上的一些思维模型整理.md`
- 新建条目（12 个，全部归入 `wiki/行业洞察/`）：
  - `思维模型-认识论.md`：第一性原理、演绎/归纳/溯因、证伪主义、范式转换
  - `思维模型-系统复杂性.md`：反馈回路、涌现、网络效应幂律、熵
  - `思维模型-决策判断.md`：贝叶斯思维、前景理论、逆向思维、机会成本
  - `思维模型-演化适应.md`：自然选择、博弈论、路径依赖
  - `思维模型-人性社会.md`：激励机制、比较优势、社会建构、无意识
  - `思维模型-知识信息.md`：信息论、地图≠疆域、奥卡姆剃刀
  - `思维模型-尺度增长.md`：复利/指数增长、规模效应、收益递减
  - `思维模型-战略行动.md`：杠杆点、边际思维、二阶思维
  - `思维模型-认知局限.md`：有限理性、认知偏差清单、邓宁-克鲁格
  - `思维模型-时间不确定性.md`：黑天鹅/肥尾、反脆弱、遍历性
  - `思维模型-结构形式.md`：对称性与守恒、递归与分形
  - `思维模型-元模型.md`：芒格多元格栅、辩证法
- 更新：`wiki/index.md`（行业洞察 +12）

## [2026-05-05] ingest | ADLC - Agent 驱动的软件开发生命周期（LinkedIn）

- 存入：`raw/sdlc/ADLC.md`
- 新建条目：`wiki/行业洞察/ADLC.md`（SDLC vs ADLC 6 大转变 + 5 条最佳实践）
- 更新：`wiki/index.md`（行业洞察 +1）

## [2026-05-05] ingest | Agent Architecture 2026 三大升级路径（LinkedIn）

- 存入：`raw/sdlc/Agent Architecture.md`
- 新建条目：
  - `wiki/应用开发/Agentic-RAG.md`（LLM 置入检索循环：自主分解→规划→检索→自检→生成）
  - `wiki/AI基础设施/MCP.md`（模型上下文协议：Agent 工具接入的行业标准，OpenAI/Google/Microsoft 采用）
- 更新：`wiki/index.md`（应用开发 +1，AI基础设施 +1）

## [2026-05-05] ingest | 前谷歌Meta高管：PM 物种替换（Lenny's Newsletter）

- 存入：`raw/sdlc/前谷歌Meta高管：产品经理正在物种替换，你被归到哪边，可能不是你自己说了算.md`
- 新建条目：`wiki/行业洞察/AI时代PM物种替换.md`（Information Mover vs Builder + 身份流动性三层 + Fake Builder + Smiling Exhaustion）
- 更新：`wiki/index.md`（行业洞察 +1）

## [2026-05-05] ingest | Cat Wu Lenny's Podcast：AI-PM 速度文化（Anthropic）

- 存入：`raw/sdlc/Cat Wu 面试了几百个 PM 候选人，几乎没人答对一个问题：AI 产品经理到底应该干什么？.md`
- 新建条目：`wiki/行业洞察/AI-PM速度文化.md`（research preview + evergreen launch room + AGI pilled + product taste）
- 更新：`wiki/index.md`（行业洞察 +1）

## [2026-05-05] ingest | LLM Wiki + Graphify 企业级 RAG 实测

- 存入：`raw/applications/Karpathy的LLM Wiki + 3.5 万Star的Graphify：企业级 RAG 缺的真是知识图谱？.md`
- 新建条目：`wiki/应用开发/企业级RAG架构.md`（个人知识库 vs 企业知识库 + 五层架构 + 三方案实测对比）
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-05-05] ingest | AutoResearch 软件开发移植

- 存入：`raw/sdlc/我把 Karpathy 的 AutoResearch 搬到了软件开发领域，效果炸了.md`
- 新建条目：`wiki/应用开发/AutoResearch软件开发.md`（多 Agent 交叉审核 + 5 维加权评分 + 反馈驱动迭代）
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-05-05] ingest | Claude Code 团队配置实战（量化基本面研究团队）

- 存入：`raw/ai_usage/量化基本面研究团队的CLAUDE.md、Skills和Hooks实战配置指南.md`
- 新建条目：`wiki/应用开发/Claude-Code团队配置.md`（CLAUDE.md 三层 + Skills Reference vs Task + Hooks 四类应用）
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-05-05] ingest | AI PPT 工程化（SVG 方案 + gpt-image-2 pipeline）

- 存入：
  - `raw/ai_usage/gpt-image-2发布后，PPT最强skill.md`
  - `raw/ai_usage/分享一个用AI写PPT的技巧.md`
  - `raw/ai_usage/一句话生成PPT丨Obsidian + Claude Code 实践手记 · 04.md`
- 新建条目：`wiki/应用开发/AI-PPT工程化.md`（SVG 单页方案 + gpt-image-2 十步 pipeline，合并 3 篇同主题文章）
- 更新：`wiki/index.md`（应用开发 +1）

## [2026-05-08] aihot-pull --since 30d | 候选 356 / 入库 32 / 起草 wiki 11
- run-id: 2026-05-08T02:31:15.604Z
- 入库:
  - raw/industry_insight/2026-04-30-new-microsoft-paper-shows-that-current-ai-assistants-often-damage-documents-duri.md (S0_industry, aihot_summary_only(skipped))
  - raw/engineering_roles/2026-05-02-科技圈正在发生一波反常的人才大迁移-多家十亿美元级公司的-CTO-集体辞职-放弃高管职位-转去-Anthropic-做-IC-Workday-CTO-MTS-2.md (S3_roles, aihot_summary_only(skipped))
  - raw/engineering_roles/2026-05-06-加密货币交易所-Coinbase-今天宣布裁员约-14-约-700-名员工受影响-CEO-Brian-Armstrong-给出了两个理由-加密货币市场进入下行周.md (S3_roles, aihot_summary_only(skipped))
  - raw/engineering_roles/2026-05-06-Anthropic的Claude为什么能52天推出50个重大功能-神秘武器Mythos要发布了-他们的基础设施负责人-Claude-code之父Boris刚说出.md (S3_roles, aihot_summary_only(skipped))
  - raw/engineering_roles/2026-05-05-when-everyone-is-a-key-person-in-your-company.md (S3_roles, original_full)
  - raw/engineering_roles/2026-05-05-Anthropic-CEO-Dario-Amodei的那句-Claude在设计Claude-炸了整个AI圈-但似乎很多人都看错了重点-重点不是-RSI来了-而是.md (S3_roles, aihot_summary_only(skipped))
  - raw/engineering_roles/2026-05-05-anthropic-s-boris-cherny-argues-that-for-certain-modern-model-friendly-codebases.md (S3_roles, aihot_summary_only(skipped))
  - raw/engineering_roles/2026-05-05-optimizing-software-factories.md (S3_roles, original_full)
  - raw/ai_native_infra/2026-05-06-ai-supercomputers-need-a-new-kind-of-network-to-stay-in-sync-at-massive-scale-op.md (S1_infra, aihot_summary_only(skipped))
  - raw/ai_native_infra/2026-05-05-Google-这一波操作-最让人意外的是-Google直接把LLM推理里最顽固的autoregressive瓶颈干掉了-他们和UCSD合作推出的DFlash-D.md (S1_infra, aihot_summary_only(skipped))
  - raw/ai_native_infra/2026-05-04-60x-faster-cold-starts-treating-peer-gpus-as-weight-servers.md (S1_infra, original_full)
  - raw/ai_native_infra/2026-05-07-vllm-v0-to-v1-correctness-before-corrections-in-rl.md (S1_infra, original_full)
  - raw/ai_native_infra/2026-05-05-unlocking-large-scale-ai-training-networks-with-mrc-multipath-reliable-connectio.md (S1_infra, aihot_summary_only(failed))
  - raw/dev_methodology/2026-05-08-agent-pull-requests-are-everywhere-here-s-how-to-review-them.md (S2_methodology, original_full)
  - raw/dev_methodology/2026-05-07-2026-年的-Coding-Agent-应该是什么样-Amp-新版-CLI-Neo-发布-AmpCode-https-ampcode-com-news-neo.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-06-我靠-Warp-这个Skills-太顶了-直接官方开源啊-Warp团队居然把他们日常用来大幅提效的内部-Skills-全部开源了-一条命令就能直接装上15个高质.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-06-这个创造了Claude-Code的男人Boris-Cherny大神-完整公开了自己的工作流-并直播演示了一半的编码工作在手机上完成-不是回消息-是同时跑5到10.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-06-vibe-coding-and-agentic-engineering-are-getting-closer-than-i-d-like.md (S2_methodology, original_full)
  - raw/dev_methodology/2026-05-05-Cursor-团队这篇-持续改进我们的-Agent-Harness-写的真不错-很实战-如何衡量-harness-的好坏-如何为不同模型定制-harness-中.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-04-Cursor-官方团队自己在用的-CI-Code-Review-发版-测试-清理代码-周报等工作流的-Skills-打包成一个-Plugin-一句指令安装-ad.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-04-Claude-code有时候会替你做错误假设-不主动要求澄清-该反驳时不反驳-敷衍迎合奉承你-有人把-Karpathy-对-AI-写代码常见问题的观察-整理成一.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-02-http-x-com-i-article-2050590821553258496.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-03-解决真正工程问题的-Skills-Skills-For-Real-Engineers-作者-mattpocockuk-公开了自己-claude-目录中每天在用的.md (S2_methodology, aihot_summary_only(skipped))
  - raw/dev_methodology/2026-05-01-how-a-non-technical-project-manager-built-and-shipped-a-stress-management-app-wi.md (S2_methodology, original_full)
  - raw/dev_methodology/2026-04-30-lessons-from-building-claude-code-prompt-caching-is-everything.md (S2_methodology, original_full)
  - raw/agent_engineering/2026-05-08-improving-token-efficiency-in-github-agentic-workflows.md (S4_agent, original_full)
  - raw/agent_engineering/2026-05-06-new-in-claude-managed-agents-dreaming-outcomes-and-multiagent-orchestration.md (S4_agent, original_full)
  - raw/agent_engineering/2026-05-05-openseeker-v2-pushing-the-limits-of-search-agents-with-informative-and-high-diff.md (S4_agent, original_full)
  - raw/agent_engineering/2026-05-06-anthropic-just-shipped-10-finance-agent-templates-that-turn-claude-from-a-chat-a.md (S4_agent, aihot_summary_only(skipped))
  - raw/agent_engineering/2026-05-04-new-paper-from-sakana-ai-iclr-2026-a-7b-conductor-model-just-hit-sota-on-gpqa-di.md (S4_agent, aihot_summary_only(skipped))
  - raw/agent_engineering/2026-05-04-OpenAI-Codex-新模式-Auto-review-在-频繁打扰人类-和-完全放权-之间-引入第三种治理范式-用一个独立-AI-Agent-替代人类-来审.md (S4_agent, aihot_summary_only(skipped))
  - raw/agent_engineering/2026-04-30-building-ai-agents-for-the-enterprise.md (S4_agent, original_full)
- 起草 wiki draft:
  - wiki/应用开发/Agentic-Workflow-Token效率.md (#13)
  - wiki/应用开发/AI-Agent-PR审查.md (#36)
  - wiki/AI基础设施/vLLM-V1迁移.md (#110)
  - wiki/应用开发/Claude-Managed-Agents.md (#131)
  - wiki/应用开发/Vibe-Coding与Agentic-Engineering合流.md (#144)
  - wiki/模型与技术/OpenSeeker-v2.md (#161)
  - wiki/行业洞察/AI团队弹性与利用率.md (#190)
  - wiki/AI基础设施/GPU冷启动-Peer权重传输.md (#220)
  - wiki/应用开发/非技术-PM-Claude-Code上架App.md (#307)
  - wiki/应用开发/企业级AI-Agent部署.md (#326)
  - wiki/应用开发/Prompt-Caching工程.md (#332)
- 冲突跳过:
  - "Optimizing Software Factories" ↔ wiki/行业洞察/AI团队弹性与利用率.md
- 抓取降级（content_source=aihot_summary_only）:
  - raw/industry_insight/2026-04-30-new-microsoft-paper-shows-that-current-ai-assistants-often-damage-documents-duri.md — skipped (source_type=twitter)
  - raw/engineering_roles/2026-05-02-科技圈正在发生一波反常的人才大迁移-多家十亿美元级公司的-CTO-集体辞职-放弃高管职位-转去-Anthropic-做-IC-Workday-CTO-MTS-2.md — skipped (source_type=twitter)
  - raw/engineering_roles/2026-05-06-加密货币交易所-Coinbase-今天宣布裁员约-14-约-700-名员工受影响-CEO-Brian-Armstrong-给出了两个理由-加密货币市场进入下行周.md — skipped (source_type=twitter)
  - raw/engineering_roles/2026-05-06-Anthropic的Claude为什么能52天推出50个重大功能-神秘武器Mythos要发布了-他们的基础设施负责人-Claude-code之父Boris刚说出.md — skipped (source_type=twitter)
  - raw/engineering_roles/2026-05-05-Anthropic-CEO-Dario-Amodei的那句-Claude在设计Claude-炸了整个AI圈-但似乎很多人都看错了重点-重点不是-RSI来了-而是.md — skipped (source_type=twitter)
  - raw/engineering_roles/2026-05-05-anthropic-s-boris-cherny-argues-that-for-certain-modern-model-friendly-codebases.md — skipped (source_type=twitter)
  - raw/ai_native_infra/2026-05-06-ai-supercomputers-need-a-new-kind-of-network-to-stay-in-sync-at-massive-scale-op.md — skipped (source_type=twitter)
  - raw/ai_native_infra/2026-05-05-Google-这一波操作-最让人意外的是-Google直接把LLM推理里最顽固的autoregressive瓶颈干掉了-他们和UCSD合作推出的DFlash-D.md — skipped (source_type=twitter)
  - raw/ai_native_infra/2026-05-05-unlocking-large-scale-ai-training-networks-with-mrc-multipath-reliable-connectio.md — fetch failed (HTTP 403)
  - raw/dev_methodology/2026-05-07-2026-年的-Coding-Agent-应该是什么样-Amp-新版-CLI-Neo-发布-AmpCode-https-ampcode-com-news-neo.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-06-我靠-Warp-这个Skills-太顶了-直接官方开源啊-Warp团队居然把他们日常用来大幅提效的内部-Skills-全部开源了-一条命令就能直接装上15个高质.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-06-这个创造了Claude-Code的男人Boris-Cherny大神-完整公开了自己的工作流-并直播演示了一半的编码工作在手机上完成-不是回消息-是同时跑5到10.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-05-Cursor-团队这篇-持续改进我们的-Agent-Harness-写的真不错-很实战-如何衡量-harness-的好坏-如何为不同模型定制-harness-中.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-04-Cursor-官方团队自己在用的-CI-Code-Review-发版-测试-清理代码-周报等工作流的-Skills-打包成一个-Plugin-一句指令安装-ad.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-04-Claude-code有时候会替你做错误假设-不主动要求澄清-该反驳时不反驳-敷衍迎合奉承你-有人把-Karpathy-对-AI-写代码常见问题的观察-整理成一.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-02-http-x-com-i-article-2050590821553258496.md — skipped (source_type=twitter)
  - raw/dev_methodology/2026-05-03-解决真正工程问题的-Skills-Skills-For-Real-Engineers-作者-mattpocockuk-公开了自己-claude-目录中每天在用的.md — skipped (source_type=twitter)
  - raw/agent_engineering/2026-05-06-anthropic-just-shipped-10-finance-agent-templates-that-turn-claude-from-a-chat-a.md — skipped (source_type=twitter)
  - raw/agent_engineering/2026-05-04-new-paper-from-sakana-ai-iclr-2026-a-7b-conductor-model-just-hit-sota-on-gpqa-di.md — skipped (source_type=twitter)
  - raw/agent_engineering/2026-05-04-OpenAI-Codex-新模式-Auto-review-在-频繁打扰人类-和-完全放权-之间-引入第三种治理范式-用一个独立-AI-Agent-替代人类-来审.md — skipped (source_type=twitter)
- LLM 建议跳过: 179 条（产品功能通告×25 / 重复模型通告×20 / 纯模型发布×17）

## [2026-05-08] aihot-extract 重抓 | 替换 13 个 raw 文件正文为原文
- 起因：发现首跑用 WebFetch 抓正文，工具底层用小模型重写，平均压缩 6× 损失数据点（如 GitHub blog ET 公式 m/I/C/O 定义、Haiku/Sonnet/Opus 倍数等被吞掉）
- 修复：新增 scripts/aihot-extract.mjs（node https + jsdom + @mozilla/readability + turndown），直抓 HTML 后做 readability 提取
- 结果：
  - 13 个 URL 全部抓取成功（含此前 WebFetch 失败的 #147 OpenAI MRC，根因是 WebFetch 默认 UA 触发 403）
  - 总正文体积 ~90KB → ~115KB，per-file 内容完整度显著提升
  - 复写 32 个 raw 文件，_history.jsonl 不再重复写
- #147 状态：`fetch_status: ok` / `content_source: original_full` / `wiki_status: eligible_pending_review`（未自动起草 wiki，等用户决定）

## [2026-05-08] aihot-pull 补 wiki | #147 OpenAI MRC
- 起因：首跑时 #147 抓取失败（WebFetch UA 触发 403），跳过 wiki 起草。aihot-extract 重抓后内容齐全，user 决定补起草。
- 起草：`wiki/AI基础设施/MRC-超算网络协议.md`（基于完整正文：多平面拓扑 / 包喷洒 / SRv6 / 生产实测数据）
- raw 状态：`wiki_status: drafted`、`wiki_target: wiki/AI基础设施/MRC-超算网络协议.md`
- wiki/index.md：在 AI 基础设施 表加一行

## [2026-05-08] wiki 批量 promote | draft → stable × 21
- 起因：积累 21 个 draft（9 旧 + 11 本次首跑 + 1 #147 补抓），下一次 aihot-pull 会被 ">10 draft" 闸门拒绝
- 操作：用 `scripts/wiki-promote-drafts.mjs` 把所有 `status: draft` 改成 `status: stable`，不动其他字段
- 结果：drafts 0 / stable 42
- 注意：`updated` 字段未动；只有 status 变。如需标 outdated 应单独 review。

## [2026-05-08] aihot-fetch backend 切到公开 REST API
- 起因：发现 aihot.virxact.com/agent 文档化了公开端点 `GET /api/public/feed`，匿名免费、字段全（aiSelectedReason、aiTags、qualityScore 等齐备），还多 `duplicateCount` / `duplicateSources` 可优化 dedup
- 实现：在 `scripts/aihot-fetch.mjs` 中新增 `fetchViaApi()` 函数，cursor 分页，复用现有 `toContractItem` 映射；用 `process.env.AIHOT_BACKEND` 控制（默认 `'api'`，`'rsc'` 切回 v1 scrape）
- 契约变化：
  - `fetch_method` 新值 `'public_api'`（v1 是 `'paginated_all'`）
  - 每条 item 加两个字段：`duplicate_count`、`duplicate_sources`
  - `aihot_url` 仍空（aihot 没有内部详情页，卡片直接跳 source_url）
- 兼容性：所有原 export 函数（deriveSourceType、parseRscPayload、windowFilter、parseSince）保留；20 旧测试 + 6 新 API 测试全绿
- spec 文档同步：`docs/superpowers/specs/2026-05-07-aihot-ingest-pipeline-design.md` §2 改为"API 默认 + RSC fallback"
- 实测平行对比 30d：API 返回 800 条，RSC 返回 356 条，交集仅 39（11%）。两者都属合法 aiSelected=true 子集，排序/分页策略不同；下次跑 /aihot-pull 拿到的候选会显著不同于过去

## [2026-05-08] 新增 /aihot-mp-pull 公众号爆文书签流水线
- 起因：用户想把 aihot.virxact.com/mp（公众号爆文热榜）作为 raw 导入
- 限制：mp.weixin.qq.com 反爬挡住正文抓取（readability 跳到 wappoc_appmsgcaptcha 验证页）
- 决定：做"书签级"导入，只存 metadata + 链接，**不做** LLM 分类、WebFetch、wiki draft
- 实现：
  - `scripts/aihot-mp-fetch.mjs`：直抓 /mp HTML 表（jsdom 解析），输出含 read/like/share/anomaly 的 mp-specific JSON
  - `.claude/commands/aihot-mp-pull.md`：独立 slash command，按 read_count 排序展示，用户选编号入 raw/wechat_hotposts/
  - 共享 `_history.jsonl`：跨流去重（同一篇文章在 /aihot-pull 和 /mp 都出现，仅入一次）
  - `package.json` 已有 jsdom 依赖（之前 aihot-extract.mjs 装的），无新增 npm
- 测试：9 个新单测（normalizeSince/extractRowIds/parseMpHtml/fetchMp），35/35 全绿
- 已知瑕疵：每页 20 行里 1 行的 React key 不在 RSC 序列化中，会丢 ~5%（每 20 条丢 1 条），可接受
- CLAUDE.md 加了 `raw/<series_dir>/` 与 `raw/wechat_hotposts/` 目录约定

## [2026-05-08] /aihot-mp-pull 运行失败：aihot 把 /mp 关给匿名用户了
- 跑：`/aihot-mp-pull --since 30d`
- 候选 0 / 入库 0
- 根因：`/mp*` 全部 307 → `/`（实测含 since 参数、page 参数、完整浏览器 headers + Referer 都重定向）
- 其它端点正常：`/`、`/all`、`/agent`、`/api/public/feed`、`/api/public/items` 均 200
- 时间线：本会话早些时候首次跑通拉到 92 条，过几小时再跑就 307 了 —— aihot 在那段窗口加了 auth wall
- 处理：本次不入库；保留 `scripts/aihot-mp-fetch.mjs` 与 `/aihot-mp-pull` slash command 不动
- 后续：观察 aihot /agent 文档页是否提到鉴权方式；若一直关，考虑提交反馈或弃用此流水线

## [2026-05-08] /aihot-mp-pull 加 playwright 后端
- 起因：aihot 把 /mp 关给匿名用户后，原 http 后端必废；用户选 B 方案（Playwright）
- 实现：
  - `npm install playwright` + `npx playwright install chromium`
  - 新增 `scripts/aihot-mp-fetch-playwright.mjs`：两个模式 `--login`（headed，等用户登录后保存 storageState）与默认 fetch（headless 复用 storageState）
  - `scripts/aihot-mp-fetch.mjs` 加 `--backend playwright` / `MP_BACKEND=playwright` 分发；默认仍 http（保留法医价值，方便 aihot 改回匿名时立刻复活）
  - storageState 落 `.aihot/storage-state.json`（已 gitignore）
- 用法：首次 `node scripts/aihot-mp-fetch-playwright.mjs --login` 浏览器完成登录后回车保存 → 后续 `/aihot-mp-pull --backend playwright` headless 跑
- session 估计 30-90 天有效；过期再 `--login` 一次
- 测试：35/35 单测全绿；--login flow 需用户实操，无法自动 smoke test

## [2026-05-08] /aihot-mp-pull 标记为 DEPRECATED
- 验证 login.virxact.com 后发现：登录页明示"**仅限公司同事与签约博主**"，是虚实传媒内部 SSO，外部用户无法注册账号
- Playwright auth backend 因此走不通（不是技术问题，是权限边界）
- 决定（用户选项 4）：保留全部代码，加 deprecation banner，未来 aihot 改策略可立即复活
- 改动：`.claude/commands/aihot-mp-pull.md` 顶部 banner + description 加 [DEPRECATED 2026-05-08] 前缀；两个 fetcher script 文件头注释加 deprecation 说明；保留 playwright dep / chromium binary / 单测 / fixture 不删
- 后续：专注 `/aihot-pull`（公开 REST API 仍正常）；如果哪天 aihot 暴露 `/api/public/mp` 或开放外部账号，删 banner 即可

## [2026-05-08] 新增 /aihot-daily 终端日报阅读
- 起因：读了 raw/others/ 那篇"装了这个 AI 热点 Skill 之后"，意识到我们 pipeline 全是"沉淀向"工作流（triage + 入库 + wiki），缺作者强调的"30 秒扫一眼今天 AI 圈"高频读取场景
- 实现：
  - `scripts/aihot-daily.mjs`：调 `/api/public/daily` / `/api/public/daily/{date}` / `/api/public/dailies?take=N`，渲染成终端友好的 5 版块清单（模型/产品/行业/论文/技巧）
  - `.claude/commands/aihot-daily.md`：slash command；明确"不入库、不分类、不起 wiki"是设计意图
  - `CLAUDE.md`：加三个 aihot slash command 用途分工说明
- 测试：8 个新单测覆盖 trunc / shortSource / renderDaily / renderList，43/43 全绿
- 用法：`/aihot-daily`（最新）、`/aihot-daily 2026-05-08`（指定日期）、`/aihot-daily --list 14`（看可用日期列表）

## [2026-05-09] aihot-daily-save | 2 篇文章入库 + 起 wiki draft
- 起因：用户首次走 /aihot-daily 阅读 → 挑选编号 → 入库流程
- 入库:
  - raw/agent_engineering/2026-05-08-running-codex-safely-at-openai.md (S4_agent, 6.3KB body)
  - raw/ai_native_infra/2026-05-08-adaptive-parallel-reasoning-inference-scaling.md (S1_infra, 29.5KB body)
- 起草 wiki:
  - wiki/应用开发/Codex-安全治理四层架构.md (4.9KB)
  - wiki/AI基础设施/自适应并行推理-APR.md (6.5KB，含 ThreadWeaver/Multiverse/Parallel-R1/NPR 演进谱系)
- 工程修复：scripts/aihot-extract.mjs 加 Sec-Fetch-* headers，绕过 OpenAI 等 Cloudflare 严格站的 403
- 共用 _history.jsonl：stream='daily-save' 标记两条来源
- wiki/index.md 加两行：AI 基础设施 + 应用开发 各一条
- 用法证实：daily 阅读 → 用户给"技巧与观点-N"格式索引 → 子流水线（fetch + classify + write raw）→ 可选 wiki draft；流程顺，不需要新 slash command

## [2026-05-09] /aihot-daily 加本地归档
- 新增功能：每次运行自动把渲染后的 markdown 存到 `daily/aihot/<YYYY-MM-DD>.md`（gitignored，纯本地）
- 幂等：文件首行注释带 upstream `generatedAt`，再跑同日相同 generatedAt 则跳过；upstream 重生成（generatedAt 变）则覆盖
- `--no-save` flag 可单次跳过
- 不影响 `--json` / `--list` 模式（不在归档范围）
- slash command markdown 同步更新；43/43 单测仍绿

## [2026-05-10] aihot-daily-save | 3 条技巧与观点入库 + 起 wiki draft
- 起因：/aihot-daily 2026-05-11 日报阅读 → 用户挑 #6/#7/#8 → "都入库"
- 入库（opencli twitter thread 抓全文 + 高赞评论）：
  - raw/industry_insight/2026-05-10-Claude人格化趋势的中期影响.md（S0_industry，含 Mollick 原推 + TravelerOfCode/MarcusSpillane/VoidNulled 三条评论）
  - raw/agent_engineering/2026-05-10-AI一人公司月入7万路线图.md（S4_agent，含阿易 5 步法 + 3 反模式 + peter131415/BTCxiaoyu1 评论）
  - raw/engineering_roles/2026-05-10-Lee-Robinson的11条工程师求职建议.md（S3_roles，含邵猛转述全文 + BlockView0214 反向判据）
- 起草 wiki：
  - wiki/行业洞察/Claude人格化.md（多维度人格化设计 + 反馈循环不可逆 + parasocial 企业风险）
  - wiki/应用开发/AI一人公司路线图.md（5 步 + 3 反模式 + 系统调度三能力栈）
  - wiki/行业洞察/工程师简历建议-Lee-Robinson.md（11 条 + 反向判据 + AI 时代招聘判据变形）
- wiki/index.md 加三行：应用开发 +1 / 行业洞察 +2
- 关键技术细节：tweet 内容通过 `opencli twitter thread <tweet_id> -f yaml` 抓取，避开 WebFetch 402 限制；frontmatter 与 aihot 原生入库对齐（aihot_id 留空，标 content_source: twitter_tweet_full）

## [2026-05-13] aihot-daily-save | 7 条精选回溯入库 + 起 wiki draft
- 起因：跨两期日报会话挖掘——2026-05-11 日报技巧与观点 #1/#3 + 2026-05-13 日报模型 #1 + 技巧与观点 #1/#3/#4/#8；用户"我想入库之前分析的"
- 入库 7 份（opencli twitter thread 抓 X 推 + aihot-extract.mjs 抓 blog）：
  - raw/industry_insight/2026-05-10-教育科技门槛一夜归零.md（S0_industry，阿易 + Keji715 评论延展）
  - raw/industry_insight/2026-05-10-旧版AI模型急诊诊断超越医生.md（S0_industry，Kim 原推 + thoughtson_tech 拆 copilot 假设）
  - raw/models/2026-05-12-Claude-Opus-4.7-Fast-Mode-research-preview.md（S0_industry，Claude Devs 一句话 + jatingargiitk calibration-under-load）
  - raw/dev_methodology/2026-05-12-Karpathy-90percent-token-waste.md（S2_methodology，Karpathy 6 类浪费 + 5 步组合拳 + vaesmall 预检策略）
  - raw/industry_insight/2026-05-12-AI输出形态从文本到神经视频.md（S0_industry，硅基流动 + aihot 长文延展）
  - raw/agent_engineering/2026-05-13-Google-ADK-long-running-agents.md（S4_agent，Eric Dong 完整原文 + 状态机代码）
  - raw/industry_insight/2026-05-13-OpenAI-Parameter-Golf-takeaways.md（S0_industry，OpenAI 官方复盘）
- 起草 wiki 7 条：
  - wiki/行业洞察/教育科技门槛归零.md（瓶颈迁移到课程设计）
  - wiki/行业洞察/AI急诊诊断超越医生.md（copilot 假设被 Boston ED 数据拆穿）
  - wiki/模型与技术/Claude-Opus-4.7-Fast-Mode.md（speed 是 setting，calibration 是 product decision）
  - wiki/应用开发/Token浪费与多模型路由.md（Karpathy 6 浪费 + 5 步省钱）
  - wiki/应用开发/AI输出形态演进.md（文本→Markdown→HTML→神经视频）
  - wiki/应用开发/Google-ADK长时运行Agent.md（显式状态机替代对话历史）
  - wiki/行业洞察/AI辅助研究复盘-Parameter-Golf.md（agent-default 时代竞赛规则需要重做）
- wiki/index.md 加七行：模型与技术 +1 / 应用开发 +3 / 行业洞察 +3
- 工作流验证：daily 阅读 → 用户索引选条（含跨期）→ 子流水线（opencli/extract → classify → write raw + wiki）→ 单次 commit；7 条规模仍可控
- 备注：raw/dev_methodology 是首次写入此目录（之前 raw 子目录都用 agent_engineering / industry_insight / engineering_roles）


## [2026-05-20] ingest | 智谱 ZCube 推理网络架构
- 存入：raw/ai_native_infra/刚刚，智谱发布AI Infra新成果：ZCube重构大模型推理网络.md
- 新建条目：wiki/AI基础设施/ZCube推理网络架构.md
- wiki/index.md：AI基础设施 +1

## [2026-05-21] ingest | Claude Cowork 销售自动化实战（Travis Bryant）
- 存入：raw/ai_usage/2026-05-20-Anthropic-sales-leader-claude-cowork-4000-accounts.md
- 新建条目：wiki/应用开发/Claude-Cowork销售自动化实战.md
- wiki/index.md：应用开发 +1
- 来源：aihot-daily 2026-05-21 技巧与观点 #6

## [2026-06-03] aihot-pull 产品发布/更新-1 | 候选 1 / 入库 1 / 起草 wiki 0

- run-id: 2026-06-03T06:30:25Z
- 来源：/aihot-daily 2026-06-03 产品发布/更新 #1（定向单条入库）
- 入库:
  - `raw/agent_engineering/2026-06-02-a-harness-for-every-task-dynamic-workflows-in-claude-code.md` (S4_agent, original_full)
- 起草 wiki draft: 无（闸门触发：wiki/ 现有 37 个 status: draft > 10，本次拒绝起草，标记 deferred_draft_quota）
- LLM 建议跳过: 0 条

## [2026-06-03] cleanup | 积压 draft 清理：37 → stable / 2 死链修复

- run-id: 2026-06-03T06:30:25Z
- 操作：4 个并行 agent review 全部 37 个 status:draft wiki 条目（核对 raw 源 + 校验 wikilink + 4 段结构），逐个转 status: stable
- 死链修复 2 处（均为空格短链 → 全路径连字符）:
  - `wiki/应用开发/Token浪费与多模型路由.md`: [[wiki/应用开发/AI Agent PR审查]] → [[wiki/应用开发/AI-Agent-PR审查]]
  - `wiki/模型与技术/Claude-Opus-4.7-Fast-Mode.md`: 同上修复
- 结果：wiki/ 现 0 个 draft，aihot-pull 起草闸门重开
- 闸门重开后补起草：
  - `wiki/应用开发/Claude-Code动态工作流.md` (status: draft) ← raw/agent_engineering/2026-06-02-a-harness-for-every-task-dynamic-workflows-in-claude-code.md
  - 同步更新 index.md 应用开发表 + raw wiki_status: deferred_draft_quota → drafted

## [2026-06-03] aihot-pull 产品发布/更新-7 | 候选 1 / 入库 1 / 起草 wiki 1

- run-id: 2026-06-03T06:55:09Z
- 来源：/aihot-daily 2026-06-03 产品发布/更新 #7（定向单条入库）
- 入库:
  - `raw/agent_engineering/2026-06-02-github-copilot-app-the-agent-native-desktop-experience.md` (S4_agent, original_full)
- 起草 wiki draft:
  - `wiki/应用开发/GitHub-Copilot-Agent-Native桌面.md` (status: draft) — high + original_full，无冲突
- 同步更新 index.md 应用开发表
- LLM 建议跳过: 0 条

## [2026-06-03] aihot-pull 技巧与观点-3,4,5,8 | 候选 4 / 入库 4 / 起草 wiki 2

- run-id: 2026-06-03T06:57:29Z
- 来源：/aihot-daily 2026-06-03 技巧与观点 #3,4,5,8（定向多条入库）
- 入库:
  - `raw/industry_insight/2026-06-02-karpathy-分享学习方法论.md` (S0_industry, aihot_summary_only)
  - `raw/engineering_roles/2026-06-03-running-an-ai-native-engineering-org.md` (S3_roles, original_full)
  - `raw/dev_methodology/2026-06-02-claude-code-自我检查与反馈闭环技巧.md` (S2_methodology, aihot_summary_only)
  - `raw/industry_insight/2026-06-02-why-things-will-eventually-fall-apart.md` (S0_industry, original_full)
- 起草 wiki draft:
  - `wiki/行业洞察/AI-Native工程组织实践.md` (status: draft) — #4 high + original_full
  - `wiki/行业洞察/AI经济不可持续论-Gary-Marcus.md` (status: draft) — #8 high + original_full
- 不起草:
  - #3 Karpathy 学习方法论 → low_confidence_skipped（且 twitter summary_only）
  - #5 Claude Code 自我检查反馈闭环 → not_eligible_summary_only（twitter）
- 同步更新 index.md 行业洞察表 +2
- LLM 建议跳过: 0 条

---

## [2026-06-02] ingest | ZAI 研讨会 AGI 分歧（深度分析变体首例）
- 存入：chat/2026-06-02-llm-can-reach-agi-debate.md
- 新建条目：wiki/行业洞察/LLM-vs-AGI-debate.md

## [2026-06-07] ingest-one | AI 的黑色星期五（Gary Marcus）
- 存入：raw/industry_insight/2026-06-07-AI-的黑色星期五.md
- 更新条目：wiki/行业洞察/AI经济不可持续论-Gary-Marcus.md（加为第2来源，"不可持续论"预测兑现事件）
- 来源：aihot（Notion 日报 2026-06-07 · 技巧与观点第1条）

## [2026-08-19] ingest | Stripe 收购 OpenRouter + 洽购 PayPal（对话研究综合）
- 存入：raw/industry_insight/2026-08-19-stripe-openrouter-paypal-deals.md（多篇新闻整理，非单一原文）
- 新建条目：wiki/行业洞察/Stripe-AI计量层收购战.md
- 同步更新 index.md 行业洞察表 +1
- 来源：WebSearch 多轮核实（Stripe 官方通稿 + Bloomberg/TechCrunch/Axios 等）

## [2026-08-20] ingest | E249 Token经济转点播客（OpenClaw/Hermes/Slock）
- 存入：raw/agent_engineering/2026-08-20-E249-token经济转点-OpenClaw-Hermes-本地自研Agent.md
- 新建条目：wiki/应用开发/Hermes-Slock-Agent工程新范式.md
- 更新条目：wiki/应用开发/OpenClaw-百个Codex实例运营开源项目.md（加为第2来源，补充 OpenClaw 本体产品细节）
- 同步更新 index.md 应用开发表 +1，OpenClaw 条目来源数 1→2
- 来源：NotebookLM 分析 YouTube（https://youtu.be/6FUJbpMrYRA）

## [2026-08-20] ingest | Hermes Agent 补充调研（融资背景 + 安全批评）
- 存入：raw/agent_engineering/2026-08-20-Hermes-Agent-融资与安全批评.md（多篇新闻/文档整理，非单一原文）
- 更新条目：wiki/应用开发/Hermes-Slock-Agent工程新范式.md（加为第2来源：背景/融资/技术精确化/安全批评四节）
- 同步更新 index.md 应用开发表，来源数 1→2
- 来源：WebSearch（TechCrunch、Nous Research 官方文档、MarkTechPost、Repello AI 等）

## [2026-08-25] ingest | 大语言模型并非终局（Rich Sutton 访谈）
- 存入：raw/models/2026-08-25-Rich-Sutton-大语言模型并非终局.md
- 新建条目：wiki/模型与技术/Rich-Sutton-持续学习范式.md
- 同步更新 index.md 模型与技术表 +1
- 来源：NotebookLM 分析 YouTube（https://youtu.be/EfTfAb0Y7WY，红杉资本专访）

## [2026-08-25] ingest | NeoCognition 调研 + 企业 Know-how 存放谱系（对话研究综合）
- 存入：raw/agent_engineering/2026-08-25-NeoCognition-世界模型创业与know-how谱系.md（多篇新闻整理+对话分析，非单一原文）
- 新建条目：wiki/应用开发/企业Know-how存放谱系.md（status: draft，NeoCognition③层未经验证）
- 同步更新 index.md 应用开发表 +1
- 来源：WebSearch（TechCrunch、PR Newswire、Simplify Jobs 招聘信号等）+ 对话中的谱系框架分析

## [2026-08-27] ingest | 夏淳六条判断 + AI时代教育圆桌（跨领域对照综合）
- 存入：raw/others/夏淳-AI商业价值判断六条.md（用户转述，无公开原文）
- 新建条目：wiki/行业洞察/AI时代不可替代能力-产业与教育双视角.md（status: draft，2 来源）
- 同步更新 index.md 行业洞察表 +1
- 来源：用户转述夏淳讲座 + 已存 raw/others/AI时代的教育.md（求是AI联盟圆桌，胡昊撰文）

## [2026-08-27] ingest | AI结构性失业与消费分配（群聊讨论 + "蜂巢结构"框架分析）
- 存入：raw/industry_insight/2026-08-27-AI结构性失业与消费分配-群聊讨论.md（群聊评论+对话分析+学术查证）
- 更新条目：wiki/行业洞察/AI时代不可替代能力-产业与教育双视角.md（加为第3来源："分配机制"新章节，来源数 2→3）
- 同步更新 index.md 行业洞察表
- 来源：白宫官方通稿事实核查 + Acemoglu(MIT)自动化研究 + 《Abundant Intelligence and Deficient Demand》(2026)

## [2026-08-27] update | 修正"分配机制=政府政策"的过窄表述
- 更新条目：wiki/行业洞察/AI时代不可替代能力-产业与教育双视角.md（用户反驳"光靠政府政策不靠谱"后修正，补充市场自我修正/技术扩散/集体谈判/社会舆论/国际竞争五种非政府调节力量；福特工资悖论、OpenAI4S 9.9元案例作为例证）
- 用户原始表述的"三点补充"同步更新第2点措辞

## [2026-08-27] ingest | 李明顺讲座：软件窗口收窄，硬件闭环重新定价
- 存入：raw/industry_insight/2026-08-27-李明顺-硬件闭环重新定价.md（群友转述+事实核查+逐条分析）
- 新建条目：wiki/行业洞察/软件窗口收窄-硬件闭环重新定价.md
- 同步更新 index.md 行业洞察表 +1
- 来源：群友转述 + WebSearch 核查（Plaud 营收数字、MIT NANDA 研究）

## [2026-08-28] ingest | Stop Your Agents From Spinning（生产级Agent工程）
- 存入：raw/agent_engineering/2026-08-28-Stop-Your-Agents-From-Spinning.md
- 新建条目：wiki/应用开发/Agent可靠性工程-验证网关与双纠错环.md
- 同步更新 index.md 应用开发表 +1
- 来源：NotebookLM 分析 YouTube（https://www.youtube.com/live/zjAZDBfUL4k，TwoSetAI 播客）

## [2026-08-28] ingest | Inside AgensFlow（同系列 Workshop #2）
- 存入：raw/agent_engineering/2026-08-28-Inside-AgensFlow-Reliability-Layer-Workshop2.md
- 更新条目：wiki/应用开发/Agent可靠性工程-验证网关与双纠错环.md（加为第2来源："AgensFlow：从静态手段到可学习策略"新章节，来源数 1→2）
- 同步更新 index.md 应用开发表
- 来源：NotebookLM 分析 YouTube（https://www.youtube.com/watch?v=716F3GOsaS4，TwoSetAI Workshop #2；经 Luma 活动页 https://luma.com/inkkj03y 定位到实际视频）

## [2026-08-28] ingest | AgensFlow 深度调研（开源现状/UCB1机制/营销落差/vs OpenSpec）
- 存入：raw/agent_engineering/2026-08-28-AgensFlow-深度调研-开源现状与OpenSpec对比.md（GitHub仓库+arXiv论文+对话分析）
- 更新条目：wiki/应用开发/Agent可靠性工程-验证网关与双纠错环.md（加为第3来源，来源数 2→3；修正"已发布PyPI"错误——实为git clone安装）
- 同步更新 index.md 应用开发表
- 来源：GitHub（Nicolepcx/AgensFlow，21星/7commit/Alpha）+ arXiv:2605.27466 全文

## [2026-08-28] ingest | Software engineering is not about writing code（Benoit Schillings）
- 存入：raw/models/2026-08-28-Benoit-Schillings-软件工程不是写代码.md
- 新建条目：wiki/行业洞察/Benoit-Schillings-软件工程新范式.md
- 同步更新 index.md 行业洞察表 +1
- 来源：NotebookLM 分析 YouTube（https://www.youtube.com/watch?v=1P1hJ36rxM0）

## [2026-08-29] ingest | Microsoft Agent Lightning v1.0（Harnessed Agentic RL）
- 存入：raw/ai_native_infra/2026-08-29-Microsoft-Agent-Lightning-v1.0-Harnessed-Agentic-RL.md（用户转述+事实核查+对话分析）
- 更新条目：wiki/应用开发/企业Know-how存放谱系.md（加为第2来源："④层落地障碍被打开一道口子"新章节，来源数 1→2；含用户指出的star数混淆变量澄清）
- 同步更新 index.md 应用开发表
- 来源：WebSearch核查（The New Stack、arXiv:2608.17528、GitHub microsoft/agent-lightning、Crypto Briefing）

## [2026-08-29] ingest | Cisco MyAgent/Circuit（9万人企业Agent实战案例）
- 存入：raw/agents/2026-08-29-Cisco-MyAgent-企业Agent架构问答分析.md（群友提问+用户判断+WebSearch核实）
- 更新条目：wiki/应用开发/企业Know-how存放谱系.md（加为第3来源："大企业实战案例：Cisco MyAgent/Circuit"新章节，来源数 2→3，status draft→stable）
- 同步更新 index.md 应用开发表
- 来源：WSJ、Cisco Blog、Sacra（Anthropic营收）、Glean官方博客、CloudZero（Copilot定价）

## [2026-08-29] ingest | 模型厂商两面夹击：开源模型 + 企业自建 Agent 层（对话综合分析）
- 存入：raw/industry_insight/2026-08-29-模型厂商两面夹击-开源与企业自建Agent.md（用户判断+对话分析，综合已存的Stripe-OpenRouter/Cisco两条研究）
- 更新条目：wiki/应用开发/企业Know-how存放谱系.md（加为第4来源，来源数 3→4；同时修正一处误引不存在页面的wikilink）
- 同步更新 index.md 应用开发表
- 来源：对话分析，无新增外部信源

## [2026-08-30] update | 框架结构性修正：Harness容器论 + 上下文原料层
- 存入：raw/agent_engineering/2026-08-30-Harness容器论与上下文原料层-谱系框架修正.md（群友理论修正+《办公Agent大战》一文+对话分析）
- 重大更新：wiki/应用开发/企业Know-how存放谱系.md（重写"定义"+"核心要点"，采纳"Harness是容器不是层"的修正；术语校准为context engineering/agent memory/RLVR/agentic RL post-training；新增"上下文原料层"章节——四种机制均隐含"已有干净上下文"前提，此前提本身是更前置的瓶颈；来源数 4→5）
- 同步更新 index.md 应用开发表
- 来源：群聊理论讨论 + raw/agents/办公Agent大战，重点不是Agent.md（已存未入wiki的旧raw文件，此次首次引用）

## [2026-09-01] ingest | 9-1群讨论：Predict vs Optimize、流形与吸引子盆地
- 存入：raw/models/9-1讨论.md（已有原始群聊记录，本次整理摘要）
- 更新条目：wiki/行业洞察/杨立昆LLM局限论与世界模型.md（加为第2来源，来源数 1→2）
- 同步更新 index.md 行业洞察表
- 来源：群聊讨论（Lijia Zhang 入群 + 杨立昆 presentation 引发的 predict/optimize 辨析）

## [2026-09-01] ingest | 流形假设的三个待验证前提（Lijia回复 + 用户熵增质疑）
- 存入：raw/models/2026-09-01-流形假设的三个待验证前提.md（群聊讨论+对话分析）
- 更新条目：wiki/行业洞察/杨立昆LLM局限论与世界模型.md（加为第3来源；补充"追问一/追问二"两节承接用户此前的satisficing/判别器论点；来源数 2→3）
- 同步更新 index.md 行业洞察表
- 来源：群聊讨论（Lijia Zhang 技术回应 + 用户熵增理论质疑，无公开链接）

## [2026-09-02] update | 追问：LLM训练能否做到"开放系统排熵"
- 更新：raw/models/2026-09-01-流形假设的三个待验证前提.md（新增追问章节：静态预训练套不上开放系统排熵机制，但RLVR/持续学习方向上有真正落脚点）
- 更新条目：wiki/行业洞察/杨立昆LLM局限论与世界模型.md（③熵增质疑后追加此追问，串联Agent Lightning RLVR + Rich Sutton持续学习两条已有条目）
- 来源：群聊讨论延续（无公开链接）

## [2026-09-03] ingest | 马斯克G20创新部长级会议发言（电力缺口预警）
- 存入：raw/industry_insight/2026-09-03-马斯克G20创新部长级会议发言.md（多篇报道整理）
- 新建条目：wiki/行业洞察/马斯克G20电力缺口预警.md
- 同步更新 index.md 行业洞察表 +1
- 来源：WebSearch核实（singjupost转录稿、techxplore、白宫官方通稿、ABC11、CNBC）

## [2026-09-06] ingest-one | An Alien Mind — Jakub Pachocki（深度分析变体，controversy=true）
- 存入：raw/industry_insight/2026-09-06-openai-an-alien-mind-jakub-pachocki.md
- 更新条目：wiki/行业洞察/Claude自我设计-RSI起点.md（加为第2来源，新增"分歧矩阵"章节——Anthropic乐观框架 vs OpenAI审慎框架，同一RSI现实两种情绪判断，显式保留分歧不磨平；来源数 1→2）
- 同步更新 index.md 行业洞察表
- 来源：openai.com官方文章 + askwhocastsai substack转述 + tildes讨论串

## [2026-09-06] ingest | RSI业界四阵营全景（扩展分歧矩阵为完整光谱）
- 存入：raw/industry_insight/2026-09-06-RSI业界四阵营全景.md（多篇报道综合）
- 更新条目：wiki/行业洞察/Claude自我设计-RSI起点.md（加为第3来源，新增"RSI业界四阵营全景"章节：①Bengio暂停派 ②Anthropic内部分裂(Jack Clark概率预测vs Favaro克制) ③普林斯顿技术怀疑派(Sayash Kapoor) ④Toner定义批判派；来源数 2→3）
- 同步更新 index.md 行业洞察表
- 来源：MIT Technology Review、TechCrunch、Peter Wildeford博客、MindStudio、Time、CACM、Bengio推文

## [2026-09-06] ingest | RSI真金白银下注：田渊栋RSI公司 + Jeff Dean Discovery Loop
- 存入：raw/industry_insight/2026-09-06-RSI真金白银下注-田渊栋与JeffDean创业.md（来自ai-research项目GTLC硅谷现场记录 + WebSearch最新动态核实）
- 来源：TechCrunch、AWS Press Center、Recursive官方博客、GitHub、CNBC

## [2026-09-07] update | RSI"四阵营"重构为"两轴光谱"（用户指出阵营过多，情绪判断与信念判断被混在一条轴上）
- 更新条目：wiki/行业洞察/Claude自我设计-RSI起点.md（"四阵营全景"章节重写为"两轴光谱：情绪轴×信念轴"2x2矩阵；正式纳入前一天创建但未链接的"真金白银下注"raw文件作为"相信+乐观"格的实证案例；来源数 3→4）
- 同步更新 index.md 行业洞察表
- 来源：对话中的结构性讨论，无新增外部信源

## [2026-09-07] ingest | AI4AI Bench + OMAM（YouTube）+ RSI验证瓶颈论（gpts24.com）
- 存入：raw/industry_insight/2026-09-07-AI4AI-Bench与OMAM-RSI技术证据.md（NotebookLM总结YouTube视频）、raw/industry_insight/2026-09-07-RSI验证瓶颈-gpts24.md
- 更新条目：wiki/行业洞察/Claude自我设计-RSI起点.md（新增"技术证据升级：从'能不能'到'验证跟不跟得上'"一节——AI4AI Bench具体分数、AlphaEvolve生产环境实证、METR reward-hacking趋势数据；把此前的立场辩论落到可复现的技术层；来源数 4→6；tags加AlphaEvolve/METR/reward-hacking/AI4AI-Bench）
- 同步更新 index.md 行业洞察表（来源数6）

## [2026-09-14] ingest | HuggingFace：NVIDIA收购专访 + 10分钟入门科普
- 存入：raw/industry_insight/hugging face/2026-09-14-NVIDIA收购HuggingFace-黄仁勋CNBC专访.md（NotebookLM总结YouTube字幕）、raw/industry_insight/hugging face/2026-09-14-HuggingFace10分钟快速入门-洛克船长.md（视频无字幕，yt-dlp抽音频+fal.ai Whisper转写后整理）
- 新建条目：wiki/行业洞察/HuggingFace-开源AI基础设施.md（Hugging Face从2019年开源Transformers意外转型model hub，到2026年被NVIDIA以129.3亿美元收购的完整脉络；黄仁勋开源三理由；NVIDIA 50%业务由开源驱动；2026生态数据20万企业客户/1800万开发者/300万模型；来源数2）
- 同步更新 index.md 行业洞察表

## [2026-09-15] ingest | HuggingFace补充调研：收购细节/商业模式 + OpenAI Agent攻击事件（Luwei模式）
- 存入：raw/industry_insight/hugging face/2026-09-15-NVIDIA收购交易细节与商业模式.md（WebSearch+WebFetch多信源）、raw/industry_insight/hugging face/2026-09-15-OpenAI-Agent集群攻击HuggingFace事件.md（高价值+争议事件，Luwei模式，保留分歧）
- 更新条目：wiki/行业洞察/HuggingFace-开源AI基础设施.md（补充精确交易结构$119亿+$10亿留任/2027H1交割/NVIDIA史上第二大收购；商业模式ARR $1-1.5亿/Inference Endpoints 40%+Enterprise Hub 35%；Delangue"中国占下载41%"判断；来源数2→4）
- 新建条目：wiki/行业洞察/OpenAI-Agent集群攻击HuggingFace事件.md（1200+agent蜂群协同入侵，1/3基础设施重建，reward hacking根因，分歧矩阵：Anthropic"首个真实AI安全事件" vs OpenAI"可预期训练副产物"；与Claude自我设计-RSI起点的METR数据互相印证）
- 同步更新 index.md 行业洞察表
