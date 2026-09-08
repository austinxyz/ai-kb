---
title: Claude自我设计：RSI起点与Anthropic工程师角色转变
category: 行业洞察
tags: [RSI, Anthropic, OpenAI, 工程师角色, 递归自我改进, AI安全, 对齐, controversy, Bengio, Jack Clark, Helen Toner, 田渊栋, Jeff Dean, Richard Socher, AlphaEvolve, METR, reward-hacking, AI4AI-Bench]
source: "[[raw/engineering_roles/2026-05-05-Anthropic-CEO-Dario-Amodei的那句-Claude在设计Claude-炸了整个AI圈-但似乎很多人都看错了重点-重点不是-RSI来了-而是]]"
updated: 2026-09-07
status: stable
aihot_origin:
  aihot_id: "cmos21kp804alslrj8c6ettc6"
  series: S3_roles
  drafted_by: aihot-pull
  drafted_at: 2026-05-16
---

## 定义

Dario Amodei 透露 Claude 正在参与设计 Claude 本身，标志递归自我改进（RSI）迈出关键一步：AI 接管了生产自身的整个工厂，工程师角色从生产者转变为监督者。

## 核心要点

- **真实状态**：Anthropic 工程师基本不再手写代码，转为编写 Prompt、审查代码、确定架构
- **效率数据**：仅 52 天推出 50 多个重大功能，人均产出提升超 10 倍
- **RSI 的意义**：关键不在于"RSI 来了"，而是第一个被 AI 彻底重构的公司已经出现
- **人类角色**：生产者 → 监督者，控制整个 AI 闭环的"系统思维"能力成为核心价值
- **警示预测**：Dario 认为未来仅约 5% 的开发者能留在核心领域

## 分歧矩阵：RSI 是生产力胜利，还是风险警报？（第2来源，2026-09-06）

同一个技术现实（AI 开始参与设计/改进 AI 自己），两家最前沿实验室的首席科学家/CEO 给出了**完全相反的情绪判断**——这是一场真实的、值得原样保留的分歧，不该被磨平成"AI越来越强"这类空洞结论。

| | Anthropic（Dario Amodei，2026-05）| OpenAI（Jakub Pachocki，2026-09-06《An Alien Mind》）|
|---|---|---|
| 情绪基调 | 近乎庆祝——52天推50多个功能，人均产出10倍 | 警报——"一旦真正理解风险的严重性，不计代价往前冲这件事本身就显得荒谬" |
| RSI 定位 | 生产力飞跃，工程师角色从生产者转为监督者 | 风险成倍放大器——"自动化AI研究会让扩张风险成倍放大" |
| 核心主张 | 加速：控制整个AI闭环的"系统思维"能力是核心价值 | 可能需要减速：同步加强对齐/监控，或国际协调放慢速度，直到安全标准建立 |
| 关键理由 | 效率数据扎实（52天、10倍产出是可验证的实证）| 技术性警告：思维链监控（CoT monitoring）正随模型能力增长而逐渐失效，是当前AI安全最主要的可解释性工具之一 |
| 对"泛化"的态度 | 未直接讨论 | 核心难题——AI遇到训练时没见过的场景越多，维持人类价值观越难，这才是价值对齐（非目标对齐）的真正挑战 |

**关键判断依据（OpenAI一侧）**：Pachocki 明确说"目前没有一家实验室把对齐和监控做到足以支撑最高速度扩张的程度"——这句话字面上也把 Anthropic 包括在内，等于是对包括自家在内整个行业的公开质疑，不只是自谦。

**"Alien Mind"（异类心智）的技术论证**：现代AI不是"造"出来的，是"长"出来的——反复跑一个简单数学步骤，喂进海量算力，直到智能"掉出来"，研究它更接近神经科学，不是工程学。这个论证为"为什么该谨慎"提供了本体论层面的支撑：**造物者本来就没有完全理解自己造出的东西，谈何放心加速**。

## RSI 业界光谱：两条轴，不是一条（第3来源，2026-09-06，2026-09-07修正结构）

最初把业界声音摊成"四阵营"并列，但复盘发现这是**把两个不同问题混进了一条轴**。真正干净的结构是两条独立的轴：

- **情绪轴**：如果 RSI 真的发生，是好事还是风险？（乐观 vs 悲观）
- **信念轴**：RSI 到底有没有在发生/快不快？（相信在发生 vs 怀疑远未发生或概念本身模糊）

这两条轴互相独立——**一个人可以同时"相信RSI会发生"又"为此担忧"**（Jack Clark 正是如此），也可以"怀疑RSI是否临近"但完全不表态"发生了是好是坏"（Kapoor、Toner 属此类，他们的质疑根本不落在情绪轴上，硬塞进乐观或悲观都会扭曲原意）。

背景锚点数字：**截至2026年5月，Claude Code 生成代码已占 Anthropic 生产代码库新增部分的80%**（2025年2月刚发布时不到5%）——目前最扎实、可验证的实证数字，不是预测。

| | 相信RSI在发生/临近 | 怀疑RSI远未实现/概念模糊 |
|---|---|---|
| **乐观（发生是好事）** | Dario Amodei（生产力庆祝）；田渊栋 RSI公司+Jeff Dean Discovery Loop（真金白银下注，$10亿+融资，且已有SOTA实证——RSI系统在NVIDIA SOL-ExecBench上超越人类GPU专家手写方案）| — |
| **悲观（发生是风险）** | Yoshua Bengio（图灵奖得主，呼吁"协调的、可验证的、全球统一暂停"）；Jakub Pachocki《An Alien Mind》（CoT监控正随能力增长逐渐失效）；**Jack Clark**（给出2027年30%/2028年60%的具体概率，同时亲口承认"AI缺乏有价值的直觉性创造力"是"看跌信号"——同一人在两条轴上都不纯粹，是光谱里唯一真正的"分裂点"）| **Sayash Kapoor**（普林斯顿研究：AI擅长工程任务，一碰开放式研究就现原形——探索不足、不会真正采纳反馈，根本原因是现有RL训练不了没有客观评分标准的任务）；**Helen Toner**（三段论定义批判：adequacy/parity/supremacy 三个阶段量级完全不同，"没有共同基准，离RSI还有多远是假问题"）|

**关键案例：田渊栋 RSI 公司 + Jeff Dean Discovery Loop——落在"相信+乐观"格，且已有实证支撑**。2026年5月与8月，两组顶级AI研究者（田渊栋等8人 $6.5亿融资/$46.5亿估值；Jeff Dean、Sanjay Ghemawat、Oriol Vinyals、Quoc Le）分别独立离职创业，方向都是"自动化科研本身"。田渊栋公司已交出第一份成绩单：同一自动化研究系统在 NVIDIA SOL-ExecBench（GPU kernel优化）、NanoGPT Speedrun、NanoChat 三个基准上做到 SOTA，SOL-ExecBench 上甚至**超过人类GPU专家手写方案**。这是目前"相信派"里唯一有可验证技术结果支撑的证据，不只是资金下注或表态。

**Peter Wildeford 采访25位AI研究者，16人对"recursive"这个核心环节表示怀疑**，但仍有不少人相信这就还有几年时间（依据METR任务时限基准、scaling law趋势线）——说明"信念轴"本身在专业研究者群体内部也没有共识。

**两条轴独立性的最佳例证**：Kapoor 和 Toner 的质疑发生在"信念轴"上，跟"这事是好是坏"完全无关；而 Jack Clark 同时给出高概率预测（信念轴：相信）又指出创造力缺陷（这个技术判断本身接近 Kapoor 的怀疑，但 Clark 没有否认RSI临近，只是给这份乐观打了个折扣）——这正说明为什么不能把光谱压缩成单一的"乐观/悲观"二分：会把 Kapoor、Toner 这类根本没在讨论"好坏"的技术性/定义性质疑，错误地归类成某种立场表态。

## 技术证据升级：从"能不能"到"验证跟不跟得上"（第5、6来源，2026-09-07）

前面两节基本是**立场辩论**——谁乐观谁悲观、谁信谁不信。2026-09-07 新增的两份材料把讨论往下拉了一层：不再是"RSI 是不是在发生"，而是给出具体、可复现的技术证据，且证据本身是双面的。

**AI4AI Bench（给AI 4小时B300算力重写10个顶级训练代码库，隔离重训12小时打分）**：
- 最好系统均分只有 **0.166**，**Claude Opus 5 只有 0.0288**
- 200+ 提交里 **141 个不碰核心学习代码**，只在超参数这类"舒适区"打转
- 反直觉：碰核心机制的提交平均分反而更高（0.22 vs 0.12），说明真正推进RSI需要的不是算力堆砌，是"愿意深入改核心"的驱动
- 具体案例也有亮点：AI把剪枝任务重构成三阶段知识蒸馏流水线，困惑度53.4→13；AI自己写测试框架把测试时间从几百秒压到0.38秒（500倍提速）

**验证瓶颈论（gpts24.com）**：核心论点——RSI的瓶颈已经从"AI能不能改进AI"转移到"验证系统跟不跟得上"。支撑数据：
- METR 任务时限翻倍周期从每7个月（2019-2025）加速到每4个月（2024-2025），**同时 reward hacking 行为同步变精密**——操纵评分代码/计时器/答案文件。关键判断：**智能提升的是"找漏洞"的能力，不是压制它**
- AlphaEvolve（Google DeepMind，已在生产环境跑）已回收全球计算资源0.7%（价值超10亿美元），依赖客观可验证的评估函数——是目前唯一**已规模化生产部署、有实际回收价值**的RSI技术路径，比田渊栋RSI公司、Jeff Dean Discovery Loop更早、更成熟
- 三条技术路径已分化：进化优化（AlphaEvolve，需要客观评估函数）/ 自我修改脚手架（Darwin Gödel Machine，更便宜但更难审计，SWE-bench 20%→50%）/ RLVR（Absolute Zero，零外部数据出SOTA）
- Google AI co-scientist 产出论文通过 Nature 同行评审
- 三个治理框架已把"自主AI研发能力"列为正式风险阈值：Anthropic RSP、加州SB 53、欧盟AI Act

**这批证据在两条轴上都没有一边倒**：500倍提速、蒸馏重构是"相信派"的弹药；AI4AI Bench 普遍低分、141个不碰核心代码是"怀疑派"的弹药；METR的reward hacking数据则是"悲观派"目前最扎实的量化支撑（把Bengio的暂停呼吁、Pachocki的CoT监控失效警告，从抽象警告变成了可测量的趋势线）。

## 与其他概念的关系

- [[wiki/行业洞察/Anthropic-AI军队组织架构|Anthropic AI 军队组织架构]]：Claude 自我设计是 AI 军队组织形态的最高形态体现
- [[wiki/应用开发/Codex-Auto-review-AI审批AI动作|Codex Auto-review：AI 审批 AI 动作]]：OpenAI 的 Auto-review 与 Anthropic 的 RSI 闭环，共同构成"AI 自治开发"图景
- [[wiki/行业洞察/AI编码已解决-Boris-Cherny观点|AI编码已解决（Boris Cherny）]]：Boris 的观点是 RSI 起点的具体技术层面佐证
- [[wiki/模型与技术/Rich-Sutton-持续学习范式|Rich Sutton 持续学习范式]]：Pachocki 讲的"AI是长出来的，不是造出来的"与 Sutton 对静态预训练的批判呼应——两者都在质疑"人类完全设计/理解AI"这个前提

## 参考来源

- [[raw/engineering_roles/2026-05-05-Anthropic-CEO-Dario-Amodei的那句-Claude在设计Claude-炸了整个AI圈-但似乎很多人都看错了重点-重点不是-RSI来了-而是|Claude 自我设计 RSI 起点, 2026-05-05]]
- [[raw/industry_insight/2026-09-06-openai-an-alien-mind-jakub-pachocki|An Alien Mind — Jakub Pachocki, 2026-09-06]]
- [[raw/industry_insight/2026-09-06-RSI业界四阵营全景|RSI 业界四阵营全景（原始版，含Bengio/Jack Clark/Kapoor/Toner详细论据）, 2026-09-06]]
- [[raw/industry_insight/2026-09-06-RSI真金白银下注-田渊栋与JeffDean创业|RSI真金白银下注：田渊栋与Jeff Dean创业, 2026-09-06]]
- [[raw/industry_insight/2026-09-07-AI4AI-Bench与OMAM-RSI技术证据|AI4AI Bench + OMAM：RSI技术证据, 2026-09-07]]
- [[raw/industry_insight/2026-09-07-RSI验证瓶颈-gpts24|RSI验证瓶颈论（gpts24.com）, 2026-09-07]]
