# 荣耀 MagicOS 11：YOYO Harness 系统级 Agent 商用落地

**整理日期**：2026-10-02
**事件日期**：2026-09-15（HGDC 2026 发布）
**来源**：微信公众号文章（原始链接未随文件保存，待补）；关键事实已通过以下官方/媒体信源交叉核实：
- [腾讯新闻：荣耀发布行业首个系统级Agent Harness架构操作系统MagicOS 11 Magic9首发搭载](https://news.qq.com/rain/a/20260915A0C1N300)
- [腾讯新闻：荣耀发布 MagicOS 11：系统级 Agent Harness 首次商用，Magic9 首发搭载](https://news.qq.com/rain/a/20260917A0AH2D00)
- [搜狐：MagicOS 11正式发布：系统级Agent架构落地，荣耀Magic9首发搭载](https://www.sohu.com/a/1076470586_434816)

---

过去十年，移动生态的增长逻辑建立在一块方寸屏幕上：做功能、买流量、争图标位次，然后等用户主动找上门。但这套逻辑正在失效。

最直观的证据来自用户侧，用户越来越不愿意下载新 App，打开 App 的次数也越来越少，哪怕服务做得不错，用户也常常想不起来用。买量成本持续上涨，转化率却在下滑。

供给侧端，RevenueCat《2026 年订阅应用状态报告》显示，AI 应用订阅用户的年度留存率仅有 21.1%，低于非 AI 应用的 30.7%；开发者普遍感到，过去靠推送、靠活动拉活的套路越来越难奏效。

事实上，这背后不是某一类应用的问题，而是 “人找服务” 的分发逻辑本身走到了天花板。RevenueCat 报告显示，2026 年每月新上市的订阅制应用数量较 2022 年飙升了 7 倍，每月有近 1.5 万款新应用涌入市场；但 2020 年前发布的老应用至今仍牢牢掌握着全市场 69% 的订阅营收，2025 年后上线的新应用只占 3%。供给严重过剩，入口却只有一个。

而 AI 正在改写这个前提。当系统开始理解意图，入口不再是一个 App 图标，而是用户的一句话、一个处境——刚买了机票、走到了快递柜前、手机上弹出一条生鲜到货的通知。这意味着 AI 终端的竞争焦点已经从谁的模型更大转向谁能让 Agent 在手机上干更多活。开发者过去围绕 GUI（图形界面）精心打磨的交互设计，可能需要围绕意图重做。

这正是荣耀在 HGDC 2026 上试图回答的问题。而它的答案并不是又发布了一个更聪明的语音助手，而是把智能体的调度能力写进了操作系统，当“理解你、替你办事”成为系统能力，开发者的服务第一次拥有了不依赖图标位次和买量预算的触达路径。

![图片](https://mmbiz.qpic.cn/mmbiz_png/S1iaf4GgGjEwcT7s7KuNa5l7ibQkwzwicF9qibXZpiaSPj0crHfCCJ9ib3AQyeVa48CSZwJ7e1iaIEJZXKLPic3HuFZA9za6icMlEtJric5lKItAedKXI/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=1)

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06QuwjkSP1G6wEJHaJCLTONqlcQexqRgJcIICxofIOJs6B6tWBfibb7now/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=2)

**新一代 YOYO：自动执行与主动服务的深度融合**

9 月 15 日，在 HGDC 2026 上，荣耀正式发布 MagicOS 11。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/S1iaf4GgGjEyEk4xjV1B63dPeC9KM0SPGiauysbbsG61w4nKbn6VaiapxvM89C3xeXfgaapDvRM0qcrlC1Umol6C4icpicIqJibZz5rKoS6mvsqmo/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=3)

荣耀官方的定义是，MagicOS 11 是行业首个实现系统级 Agent Harness 架构商用落地的终端操作系统，并将由 Magic9 系列首发搭载。荣耀同时给出了一组颇具冲击力的数据：YOYO 月活用户达到 1.6 亿，新一代 YOYO 可执行超过 100 步的长程任务，综合意图理解率达到 91.8%，其中简单任务准确率 93%、复杂任务 87%，任务执行闭环率高达 90.4%，其中 YOYO 主动服务已覆盖超过 1000 个生活场景，累计接入超过10000 家第三方 AI 服务。

![图片](https://mmbiz.qpic.cn/mmbiz_png/S1iaf4GgGjExk2yJYnicw6GL0t9xPhD7ic5KYvRtPPicubvC74Uk9cHiaVqEbG7BwN9JdA8pgZ0iaZudmDkBfPibHnZgMqIQiakCzGJ0EzY5q8v0Hdg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=4)

不过，比参数更值得开发者关注的，是这组升级背后体现出的产品思路转变。新一代YOYO 的变化可以拆解为三层递进的信号。

**第一层，交互范式从指令驱动走向意图驱动。**以买演唱会门票为例：过去用户要自己打开大麦查时间、切到时钟定闹钟、打开音乐 App 找歌单、再把歌单写进日历；而在MagicOS 11 中，用户一句话，YOYO 就能独立完成全部流程。看似只是效率提升，实质是操作单元的改变，过去用户操作的单位是点击，现在变成了意图。当交互的最小单位从点击变成意图，服务被触达的机会就不再取决于界面曝光，而取决于能否被意图匹配。

**第二层，是 AI 开始理解非结构化的日常。**MagicOS 11 推出的 YOYO 任务支持行业最丰富的 40 多种触发条件，涵盖时间、地理位置、应用状态、消息通知、网络环境甚至电池和设备状态，用户一次设定、次次自动执行。追剧模式、安心离家模式、刷抖音护眼提醒，这些场景的共同点在于：触发服务的主语从用户变成了情境。你的服务不再是等用户打开才出现，而是可以在用户自己都没意识到需求的时刻被激活。

**第三层，是从听指令进化到懂处境**。YOYO 记日程依托端侧 VLM 大模型，用户购票、挂号后系统自动识别页面信息写入日程；YOYO 取件码不仅主动显示快递信息，还会区分生鲜、贵重、大件包裹做差异化提醒。这些细节的提升证明 AI 已经能读懂那些从未被标准化的信息，而日常生活中的大部分服务场景，恰恰由这类信息构成。谁能读懂它们，谁的服务就有机会嵌入原本没有入口的场景。

![图片](https://mmbiz.qpic.cn/mmbiz_png/S1iaf4GgGjEwbTxia4tJB5ic5hOtcoWv86DQMCma6dksJ5Ip6aGNy7qX9EZeqmxWbHicHQiaTxljagPdXsNib792cnmXJicv1nfqcOrd66TnOVwcUc/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=5)

这些功能看似细碎，实则指向一个深刻的判断**：AI 的价值不在于炫技，而在于无缝嵌入普通人衣食住行的高频场景。对开发者而言，服务不必等用户主动打开，而能在用户需要的时候主动出现。这既是体验的跃迁，更是触达逻辑的重构。**

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/S1iaf4GgGjEz0WHlWHxqHicQ8Cz3d7TyUdC0pelJiabjjXuiaNsicxAicSC1poYRkOfpCMHriaeMB4Ycru0CzdfiaN9t7bm2VJLHASWJtxHeuyp64L0/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=6)

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06QDyP5HTUOXsPlJWd79yygiasaqXicpN7ibIfqiak5WFpaxE1mGxxpfmMjiaA/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=7)

**YOYO Harness 落地：一次操作系统层面的重写**

这些能力背后，事实上是荣耀自研的系统级 Agent 框架在底层完成了重构。

过去两年，行业谈智能体，注意力几乎全在模型上。但模型再强，如果它不知道当前屏幕显示什么、用户在什么场景、能调用哪些工具、上一步执行是否成功，它就只是一个在真空里思考的大脑。

模型之外的这一层，行业习惯叫它 Harness。2026 年初，Harness Engineering 取代提示词工程，成为硅谷最流行的 AI 工程化范式。行业常用一个公式来表达 Agent 和Harness 的关系——Agent = LLM + Harness。大模型提供语言理解、推理、代码生成等能力，Harness 负责把这些能力接入具体流程，让输出可执行、可观察、可验证。

具体到新一代 YOYO，荣耀把这套框架叫作 YOYO Harness。它的核心思路是把 AI 的感知、规划和执行能力下沉至系统层，并采用端云协同的大模型方案，让 YOYO 从回答问题的 AI 助手，升级为能够主动执行任务的系统 Agent。

从 CSDN 的观察来看，这套框架真正的价值在于：它让自动执行和主动服务第一次在系统层面实现了深度融合。过去，自动执行是工具属性，主动服务是推荐属性，两者在App 内是割裂的；而 YOYO Harness 把感知、记忆、规划、执行串成一条完整链路，**AI 不再是等待指令的被动工具，而是替你经营你的目标的系统级存在，并且把最后的决定权留在你手里。**

谈及荣耀选择在操作系统层面做 Harness，荣耀表示：“过去行业谈 Agent，关注的重点更多是模型这个‘大脑’的进化，但当 Agent 开始处理真实场景中的复杂任务后，最终能不能把事情办好，还取决于它能感知到什么信息、怎样规划任务、能调用哪些工具，以及执行过程中能不能根据实际情况作出调整。同样的模型通过不同的系统协同，最终呈现出来的 Agent 体验可能并不相同。”

这正是 Harness 受到行业关注的根本原因。好的工程体系甚至可以在一些具体任务上，弥补模型自身的部分不足。对用户来说，这意味着同样的模型，通过更好的系统协同，也能带来更好用的 Agent 体验。

更深层的意义在于：AI 竞争的核心正在从谁的模型更强转向谁的系统工程能力更强。而手机终端恰好具备做好这套体系的独特优势，它能够结合用户当前的使用场景和相关信息更准确地理解需求，同时连接着丰富的应用、服务和设备能力，具备把需求转化为实际行动的条件。

**对开发者来说，这层差异会直接落到技术路线上：如果 AI 只是应用层的一个入口，你的服务只能等着被打开；如果智能体调度能力被下沉到系统层，你的服务才有可能被编排进一条完整的任务链。**

就在荣耀发布 MagicOS 11 的第二天，vivo 发布原系统 7 与蓝河操作系统 4，同样以大模型+Harness+智能体安全架构重构系统体验；9 月 17 日 OPPO 开发者大会上，ColorOS 17 的 Agent Matrix 智能体生态框架也引入了端云 Harness 工程。

从独行者到竞逐者，Harness 正在从一个技术名词变成行业共识。而率先交卷的荣耀，已经在这个方向上跑出了身位差。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06Q0QtgZAx8xsoTReptvArfwbn9MvHGVfV98Qkl5PMRS6MCt2ljwLJwoQ/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=8)

**从模型到入口的全链路 AI 底座，荣耀给开发者带来了什么？**

如果说 Agent Harness 是技术底座，那么支撑它运转的，是荣耀在模型、入口、框架、开放标准等全链路上的系统化布局。

![图片](https://mmbiz.qpic.cn/mmbiz_png/S1iaf4GgGjEz23qbuJlAgYmK2CeoxicTf5u2PcXA7FpZ2nKGbaD63PDib7gp7jjvLnxrj0icqtYLNTh8TBOkg1icJ16jrN5Lia7Rvy7wg2uJnHj7w/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=9)

在模型层，荣耀构建了覆盖端侧与云侧的统一 AI 模型矩阵，并与阿里等头部大模型厂商深度合作，基于海量真实场景数据反哺模型迭代。端云协同架构下，手机端 AI 在保护本地数据的同时实现毫秒级响应与主动执行。

在入口层，历经三年发展，YOYO 建议已落地桌面、负一屏、AOD、灵动胶囊、动态通知、通知中心和荣耀任意门等 7 种系统级触达入口，YOYO 月活达 1.6 亿+，主动服务已覆盖1000+ 服务场景，持续从被动响应升级为主动智能；生态上，累计接入10000+ 第三方 AI 服务。

在框架层，YOYO Harness 不仅服务于 YOYO 智能体，也服务于所有系统级应用，通话 Agent 等系统应用都在 Harness 的加持下进化得更智能、更好用。

在开放标准层，MagicOS 11 对 MCP、A2A、Skills 和 GUI 路线实现了全兼容。目前，荣耀已开放 700 个工具和 500 个开放 Skill，YOYO Harness 能够根据任务需要灵活组合并跨应用协同这些能力。荣耀已与微信通过 A2A 打通。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06Q3SAo8dibFicWvibnB5u4gdHLgb2AbA6UJ8VImKnyW92hibqZefwpDbPYAQ/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=10)

**开发者的三重范式迁移：从做界面到做工具**

而这套全链路布局的意义，最终要落到开发者身上。它对开发者最直接的影响，是开发模式、技术路径和商业逻辑三个层面的系统性调整。

**其一，开发模式之变**：从做界面到做工具。过去开发者的核心是设计 GUI，界面布局、交互动线、视觉呈现；而在 MagicOS 11 架构下，服务需要被抽象成 Agent 可识别的Skill 或 API，让 YOYO 直接调用。当 YOYO 能执行超 100 步长程任务时，开发者需要思考的不再是页面如何好看好点，而是服务如何被无缝组合与执行。从等待用户点击到被 Agent 编排调用，这几乎是一次产品方法论的重写。

**其二，技术路径之选**：优先上高速，越野做兜底。第一优先级是 MCP、Skills、A2A 等标准协议通道，直接调用、稳定高效，也是荣耀接入门槛最低的选择：意图框架支持 1个 JSON、1 天完成接入，任意门仅需提供 Deeplink，一次开发、多端适配。第二优先级才是 GUI 兜底，对暂未适配的应用，Agent 可以看懂屏幕模拟操作，但不应作为首选方案。

**其三，商业增长之变：**入口重构下的确定性增长。流量入口正在从 App 图标向系统级Agent 迁移，服务能否被 Agent 优先推荐和调用，可能比 App 的日活更关键。对长尾开发者而言，“服务找人”意味着不再需要巨额买量就能获得高质量触达；对头部开发者，尽早完成 Skill 化改造则意味着占据先发身位。商业模式上，荣耀构建了基础模型合作、MCP/Skill 合作及 A2A 深度合作的三层共创体系，通过订阅、订单及交易分成等多元模式与开发者深度链接，增长不再是流量生意，而是随服务被调用次数持续沉淀的确定性收入。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06Q0jqAkXB2hEohZkOqYzXVsmJtnNRQncYh54ZQOpcC5ZGSicYFgtBZP4w/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=11)

**比手机厂商更懂 AI，比 AI 厂商更懂手机**

不过，全链路的布局能力，并非每一家都能复制。事实上，AI 智能体赛道上，玩家早已不只是手机厂商，OpenAI、字节跳动、阶跃星辰等模型厂商纷纷下场，互联网大厂也在加码 Agent 入口。那么，同样要做 Agent，为什么是荣耀，以及终端厂商更有机会把这件事做成？作为终端厂商，荣耀凭什么吸引开发者？

答案是：荣耀比手机厂商更懂 AI，比大模型厂商更懂手机。

从 CSDN 与大量开发者的交流中看，一个反复被提及的判断是：做 Agent 调用，模型能力反而是变量最小的部分，各家旗舰模型在意图理解上的差距已经不大；真正的分水岭在于，这个 Agent 能不能感知到足够的上下文、能不能打通系统底层的服务、能不能在真实生活场景里持续被验证。而这三点，恰好是终端厂商的主场。

**首先是端侧感知能力。**荣耀长期积累了手机硬件感知、情境围栏和第三方应用服务状态的感知能力。以 YOYO 任务为例，用户只需交代一次，系统就能结合情境和服务状态的变化自动触发执行，让需求持续得到响应。在开发者看来，这类能力的本质是一种“系统级的数据特权”，它能感知到的情境维度，决定了开发者服务能被匹配到的场景宽度。

**其次是系统服务 AI 化改造的彻底程度，这决定了复杂任务的天花板**。大模型厂商做手机时改不动底层接口，遇到多个系统服务联动的场景就会卡住；而荣耀基于多年的手机厂商经验，可以直接对系统服务做整体 AI 化重构。MagicOS 11 开放了数百个工具和Skill，YOYO Harness 可以根据任务需要组合调用。对开发者而言，这意味着自己的服务有机会被编排进一条跨系统服务的完整任务链，而不是孤立地等待被打开。

**最后是主动服务场景的长期积累**。荣耀从 MagicOS 6.0 就开始布局主动服务，几年下来沉淀了什么样的场景能被主动触发、什么样的提醒用户不反感、什么样的时机推送转化最高，这些隐性经验真实决定着主动服务的体验分寸。荣耀将 AI 化作一种无需刻意学习就能享受到的便利，这种融入生活细节的体验积累，是短期内极难追赶的。

在吸引开发者这件事上，荣耀也给出了真金白银的诚意。**荣耀远航计划已连续运作 4 年，在 20 亿元激励资源的基础上持续升级。截至目前，该计划已累计扶持 3000+ 伙伴，发放上亿级资源曝光**。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/S1iaf4GgGjExvLyeZ9PYpGXrOTQibTy1o3qzvkhOtBHPqM2tm60rOMHX5rquRiaKeBO8YDQmUHAjFic1EXHKpvFYyvf2xklojQSEKQPMy2qXMD0/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=12)

具体到合作案例，生态的虹吸效应已经显现，荣耀已联动京东、大麦、美的、支付宝、美团、高德、快手、影石等头部伙伴，在 AI 服务、智慧互联、基础体验优化等方向展开深度共创。

从这一点上来看，荣耀的出发点很明确，坚持开放兼容，让不同类型的生态伙伴都能参与进来，也尊重合作伙伴不同的技术选择，让用户获得更丰富、更好用的服务。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06QGHX4EaTS3AknUHvnayNiaLnANlsxF3g1JR5q9HIdppdNd8c8uyuC05w/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=13)

**从 YOYO 建议到 YOYO Harness，荣耀与开发者的双向奔赴**

如果将视野拉长，MagicOS 11 和 Agent Harness 只是荣耀长期战略的一个阶段性落子。

早在今年 6 月的 MWC 上海展会上，荣耀就首次系统定义了下一代移动终端操作系统 AgenticOS ，提出“终端不再是应用的容器，而是智能体的舞台”这一判断。荣耀终端股份有限公司产品线总裁方飞在演讲中将其概括为四大核心特征：意图驱动、自然交互、主动智能、天生跨端。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/S1iaf4GgGjEx4LI4ztO6Eic11Tw3YdSiauJlrfz7rUQW6HD0wViaJ4duDI6AotHIia4g35P6qgQEHXuZlJ6909Ria2IBc3SkcsbN91s90OPxDTk8s/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=14)

需要说明的是，MagicOS 与 AgenticOS 并非替代关系：MagicOS 11 将向 AgenticOS 的方向演进，但二者之间会经历并行且长期演进的阶段。MagicOS 持续为用户提供稳定好用的体验，AgenticOS 将通过预览版进行前瞻探索，并面向小范围用户开放。AgenticOS 的探索成果会反哺到 MagicOS。从 MagicOS 11 开始，操作系统的底层架构和系统交互已经逐步面向 Agent 快速重构，全新的体验改变已经在发生。

这个判断对开发者而言，既是挑战更是机遇。应用依然承载着专业能力与服务价值，但这些能力被发现、被使用的方式正在发生根本改变，能否在用户真正需要的时刻被发现、被调用，将成为新的核心竞争力。

从 2016 年初代 Magic 手机首发 Magic Live 智慧引擎，试图让手机感知世界；到 2021 年发布 YOYO 建议，将主动服务引入行业；再到今天 MagicOS 11 实现系统级Agent Harness 的全面落地。荣耀的底层逻辑始终没变：把设备的选择、繁琐事务的处理，统统交给 AI，把生活和时间重新交还给用户。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Pn4Sm0RsAujX5kS5KQ6BaBUsy1RqR06Q3hdXZlicTdZH0gDHXnpe9sZjuIdKFqdo93tKQ8icc5U5JcMkFHiadezlA/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=15)

**当应用容器变成智能体中枢，开发者的答案是什么**

站在 2026 年回望，荣耀在生态上的成果已经可以量化。

生态侧，跨品牌碰一碰分享全面落地，覆盖六大生态、一碰传适配设备超 5000 万台，合作生态伙伴 60 家以上，成为行业首个与所有主流品牌互传的厂商。AI 服务生态已接入超 4000个生态 MCP 和智能体，落地 3000 多个场景。过去一年，荣耀采纳超过 15万条用户建议，完成 500 多项功能更新，连续 18 个月保持月度迭代，这套高频共创机制，正是生态活力最直接的注脚。

![图片](https://mmbiz.qpic.cn/mmbiz_png/S1iaf4GgGjExYN4PUdbzMg6ChzJmWogVYgmHUGkYicE9ac7piak6A4vwg0hpnQxSlf2lvWsFqYlics7A4IrQxKYS6MQJW2JAmGxggFn1XjbyKyo/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=16)

从产业视角看，AI 操作系统仍处在发展早期，终端厂商、大模型企业、应用开发者需要共同建设生态，终端厂商发挥硬件感知优势，大模型厂商提供模型能力，应用开发者开放工具接口，只有多方协同，AI 技术才能真正大规模服务普通消费者。**荣耀坚持开放合作，****打造****让不同伙伴的优势能够被安全调用、灵活组合的开放智能中枢。**

对开发者而言，选择正在变得清晰：当**智能体变成手机系统的基础能力，要回答的已不是要不要做 AI，而是以何种姿态参与这场重构——是把服务封装成等待被调用的工具，还是守着界面等待用户回头。**

从应用容器到智能体中枢，改变的不只是操作系统的底层架构，更是每一个开发者的增长公式，入口从图标变成意图，触达从买量变成编排，收入从流量生意变成服务生意。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/S1iaf4GgGjEyM9vDib6bQYlUiaUcyibM6IptHterqfqx960QsiaZTy1PAmVOTozBt95ic25Bo6YbMlUTNRVX3ctVt4icSIhxClHmYTV5GoBa0xtymk/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=17)

行业首个系统级 Agent Harness 的商用落地，为这个选择提供了一个成本足够低、路径足够宽、增长足够确定的答案。