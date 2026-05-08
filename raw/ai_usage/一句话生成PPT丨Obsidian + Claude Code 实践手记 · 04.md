这是「Obsidian + Claude Code 实践手记」系列教程的第四期。

这一期偏实用，也是比较广泛的需求——生成PPT。我挑选官方内置的PPT skill和社区比较热门的skill 做个对比，方便大家按需选用。

本期内容：

1、方案一：Claude Code 内置 pptx skill（官方）

2、方案二：guizang-ppt-skill（第三方）

3、横向对比 + 建议

4、用 AI 做 PPT 的几个踩坑记录

---

###   

### 1、方案一：官方内置 pptx skill 

这是 Claude Code 自带的招式，不用装任何东西，开箱即用。

我下的指令很短：

```
基于我的知识库公众号已发布的 claude + obsidian 这三期内容为主题，生成一份PPT，风格：学术风，干净克制，保存到草稿，请用内置skill。指令输入后，它就自动去执行了：
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9Y0I1V23gpn4ciaNISWmiccAF0EReFcw8MMb2ltGY1ib7bS5nwNK2nibOSRTe81lcHv9MgEhp1W4OAYZqibFbd2RkKa8Wqaa685tians/640?wx_fmt=png&from=appmsg)

注意，一个小提示：

我们在使用Claude code时因为权限和安全问题，经常会发现它需要我们的授权，需要我们回车确认。完全体验不到自动化的快感。所以在一些单独的项目，我们需要它去自动执行。（可能有风险，尽量在子项目使用。）如图所示，输入命令开始。

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9aWlWVSYfo3GFSKUdwjJDrf3oOycXvSm250wcpWtl5xMxOjFOfYW6tVXNSNk8qMcOEcbf9Wpmn4VGM0GHUTRNar6qYk8GjTcJ0/640?wx_fmt=png&from=appmsg)

```
cd  你的子项目文件夹路径  
```

如图所示，实际跑出来 12 页，16:9，深蓝主色（#3A5F8A）配浅灰卡片底（#EDEDEA），Cambria 标题字体配 Calibri 正文。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/WiaSChe88J9ZPxOyGyZhQrJzpvhdv6Mhr3k75vLb8R90ia3prSuib2RVok1FCU8YnV2dTyZ08Vl2vMexajzNBQbicT0YWphldlhd96j6xeLbdU8/640?wx_fmt=png&from=appmsg)

整体观感——**像一份咨询公司的内部分享**，工整、规矩、挑不出错。我挑几张截图：

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9a5tb2xCWdU8rZ354h9cW2AsmJdOQJaIxLoLUHCB1NaxbtgQdIDUZoDPQqDW9bdyl6uZbvRMGFfYfvHINaseZ60DJQbLPQTjnQ/640?wx_fmt=png&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9ZHlxvUZwRCKuJibicK4aYuTsnUeRE5FwNJp21QI2eDvZnyFY5aeC1PQXSlZohvMtQdKiaicBaNQvNib772Sl1XgW7BnI85VrVTg71E/640?wx_fmt=png&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9asC2TIXtRZibEJicqvgcBV9hXn5EjhE2D0lYysPCgvJgoTibialianIicMGPQWbgsZ39yM5oPzWs15J9Qho3v9icYnQY3uyL3zZanXow/640?wx_fmt=png&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/WiaSChe88J9abnWVm3sicxzfpFQ2QpywMeGb4G3aurib5q5GuY2cs4pibdqWsib27OtKJ0ERV0pTfXqXiawQdAxGiaqBMkhX2L4pm8ia1pFLWuL0Kjc/640?wx_fmt=png&from=appmsg)

  

##### 它的优点

第一， **真正可编辑的 .pptx 文件** 。Office、WPS、Keynote 都能打开，每个文字框、每个色块都能改。AI 给你的不是终点，是起点。

第二， **零配置门槛** 。不用装第三方 skill，不用调环境，开箱即用。10 页左右的 PPT 几十秒就完事。

第三， **不翻车** 。卡片式布局、统一页眉、章节标识、页脚出处——它的排版逻辑非常稳，再差也差不到哪里去。

##### 它的缺点

第一， **模板感强** 。色块 + 编号圆点 + 标题 + 描述，工整有余，惊艳不足。一眼就能看出是 AI 做的。

第二， **中英文混排不够精致** 。默认用 Cambria 渲染中文，字体观感偏弱。对版式敏感的人会扎眼。

##### 适合谁

- 公司内部汇报、周报、月报、项目复盘——这种场景规整就够了
    
- 销售提案、客户初稿——给客户的第一版，稳重不出错最重要
    
- 时间紧、立等可取的场景
    
- 不想折腾、只想要"能用"的人
    

**职场上，「不出错」比「惊艳」重要十倍。** 这个方案就是为这种场景而生的。

当然，我举的例子是：一句话生成。显然，设计风格，约束条件等我们都可以自我设定，PPT仍然有提升的空间。这个在后面说。

---

###   

### 2、方案二：guizang-ppt-skill 

###   

这是社区大佬歸藏总结了他的经验做的很火的一个第三方 skill，做出来的不是 .pptx，是 **HTML 网页演示稿** 。但视觉规格是另一个量级。个人觉得，HTML在展示上更方便，毕竟你的电脑可能没有办公软件，但一定有浏览器。

```
项目开源地址：https://github.com/anthropics/skills
```

首先安装skill：

```
npx skills add https://github.com/op7418/guizang-ppt-skill --skill guizang-ppt-skill
```

然后下指令：

```
用 guizang-ppt-skill 生成同样主题的演示稿。跑出来一个 HTML 文件，15 页，按F11浏览器全屏演示。。、
```

视觉风格是杂志/编辑设计风——墨黑（#0a0a0b）配米白纸张色（#f1efea），Noto Serif SC 中文衬线配 Playfair Display 西文衬线，IBM Plex Mono 等宽字体做小标签。

更狠的地方——封面和章节过渡页带 WebGL 动态背景，粒子流动的视觉效果。整份演示稿被它组织成"三幕式"：Act I 本命法宝、Act II 从零搭建、Act III 炼化升级。每幕之间有过渡页、引文页、数据页。

**这不像 AI 做的，就像独立设计师做的。**

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/WiaSChe88J9Y5RpSvPLU5eg8FFOhG4qXqbiaa29Lnqp66keZoKJLy7NuPwwe8trwlOgWsoyOPRGMYc3CAoYpWsTLibFUMC5A4YkqbPvZ3wgBbU/640?wx_fmt=png&from=appmsg)

![图片](https://mmbiz.qpic.cn/mmbiz_gif/WiaSChe88J9byJqicapR0Z50vHiazuv2jbDDDunK4IPWbuias6zbichPDgQkAJwHicBHBU4tcAufXb2TePKdNJnPw4uTwtM9kXCIu5Wln7AcNfn6g/640?wx_fmt=gif&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9Z9EH68ws8kjMZXrKkqaFOtumPMicO3w3v88XdvWWnF4GbCibicG8etkfnx9b1xDuWXHbtUCgwqY4yOibsdTVWI2JibZNxg6HvWGI84/640?wx_fmt=png&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9ZCoAK0xQvYqmPtibFOdSnpYdIpFHlgouLRzla6Ls5Xa8j1tcNoRvT1cW9NpHIuEzyYW8LoCH1I43Hv0T7lOpKEatedzlnof2aA/640?wx_fmt=png&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9acGxkS4XI3elOndNQ6kp5KtO8icFABTUdpb3QppEX3zgG6Js0nRuzPRRqTZUT2tLBvt4kQeia4hjcFFWBxMl5Kdthl1SqYUpRLU/640?wx_fmt=png&from=appmsg)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/WiaSChe88J9aqxicMra1dlwg0ZZx02F6duLibsjVGVs5UkDkibtHWRWxAgamUbmOMtsXHKSpdoQzoq2MFxOfQWo4MXsoIpVTITicZfcm80yUVvM4/640?wx_fmt=png&from=appmsg)

  

  

它的优点

第一， **视觉冲击力极强** 。封面、章节页、引文页都有独特的版式语言，完全跳出了"AI 模板感"。

第二， **真正的设计感** 。衬线 + 等宽 + 黑白对比，杂志气质。每一页都像是经过设计师过手的。

第三， **特别适合做对外内容** 。公众号封面、知识星球分享、付费课程演示——这种场景下视觉就是流量。

第四，非常高级且丝滑的动效。

第五，有很多漂亮的模板。除了本文的演示，其实还有几套不同的模板，靛蓝瓷、森林墨、牛皮纸、沙丘，方便使用。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/WiaSChe88J9aic2eocfoHekHaQfaBp6N8v5ouI9OtJT72yhVvv0YMWKEQcjCG4e9euQ70j3QVD3ld98aGaK706xRQrjq2hODdUgLutzrcrQEU/640?wx_fmt=jpeg&from=appmsg)

  

##### 它也有的可能一些人不接受的地方：不是真正的 .pptx 。是 HTML 文件，PowerPoint 打不开。要改内容，得改 HTML 代码，或者让 AI 帮你改。

##### 适合谁

- 公众号、视频号、小红书等对外内容——视觉是流量
    
- 知识分享、付费课程、个人品牌演讲
    
- 对设计有要求、希望演示稿能体现个人审美的人
    
- 不介意"用浏览器演示"这种方式的人
    

---

###   

### 3、横向对比 + 我的真实建议

###   

##### 一张表看清两者差异

|维度|官方 pptx skill|guizang-ppt-skill|
|---|---|---|
|输出格式|真 .pptx 文件|HTML 网页|
|可编辑性|Office 直接编辑|改 HTML 代码|
|视觉水准|商务规整|杂志设计感|
|配置门槛|零|需安装第三方 skill|
|演示便利度|高|高|
|适合场景|内部汇报、客户提案|对外内容、个人品牌|

##### 我的真实建议

如果你要做那个个性化的展示，线下分享等场景无脑选方案二。如果是企业内部汇报，给客户提案等等场合就选方案一，基本不出错。

**两类场景都有的——两个都装，按场景切换。**

这才是真正成熟的用法。**工具没有最好的，只有最合适的。** 这两套 skill 互不冲突，能共存在同一个 Claude Code 里。给客户发提案用方案一，给读者做内容用方案二。

---

###   

### 4、用 AI 做 PPT 的几个真实建议

###   

建议一：先和 AI 讨论大纲，再让它生成

**这是最重要的一条，没有之一。**

很多人用 AI 做 PPT 的姿势是——一句话扔过去，然后等成品。结果方向偏了、重点错了、漏掉关键内容，整份重做。

正确姿势是：先让 AI 出大纲（每页标题 + 核心论点），你过一遍，确认或调整，再让它生成。

这一步带来二个好处：

第一， **省 token 省时间** 。生成完整 PPT 是大开销，生成大纲是小开销。先在小开销阶段对齐方向，能避免大开销阶段的反复返工。

第二， **方向可控** 。AI 在大纲阶段错了，你一句话就能纠正；它在 PPT 生成完之后错了，你得整份重做。

##### 建议二：指令不要写得太死

这条反直觉，我一开始觉得指令越详细 AI 越听话，结果发现——**过度具体的指令会让 AI 失去发挥空间**。

比如你写"第一页放标题，第二页放目录，第三页放背景，第四页放问题..."AI 真的就死板地按这个执行，完全失去它本该有的结构能力。

正确做法是——**给方向、给约束、给禁忌，但把结构决策留给 AI**。它会基于你的素材自己判断什么该详写什么该略写，效果反而比你硬框结构好。

---

  

 5、预告

  

下一期是 CLAUDE.md，重点讲它作为 AI 的记忆系统。

大模型每次对话都从零开始，它不记得你是谁、你的偏好、你的术语、你踩过的坑。CLAUDE.md 就是给 AI 装的一份持久记忆——它不是一份指令清单，是你和 AI 之间的契约。下一期会讲清楚这份记忆该怎么写、怎么管、怎么让它越用越像如你所意。如果你有问题，建议或者想要讨论的内容，发在评论区或者后台私信我。

  

  

我们下一期见。