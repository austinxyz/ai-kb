# RSI 真金白银下注：田渊栋 RSI 公司 + Jeff Dean Discovery Loop

**整理日期**：2026-09-06
**背景**：田渊栋公司背景见 [[raw/external/industry/GTLC Silcon Valley]]（GTLC硅谷现场观察），本条目补充两家公司最新动态
**来源**：多篇报道综合（见文末）

---

## 一、Recursive Superintelligence（RSI，田渊栋联合创立）最新动态

**7月28日签 $4.1亿美元 AWS 算力协议**，多年期，**纯算力交易，不含投资**——跟大厂之间常见的"投资+算力捆绑"模式不同。Socher 原话："对我们来说，重点不是招多少人（headcount），是养多少个 agent（agent count）"——预算大头砸算力，不是人力。

**第一个技术里程碑（联创 Tim Rocktäschel 公布）**：自动化AI研究系统在三个基准上做到SOTA，同一个系统跨任务通用：

| 基准 | 成绩 |
|---|---|
| NVIDIA SOL-ExecBench（GPU kernel优化，235个kernel）| 均分0.699→0.754，超过人类GPU专家手写方案，也超过其他AI系统方案 |
| NanoGPT Speedrun（社区优化两年多的老基准）| 79.7秒→77.5秒 |
| NanoChat（Karpathy的autoresearch基准）| 达到同样loss快1.3倍 |

研究细节开源在 GitHub（`recursive-org/first-steps-toward-automated-ai-research`）。

**产品时间线**：Socher 争取2026年10月前放出第一批"能真玩的东西"——"几个月内，不是几个季度或几年"。

**AWS 合作深度**：AWS VP Jason Bennett 提到协议包含**共同开发专为这类基础级AI公司设计的基础设施**，被定位为未来同类合作的范本。

## 二、Discovery Loop（Jeff Dean 创立）

**2026年8月5日官宣**，Jeff Dean 离开Google **27年**后创业。公益公司（Public Benefit Corporation）结构。

**联合创始人**：
- **Jeff Dean**（CEO，前Google首席科学家）
- **Sanjay Ghemawat**（Google传奇工程师，MapReduce/BigTable/Spanner等核心系统缔造者）
- **Oriol Vinyals**（DeepMind，AlphaStar/Gemini核心人物）
- **Quoc Le**（AutoML、神经架构搜索先驱）

**融资**：Radical Ventures + Khosla Ventures 领投，Lightspeed、Kleiner Perkins、Doerr Capital 跟投——**Alphabet自己也投了**，友好分手，谷歌押注了自己前首席科学家的新公司。

**使命**：用AI给科研提速。核心逻辑：传统科研靠"缓慢、顺序的人类迭代"，这是瓶颈；要**同时跑几千个实验**，部分自动化整个研究流程。**技术路线明确提到探索"递归自我改进"**——用AI开发更强的AI，减少人类在迭代循环里的参与。

## 三、两家公司对照

| | RSI（田渊栋） | Discovery Loop（Jeff Dean） |
|---|---|---|
| 官宣时间 | 2026-05 | 2026-08（晚3个月）|
| 估值/融资 | $46.5亿估值，$6.5亿融资 | 未披露总额，种子轮 |
| 核心投资人 | Google GV、NVIDIA、AMD | Alphabet自己、Radical、Khosla |
| 团队规模 | <30人 | 更小（4位重量级创始人起步）|
| 技术主张 | 递归自我改进+自动化知识发现 | 递归自我改进+自动化科研流程 |
| 实证进展 | 3个基准SOTA（含超越人类专家）| 尚未见公开技术成果 |

## 对话中的分析

**这不是巧合，是同一波信号**：短短三个月内，两组最顶级的AI研究者阵容分别独立离职创业，做几乎一样的事——用AI自动化科研本身。跟此前存的 [[wiki/行业洞察/Claude自我设计-RSI起点|RSI四阵营辩论]] 正好构成一个新数据点：理论上还在吵"RSI是不是空中楼阁"，但真金白银（合计$10亿+的融资和算力）已经在下注这个方向是真的。

**连投资人都重叠**——Google/Alphabet 一边投了田渊栋（通过GV），一边又投了自己前首席科学家的新公司，说明谷歌自己内部对这个方向的信心，不亚于外部创业者。

**与四阵营辩论的关系**：这构成"第五阵营——真金白银下注派"，跟纯理论辩论的四个阵营（庆祝派/警报派/技术怀疑派/定义批判派）形成对照——RSI 的 SOTA 实证结果（尤其是 SOL-ExecBench 超越人类专家）某种程度上是对普林斯顿"AI不会做真正研究"这个技术怀疑论的直接反例，值得持续跟踪验证是否能规模化复现。

---

## 来源

- [TechCrunch: Recursive Superintelligence signs $410M compute deal with Amazon](https://techcrunch.com/2026/07/28/recursive-superintelligence-signs-400-compute-deal-with-amazon/)
- [Recursive: First Steps Toward Automated AI Research](https://www.recursive.com/articles/first-steps-toward-automated-ai-research)
- [GitHub: recursive-org/first-steps-toward-automated-ai-research](https://github.com/recursive-org/first-steps-toward-automated-ai-research)
- [AWS Press Center: Recursive Signs $410M Collaboration](https://press.aboutamazon.com/aws/2026/7/recursive-signs-410-million-multi-year-collaboration-with-aws-to-scale-self-improving-ai)
- [TechCrunch: Jeff Dean and other top AI researchers leaving Google](https://techcrunch.com/2026/08/05/jeff-dean-and-other-top-ai-researchers-are-leaving-google-to-launch-their-own-startup/)
- [CNBC: Google chief scientist Jeff Dean leaving company](https://www.cnbc.com/2026/08/05/google-chief-scientist-jeff-dean-leaving-company-after-27-years.html)
