import fs from 'node:fs';
import path from 'node:path';

const files = [
  'raw/agent_engineering/2026-05-04-new-paper-from-sakana-ai-iclr-2026-a-7b-conductor-model-just-hit-sota-on-gpqa-di.md',
  'raw/agent_engineering/2026-05-04-OpenAI-Codex-新模式-Auto-review-在-频繁打扰人类-和-完全放权-之间-引入第三种治理范式-用一个独立-AI-Agent-替代人类-来审.md',
  'raw/agent_engineering/2026-05-06-anthropic-just-shipped-10-finance-agent-templates-that-turn-claude-from-a-chat-a.md',
  'raw/agent_engineering/2026-05-15-new-tools-models-repos-and-papers-out-of-microsoft-research-are-here-use-ai-and-.md',
  'raw/agent_engineering/2026-05-15-你敢把-Opus-和-GPT-接入到小龙虾里跑吗-反正我是不敢-跑不起-但是不接入这些顶级模型-有些复杂任务-国产模型真的搞不定-发现一个以前不知道的团队做的开.md',
  'raw/agent_engineering/2026-05-16-people-freaking-out-over-my-ai-spend-what-nobody-sees-part-of-what-excites-me-so.md',
  'raw/ai_native_infra/2026-05-05-Google-这一波操作-最让人意外的是-Google直接把LLM推理里最顽固的autoregressive瓶颈干掉了-他们和UCSD合作推出的DFlash-D.md',
  'raw/ai_native_infra/2026-05-06-ai-supercomputers-need-a-new-kind-of-network-to-stay-in-sync-at-massive-scale-op.md',
  'raw/dev_methodology/2026-05-02-http-x-com-i-article-2050590821553258496.md',
  'raw/dev_methodology/2026-05-03-解决真正工程问题的-Skills-Skills-For-Real-Engineers-作者-mattpocockuk-公开了自己-claude-目录中每天在用的.md',
  'raw/dev_methodology/2026-05-04-Claude-code有时候会替你做错误假设-不主动要求澄清-该反驳时不反驳-敷衍迎合奉承你-有人把-Karpathy-对-AI-写代码常见问题的观察-整理成一.md',
  'raw/dev_methodology/2026-05-04-Cursor-官方团队自己在用的-CI-Code-Review-发版-测试-清理代码-周报等工作流的-Skills-打包成一个-Plugin-一句指令安装-ad.md',
  'raw/dev_methodology/2026-05-05-Cursor-团队这篇-持续改进我们的-Agent-Harness-写的真不错-很实战-如何衡量-harness-的好坏-如何为不同模型定制-harness-中.md',
  'raw/dev_methodology/2026-05-06-我靠-Warp-这个Skills-太顶了-直接官方开源啊-Warp团队居然把他们日常用来大幅提效的内部-Skills-全部开源了-一条命令就能直接装上15个高质.md',
  'raw/dev_methodology/2026-05-06-这个创造了Claude-Code的男人Boris-Cherny大神-完整公开了自己的工作流-并直播演示了一半的编码工作在手机上完成-不是回消息-是同时跑5到10.md',
  'raw/dev_methodology/2026-05-07-2026-年的-Coding-Agent-应该是什么样-Amp-新版-CLI-Neo-发布-AmpCode-https-ampcode-com-news-neo.md',
  'raw/engineering_roles/2026-05-02-科技圈正在发生一波反常的人才大迁移-多家十亿美元级公司的-CTO-集体辞职-放弃高管职位-转去-Anthropic-做-IC-Workday-CTO-MTS-2.md',
  'raw/engineering_roles/2026-05-05-Anthropic-CEO-Dario-Amodei的那句-Claude在设计Claude-炸了整个AI圈-但似乎很多人都看错了重点-重点不是-RSI来了-而是.md',
  'raw/engineering_roles/2026-05-05-anthropic-s-boris-cherny-argues-that-for-certain-modern-model-friendly-codebases.md',
  'raw/engineering_roles/2026-05-06-Anthropic的Claude为什么能52天推出50个重大功能-神秘武器Mythos要发布了-他们的基础设施负责人-Claude-code之父Boris刚说出.md',
  'raw/engineering_roles/2026-05-06-加密货币交易所-Coinbase-今天宣布裁员约-14-约-700-名员工受影响-CEO-Brian-Armstrong-给出了两个理由-加密货币市场进入下行周.md',
  'raw/engineering_roles/2026-05-16-the-ceo-of-the-world-s-most-valuable-semiconductor-company-just-told-a-room-full.md',
  'raw/industry_insight/2026-04-30-new-microsoft-paper-shows-that-current-ai-assistants-often-damage-documents-duri.md',
  'raw/industry_insight/2026-05-16-fun-interview-with-jacob-effron-on-the-unsupervised-learning-podcast.md',
];

for (const fp of files) {
  const txt = fs.readFileSync(fp, 'utf8');
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  const fm = m[1];
  const get = (re) => (fm.match(re) || [])[1]?.trim() || '';
  console.log('FILE:', fp);
  console.log('TITLE:', get(/title:\s*"?([^"\n]+)"?/m));
  console.log('SERIES:', get(/primary_series:\s*"?([^"\n]+)"?/));
  console.log('TAGS:', get(/aihot_tags:\s*\[([^\]]+)\]/));
  // multi-line summary
  const sumMatch = fm.match(/aihot_summary:\s*\|\n([\s\S]*?)(?=\naihot_recommendation|$)/);
  const sum = sumMatch ? sumMatch[1].replace(/^  /gm,'').trim() : '';
  console.log('SUMMARY:', sum.slice(0, 300));
  console.log('---');
}
