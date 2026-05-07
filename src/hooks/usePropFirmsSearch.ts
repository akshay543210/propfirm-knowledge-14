import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm } from '@/types/supabase';
import { fetchWithTimeout } from '@/utils/resilientFetch';

export type SortKey = 'rating' | 'price_asc' | 'price_desc' | 'newest' | 'relevance';

export interface PropFirmFilters {
  search?: string;
  platforms?: string[];
  asset_classes?: string[];
  feature_tags?: string[];
  countries?: string[];
  market_type?: string[];
  min_fee?: number;
  max_fee?: number;
  min_account?: number;
  max_account?: number;
  min_profit_split?: number;
  min_rating?: number;
  verified?: boolean;
  year_from?: number;
  category_id?: string;
  sort?: SortKey;
  page?: number;
  page_size?: number;
}

interface SearchResponse {
  firms: PropFirm[];
  total: number;
  page: number;
  page_size: number;
}

const CACHE_PREFIX = 'pf-search-cache:';

const hashKey = (filters: PropFirmFilters) =>
  CACHE_PREFIX + JSON.stringify(filters, Object.keys(filters).sort());

const readCache = (key: string): SearchResponse | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SearchResponse) : null;
  } catch {
    return null;
  }
};

const writeCache = (key: string, value: SearchResponse) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
};

export function usePropFirmsSearch(filters: PropFirmFilters, debounceMs = 300) {
  const [debounced, setDebounced] = useState(filters);
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchIdRef = useRef(0);
  const isMountedRef = useRef(true);

  // Debounce search text changes; non-search filters apply immediately
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(filters), debounceMs);
    return () => clearTimeout(handle);
  }, [filters, debounceMs]);

  const cacheKey = useMemo(() => hashKey(debounced), [debounced]);

  const run = useCallback(async () => {
    const id = ++fetchIdRef.current;

    // SWR: show stale results while we revalidate
    const cached = readCache(cacheKey);
    if (cached) {
      setFirms(cached.firms);
      setTotal(cached.total);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetchWithTimeout(async (signal) => {
        const { data, error: invokeError } = await supabase.functions.invoke<SearchResponse>(
          'search-firms',
          { body: debounced },
        );
        if (signal.aborted) throw new Error('aborted');
        if (invokeError) throw invokeError;
        if (!data) throw new Error('Empty response');
        return data;
      });

      if (id !== fetchIdRef.current || !isMountedRef.current) return;

      setFirms(result.firms);
      setTotal(result.total);
      writeCache(cacheKey, result);
    } catch (err) {
      if (id !== fetchIdRef.current || !isMountedRef.current) return;
      console.error('usePropFirmsSearch error:', err);
      if (!cached) {
        setError(err instanceof Error ? err.message : 'Search failed');
      }
    } finally {
      if (id === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [cacheKey, debounced]);

  useEffect(() => {
    isMountedRef.current = true;
    run();
    return () => {
      isMountedRef.current = false;
    };
  }, [run]);

  return { firms, total, loading, error, retry: run };
}
