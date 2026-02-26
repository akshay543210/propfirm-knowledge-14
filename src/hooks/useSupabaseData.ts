import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm, Review } from '@/types/supabase';
import { useMarket, MarketType } from '@/contexts/MarketContext';
import { useAppReady } from '@/contexts/AppReadyContext';
import { recoverSession, clearRecoveryCounter } from '@/utils/sessionRecovery';

// Cache for prop firms data
const CACHE_KEY = 'propfirm-cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: PropFirm[];
  timestamp: number;
  market: MarketType;
  type: string;
}

const getCache = (market: MarketType, type: string): PropFirm[] | null => {
  try {
    const cached = sessionStorage.getItem(`${CACHE_KEY}-${type}-${market}`);
    if (cached) {
      const entry: CacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_EXPIRY && entry.market === market) {
        return entry.data;
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return null;
};

const setCache = (data: PropFirm[], market: MarketType, type: string): void => {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now(), market, type };
    sessionStorage.setItem(`${CACHE_KEY}-${type}-${market}`, JSON.stringify(entry));
  } catch (e) {
    console.warn('Cache write error:', e);
  }
};

// Timeout constant
const FETCH_TIMEOUT = 10000;

// Track consecutive failures for global recovery
let consecutiveFailures = 0;

/**
 * Resilient fetch helper:
 *  - Uses AbortController to actually cancel hanging requests
 *  - 10s timeout
 *  - Retries exactly once on failure
 *  - After 2 consecutive final failures, triggers session recovery
 */
const fetchWithTimeout = async <T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = FETCH_TIMEOUT
): Promise<T> => {
  const attempt = async (): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await fetchFn(controller.signal);
      clearTimeout(timeoutId);
      consecutiveFailures = 0;
      clearRecoveryCounter();
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  try {
    return await attempt();
  } catch (firstError) {
    console.warn('Fetch failed, retrying once...', firstError);
    try {
      return await attempt();
    } catch (retryError) {
      consecutiveFailures++;
      if (consecutiveFailures >= 2) {
        console.error('Multiple fetch failures detected, recovering session');
        consecutiveFailures = 0;
        await recoverSession();
      }
      throw retryError;
    }
  }
};

export const usePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady: marketReady } = useMarket();
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const hasFetchedRef = useRef(false);

  const fetchPropFirms = useCallback(async () => {
    // Guard: Don't fetch until ALL systems are ready
    if (!allReady || !marketReady) {
      console.log('usePropFirms: Not ready yet, skipping fetch');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    hasFetchedRef.current = true;

    // Check cache first for instant display
    const cached = getCache(market, 'all');
    if (cached && cached.length > 0) {
      console.log('usePropFirms: Using cached data');
      setPropFirms(cached);
      setLoading(false);
    }

    try {
      console.log('usePropFirms: Fetching prop firms for market:', market);
      if (!cached?.length) setLoading(true);
      setError(null);

      const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
        return supabase
          .from('prop_firms')
          .select('*')
          .contains('market_type', [market])
          .order('created_at', { ascending: false })
          .abortSignal(signal);
      });

      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }

      if (dbError) {
        console.error('usePropFirms: Database error:', dbError);
        throw dbError;
      }

      const firms = (data as PropFirm[]) || [];
      console.log('usePropFirms: Fetched', firms.length, 'prop firms');
      
      setPropFirms(firms);
      setCache(firms, market, 'all');
      setError(null);
    } catch (err) {
      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }
      console.error('usePropFirms: Fetch error:', err);
      // Only set error if we don't have cached data
      if (!cached?.length) {
        setError(err instanceof Error ? err.message : 'Failed to load prop firms');
      }
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [market, allReady, marketReady]);

  useEffect(() => {
    isMountedRef.current = true;

    if (allReady && marketReady) {
      fetchPropFirms();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [allReady, marketReady, market]);

  // Ensure loading ends after timeout even if something goes wrong
  useEffect(() => {
    if (!allReady || !marketReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        console.log('usePropFirms: Fallback timer triggered, ending loading state');
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady, marketReady]);

  return { propFirms, loading, error, refetch: fetchPropFirms };
};

export const useAllPropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const hasFetchedRef = useRef(false);

  const fetchPropFirms = useCallback(async () => {
    if (!allReady) {
      console.log('useAllPropFirms: Not ready yet, skipping fetch');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    hasFetchedRef.current = true;

    try {
      console.log('useAllPropFirms: Fetching all prop firms...');
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
        return supabase
          .from('prop_firms')
          .select('*')
          .order('created_at', { ascending: false })
          .abortSignal(signal);
      });

      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }

      if (dbError) {
        console.error('useAllPropFirms: Database error:', dbError);
        throw dbError;
      }

      console.log('useAllPropFirms: Fetched', data?.length || 0, 'prop firms');
      setPropFirms((data as PropFirm[]) || []);
      setError(null);
    } catch (err) {
      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }
      console.error('useAllPropFirms: Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load prop firms');
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [allReady]);

  useEffect(() => {
    isMountedRef.current = true;
    if (allReady) {
      fetchPropFirms();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [allReady]);

  // Fallback timer
  useEffect(() => {
    if (!allReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady]);

  return { propFirms, loading, error, refetch: fetchPropFirms };
};

export const useHomepagePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady: marketReady } = useMarket();
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const fetchIdRef = useRef(0);
  const hasFetchedRef = useRef(false);

  const fetchHomepagePropFirms = useCallback(async () => {
    // Guard: Don't fetch until ALL systems are ready
    if (!allReady || !marketReady) {
      console.log('useHomepagePropFirms: Not ready yet, skipping fetch');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    hasFetchedRef.current = true;

    // Check cache first for instant display
    const cached = getCache(market, 'homepage');
    if (cached && cached.length > 0) {
      console.log('useHomepagePropFirms: Using cached data', cached.length);
      setPropFirms(cached);
      setLoading(false);
    }

    try {
      console.log('useHomepagePropFirms: Fetching for market:', market);
      if (!cached?.length) setLoading(true);
      setError(null);

      const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
        return supabase
          .from('prop_firms')
          .select('*')
          .eq('show_on_homepage', true)
          .contains('market_type', [market])
          .order('created_at', { ascending: false })
          .abortSignal(signal);
      });

      // Check if this fetch is still relevant
      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        console.log('useHomepagePropFirms: Fetch superseded or unmounted');
        return;
      }

      if (dbError) {
        console.error('useHomepagePropFirms: Database error:', dbError);
        throw dbError;
      }

      const firms = (data as PropFirm[]) || [];
      console.log('useHomepagePropFirms: Fetched', firms.length, 'homepage firms');
      
      setPropFirms(firms);
      setCache(firms, market, 'homepage');
      setError(null);
    } catch (err) {
      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }
      console.error('useHomepagePropFirms: Fetch error:', err);
      // Only set error if we don't have cached data
      if (!cached?.length) {
        setError(err instanceof Error ? err.message : 'Failed to load prop firms');
      }
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [market, allReady, marketReady]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!allReady || !marketReady) {
      return;
    }

    fetchHomepagePropFirms();

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up real-time subscription
    channelRef.current = supabase
      .channel(`homepage-prop-firms-${market}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prop_firms',
          filter: 'show_on_homepage=eq.true'
        },
        () => {
          console.log('Real-time update detected, refetching...');
          fetchHomepagePropFirms();
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [allReady, marketReady, market]);

  // Fallback timer to ensure loading always ends
  useEffect(() => {
    if (!allReady || !marketReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        console.log('useHomepagePropFirms: Fallback timer triggered, ending loading state');
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady, marketReady]);

  return { propFirms, loading, error, refetch: fetchHomepagePropFirms };
};

export const useTopRatedFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady: marketReady } = useMarket();
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const hasFetchedRef = useRef(false);

  const fetchTopRatedFirms = useCallback(async () => {
    if (!allReady || !marketReady) {
      console.log('useTopRatedFirms: Not ready yet, skipping fetch');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    hasFetchedRef.current = true;

    const cached = getCache(market, 'toprated');
    if (cached && cached.length > 0) {
      setPropFirms(cached);
      setLoading(false);
    }

    try {
      console.log('useTopRatedFirms: Fetching for market:', market);
      if (!cached?.length) setLoading(true);
      setError(null);

      const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
        return supabase
          .from('prop_firms')
          .select('*')
          .contains('market_type', [market])
          .order('review_score', { ascending: false })
          .limit(10)
          .abortSignal(signal);
      });

      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }

      if (dbError) {
        console.error('useTopRatedFirms: Database error:', dbError);
        throw dbError;
      }

      const firms = (data as PropFirm[]) || [];
      console.log('useTopRatedFirms: Fetched', firms.length, 'top rated firms');
      
      setPropFirms(firms);
      setCache(firms, market, 'toprated');
      setError(null);
    } catch (err) {
      if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
        return;
      }
      console.error('useTopRatedFirms: Fetch error:', err);
      if (!cached?.length) {
        setError(err instanceof Error ? err.message : 'Failed to load top rated firms');
      }
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [market, allReady, marketReady]);

  useEffect(() => {
    isMountedRef.current = true;

    if (allReady && marketReady) {
      fetchTopRatedFirms();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [allReady, marketReady, market]);

  // Fallback timer
  useEffect(() => {
    if (!allReady || !marketReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady, marketReady]);

  return { propFirms, loading, error, refetch: fetchTopRatedFirms };
};

export const useReviews = (firmId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady: marketReady } = useMarket();
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (!allReady || !marketReady) {
      return;
    }

    const currentFetchId = ++fetchIdRef.current;
    hasFetchedRef.current = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
          let query = supabase
            .from('reviews')
            .select(`
              id,
              firm_id,
              user_id,
              reviewer_name,
              rating,
              title,
              content,
              images,
              is_verified,
              helpful_count,
              created_at,
              updated_at,
              market_type,
              prop_firms:firm_id (
                id,
                name,
                slug
              )
            `)
            .eq('market_type', market)
            .order('created_at', { ascending: false })
            .abortSignal(signal);

          if (firmId) {
            query = query.eq('firm_id', firmId);
          }

          return query;
        });

        if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
          return;
        }

        if (dbError) throw dbError;
        setReviews((data as Review[]) || []);
        setError(null);
      } catch (err) {
        if (currentFetchId !== fetchIdRef.current || !isMountedRef.current) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMountedRef.current = false;
    };
  }, [firmId, market, allReady, marketReady]);

  // Fallback timer
  useEffect(() => {
    if (!allReady || !marketReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady, marketReady]);

  return { reviews, loading, error };
};

export const usePropFirmBySlug = (slug: string) => {
  const [propFirm, setPropFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (!allReady || !slug) {
      return;
    }

    hasFetchedRef.current = true;

    const fetchPropFirm = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
          return supabase
            .from('prop_firms')
            .select('*')
            .eq('slug', slug)
            .abortSignal(signal)
            .single();
        });

        if (!isMountedRef.current) return;

        if (dbError) throw dbError;
        setPropFirm(data as PropFirm);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load prop firm');
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchPropFirm();

    return () => {
      isMountedRef.current = false;
    };
  }, [slug, allReady]);

  // Fallback timer
  useEffect(() => {
    if (!allReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady]);

  return { propFirm, loading, error };
};

export const usePropFirmById = (id: string) => {
  const [propFirm, setPropFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (!allReady || !id) {
      return;
    }

    hasFetchedRef.current = true;

    const fetchPropFirm = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await fetchWithTimeout(async (signal) => {
          return supabase
            .from('prop_firms')
            .select('*')
            .eq('id', id)
            .abortSignal(signal)
            .single();
        });

        if (!isMountedRef.current) return;

        if (dbError) throw dbError;
        setPropFirm(data as PropFirm);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load prop firm');
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchPropFirm();

    return () => {
      isMountedRef.current = false;
    };
  }, [id, allReady]);

  // Fallback timer
  useEffect(() => {
    if (!allReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current) {
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady]);

  return { propFirm, loading, error };
};
