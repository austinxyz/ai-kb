---
title: 企业Know-how存放谱系
category: 应用开发
tags: [RAG, Harness, 世界模型, 持续学习, NeoCognition, 企业AI, 微调, Agent Lightning, 强化学习, Cisco, Circuit, Glean, context engineering, agent memory, RLVR]
source: "[[raw/agent_engineering/2026-08-25-NeoCognition-世界模型创业与know-how谱系|NeoCognition：世界模型创业与Know-how谱系]]"
updated: 2026-08-30
status: stable
---

## 定义

大模型作为"知识"层已经够用，但作为企业"技能/know-how"层仍有差距——原因是企业的流程、约束、隐性经验不在公开训练数据里，模型权重固定后也无法结合企业情况持续改变。业界应对这个缺口的方案本质上是**同一个问题（"Agent怎么变强"）的几种并存机制，不是必须依次穿过的架构层**，区别在于改动发生在哪、成本多高，生产系统通常混用而非二选一。**Agent = Model + Harness**，Harness 是容器，RAG/memory/持续学习/权重训练都是装在这个容器里（或直接改容器外的模型本身）的不同选项。NeoCognition（$40M 种子轮，2026-04）是这些机制里押注最深、也最未经验证的一档。

## 核心要点（2026-08-30 框架修正版）

**机制从"外置"到"内化"，不是分层，是选项**：
- **RAG / context engineering**：知识存外部数据库，查询时检索塞进 prompt。只能存"事实"，存不了"怎么干活"。业界现更多把 RAG 并入 **context engineering** 这个大概念下
- **Agent memory（Harness 内组件）**：知识存结构化技能/经验文件，Agent 自己维护更新（见 [[wiki/应用开发/Hermes-Slock-Agent工程新范式|Hermes 技能沉淀]]）。标准说法分 episodic/semantic/procedural 三类记忆。本质是"外挂"，模型本身没变
- **世界模型/持续学习（Harness 内，业界无共识的一档）**：分两派互不相认正统——① **training-free 的 test-time/continual learning**（本质是 memory 套了层 RL 话术，NeoCognition 属于这派，5个月零论文零benchmark的可疑处正对应这个判断）；② **真做参数更新但很轻很快**（LoRA快节奏），暂无查到的对号案例
- **权重训练 / post-training**：知识存模型参数本身，标准叫法涵盖 SFT/RLHF/DPO/GRPO/**RLVR**。Agent Lightning 这类"把Harness轨迹变训练数据"的路子，业界叫 **agentic RL post-training** 或 **rollout-as-a-service**；其 reward 来自任务结果可验证（SWE-bench 跑没跑通），精确归类是 **RLVR**（Reinforcement Learning from Verifiable Rewards），不是 RLHF/DPO 那挂——RLVR 是这两年把 agentic RL 做到低成本可复现的关键前提

**关键澄清**：
- RAG 与 memory 不是替代关系，是**互补**——成熟系统通常两者叠加
- 前三种机制解决的是"know-how 外置于 Harness"，本质上没碰模型本身——是**绕过**"模型不懂企业 know-how"这个问题，不是**解决**它；只有权重训练/post-training 是真正啃最硬的骨头，代价最高，效果上限也最高
- test-time/continual learning 这一派如果真做到了，才是 Rich Sutton 讲的持续学习在企业场景的具体落地

**NeoCognition 现状（2026-08-25 查证）**：$40M 种子轮，团队出自俄亥俄州立大学 AI Agent Lab（Yu Su/Xiang Deng/Yu Gu），核心痛点锚定"Agent 独立完成任务成功率仅约 50%"。技术表述含糊——只说"构建 world model"、"不必完整重训就能动态更新行为"，**5 个月内零技术论文、零 benchmark、零客户案例**。唯一新信号是 7 月一则面向 Series A/企业客户组织架构的招聘，暗示商业化推进但技术路线仍未验证。

**风险判断**：③揭盅时很可能发现本质是②的更精致版本（如可学习检索索引、轻量表征微调），"世界模型"更多是叙事包装而非全新范式——但即便如此，若真做出可靠动态更新机制，商业价值依然巨大。

## 权重训练/post-training 的落地障碍被打开一道口子：Microsoft Agent Lightning v1.0（第2来源，2026-08-29）

此前判断"权重训练太贵不现实"，主要卡点是**训练-服务失配**（train-serve mismatch）——RL 训练环境和生产部署环境不是同一套代码/工具/上下文，训出来的东西未必真适配生产。

**2026-08-17 Microsoft 开源 Agent Lightning v1.0** 正面解决这个卡点：让生产用的 Harness 本身直接变成训练环境，Agent 代码/工具"ZERO changes"，用 API Gateway 无侵入截获真实交互数据喂给 RL 算法。实测：6000条训练样本+适度算力，Qwen3.5-9B 在 SWE-bench Verified 从 41.8%→56.4%（+14.6分）。

**准确定位**：它把 **Harness 执行轨迹直接变成 agentic RL post-training（RLVR）的原料**，打通了"Harness 内机制"通往"权重训练"这条路。3500行核心代码本身不实现 RL 算法——真正的策略训练委托给成熟框架 **VERL**（+ vLLM 做推理服务），微软自己只写了"怎么把 Harness 执行轨迹无损转换成 VERL 训练样本"这层编排代码，创新点是"层次化信度分配"（多步轨迹的 reward 怎么合理分摊回每一步决策），不是算法突破。

**与 NeoCognition/AgensFlow 的对照**：AgensFlow（见 [[wiki/应用开发/Agent可靠性工程-验证网关与双纠错环|Agent可靠性工程]]）名字叫"可学习的协同"，但本质上一直不敢碰权重——用 UCB1 老虎机学 Harness 路由策略，权重冻结，是纯 Harness 内机制。Agent Lightning 直接把最难的"权重训练"这条路蹚通了。**两者是同一问题的两种野心程度不同的答案**——AgensFlow 是保守解（不碰权重），Agent Lightning 是激进解（真做 RLVR）。

**关于 star 数对比的澄清**：Agent Lightning 17.9k星 vs AgensFlow 21星，这个差距不能简单读成"技术更成熟"——**发布方是微软还是无名个体研究者，本身就是 star 数的最大混淆变量**，微软品牌自带流量，不代表代码质量或工程严谨度有等量差距。更可靠的成熟度信号是文中列的实质差异：**是否依赖成熟RL框架（VERL）落地权重训练、是否有真实benchmark数字（SWE-bench 14.6分提升）**——这些和"是谁发布的"无关，是可独立核查的技术事实。

## 大企业实战案例：Cisco MyAgent/Circuit（第3来源，2026-08-29）

Cisco 2026-08-27 宣布向全球约9万名员工部署个人 Agent **MyAgent**，是目前查到的最完整、最可验证的企业实战案例，直接印证本条目谱系框架。

**技术来源**：MyAgent 完全内部研发，不是三方模型公司交付，建在 Cisco 自 2023 年搭建的内部平台 **Circuit** 之上（核心团队约40人）。Circuit 是**多模型路由层，不绑定单一厂商**——可调用 Azure OpenAI、Claude、Gemini、Cisco 自研模型、开放权重模型、内部自建 Agent、传统自动化工具，按任务类型/成本/延迟/能力自动路由。实测流量分布：约50-60%请求走**自有GPU跑的开放权重模型**，20-30%交给传统自动化，只有很小一部分真正调用外部前沿大模型。

**选择这条路的三层考量**：① 安全信任优先——2023年做第一代助手就是怕员工把内部数据喂进公开ChatGPT；② 成本——9万人×持久记忆+多工具调用，token消耗指数增长，Circuit agentic interactions 环比涨了近350%，倒逼路由降本；③ **产品化企图**——Cisco 明确把这次部署定位成"零号客户"实验，目的是把内部实践打包成向外部客户销售的企业AI架构蓝图（叠加收购的 Splunk 可观测性能力）。

**对谱系的印证**：Circuit 把基础模型当成**可替换的商品化组件**，企业专属的流程/权限/数据留在自己手里（对应 Harness 内的 context engineering + memory 机制），模型只是被路由调用的执行单元——这是 RAG+memory 组合在真实大厂的完整落地，不是理论推演。

**对模型厂商的启示**：Anthropic 80%收入来自30万+企业客户，超1000个客户年花费超$100万——企业早已是模型厂商的收入主体，不是边缘市场。但 Cisco 案例显示模型厂商已被路由层拉到跟传统自动化工具同一梯队里比价——如果大企业普遍走这条路，前沿模型议价权会被压缩到只剩"最难的一小部分请求"，主战场变成"谁能提供更好的路由/治理/Agent Registry 这层基础设施"（Glean 是这层的独立商业化产品案例）。这与 [[wiki/行业洞察/软件窗口收窄-硬件闭环重新定价|软件窗口收窄]] 是同一逻辑在企业软件层面的翻版。

## 模型厂商的两面夹击：开源模型 + 企业自建 Agent 层（第4来源，2026-08-29）

结合 [[wiki/行业洞察/Stripe-AI计量层收购战|Stripe 收购 OpenRouter]] 与本条目 Cisco 案例，可归纳出模型厂商正被**同一利润池两头挤压、机制不同**：

- **上方（开源模型）挤"能力溢价"**：Qwen、DeepSeek 持续打穿"模型本身值多少钱"的假设——Cisco 50-60%流量走自有GPU开源模型即是明证，压的是**定价权**
- **下方（企业自建 Agent 层）挤"入口权"**：Circuit/MyAgent 把模型变成路由表里可替换的一行，企业攥住流程/权限/数据，模型厂商连"谁在用"都未必看得清全貌，压的是**分发权**

**两头一起挤比单独任何一个更致命**：定价权在，分发权丢了能靠"绕不开我"硬扛；分发权在，定价权松动能靠走量补；两个同时松动，是教科书式两面夹击。

**Stripe 收购 OpenRouter 是这场夹击的先手信号**：当模型厂商传统议价方式（"我更强你多付"）同时被开源和企业自建架空，真正能收租的位置变成"谁经手调用、谁管计量计费"——这正是路由/网关层，Stripe 买的不是模型能力，是提前卡进必然被重新定价的位置。

**大模型巨头的三种应对推演**：① 往路由层反打，自己做企业级路由/治理产品（如 Claude for Enterprise、MCP，本质是不想被架空）；② 算力护城河收窄到"守住最难的一小撮高价值请求"——算力优势在通用模型竞赛里边际效应递减，但在这个更窄的战场里可能重新变得关键；③ 深度绑定而非浅层API，主动开源 Harness 层占心智（如 OpenAI 开源 Codex Harness），即使企业自建，架构范式也是自己定的。

**结论**：这波挤压大概率不会消灭大模型巨头，而是逼它们从"卖模型"转向"卖整套企业AI架构（模型+路由+治理+Harness）"——跟 Cisco 自己在干的事本质相同，只是巨头要抢先做，否则会被企业和 Stripe 这类第三方抢占位置。

## 框架结构性修正：Harness 是容器不是层 + 上下文"原料层"前置于一切机制（第5来源，2026-08-30）

群友对原"四层谱系"提出理论修正，本条目采纳并据此重写了上面的核心要点。

**Harness 容器论**：原框架把 RAG/Harness/世界模型/权重训练列成需依次穿过的四"层"，存在逻辑瑕疵——RAG/memory/持续学习不是跟 Harness 并列的层，是**装在 Harness 容器里的组件**。准确图景是 Agent = Model + Harness，模型权重是一侧，Harness（工具调用循环、context管理、memory、可观测性）是另一侧，各机制的区别只是"改动位置"和"成本"，不是必须依次穿过的架构层。

**术语与已查案例对号**：NeoCognition 对应"training-free test-time/continual learning"派（memory套RL话术，5个月零披露印证了这个怀疑）；AgensFlow 是纯 Harness 内机制（UCB1不碰权重）；Agent Lightning 精确对应"agentic RL post-training / rollout-as-a-service"，其 reward 来自可验证任务结果，应归入 **RLVR** 子类而非 RLHF/DPO。

**缺口：上下文"原料层"先于一切机制**（来自 [[raw/agents/办公Agent大战，重点不是Agent|《办公Agent大战，重点不是Agent》]]一文）：以上所有机制（RAG/memory/权重训练）都隐含一个前提——**已经有干净、结构化的上下文可以喂**。但大部分企业的上下文从未被结构化沉淀，散落在群聊、临时会议、口头交流里。RAG查不到没被记录的东西，memory攒不出没发生过的交互，权重训练更不用说——**没有一种机制能解决"原料不存在"这个问题**。飞书的护城河论点正是把"上下文沉淀"做成云文档/多维表格/评论留痕这类工作过程的副产品，不需要事后搬运。

**修正后的完整图景是五层，不是四层**：**原料层（上下文能否被结构化捕获）→ Model+Harness容器 → 容器内的context engineering/memory/持续学习/权重训练机制**。这与 Cisco Circuit 案例吻合——Circuit 好用的前提是 Cisco 自2023年就打下的数字化基础，普通企业没这个底子，后面的机制再精妙也没有原料可喂，这也是"个人Agent好用、企业Agent还没雏形"最直接的解释。

## 与其他概念的关系

- [[wiki/模型与技术/Rich-Sutton-持续学习范式|Rich Sutton 持续学习范式]]：③"世界模型/动态表征"这一档，正是 Sutton 说的"持续学习"在企业落地场景的具体形态；NeoCognition 是否能兑现，直接检验 Sutton 论断的产业可行性
- [[wiki/应用开发/Hermes-Slock-Agent工程新范式|Hermes / Slock：Agent 工程新范式]]：Hermes 的技能沉淀机制是谱系②的代表性实现，是目前唯一被广泛验证、能规模化运行的"know-how 外置"方案
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：②这一档本质上是 Harness Engineering 的一个具体应用场景——把企业专属经验编码进 harness 层而非模型权重
- [[wiki/行业洞察/软件窗口收窄-硬件闭环重新定价|软件窗口收窄：硬件闭环重新定价]]：Cisco 案例中模型厂商被路由层压缩议价权，与软件价值转移到硬件/供应链闭环是同一逻辑在企业软件层面的翻版

## 参考来源

- [[raw/agent_engineering/2026-08-25-NeoCognition-世界模型创业与know-how谱系|NeoCognition：世界模型创业与Know-how谱系]]
- [[raw/ai_native_infra/2026-08-29-Microsoft-Agent-Lightning-v1.0-Harnessed-Agentic-RL|Microsoft Agent Lightning v1.0：Harnessed Agentic RL]]
- [[raw/agents/2026-08-29-Cisco-MyAgent-企业Agent架构问答分析|Cisco MyAgent：企业 Agent 架构问答分析]]
- [[raw/industry_insight/2026-08-29-模型厂商两面夹击-开源与企业自建Agent|模型厂商的两面夹击：开源模型 + 企业自建 Agent 层]]
- [[raw/agent_engineering/2026-08-30-Harness容器论与上下文原料层-谱系框架修正|Harness容器论与上下文原料层：谱系框架修正]]
- [[raw/agents/办公Agent大战，重点不是Agent]]
