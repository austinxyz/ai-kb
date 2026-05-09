---
description: 拉 aihot.virxact.com AI 日报到终端，30 秒扫完五版块（不入库、不分类、不起 wiki）
---

You are showing the user today's (or a specified date's) AI 日报 from aihot.virxact.com.

This command is for **fast reading only**. No raw/, no wiki, no _history. The user wants a quick scan of what happened in AI today, like flipping a newspaper.

## Argument parsing

The user invokes with one of:
- `/aihot-daily` (no args) → latest available daily
- `/aihot-daily 2026-05-08` → specific date (YYYY-MM-DD)
- `/aihot-daily --list 14` → list last 14 daily dates so the user can pick one
- `/aihot-daily --json` → raw JSON dump (for piping to other tools)
- `/aihot-daily --no-save` → skip the auto-archive step (default behavior auto-saves to `daily/aihot/<date>.md`, gitignored)

If the user passes both a date and `--list`, prefer `--list` (date is then ignored).

## Local archive (auto-save)

Every render mode (with or without a date) auto-saves the rendered markdown to `daily/aihot/<YYYY-MM-DD>.md`. The `daily/` dir is already gitignored — pure local. Idempotent: re-running for the same date with same upstream `generatedAt` skips the write. If aihot regenerates the daily later in the day (different generatedAt), the local file is overwritten. Pass `--no-save` to opt out for one run.

## Execution

Single Bash call to the fetcher. Pass through whatever args the user gave:

```bash
node scripts/aihot-daily.mjs <args>
```

The script handles everything: fetch, render markdown, print to stdout. Just relay its output to the user without summarizing or paraphrasing.

If the script exits non-zero:
- Exit 1 + stderr says "404": the requested date hasn't been generated yet (北京时间 08:00 cron). Suggest user try the previous day or run without args (latest).
- Exit 2: invalid date format. Show the error and explain expected format.
- Other: show stderr verbatim.

## Important rules

1. **Output verbatim** — the script's markdown is already designed for terminal reading. Do NOT re-render, summarize, or paraphrase.
2. **No follow-ups** — do not ask "want me to ingest these?" or "shall I write to raw/?". This is read-only by design. If the user later says "save #3 to raw", they can run `/aihot-pull` instead.
3. **Don't fetch source URLs** — the daily already has a one-line summary per item. The user reads, decides which links to click manually.
4. **Don't update wiki/log.md** — daily reads are not events worth logging.
5. If user explicitly asks for a feature beyond rendering (e.g. "translate to English", "filter to model releases"), do that on top of the script output but don't extend the script itself unless requested.
