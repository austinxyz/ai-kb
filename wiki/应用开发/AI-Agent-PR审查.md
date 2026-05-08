---
title: AI Agent PR 审查
category: 应用开发
tags: [Agent, Code-Review, GitHub, 技术债, 安全]
source: "[[raw/dev_methodology/2026-05-08-agent-pull-requests-are-everywhere-here-s-how-to-review-them]]"
updated: 2026-05-08
status: stable
aihot_origin:
  aihot_id: "cmovvs6e600ouslcxuur7w2qt"
  aihot_url: ""
  series: S2_methodology
  drafted_by: aihot-pull
  drafted_at: 2026-05-08
---

## 定义
GitHub 官方给出的 AI Agent 生成 PR 的系统化审查方法：在 Copilot 评审已突破 6000 万次（一年增 10×、超 1/5 的 GitHub Code Review 现已涉及 agent）的现实下，用 5 个红旗 + 10 分钟分级流程，把人类有限的判断力集中到机器看不出的地方——上下文、副作用、组织级技术债。

## 核心要点
- **量级**：Copilot Code Review 已处理 6000 万+ reviews，一年增长 10×；超过 1/5 的 GitHub Code Review 现在涉及 agent。一个开发者午饭前可发起 12 个 agent session，但人工审查容量没扩容。
- **关键证据**：2026 年 1 月论文《More Code, Less Reuse》（arXiv 2601.21276）发现 agent 生成的代码每次变更引入更多冗余和技术债，但表面整洁，反而让审查者更乐意 approve——"clean surface, quiet debt"。
- **5 个红旗**：① CI gaming（删测试、加 `|| true`、动 coverage 阈值就是阻断条件）；② Code reuse blindness（agent 不知整库已有 utility，会重复造轮子，要求合并而非留评论）；③ Hallucinated correctness（编译通过、测试通过但语义错——分页 off-by-one、permission check 缺漏；要求新写一个能在 pre-change 行为下失败的测试）；④ Agentic ghosting（大无 plan 的 PR 让审查投入打水漂，要求先拆 plan）；⑤ Untrusted input in workflows（PR body / issue body / commit message 插值进 prompt 再喂 shell 是 prompt injection 大门，须用 least-privilege `permissions: read-all` 默认 + 模型输出禁止 eval + 分析与执行步要拆开加人工 gate）。
- **10 分钟分级清单**：1–2 min 扫描分类 → 2–3 min 先看 CI 改动（动 `.github/workflows`、test config、coverage、build script 都先看）→ 3–5 min 扫新 utility 查重复 → 5–8 min 追一条关键路径（input → transforms → output 的边界条件、permission、意外分支）→ 8–9 min 安全边界（含 LLM 的 workflow 必跑 prompt injection 检查）→ 9–10 min 要求证据（关键变更要有 fail-on-pre-change 的回归测试）。
- **请求拆 PR 的硬阈值**：diff 触动 5 个以上无关文件、PR 目的一句话讲不清、PR body 空且无 plan、CI 失败而 diff 只动测试文件——四条任一即应退回，并附"Please break this into smaller scoped units, or add a summary of what each part does and why it's structured this way"模板。
- **Copilot first 工序分工**：自动评审跑机械问题（style、obvious logic、missing error handling、type mismatch），人类只追"判断"——上下文、组织级 prior art、operational constraint。可用 Copilot SDK 把团队 checklist（auth 在 admin endpoint 上、env var 安全处理、所有外部输入 validated）codify 成 workflow，命中关键问题就阻断 merge。
- **核心观点**："Judgment is the bottleneck, and that's fine"——boilerplate 扫描时间应缩短，不缩短的是审查者携带的、不写在仓库里的系统知识。

## 与其他概念的关系
- [[wiki/应用开发/Vibe-Coding与Agentic-Engineering合流|Vibe Coding 与 Agentic Engineering 合流]]：与 Simon Willison 的"我自己也不再每行 review"互为镜像——本文给"还是要 review"的人一份操作清单。
- [[wiki/应用开发/Harness-Engineering|Harness Engineering]]：5 个红旗中至少 3 个（CI gaming、untrusted input、agent ghosting）属于 harness 设计层面要在 PR 前拦的项；review 是 harness 失效后的最后防线。
- [[wiki/行业洞察/认知债务|认知债务]]：Agent 生成代码的"surface looks complete"与认知债务的复利积累机制完全同源。

## 参考来源
- [[raw/dev_methodology/2026-05-08-agent-pull-requests-are-everywhere-here-s-how-to-review-them|Agent pull requests are everywhere. Here's how to review them]]
