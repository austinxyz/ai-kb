---
title: 非技术 PM 用 Claude Code 上架 App
case_study: Respiro
category: 应用开发
tags: [Claude-Code, Case-Study, PM, Multi-Agent, App-Store, Swift]
source: "[[raw/dev_methodology/2026-05-01-how-a-non-technical-project-manager-built-and-shipped-a-stress-management-app-wi]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmon6g4w70do8sll9bfon702b"
  aihot_url: ""
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
Mythical Games 项目经理 Kostiantyn Vlasenko 在 Built With Opus 4.6 Claude Code Hackathon 中获奖的实践：零编程经验、72 小时内做出原型、6 周内独立把 iOS 压力管理 App "Respiro" 上线 Apple App Store；核心方法是把十年"管人"经验直接迁到"管 IDE 里的 AI agent"。

## 核心要点
- **产品差异化**：Respiro 通过手机实时检测压力信号（accelerometer + 行为信号 → Apple 平台 API），在用户真正紧张的瞬间主动弹出 box breathing 引导——区别于"晚上 10 点提醒做深呼吸"的传统应用。文章开头就是"采访前 15 分钟手机替他识破他自己没察觉的紧张"案例。
- **6 周节奏 + 现实成绩**：72 小时 hackathon 出可用原型；6 周后 App Store 上线，已数百用户。
- **15+ Sub-Agent 并行架构**：包含 TCA architect agent、Swift developer agent、Metal specialist、code reviewer 等，全部在 IDE 里并行运行，由 Vlasenko 自己 orchestrate。
- **首版 → Swift 重写**：MVP 用 React Native，因没 Android 手机测试受阻，Vlasenko 让 Claude Code 在数小时内把整个应用从 React Native 重写为原生 Swift——展示了 agent 化的"重写成本"已远低于传统手写。
- **管 agent ≈ 管人的认知迁移**：Vlasenko 自述："I have a lot of experience managing real people. I realized this was the same thing, only managing agents inside my IDE."
- **跨非工程环节的 Claude 引导**：① Apple Developer Program 注册——卡住就截屏问"hey, what should I press here?"，靠 Claude vision 一步步引导。② Sentry 日志、Amplitude 分析等第三方集成——"I completed the sign-in, here's the API key"，Claude 99% 一次成功。③ Meta API token 创建 UI 找不到入口，截屏让 Claude 解读界面后引导点击。Vlasenko 直言 Claude vision 是最被低估的能力。
- **超越编码的价值**：Amplitude 集成不止接 SDK，Claude 还配出 user funnel、retention、DAU/MAU；blog 与 TikTok 内容由 Claude 写；增长策略——给心理学家 / mindfulness practitioner 推荐 Respiro—— Vlasenko 自己没想到，试了真有效。
- **二阶效应**：作者把 workflow 带回 Mythical Games 本职岗，开始直接 commit 代码发版；公司组建小型纯 Claude 交付团队；他观察到工程师"放下逐行控制代码"的 mindset 比 PM 难，"For me, it was easy because I don't have a deep programming background and it just felt like a natural way of working."

## 与其他概念的关系
- [[wiki/应用开发/Claude-Code团队配置|Claude Code 团队配置]]：15+ sub-agent 并行是 Claude Code 团队配置在个人开发场景的极致化应用。
- [[wiki/行业洞察/AI时代PM物种替换|AI 时代 PM 物种替换]]：案例验证了 PM 转 Builder 的可行性——身份流动性与"管 agent ≈ 管人"心智迁移。
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：PM 思维管 agent 时天然对应 harness 的"团队规则、独立验证"原则。

## 参考来源
- [[raw/dev_methodology/2026-05-01-how-a-non-technical-project-manager-built-and-shipped-a-stress-management-app-wi|How a non-technical project manager built and shipped a stress management app with Claude Code in six weeks]]
