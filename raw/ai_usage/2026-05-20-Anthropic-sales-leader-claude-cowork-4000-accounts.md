# How an Anthropic Sales Leader Uses Claude Cowork to Run a 4,000-Account Book

- **来源**: https://claude.com/blog/how-an-anthropic-sales-leader-uses-claude-cowork-to-run-a-4-000-account-book
- **作者**: Travis Bryant, Head of US Mid-Market GTM at Anthropic
- **发布日期**: 2026-05-20
- **抓取日期**: 2026-05-20
- **content_source**: blog_full

---

## 背景

Travis Bryant 是 Anthropic 美国中端市场 GTM 负责人，管理两个细分：中端市场科技公司 + 行业客户（金融服务、医疗、零售、制造）。账户数：4000 个。

他用 Claude Cowork 把三类工作自动化：
- 每日：客户通话前准备
- 每周：销售预测汇总报告
- 每季：全账户评分项目

## 具体实现

### 每日任务（节省约 90 分钟）

1. **会议室预订 Skill**：扫描 Google Calendar，为缺少会议室的外部会议自动预订
2. **客户通话准备 Skill**：从 BigQuery 拉取消费数据、从 Salesforce 拉取 pipeline 状态，在通话前整合好

### 每周预测（每周节省约 3 小时）

定时 Skill 在周一预测电话前生成单页 Web 报告：
- 从 Salesforce 拉取 opportunity 记录和预测 commit
- 从 BigQuery 获取 token 消费
- 汇编内部文档笔记
- 输出：头部指标 / 重点交易 / 涨跌变动 / 预测快照

### 季度全账户评分（原需数百小时）

**规模**：4000 个账户，一夜跑完

**原本需要**：RevOps、FP&A、Marketing 团队数百小时

**科技账户评分维度（5 项）**：
1. Agent opportunity
2. Internal transformation
3. AI commitment
4. White space against existing spend
5. Industry fit

**行业账户评分维度（5 项）**：
1. Knowledge-worker density
2. Public AI commitments
3. （另外 3 项未披露）

**输出**：
- 每个账户的数值评分
- 每个维度的书面理由
- 按领土划分的可交互 Dashboard
- 账户排名 + 生成的理由说明
- 可悬停详情（潜在用例 + 可比案例）

## 实现方式（无技术提示）

Bryant 的迭代模式：
1. 与 Claude 定义评分维度
2. 跑测试领土
3. 检查输出
4. 调整权重（"我觉得 D4 权重有点高，调低一点"）
5. 跑下一批领土

## 关键引用

> "Prompts read like English sentences, outputs land in formats I already work in (docs, web pages, and Salesforce updates), and the human-in-the-loop pattern is built in so Claude proposes and I approve before anything ships."

Bryant 明确表示更偏好 Claude Cowork 而非 Claude Code，因为界面比终端交互更适合他的工作流。

## 给销售团队的建议

- **模式 1**：把准备工作放到定时任务上——scheduled task 消除了人工提醒
- **模式 2**：把大型战略项目（TAM sizing、账户研究、竞品基准）跑成过夜例程

Sales 插件包含基础 Skills，供各团队针对自身工作流定制。
