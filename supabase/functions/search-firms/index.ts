import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-retry-count, cache-control, pragma, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Max-Age': '86400',
};

const BodySchema = z.object({
  search: z.string().trim().max(200).optional(),
  platforms: z.array(z.string()).max(20).optional(),
  asset_classes: z.array(z.string()).max(20).optional(),
  feature_tags: z.array(z.string()).max(20).optional(),
  countries: z.array(z.string()).max(50).optional(),
  market_type: z.array(z.string()).max(20).optional(),
  min_fee: z.number().min(0).optional(),
  max_fee: z.number().min(0).optional(),
  min_account: z.number().min(0).optional(),
  max_account: z.number().min(0).optional(),
  min_profit_split: z.number().min(0).max(100).optional(),
  min_rating: z.number().min(0).max(5).optional(),
  verified: z.boolean().optional(),
  year_from: z.number().int().min(1900).max(2100).optional(),
  category_id: z.string().optional(),
  sort: z.enum(['rating', 'price_asc', 'price_desc', 'newest', 'relevance']).optional().default('rating'),
  page: z.number().int().min(1).optional().default(1),
  page_size: z.number().int().min(1).max(60).optional().default(20),
});

const responseHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const raw = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: responseHeaders },
      );
    }
    const f = parsed.data;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    let q = supabase.from('prop_firms').select('*', { count: 'exact' });

    if (f.search && f.search.length > 0) {
      if (f.search.length >= 3) {
        q = q.textSearch('tsv', f.search, { type: 'websearch', config: 'english' });
      } else {
        q = q.ilike('name', `%${f.search}%`);
      }
    }
    if (f.platforms?.length) q = q.contains('platforms', f.platforms);
    if (f.asset_classes?.length) q = q.contains('asset_classes', f.asset_classes);
    if (f.feature_tags?.length) q = q.contains('feature_tags', f.feature_tags);
    if (f.countries?.length) q = q.overlaps('countries', f.countries);
    if (f.market_type?.length) q = q.overlaps('market_type', f.market_type);
    if (f.min_fee !== undefined) q = q.gte('fee_min', f.min_fee);
    if (f.max_fee !== undefined) q = q.lte('fee_max', f.max_fee);
    if (f.min_account !== undefined) q = q.gte('account_min', f.min_account);
    if (f.max_account !== undefined) q = q.lte('account_max', f.max_account);
    if (f.min_profit_split !== undefined) q = q.gte('profit_split', f.min_profit_split);
    if (f.min_rating !== undefined) q = q.gte('rating_avg', f.min_rating);
    if (f.verified !== undefined) q = q.eq('verified', f.verified);
    if (f.year_from !== undefined) q = q.gte('year_established', f.year_from);
    if (f.category_id) q = q.eq('category_id', f.category_id);

    switch (f.sort) {
      case 'price_asc': q = q.order('price', { ascending: true, nullsFirst: false }); break;
      case 'price_desc': q = q.order('price', { ascending: false, nullsFirst: false }); break;
      case 'newest': q = q.order('created_at', { ascending: false, nullsFirst: false }); break;
      case 'relevance':
      case 'rating':
      default:
        q = q.order('rating_avg', { ascending: false, nullsFirst: false }).order('review_score', { ascending: false, nullsFirst: false });
    }

    const from = (f.page - 1) * f.page_size;
    const to = from + f.page_size - 1;
    q = q.range(from, to);

    const { data, count, error } = await q;
    if (error) {
      console.error('search-firms query error', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
    }

    return new Response(
      JSON.stringify({ firms: data ?? [], total: count ?? 0, page: f.page, page_size: f.page_size }),
      { status: 200, headers: responseHeaders },
    );
  } catch (e) {
    console.error('search-firms unexpected', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: responseHeaders });
  }
});
