#!/usr/bin/env node
// aihot-mp-fetch-playwright — fetch /mp via authenticated Playwright session.
//
// ⚠️ DEPRECATED 2026-05-08: login.virxact.com is internal SSO for 虚实传媒
// employees + contracted bloggers only. External users cannot register, so
// the --login flow has nowhere to authenticate to. Code preserved as a
// reference if upstream policy changes (e.g. opens an external account tier
// or exposes /api/public/mp).
//
// Two modes:
//   --login           launch headed browser, wait for user to sign in, save storageState
//   (default)         headless fetch using saved storageState; prints JSON envelope
// Storage state: .aihot/storage-state.json (gitignored). One-time login persists ~30-90 days.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import { parseMpHtml, normalizeSince } from './aihot-mp-fetch.mjs';

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.aihot');
const STATE_FILE = path.join(STATE_DIR, 'storage-state.json');
const BASE = 'https://aihot.virxact.com/mp';
const PAGE_HARD_CAP = 30;

function ensureStateDir() {
  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
}

async function loginFlow() {
  ensureStateDir();
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  process.stderr.write('\n=== aihot-mp login ===\n');
  process.stderr.write('A Chromium window will open. Sign in via the 登录 button.\n');
  process.stderr.write('Once /mp shows the 公众号爆文 table, this script auto-saves and closes — no terminal action needed.\n\n');
  await page.goto(BASE).catch(() => {});

  const TIMEOUT_MS = 10 * 60 * 1000; // 10 min for user to log in
  const POLL_MS = 2000;
  const t0 = Date.now();
  let lastUrl = '';
  while (Date.now() - t0 < TIMEOUT_MS) {
    const url = page.url();
    if (url !== lastUrl) {
      process.stderr.write(`url: ${url}\n`);
      lastUrl = url;
    }
    if (url.startsWith('https://aihot.virxact.com/mp')) {
      const tableCount = await page.locator('table.mp-table').count().catch(() => 0);
      if (tableCount > 0) {
        // Confirm by re-navigating with a fresh request to make sure no redirect
        await page.goto(BASE, { waitUntil: 'domcontentloaded' }).catch(() => {});
        const finalUrl = page.url();
        const finalTable = await page.locator('table.mp-table').count().catch(() => 0);
        if (finalUrl.startsWith('https://aihot.virxact.com/mp') && finalTable > 0) {
          await ctx.storageState({ path: STATE_FILE });
          await browser.close();
          process.stderr.write(`\n✓ saved storage state to ${STATE_FILE}\n`);
          process.stderr.write(`Now run: node scripts/aihot-mp-fetch.mjs --backend playwright --since 30d\n`);
          return;
        }
      }
    }
    await new Promise(r => setTimeout(r, POLL_MS));
  }
  process.stderr.write(`\n✗ timeout waiting for /mp to load with table. Did you sign in?\n`);
  await browser.close();
  process.exit(1);
}

async function fetchFlow(since, opts = {}) {
  if (!fs.existsSync(STATE_FILE)) {
    throw new Error(`no storage state at ${STATE_FILE}. Run: node scripts/aihot-mp-fetch-playwright.mjs --login`);
  }
  const sinceParam = normalizeSince(since);
  const maxPages = opts.maxPages ?? PAGE_HARD_CAP;
  const items = [];
  const errors = [];
  const seenIds = new Set();

  const browser = await chromium.launch({ headless: true });
  try {
    const ctx = await browser.newContext({ storageState: STATE_FILE });
    const page = await ctx.newPage();
    page.setDefaultTimeout(30000);

    for (let p = 1; p <= maxPages; p++) {
      const url = `${BASE}?since=${sinceParam}&page=${p}`;
      let html;
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
        if (res && res.status() >= 400) {
          errors.push({ stage: 'fetch_page', page: p, message: `HTTP ${res.status()}` });
          break;
        }
        // Wait for the table; if it never appears, page is empty or login expired
        await page.waitForSelector('table.mp-table', { timeout: 10000 }).catch(() => {});
        html = await page.content();
      } catch (e) {
        errors.push({ stage: 'fetch_page', page: p, message: String(e.message || e) });
        break;
      }

      // Cheap login-expiration detection
      if (page.url().includes('login.virxact.com') || page.url().endsWith('/')) {
        errors.push({ stage: 'auth', page: p, message: 'session expired or /mp not accessible — re-run --login' });
        break;
      }

      let pageResult;
      try {
        pageResult = parseMpHtml(html);
      } catch (e) {
        errors.push({ stage: 'parse_page', page: p, message: String(e.message || e) });
        break;
      }
      errors.push(...pageResult.errors.map(e => ({ ...e, page: p })));
      if (pageResult.items.length === 0) break;

      let added = 0;
      for (const it of pageResult.items) {
        if (seenIds.has(it.aihot_id)) continue;
        seenIds.add(it.aihot_id);
        items.push(it);
        added++;
      }
      if (added === 0) break; // page entirely duplicate
    }

    await browser.close();
  } catch (e) {
    try { await browser.close(); } catch {}
    throw e;
  }

  return { items, errors, since: sinceParam };
}

async function main(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      login: { type: 'boolean', default: false },
      since: { type: 'string', default: '30d' },
      limit: { type: 'string' },
    },
  });

  if (values.login) {
    await loginFlow();
    return;
  }

  const fetched_at = new Date();
  let items = [];
  const errors = [];
  let sinceUsed = values.since;
  try {
    const r = await fetchFlow(values.since);
    items = r.items;
    errors.push(...r.errors);
    sinceUsed = r.since;
  } catch (e) {
    errors.push({ stage: 'fetch_or_parse', message: String(e.message || e) });
  }

  if (items.length === 0 && errors.some(e => e.stage === 'fetch_page' || e.stage === 'auth' || e.stage === 'fetch_or_parse')) {
    process.stderr.write(`aihot-mp-fetch-playwright fatal: ${errors.map(e => e.message).join('; ')}\n`);
    process.exit(1);
  }

  const limited = values.limit ? items.slice(0, Number(values.limit)) : items;
  const output = {
    fetched_at: fetched_at.toISOString(),
    window: { since: sinceUsed, until: fetched_at.toISOString() },
    source: 'aihot.virxact.com/mp',
    fetch_method: 'playwright',
    items: limited,
    errors,
  };
  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  process.exit(errors.length > 0 && items.length === 0 ? 2 : 0);
}

import { pathToFileURL } from 'node:url';
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(err => {
    process.stderr.write(`aihot-mp-fetch-playwright unhandled: ${err.stack ?? err}\n`);
    process.exit(1);
  });
}
