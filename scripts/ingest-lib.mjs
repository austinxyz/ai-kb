// ingest-lib — pure helpers shared by ingest-one command + prepare CLI.
// source_type detection reused from aihot-fetch (single source of truth).
import { deriveSourceType } from './aihot-fetch.mjs';

export { deriveSourceType };

const SERIES_DIR = {
  S1_infra: 'ai_native_infra',
  S2_methodology: 'dev_methodology',
  S3_roles: 'engineering_roles',
  S4_agent: 'agent_engineering',
  S0_industry: 'industry_insight',
};

export function normalize(title) {
  if (!title) return '';
  return String(title).toLowerCase().replace(/\s+/g, '').replace(/[^\w一-鿿]/g, '');
}

export function computeNormKey(title, url) {
  return normalize(title) + '||' + (url || '');
}

export function slugify(title) {
  if (!title) return 'untitled';
  const hasCJK = /[一-鿿]/.test(title);
  let s = hasCJK
    ? title.replace(/[^一-鿿a-zA-Z0-9]+/g, '-')
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/g, '');
  return s || 'untitled';
}

export function cstDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const cst = new Date(d.getTime() + 8 * 3600 * 1000);
  return cst.toISOString().slice(0, 10);
}

export function seriesToDir(series) {
  return SERIES_DIR[series] || 'industry_insight';
}

// Accept "2026-06-05", "6月5", "6月5日", "6-5". year defaults to provided fallback.
export function parseDailyDate(input, year) {
  if (!input) return null;
  const s = String(input).trim();
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
  }
  const cn = s.match(/^(\d{1,2})月(\d{1,2})日?$/);
  if (cn) {
    return `${year}-${cn[1].padStart(2, '0')}-${cn[2].padStart(2, '0')}`;
  }
  const dash = s.match(/^(\d{1,2})-(\d{1,2})$/);
  if (dash) {
    return `${year}-${dash[1].padStart(2, '0')}-${dash[2].padStart(2, '0')}`;
  }
  return null;
}

export function findDuplicate(normKey, url, seenNormKeys, seenUrls) {
  if (seenNormKeys.has(normKey)) return { hit: true, by: 'norm_key' };
  if (url && seenUrls.has(url)) return { hit: true, by: 'source_url' };
  return { hit: false, by: null };
}
