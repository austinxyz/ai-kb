#!/usr/bin/env node
// Direct HTTPS fetch + Readability + Turndown for losslessly extracting article bodies.
// Usage:
//   node scripts/aihot-extract.mjs <url>                 # print extracted markdown to stdout
//   node scripts/aihot-extract.mjs --to <file> <url>     # write to file
//   node scripts/aihot-extract.mjs --batch <jsonfile>    # jsonfile: [{num, url, out_path}, ...]

import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

function fetchUrl(url, redirects = 6) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.get(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8',
      },
      timeout: 30000,
    }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        resolve(fetchUrl(next, redirects - 1));
        return;
      }
      if (res.statusCode >= 400) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ url, body: Buffer.concat(chunks).toString('utf8'), status: res.statusCode }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
  });
}

function htmlToMarkdown(html, finalUrl) {
  const dom = new JSDOM(html, { url: finalUrl });
  const doc = dom.window.document;

  // Strip stuff that confuses readability
  for (const sel of ['script', 'style', 'noscript', 'iframe', 'svg', 'nav', 'footer', 'header', 'aside']) {
    for (const el of doc.querySelectorAll(sel)) el.remove();
  }

  // arxiv abstract page: prefer the abstract block directly
  if (/^https?:\/\/arxiv\.org\/abs\//.test(finalUrl)) {
    const title = doc.querySelector('h1.title')?.textContent?.replace(/^Title:\s*/i, '').trim() || '';
    const authors = doc.querySelector('.authors')?.textContent?.replace(/^Authors?:\s*/i, '').trim() || '';
    const abs = doc.querySelector('blockquote.abstract')?.textContent?.replace(/^Abstract:\s*/i, '').trim() || '';
    const subj = doc.querySelector('.subjects')?.textContent?.trim() || '';
    if (title || abs) {
      let md = '';
      if (title) md += `# ${title}\n\n`;
      if (authors) md += `**Authors**: ${authors}\n\n`;
      if (subj) md += `**Subjects**: ${subj}\n\n`;
      if (abs) md += `## Abstract\n\n${abs}\n\n`;
      md += `**arXiv URL**: ${finalUrl}\n`;
      return md;
    }
  }

  let article = null;
  try {
    article = new Readability(doc, { keepClasses: false }).parse();
  } catch (e) {
    article = null;
  }

  if (!article || !article.content || article.content.length < 200) {
    // Fallback: largest <main> or <article>
    const cand = doc.querySelector('main') || doc.querySelector('article') || doc.body;
    article = { title: doc.querySelector('h1')?.textContent?.trim() || '', content: cand?.innerHTML || '' };
  }

  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    hr: '---',
    bulletListMarker: '-',
    emDelimiter: '*',
  });
  // Preserve <pre><code class="language-xx"> as fenced code
  td.addRule('fencedCodeBlock', {
    filter: node => node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE',
    replacement: (_content, node) => {
      const code = node.firstChild;
      const cls = (code.getAttribute('class') || '');
      const langMatch = cls.match(/language-([\w-]+)/);
      const lang = langMatch ? langMatch[1] : '';
      const text = code.textContent.replace(/\n+$/, '');
      return `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
    },
  });
  // Drop image data:uris and decorative svg
  td.addRule('stripDataImg', {
    filter: node => node.nodeName === 'IMG' && (/^data:/i.test(node.getAttribute('src') || '')),
    replacement: () => '',
  });

  let md = '';
  if (article.title) md += `# ${article.title}\n\n`;
  md += td.turndown(article.content);
  // Collapse 3+ blank lines
  md = md.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return md;
}

async function extractOne(url) {
  const { url: finalUrl, body } = await fetchUrl(url);
  const md = htmlToMarkdown(body, finalUrl);
  return { finalUrl, md };
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('usage: aihot-extract.mjs [--to <file>] <url>  |  --batch <jsonfile>');
    process.exit(2);
  }

  if (args[0] === '--batch') {
    const file = args[1];
    const tasks = JSON.parse(fs.readFileSync(file, 'utf8'));
    const results = [];
    for (const t of tasks) {
      try {
        const { md, finalUrl } = await extractOne(t.url);
        fs.writeFileSync(t.out_path, md, 'utf8');
        results.push({ num: t.num, url: t.url, finalUrl, bytes: md.length, status: 'ok' });
        console.error(`ok  #${t.num} ${md.length}B -> ${t.out_path}`);
      } catch (e) {
        results.push({ num: t.num, url: t.url, error: String(e.message || e), status: 'failed' });
        console.error(`ERR #${t.num} ${e.message}`);
      }
    }
    process.stdout.write(JSON.stringify(results, null, 2));
    return;
  }

  let toFile = null;
  let url;
  if (args[0] === '--to') { toFile = args[1]; url = args[2]; } else { url = args[0]; }
  const { md, finalUrl } = await extractOne(url);
  if (toFile) { fs.writeFileSync(toFile, md, 'utf8'); console.error(`wrote ${md.length}B to ${toFile}`); }
  else { process.stdout.write(md); }
  console.error(`final-url: ${finalUrl}`);
}

main().catch(e => { console.error('fatal:', e); process.exit(1); });
