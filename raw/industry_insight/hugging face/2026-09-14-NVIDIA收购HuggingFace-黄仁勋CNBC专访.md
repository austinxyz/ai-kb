# NVIDIA 收购 Hugging Face：黄仁勋 CNBC 专访详细整理

**整理日期**：2026-09-14
**来源**：YouTube《Nvidia CEO Jensen Huang on Hugging Face deal: Open models matter greatly to our company》
https://youtu.be/ZHXzNEFvO3A
**方法**：NotebookLM 总结（YouTube 官方字幕）

---

## 背景

CNBC 晨间专访节目，就 NVIDIA 宣布收购 Hugging Face 的重磅交易，NVIDIA CEO 黄仁勋与 Hugging Face CEO Clem Delangue 接受主持人 Andrew、Becky 现场连线专访。采访时两人背景中都摆着 Hugging Face 标志性的表情符号招牌。黄仁勋在采访前刚参加完 Hugging Face 的全员大会。

## 一、交易性质、金额与动机

**交易结构**：NVIDIA 正式收购 Hugging Face。交易完成后，Hugging Face 三位联合创始人及全员加入 NVIDIA。Hugging Face 将作为 NVIDIA 内部的**独立、中立平台**继续运营，不并入闭源产品线。

**金额**：**129.3 亿美元**（$12.93 Billion）成交。黄仁勋透露当时还有其他竞标者，129.3亿是达成交易所需的价格，原话"每一分钱都物有所值"（worth every single penny）。对比 Hugging Face 2023年融资估值 45亿美元，涨幅巨大。

**双方动机**：
- **Hugging Face 侧**：Clem 说今年夏天团队意识到开源 AI 到了关键转折点，需要更多资源、规模和曝光度。他去找黄仁勋，说"想把开源AI做大"（we want to make open source AI big），黄仁勋当场回"说干就干"（let's do it）。
- **NVIDIA 侧**：黄仁勋称开源模型对 NVIDIA 极其重要，是公司业务的重要增长引擎。得知 Hugging Face 在找新归宿且面临其他买家竞标，他认为必须确保这个关键平台落在对的地方，并给它扩展开源生态所需的全部资源。

## 二、黄仁勋对"开源模型为什么重要"的论述

**行业两条路径**（Clem 和黄仁勋共同点出）：
1. 闭源 API 主导——大家向少数巨头租 AI API，把 AI 业务外包
2. 开源 AI 普及——所有人都能当 AI 的**拥有者和构建者**（owner, builder），不只是租用者

**企业必须拥有开源模型的理由**：
- 保护核心知识产权与私有数据——比如基础科学研究这类拥有独特领域知识/私有数据的企业，必须对技术有掌控权和自主所有权
- 监管与数据主权限制——很多机构因合规或国家数据主权要求，不能直接用外部托管的闭源 API
- 技术成熟度到了临界点——目前开源前沿模型（open frontier AI models）和 agent harness systems 的性能已经足够支撑企业自主构建 AI

**开源闭源并行互补**：黄仁勋明确说他很推荐用开箱即用的闭源 API（NVIDIA 内部也大量租用），但开源模型的加速发展同样极其关键，目前两边都在高速增长，不是零和。

## 三、具体数字

**Hugging Face 生态数据**：
- 全球 **20万**（200,000）企业客户
- **1800万**（18 million）全球 AI 构建者/开发者
- 平台托管 **300万**（3 million）个可用模型
- 覆盖语言、世界基础模型、物理、化学、生物、机器人等所有 AI 领域
- 远期目标：未来几年把 Hugging Face 上的构建者规模扩到 **1亿**（100 million）

**NVIDIA 业务结构**：
- 云服务提供商（CSP）只占 NVIDIA 业务的 **50%**，另外 **50%** 很大程度由**开源模型**驱动
- NVIDIA 是全球最大的 AI 计算平台，同时也是全球**最大的开源模型贡献者**
- NVIDIA 内部写代码/日常工作大量租用闭源工具：**Claude Code、Codex、Perplexity、Cursor**

**顺带提及的行业动态**：
- Anthropic 预计未来几个月内 IPO
- OpenAI 的 Agents 在今年5-7月取得重大突破

## 四、对 NVIDIA 战略和 AI 生态的意义

**对 NVIDIA**：
- 强化闭源+开源两侧双向增长战略（各占业务半壁江山），不管市场偏向哪边 NVIDIA 都受益
- 掌控最大的开源模型托管/开发者社区，直接锁定1800万（未来1亿）AI 构建者在训练/微调/推理上的硬件算力需求

**对整个生态**：
- 保障开源平台中立独立——NVIDIA 注资算力和资金，同时承诺保持 Hugging Face 独立中立，防止被闭源 API 巨头封锁
- 促进 AI 技术民主化——确保开源技术持续分发全球，避免行业走向垄断

## 值得关注的分析角度（供AI4D报告参考）

这笔交易是"硬件公司收购开源生态入口"的典型案例，跟 wiki 里已有的"企业Know-how存放谱系"讨论有交叉——Hugging Face 的300万模型+1800万开发者，本质是给企业提供了"不依赖闭源API租用"的另一条技术自主路径，跟黄仁勋说的"监管/数据主权限制"理由直接呼应。NVIDIA 50%业务由开源驱动这个数字，也是"开源不是慈善，是真实的算力生意"最直接的证据。

---

## 来源

- YouTube: [Nvidia CEO Jensen Huang on Hugging Face deal: Open models matter greatly to our company](https://youtu.be/ZHXzNEFvO3A)
