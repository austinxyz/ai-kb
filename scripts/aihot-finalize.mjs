#!/usr/bin/env node
// Step 7 finalize:
// 1. Update raw file frontmatter with wiki_status etc.
// 2. Update wiki/index.md to add new entries.
// 3. Append wiki/log.md.
// 4. Write wiki_drafted.flag.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TO_WRITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/_to_write.json'), 'utf8'));
const KEPT = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/kept.json'), 'utf8'));

const SINCE = '30d';
const FETCHED_AT = KEPT.fetched_at;
const RUN_DATE = '2026-05-08';

// Drafted map (raw_num -> wiki_path) and conflict map
const DRAFTED = {
  13: 'wiki/应用开发/Agentic-Workflow-Token效率.md',
  36: 'wiki/应用开发/AI-Agent-PR审查.md',
  110: 'wiki/AI基础设施/vLLM-V1迁移.md',
  131: 'wiki/应用开发/Claude-Managed-Agents.md',
  144: 'wiki/应用开发/Vibe-Coding与Agentic-Engineering合流.md',
  161: 'wiki/模型与技术/OpenSeeker-v2.md',
  190: 'wiki/行业洞察/AI团队弹性与利用率.md',
  220: 'wiki/AI基础设施/GPU冷启动-Peer权重传输.md',
  307: 'wiki/应用开发/非技术-PM-Claude-Code上架App.md',
  326: 'wiki/应用开发/企业级AI-Agent部署.md',
  332: 'wiki/应用开发/Prompt-Caching工程.md',
};
const CONFLICT = {
  191: 'wiki/行业洞察/AI团队弹性与利用率.md',
};
// After re-extraction with direct HTTPS, #147 OpenAI MRC succeeded. It is now
// eligible (high + original_full) but no wiki draft was created in the rerun
// — flagged as "eligible" so the user can decide.
const ELIGIBLE_NO_DRAFT = new Set([147]);
const FAILED = new Set();

// 1. Update raw frontmatter
function updateRawFrontmatter(absPath, additions) {
  const txt = fs.readFileSync(absPath, 'utf8');
  if (!txt.startsWith('---')) throw new Error('no frontmatter: ' + absPath);
  const end = txt.indexOf('\n---', 3);
  if (end === -1) throw new Error('unterminated fm: ' + absPath);
  const fm = txt.slice(0, end); // includes leading ---
  const rest = txt.slice(end);  // starts with \n---
  const next = fm + '\n' + additions.join('\n') + rest;
  fs.writeFileSync(absPath, next, 'utf8');
}

const updates = [];
for (const r of TO_WRITE) {
  let additions;
  if (DRAFTED[r.num]) {
    additions = [
      `wiki_status: drafted`,
      `wiki_target: "${DRAFTED[r.num]}"`,
    ];
  } else if (CONFLICT[r.num]) {
    additions = [
      `wiki_status: conflict_skipped`,
      `wiki_conflict_with: "${CONFLICT[r.num]}"`,
    ];
  } else if (ELIGIBLE_NO_DRAFT.has(r.num)) {
    additions = [`wiki_status: eligible_pending_review`];
  } else {
    additions = [`wiki_status: not_eligible_summary_only`];
  }
  updateRawFrontmatter(r.abs_path, additions);
  updates.push({ num: r.num, status: additions[0].split(':')[1].trim() });
}

// 2. Update wiki/index.md to add new entries
const indexPath = path.join(ROOT, 'wiki/index.md');
let indexTxt = fs.readFileSync(indexPath, 'utf8');

// New rows (organized by category)
const newRows = {
  '模型与技术': [
    { wiki: 'wiki/模型与技术/OpenSeeker-v2', title: 'OpenSeeker-v2', sum: '纯学术 SFT + 10.6k 数据 30B 模型在 BrowseComp 等四基准超越工业级管线，质胜量' },
  ],
  '应用开发': [
    { wiki: 'wiki/应用开发/Agentic-Workflow-Token效率', title: 'Agentic Workflow Token 效率', sum: 'GitHub 工程化方法：日志埋点 + ET 指标 + 删除未用 MCP + 用 gh CLI 替换 MCP，9/12 workflow 平均省 19-62%' },
    { wiki: 'wiki/应用开发/AI-Agent-PR审查', title: 'AI Agent PR 审查', sum: '5 大红旗：CI gaming、复用盲区、幻觉正确性、agent ghosting、不可信输入；10 分钟分级审查清单' },
    { wiki: 'wiki/应用开发/Claude-Managed-Agents', title: 'Claude Managed Agents', sum: 'Dreaming（跨会话提炼记忆）+ Outcomes（rubric grader）+ Multiagent（lead/sub 编排）三件套，docx +8.4% pptx +10.1%' },
    { wiki: 'wiki/应用开发/Vibe-Coding与Agentic-Engineering合流', title: 'Vibe Coding 与 Agentic Engineering 合流', sum: 'Simon Willison：随 agent 可靠度上升，"不审 review" 从 vibe coding 蔓延到生产级，问责机制缺位' },
    { wiki: 'wiki/应用开发/非技术-PM-Claude-Code上架App', title: '非技术 PM 用 Claude Code 上架 App', sum: '十年 PM 6 周用 Claude Code 出 iOS 压力管理应用 Respiro：多 agent 并行 + 截图调试 + Apple 流程全程 Claude 引导' },
    { wiki: 'wiki/应用开发/企业级AI-Agent部署', title: '企业级 AI Agent 部署', sum: 'Anthropic 三支柱：跨越"agentic thinking divide"、员工技能转型、流程压缩；Claude Cowork 6 个月落地框架' },
    { wiki: 'wiki/应用开发/Prompt-Caching工程', title: 'Prompt Caching 工程', sum: 'Claude Code 团队复盘：前缀匹配 → 静态在前动态在后；用 message 不用 system 改 prompt；切模型废缓存；compaction 也要继承前缀' },
  ],
  'AI 基础设施': [
    { wiki: 'wiki/AI基础设施/vLLM-V1迁移', title: 'vLLM V0→V1 迁移', sum: '在线 RL 迁移先修后端正确性：processed_logprobs + 显式关 prefix-cache/async-scheduling + clear_cache=False + fp32 lm_head' },
    { wiki: 'wiki/AI基础设施/GPU冷启动-Peer权重传输', title: 'GPU 冷启动与 Peer 权重传输', sum: 'Runway NCCLBack：用 200-400 Gbps GPU 互联代替 2-10 Gbps 云存储下载，60× 加速；日省 347TB 流量、6500 推理分钟' },
  ],
  '行业洞察': [
    { wiki: 'wiki/行业洞察/AI团队弹性与利用率', title: 'AI 团队弹性与利用率', sum: 'Tomer Tunguz：AI/人力比决策本质是韧性而非吞吐；3 人管 20 agent 走 1 人 = 33% 机构记忆损失，应保 70-90% 利用率' },
  ],
};

function addRowsToCategory(catName, rows) {
  // Find the section "### <catName>" and the table after it
  const re = new RegExp(`### ${catName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\n\\n\\| 条目 \\| 摘要 \\| 来源数 \\|\\n\\|[^\\n]+\\|\\n([\\s\\S]*?)(?=\\n\\n###|\\n\\n---)`);
  const m = indexTxt.match(re);
  if (!m) {
    console.error('section not found:', catName);
    return;
  }
  // Insert new rows at end of existing rows, replacing the placeholder if present
  let body = m[1];
  if (body.includes('*(待添加)*')) {
    // Replace the placeholder line with new rows
    const newLines = rows.map(r => `| [[${r.wiki}\\|${r.title}]] | ${r.sum} | 1 |`).join('\n');
    body = body.replace(/\| \*\(待添加\)\* \| — \| — \|\n?/, newLines + '\n');
  } else {
    const newLines = rows.map(r => `| [[${r.wiki}\\|${r.title}]] | ${r.sum} | 1 |`).join('\n');
    body = body.trimEnd() + '\n' + newLines + '\n';
  }
  indexTxt = indexTxt.replace(m[1], body);
}

if (process.env.SKIP_INDEX_AND_LOG !== '1') {
  for (const [cat, rows] of Object.entries(newRows)) addRowsToCategory(cat, rows);
  fs.writeFileSync(indexPath, indexTxt, 'utf8');
}

// 3. Append wiki/log.md
const draftedRows = Object.entries(DRAFTED).map(([num, p]) => `  - ${p} (#${num})`).join('\n');
const conflictRows = Object.entries(CONFLICT).map(([num, p]) => {
  const r = TO_WRITE.find(t => t.num === Number(num));
  return `  - "${r?.title?.slice(0, 70) || num}" ↔ ${p}`;
}).join('\n');

const writtenRaw = TO_WRITE.map(r => {
  const cs = FAILED.has(r.num) ? 'aihot_summary_only(failed)' : (r.skip_fetch ? 'aihot_summary_only(skipped)' : 'original_full');
  return `  - ${r.rel_path} (${r.series}, ${cs})`;
}).join('\n');

const degraded = TO_WRITE.filter(r => r.skip_fetch || FAILED.has(r.num)).map(r => {
  const reason = FAILED.has(r.num) ? 'fetch failed (HTTP 403)' : `skipped (source_type=${r.source_type})`;
  return `  - ${r.rel_path} — ${reason}`;
}).join('\n');

const cls = JSON.parse(fs.readFileSync(path.join(ROOT, 'raw/_cards/current/classification.json'), 'utf8'));
const skipCount = cls.filter(c => c.primary_series === 'SKIP').length;
const skipReasons = new Map();
for (const c of cls.filter(c => c.primary_series === 'SKIP')) {
  const r = (c.skip_reason || '未知').slice(0, 30);
  skipReasons.set(r, (skipReasons.get(r) || 0) + 1);
}
const topSkip = [...skipReasons.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, n]) => `${r}×${n}`).join(' / ');

const logEntry = `\n## [${RUN_DATE}] aihot-pull --since ${SINCE} | 候选 ${KEPT.total} / 入库 ${TO_WRITE.length} / 起草 wiki ${Object.keys(DRAFTED).length}
- run-id: ${FETCHED_AT}
- 入库:
${writtenRaw}
- 起草 wiki draft:
${draftedRows}
- 冲突跳过:
${conflictRows}
- 抓取降级（content_source=aihot_summary_only）:
${degraded}
- LLM 建议跳过: ${skipCount} 条（${topSkip}）
`;

if (process.env.SKIP_INDEX_AND_LOG !== '1') {
  const logPath = path.join(ROOT, 'wiki/log.md');
  fs.appendFileSync(logPath, logEntry, 'utf8');
}

// 4. Write wiki_drafted.flag
fs.writeFileSync(path.join(ROOT, 'raw/_cards/current/wiki_drafted.flag'), new Date().toISOString(), 'utf8');

console.log('updated raw frontmatter:', updates.length);
console.log('  drafted:', Object.keys(DRAFTED).length);
console.log('  conflict_skipped:', Object.keys(CONFLICT).length);
console.log('  not_eligible:', updates.filter(u => u.status === 'not_eligible_summary_only').length);
console.log('updated wiki/index.md');
console.log('appended wiki/log.md');
console.log('wrote wiki_drafted.flag');
