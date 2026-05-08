#!/usr/bin/env node
// aihot-fetch — fetch and parse aihot.virxact.com curated cards into JSON.
// Strategy: paginated /all + filter aiSelected:true. See aihot-fetch.notes.md.

const SOURCE_TYPE_RULES = [
  [/(^|\.)twitter\.com$|(^|\.)x\.com$/i, 'twitter'],
  [/(^|\.)mp\.weixin\.qq\.com$/i, 'wechat'],
  [/(^|\.)github\.com$|(^|\.)github\.io$/i, 'github'],
  [/(^|\.)arxiv\.org$/i, 'arxiv'],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/i, 'youtube'],
];

export function deriveSourceType(url) {
  try {
    const host = new URL(url).hostname;
    for (const [re, type] of SOURCE_TYPE_RULES) {
      if (re.test(host)) return type;
    }
    return 'blog';
  } catch {
    return 'blog';
  }
}
