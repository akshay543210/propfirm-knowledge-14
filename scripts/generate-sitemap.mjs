/**
 * Generates public/sitemap.xml from all firm slugs.
 * Run before build via the `prebuild` npm script.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = process.env.SITE_URL || 'https://propfirmknowledge.store';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jkiblofuayvdrrxbbhuu.supabase.co';
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

const STATIC_PATHS = [
  '/',
  '/propfirms',
  '/top-firms',
  '/cheap-firms',
  '/compare',
  '/reviews',
  '/table-review',
  '/drama-tracker',
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/sitemap.xml');

async function fetchSlugs() {
  if (!SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/prop_firms?select=slug,updated_at`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );
    if (!res.ok) {
      console.warn('[sitemap] Supabase fetch failed:', res.status);
      return [];
    }
    return (await res.json()) as Array<{ slug: string; updated_at: string | null }>;
  } catch (e) {
    console.warn('[sitemap] error fetching firms:', e);
    return [];
  }
}

function urlEntry(loc, lastmod, priority = '0.7') {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <priority>${priority}</priority>
  </url>`;
}

(async () => {
  const firms = await fetchSlugs();
  const today = new Date().toISOString().slice(0, 10);

  const entries = [
    ...STATIC_PATHS.map((p) => urlEntry(p, today, p === '/' ? '1.0' : '0.8')),
    ...firms.flatMap((f) => [
      urlEntry(`/${f.slug}`, (f.updated_at ?? today).slice(0, 10), '0.9'),
      urlEntry(`/${f.slug}/reviews`, (f.updated_at ?? today).slice(0, 10), '0.6'),
    ]),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  writeFileSync(OUTPUT, xml, 'utf8');
  console.log(`[sitemap] wrote ${entries.length} URLs to ${OUTPUT}`);
})();
