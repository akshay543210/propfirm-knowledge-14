import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm, Review } from '@/types/supabase';
import { useMarket, MarketType } from '@/contexts/MarketContext';

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

// Helper function to filter firms by market on client side (for joined queries)
const filterByMarket = (firms: PropFirm[], market: MarketType): PropFirm[] => {
  return firms.filter(firm => {
    const marketTypes = firm.market_type || ['forex'];
    return marketTypes.includes(market);
  });
};

// Timeout constant for failsafe
const FETCH_TIMEOUT = 10000; // 10 seconds

export const usePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady } = useMarket();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  const fetchPropFirms = useCallback(async () => {
    // Don't fetch if market isn't ready
    if (!isReady) {
      console.log('usePropFirms: Waiting for market to be ready...');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;

    try {
      console.log('usePropFirms: Fetching prop firms for market:', market);
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCache(market, 'all');
      if (cached && cached.length > 0) {
        console.log('usePropFirms: Using cached data');
        setPropFirms(cached);
        setLoading(false);
      }

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT);
      });

      // Create the fetch promise
      const fetchPromise = supabase
        .from('prop_firms')
        .select('*')
        .contains('market_type', [market])
        .order('created_at', { ascending: false });

      const { data, error: dbError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as Awaited<typeof fetchPromise>;

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
      setError(err instanceof Error ? err.message : 'Failed to load prop firms');
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [market, isReady]);

  useEffect(() => {
    isMountedRef.current = true;

    if (isReady) {
      fetchPropFirms();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPropFirms, isReady]);

  return { propFirms, loading, error, refetch: fetchPropFirms };
};

export const useAllPropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  const fetchPropFirms = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current;

    try {
      console.log('useAllPropFirms: Fetching all prop firms...');
      setLoading(true);
      setError(null);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT);
      });

      const fetchPromise = supabase
        .from('prop_firms')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error: dbError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as Awaited<typeof fetchPromise>;

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
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchPropFirms();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPropFirms]);

  return { propFirms, loading, error, refetch: fetchPropFirms };
};

export const useHomepagePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady } = useMarket();
  const isMountedRef = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const fetchIdRef = useRef(0);

  const fetchHomepagePropFirms = useCallback(async () => {
    // Don't fetch if market isn't ready
    if (!isReady) {
      console.log('useHomepagePropFirms: Waiting for market to be ready...');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;

    try {
      console.log('useHomepagePropFirms: Fetching for market:', market);
      setLoading(true);
      setError(null);

      // Check cache first for instant display
      const cached = getCache(market, 'homepage');
      if (cached && cached.length > 0) {
        console.log('useHomepagePropFirms: Using cached data', cached.length);
        setPropFirms(cached);
        setLoading(false);
      }

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT);
      });

      // Create the fetch promise
      const fetchPromise = supabase
        .from('prop_firms')
        .select('*')
        .eq('show_on_homepage', true)
        .contains('market_type', [market])
        .order('created_at', { ascending: false });

      // Race between fetch and timeout
      const { data, error: dbError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as Awaited<typeof fetchPromise>;

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
      setError(err instanceof Error ? err.message : 'Failed to load prop firms');
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [market, isReady]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isReady) {
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
  }, [fetchHomepagePropFirms, isReady, market]);

  return { propFirms, loading, error, refetch: fetchHomepagePropFirms };
};

export const useTopRatedFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady } = useMarket();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  const fetchTopRatedFirms = useCallback(async () => {
    if (!isReady) {
      console.log('useTopRatedFirms: Waiting for market to be ready...');
      return;
    }

    const currentFetchId = ++fetchIdRef.current;

    try {
      console.log('useTopRatedFirms: Fetching for market:', market);
      setLoading(true);
      setError(null);

      const cached = getCache(market, 'toprated');
      if (cached && cached.length > 0) {
        setPropFirms(cached);
        setLoading(false);
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT);
      });

      const fetchPromise = supabase
        .from('prop_firms')
        .select('*')
        .contains('market_type', [market])
        .order('review_score', { ascending: false })
        .limit(10);

      const { data, error: dbError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as Awaited<typeof fetchPromise>;

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
      setError(err instanceof Error ? err.message : 'Failed to load top rated firms');
    } finally {
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [market, isReady]);

  useEffect(() => {
    isMountedRef.current = true;

    if (isReady) {
      fetchTopRatedFirms();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchTopRatedFirms, isReady]);

  return { propFirms, loading, error, refetch: fetchTopRatedFirms };
};

export const useReviews = (firmId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { market, isReady } = useMarket();
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isReady) {
      return;
    }

    const currentFetchId = ++fetchIdRef.current;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT);
        });

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
          .order('created_at', { ascending: false });

        if (firmId) {
          query = query.eq('firm_id', firmId);
        }

        const { data, error: dbError } = await Promise.race([
          query,
          timeoutPromise
        ]) as Awaited<typeof query>;

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
  }, [firmId, market, isReady]);

  return { reviews, loading, error };
};

// Export the helper for use in other components
export { filterByMarket };
