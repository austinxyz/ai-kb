# Cisco MyAgent：企业 Agent 架构问答分析

**整理日期**：2026-08-29
**背景**：群友针对 [[raw/agents/Cisco 给 9 万员工配上个人 Agent：记住你的一切，还能替你跨系统办事]] 提问，用户提出自己的判断并请求核实
**来源**：Cisco 原文 + WebSearch 核实（见文末）

---

## 群友问题

> 这个 Agent 是 Cisco 自己开发的，还是基于 OpenAI/Claude 等基础模型结合自有数据开发的企业内部 Agent？Cisco 选择这种方式主要考量是什么——数据安全合规，还是成本效率，还是深度连接内部系统？Claude 和 OpenAI 目前主要客户是个人/中小企业还是大型企业？未来是否会形成"基础模型/AI平台 → 企业数据和工作流程 → 内部Agent"的模式？

## 用户的判断

> 重点可能还是企业数据和know-how，这部分企业不希望直接给Anthropic或者OpenAI。那么自己将这一层比较安全，也更可控。Glean实际上是直接搭建这样的框架。大企业用claude也很多，不过现在再往回缩，自己用开源模型来搭建基础模型越来越多。总的趋势是肯定的，从拼大模型，转到拼Agent...但是谁可以把握主动权，大模型产商和大企业会有博弈。

---

## 一、Cisco 技术来源核实

MyAgent 是 Cisco **完全内部研发**，不是三方模型公司定制交付，也不是独立训练的大模型。建在 Cisco 自 2023 年搭建的内部平台 **Circuit** 之上（核心团队约40人）。

**Circuit 架构：多模型路由层，不绑定单一厂商**——可调用 Azure OpenAI、Claude、Gemini、Cisco 自研 Deep Network Model、开放权重模型、内部团队自建 Agent、传统自动化工具，按任务类型/成本/延迟/能力自动路由。

**实测流量分布**：约 50-60% 请求由**开放权重模型**处理（Cisco 自有数据中心 GPU 跑），约 20-30% 交给传统软件自动化，只有很小一部分才真正调用外部前沿大模型。

## 二、Cisco 选择这条路的考量——安全信任优先，成本第二

官方原话：Subaiya 说"最初使用时最需要的就是安全和信任"。根本原因追溯到 2023 年做第一代助手时，就是怕员工把内部数据、客户信息直接喂进公开的 ChatGPT——不是先想清楚战略再动手，是先解决"敢不敢用"的信任问题。

成本是第二位但同样现实：9万人×持久记忆+多次工具调用的模式，token消耗指数增长。Cisco 明确不是"最强模型包办一切"，大模型只当规划判断层，确定性步骤交给规则/API/自动化。Circuit 上 agentic interactions 环比涨了近350%，这个增长倒逼了路由降本机制。

**第三层考量（原文提到但常被忽略）**：Cisco 明确把这次部署定位成"零号客户"实验——目的是把内部实践打包成向外部客户销售的企业 AI 架构蓝图。收购 Splunk 带来可观测性能力，用9万人验证出来的治理+成本体系本身就是产品。

## 三、Claude/OpenAI 的客户定位核实——企业早已是核心，不是边缘市场

**Anthropic 80% 的收入来自 30万+ 企业客户**，超过1000个客户年花费超过 $100万（2026年4月这个数字比两个月前翻了一倍）。企业不是 Anthropic 的边缘市场，是收入主体。

**结论**：群友"未来大企业会自建 Agent、模型厂商退到底层"的直觉方向对，但时间线要修正——这个格局**现在就已经是主流**，不是"未来会形成"。Circuit 架构本身就是例证：基础模型被 Cisco 当成可替换的商品化组件，路由层根据成本/能力挑用哪个，前沿模型只吃最难的一小部分请求。群友总结的"基础模型/AI平台 → 企业数据和工作流程 → 内部Agent"三层结构，跟 Circuit 实际架构完全对得上。

## 四、对用户判断的逐条核实

- **"企业不想把 know-how 直接给 Anthropic/OpenAI，自己做这层更安全可控"**——完全对，Cisco 案例是最直接的证据，也验证了 [[wiki/应用开发/企业Know-how存放谱系|企业Know-how存放谱系]] 框架：Cisco 把企业专属流程/权限/数据留在自己手里，模型只是被路由调用的组件
- **"开源模型自建越来越多"**——查证属实，Cisco 50-60%流量走自己GPU跑的开放权重模型，是这类大厂的普遍路径
- **"企业10万20万订阅Copilot"**——Microsoft 365 Copilot 企业版 $30/用户/月，500人规模一年 $41.4万；如果是自建 Agent 用 Copilot Studio（按调用量计费），单个 CRM 挂钩的 Agent 一天1万次交互，一个月成本能到 $9万-30万——数字量级对，需分清是"多少人订阅"还是"单个 Agent 月度调用成本"
- **"Glean 直接做这层"**——查证准确，Glean 官方定位是"企业级 Work AI 平台"，今年2月推出 Glean Agents，主打"横向打通全公司数据+权限治理"，跟 Circuit 是同一赛道的独立商业化产品
- **"模型产商和大企业会有博弈"**——Cisco 案例里模型厂商已经被路由层拉到跟传统自动化工具同一梯队里比价，对 OpenAI/Anthropic 是警讯：如果大企业都走这条路，前沿模型议价权会被压缩到只剩"最难的一小部分请求"，主战场变成"谁能提供更好的路由/治理/Agent Registry 这层基础设施"——与软件窗口收窄、价值转移到硬件闭环是同一逻辑在企业软件层面的翻版

---

## 来源

- [[raw/agents/Cisco 给 9 万员工配上个人 Agent：记住你的一切，还能替你跨系统办事]]（原文，含 WSJ/Cisco Blog 等参考链接）
- [WSJ: Cisco gave all 90,000 employees their own AI agent](https://www.wsj.com/cio-journal/cisco-gave-all-90-000-employees-their-own-ai-agent-1a4ad8bc)
- [Cisco Blog: My Agent and the rise of ambient intelligence](https://blogs.cisco.com/news/my-agent-and-the-rise-of-ambient-intelligence-ciscos-next-step-in-enterprise-ai)
- [Cisco Blog: Secure internal AI assistant](https://blogs.cisco.com/cisco-on-cisco/cisco-secure-internal-ai-assistant)
- [Sacra: Anthropic revenue](https://sacra.com/c/anthropic/)
- [Glean: Introducing Glean Agents](https://www.glean.com/blog/glean-agents-launch-blog)
- [CloudZero: Copilot Studio Pricing 2026](https://www.cloudzero.com/blog/copilot-studio-pricing/)
