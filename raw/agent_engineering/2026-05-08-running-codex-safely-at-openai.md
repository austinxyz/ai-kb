---
title: "在 OpenAI 安全运行 Codex"
slug: 2026-05-08-running-codex-safely-at-openai
fetched_at: 2026-05-09T00:00:00.000Z
aihot_id: ""
aihot_url: ""
aihot_published_at: 2026-05-08T00:00:00.000Z
aihot_tags: []
aihot_starred: 0
aihot_summary: |
  OpenAI通过沙盒隔离、人工审批流程、严格网络策略与原生代理遥测四层防护机制，确保Codex代码生成模型的安全运行。沙盒环境完全隔离执行代码，所有生产请求需经人工审核批准，网络策略限制外部依赖访问，实时遥测系统监控代理行为异常。该安全框架使企业能够合规采用AI编程助手，在保障代码安全性的同时维持开发效率。
aihot_recommendation_reason: ""
source_url: "https://openai.com/index/running-codex-safely"
source_type: "blog"
content_source: "original_full"
fetch_status: "ok"
fetch_error: null
classification:
  primary_series: "S4_agent"
  also_relevant: ["S2_methodology"]
  confidence: "high"
ingest_method: "aihot-daily-save"
ingest_source: "daily 2026-05-09 · 技巧与观点 #8"
wiki_status: drafted
wiki_target: "wiki/应用开发/Codex-安全治理四层架构.md"
---
# Running Codex safely at OpenAI

As AI systems become more capable, they increasingly act on behalf of users. Coding agents can autonomously review repositories, run commands, and interact with development tools. These are tasks that previously required direct human execution.

With Codex, we’ve designed these capabilities alongside the controls organizations need for safe deployment. Security teams need ways to govern how agents operate: what they can access, when human approval is required, which systems they can interact with, and what telemetry exists to explain their behavior.

At OpenAI, we deploy Codex with a few clear goals: keep the agent inside clear technical boundaries, let developers move quickly on low-risk actions, and make higher-risk actions explicit. We also preserve agent-native telemetry so we can understand and audit what the agent did. In practice, that means managed configuration, constrained execution, network policies, and agent-native logs.

## Controlling how Codex operates

We deploy Codex with a simple principle that it should be productive inside a bounded environment, low-risk everyday actions should be frictionless, and higher-risk actions should stop for review.

Approvals and sandboxing work together. The sandbox defines the technical execution boundary, including where Codex can write, whether it can reach the network, and which paths remain protected. Approval policy determines when Codex must ask to perform an action, such as when it needs to do something outside of the sandbox. Users can approve the action once, or approve that type of action for that session.

For routine approval requests, we are using Auto-review mode, which is a feature that, when turned on, auto-approves certain kinds of requests to reduce how often users have to stop and approve Codex actions. Codex sends the planned action and recent context to the auto-approval subagent, which can automatically approve low-risk actions instead of interrupting the user. That keeps Codex moving on routine work while still stopping on higher-risk or actions with unintended consequences.

We do not run Codex with open-ended outbound access. Our managed network policy allows expected destinations, blocks destinations we do not want Codex reaching, and requires approval for unfamiliar domains. That lets Codex complete common, known-good workflows without giving it broad network access.

We also manage how Codex authenticates. CLI and MCP OAuth credentials are stored in the secure OS keyring, login is forced through ChatGPT, and access is pinned to our ChatGPT enterprise workspace. That keeps Codex usage tied to our workspace-level controls and makes Codex activity available in the ChatGPT Compliance Logs Platform for our enterprise workspace.

We use rules so Codex does not treat every shell command as equally safe. Common benign commands that engineers use in day-to-day development are allowed without approval outside of the sandbox and specific dangerous commands can be blocked or require approval. That lets Codex move quickly through ordinary engineering tasks while still forcing review or blocking patterns we do not want to run outside the sandbox.

We apply this posture through a combination of cloud-managed requirements, macOS managed preferences, and local requirements files. Requirements are admin-enforced controls that users cannot override. The macOS managed preferences and local requirements files allow us to keep a consistent baseline while still testing different configurations by team, user group, or environment. These configurations apply across local Codex surfaces, including the desktop app, CLI, and IDE extension.

## Agent-native telemetry and audit trails

Control is only half the job. Once agents are deployed, security teams need visibility into what these agents are doing and why. Traditional security logs are still useful when looking at actions taken by Codex, but they mostly answer what happened: a process started, a file changed, a network connection was attempted. Defenders are still left to figure out why Codex did something, or the user's intent.

Codex can give security teams a more agent-aware view. Codex supports OpenTelemetry log export for various Codex events such as user prompts, tool approval decisions, tool execution results, MCP server usage, and network proxy allow or deny events. Codex activity logs are also available through the OpenAI Compliance Platform for Enterprise and Edu customers.

At OpenAI, we use Codex logs alongside our AI-powered security triage agent. When an endpoint alert says Codex did something unusual, the endpoint security tool tells us that a suspicious event occurred. Codex logs then help explain the surrounding intent by the user and agent. Our AI security triage agent uses Codex logs to inspect the original request, tool activity, approval decisions, tool results, and any relevant network policy decision or block. The AI security triage agent surfaces its analysis to our security team for review to distinguish between expected agent behavior, benign mistakes, and activity that truly warrants escalation.

We also use the same telemetry operationally. We use these logs to understand how internal adoption is changing, which tools and MCP servers are being used, how often the network sandbox is blocking or prompting, and where the rollout still needs tuning. These OpenTelemetry logs can be centralized in SIEM and compliance logging systems.

## Looking ahead

As coding agents like Codex become integrated into development workflows, security teams need tools specifically designed for managing this shift. Codex provides the control surfaces, configuration management, sandboxing, and detailed agent-aware telemetry needed to ensure safe adoption. With those capabilities in place, security teams can enable Codex with greater confidence, balancing developer productivity with the visibility and control required for enterprise security. More information on configuring Codex can be found [here](https://developers.openai.com/codex/config-basic), and the Compliance API [here](https://help.openai.com/en/articles/9261474-openai-compliance-platform-for-enterprise-and-edu-customers).
