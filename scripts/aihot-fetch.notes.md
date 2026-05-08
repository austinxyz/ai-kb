# aihot-fetch implementation notes

## Probe date

- 2026-05-07 (initial)

## Site architecture

aihot.virxact.com is a Next.js App Router app with React Server Components.
The page HTML is mostly the static shell + a series of `self.__next_f.push([N,"..."])`
script calls that contain the streaming RSC payload. The interesting data lives
inside that payload, encoded as JSON-escaped JSON.

Public access is granted (no auth needed) for `/`, `/all`, `/daily`, `/mp`,
`/feed.xml`, `/feed/all.xml`, `/feed/daily.xml`. Any `/api/*` path 302-redirects
to login.virxact.com.

## Chosen strategy

**`paginated_all`** — fetch `/all?page=1`, `?page=2`, … iterating until the
oldest item on the page is older than the `--since` cutoff, then filter
`aiSelected === true` to keep only editor-curated items.

### Why not the alternatives

| Path | Why rejected |
|------|--------------|
| `/feed.xml` (RSS) | Clean, but only ~50 items spanning the last ~24 hours. Weekly cadence would miss 6 days. |
| `/` (curated home) | Same date-window limit (~2 days). Pagination param `?page=N` is ignored. |
| `/all` page 1 only | Single page = 40 items spanning ~5 hours. Inadequate for 7-day window. |
| `/api/*` | All routes 302 to login. Authenticated API not pursued. |
| `?date=YYYY-MM-DD` filter | Ignored on both `/` and `/all`. |

### How this maps to spec §2 strategies

The spec listed three fallback levels:
1. `__NEXT_DATA__` extraction
2. Reverse-engineer backend API
3. Playwright headless

What the probe actually found:
- Strategy 1 partial: there IS streaming data (`self.__next_f.push`) but it's
  not the legacy `<script id="__NEXT_DATA__">` shape — App Router uses streaming
  RSC. We extract by scanning push calls and joining the payloads.
- Strategy 2 N/A: backend API requires auth.
- Strategy 3 not needed: server-rendered HTML contains the full payload for
  unauthenticated requests.

So we sit between strategies 1 and 2: zero-JS-engine HTML scrape + RSC payload
join. No Playwright dependency.

## Field mapping (RSC item JSON → our contract)

After joining all `self.__next_f.push` payloads, item objects appear as
self-contained JSON dicts with `{"id":"cm…",…}` shape. Match each with a
JSON-aware brace walker.

| Our contract field | Source path |
|---------------------|---------------------------------------------------|
| aihot_id            | `id` (cuid string starting with `cm`)             |
| title               | `title` (English) || `titleZh` if title missing  |
| summary             | `summaryZh`                                        |
| recommendation_reason | `aiSelectedReason`                              |
| tags                | `aiTags[].tag` (array)                            |
| starred_count       | `qualityScore` (or `finalScore` — same value seen)|
| published_at        | `publishedAt` (ISO 8601 UTC, ready as-is)         |
| source_url          | `url`                                             |
| source_type         | derived from `url` hostname (see deriveSourceType) |

Curation flag (filter criterion):
- `aiSelected === true` ⇒ keep
- Also confirmable via `accentClass === "timeline-item-selected"` — same signal

`source.kind` values seen: `rss`, `x`, `web`, `mp` (公众号). Not used in our
contract directly but informs source_type heuristics.

## Pagination loop

```
page = 1
items_acc = []
loop:
  fetch /all?page={page}
  parse items
  if no items: break
  items_acc.extend(items where aiSelected == true)
  oldest_published_at = min(item.publishedAt for item in current page)
  if oldest_published_at < (now - since_days): break
  page += 1
return items_acc filtered by published_at >= cutoff
```

Empirical pace at probe date: 40 items per page, ~5-7 pages per CST day.
A `--since 7d` window typically requires ~40-50 page fetches.

## Known quirks

1. **No `__NEXT_DATA__` script tag.** App Router uses streaming RSC via
   `self.__next_f.push`. Our regex must match all push calls (there are usually
   6 chunks at probe time; the 5th chunk holds most item data).
2. **Realistic User-Agent required.** Bare `curl` with default UA gets a near-empty
   shell. Use a Chrome-like UA. The script sets one explicitly.
3. **Time zone.** `publishedAt` is UTC ISO. `dateKey` and `dateLabel` are CST
   (UTC+8). The contract uses `publishedAt` (UTC) for filtering and ISO storage;
   downstream display converts to local at render time.
4. **No archive page.** There is no `/archive` or "load older" route on `/`. `/all`
   pagination is the only historical access path.
5. **`/feed.xml` not used** despite being the cleanest format — its 24-hour
   window doesn't satisfy weekly polling.

## Re-probe checklist (when site changes)

If the script's pagination loop returns 0 items or `aiSelected` filter empties
out, re-run:

```bash
curl -sL -A "Mozilla/5.0 Chrome/121.0.0.0" https://aihot.virxact.com/all -o /tmp/probe.html
grep -c 'self.__next_f.push' /tmp/probe.html
grep -c '"aiSelected"' /tmp/probe.html
grep -oE '"id":"cm[a-z0-9]{20,}"' /tmp/probe.html | head
```

Each command should return a positive count and a sample id.
