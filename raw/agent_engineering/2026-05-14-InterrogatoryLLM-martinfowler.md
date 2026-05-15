---
title: "Interrogatory LLM"
slug: 2026-05-14-InterrogatoryLLM-martinfowler
fetched_at: 2026-05-14T00:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-14T00:00:00.000Z
aihot_tags: ["LLM", "Context Engineering", "Agentic AI", "Prompt Engineering", "Martin Fowler"]
aihot_starred: 0
aihot_summary: |
  用 LLM 来"采访"人类，代替人类手写上下文文档。LLM 逐一提问（每次只问一个问题），收集完信息后生成供下一个 LLM session 使用的 context report。也可反向使用：把已有文档交给 LLM，让它采访领域专家来核查文档是否准确——比让专家自己阅读审查更有效。
aihot_recommendation_reason: |
  Martin Fowler 对一个高价值 prompt 范式的简洁阐述。"interrogatory LLM" 是为复杂任务构建上下文的实用技巧，单次提问约束（one question at a time）是可直接复用的 prompt 规则。
source_url: "https://martinfowler.com/bliki/InterrogatoryLLM.html"
source_type: "blog_personal"
content_source: "webfetch_manual"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: ["S2_methodology"]
  confidence: "high"
wiki_status: "pending"
wiki_target: ""
---

# Interrogatory LLM

> Martin Fowler · bliki · 14 May 2026 · *generative AI*

When we need an LLM to perform a complex task, we often need to feed it a lot of context. Coming up with a design for a new feature requires descriptions of how we want the feature to appear to the user, guidelines on how it should be implemented, information on external systems to consult, and so on. All this can be several pages of markdown. The obvious way to do this is for a human to write this context, but an alternative is to use an LLM to write this context after interviewing a human.

The way I can do this is to prompt the LLM to interrogate me. It should ask me all the questions it needs to create this appropriate context. I can feed much of the information it needs, and tell it other sources it needs to consult if it can't figure those out itself. Once it's done, it can then create the context report for another session (perhaps with another model) to carry out the next step.

I first saw a decent description of this approach in Harper Reed's blog. A striking element of his approach is insisting that the LLM ask only one question at a time. (When I tried it, I found it needed to be frequently reminded of this.)

Another way to use an interrogatory LLM is to give it a document, such as a software specification, that captures knowledge about a domain - and then ask the LLM to interview a human expert to determine if the document is accurate. This is an alternative to getting the human expert to read the document to review it. People often find reviewing hard, so a conversation with an LLM might be more fruitful, particularly if the document isn't well-written.

Naturally we can use both of these, using one interrogatory LLM to build a document, then using other interrogatory LLMs to review it with other experts.

The above is getting an LLM to create or assess context for a particular use of an LLM. But the technique is more broadly applicable. I've become a natural writer, someone who finds the process of writing an essential part of thinking. To really understand something, I need to write about it. But different people are different. Many folks find writing hard, often *very* hard. This can be a real problem when we need to get information out of someone's head into a form that other humans can consume. Maybe such people would find it easier to ask an LLM to interview them than to write a document themselves. Certainly the result will have that tang of AI-writing that folks like me shudder at - but that's better than not having the information itself, either due to rushed writing or no writing at all.

## 来源

- 原文：https://martinfowler.com/bliki/InterrogatoryLLM.html
- 作者：Martin Fowler
- 发布日期：2026-05-14
