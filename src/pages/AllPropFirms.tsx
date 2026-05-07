import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { FilterPanel } from '@/components/search/FilterPanel';
import { SearchResults } from '@/components/search/SearchResults';
import { usePropFirmsSearch, type PropFirmFilters, type SortKey } from '@/hooks/usePropFirmsSearch';
import { SEO } from '@/components/SEO';

const PAGE_SIZE = 18;

const parseList = (v: string | null) => (v ? v.split(',').filter(Boolean) : undefined);
const parseNum = (v: string | null) => (v != null && v !== '' ? Number(v) : undefined);

const filtersFromParams = (sp: URLSearchParams): PropFirmFilters => ({
  search: sp.get('q') || undefined,
  platforms: parseList(sp.get('platforms')),
  asset_classes: parseList(sp.get('assets')),
  feature_tags: parseList(sp.get('features')),
  market_type: parseList(sp.get('markets')),
  countries: parseList(sp.get('countries')),
  min_fee: parseNum(sp.get('fee_min')),
  max_fee: parseNum(sp.get('fee_max')),
  min_rating: parseNum(sp.get('rating')),
  verified: sp.get('verified') === '1' ? true : undefined,
  sort: (sp.get('sort') as SortKey) || 'rating',
  page: parseNum(sp.get('page')) ?? 1,
  page_size: PAGE_SIZE,
});

const filtersToParams = (f: PropFirmFilters): Record<string, string> => {
  const out: Record<string, string> = {};
  if (f.search) out.q = f.search;
  if (f.platforms?.length) out.platforms = f.platforms.join(',');
  if (f.asset_classes?.length) out.assets = f.asset_classes.join(',');
  if (f.feature_tags?.length) out.features = f.feature_tags.join(',');
  if (f.market_type?.length) out.markets = f.market_type.join(',');
  if (f.countries?.length) out.countries = f.countries.join(',');
  if (f.min_fee != null) out.fee_min = String(f.min_fee);
  if (f.max_fee != null) out.fee_max = String(f.max_fee);
  if (f.min_rating != null) out.rating = String(f.min_rating);
  if (f.verified) out.verified = '1';
  if (f.sort && f.sort !== 'rating') out.sort = f.sort;
  if (f.page && f.page > 1) out.page = String(f.page);
  return out;
};

const countActive = (f: PropFirmFilters) => {
  let n = 0;
  if (f.search) n++;
  if (f.platforms?.length) n++;
  if (f.asset_classes?.length) n++;
  if (f.feature_tags?.length) n++;
  if (f.market_type?.length) n++;
  if (f.countries?.length) n++;
  if (f.min_fee != null || f.max_fee != null) n++;
  if (f.min_rating) n++;
  if (f.verified) n++;
  return n;
};

const AllPropFirms = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  const updateFilters = (next: PropFirmFilters) => {
    setSearchParams(filtersToParams(next), { replace: true });
  };

  const { firms, total, loading, error, retry } = usePropFirmsSearch(filters);
  const activeCount = countActive(filters);

  const panel = <FilterPanel filters={filters} onChange={updateFilters} totalActive={activeCount} />;

  return (
    <div className="min-h-screen bg-background font-body noise-overlay">
      <SEO
        title="All Prop Firms — Compare & Filter | PropFirm Knowledge"
        description="Browse and filter every prop trading firm by platform, asset class, fee, rating and more. Find your perfect funded account."
        canonical="/propfirms"
      />
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />

      <SectionWrapper divider={false} className="pt-56 sm:pt-36">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 font-heading">All Prop Firms</h1>
            <p className="text-lg text-muted-foreground">Filter, compare, and discover the best prop trading firms</p>
          </div>

          {/* Mobile filter trigger */}
          <div className="lg:hidden mb-4 flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters {activeCount > 0 && `(${activeCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <div className="pt-6">{panel}</div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <aside className="hidden lg:block">{panel}</aside>
            <div>
              <SearchResults
                firms={firms}
                total={total}
                loading={loading}
                error={error}
                page={filters.page ?? 1}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => updateFilters({ ...filters, page: p })}
                onRetry={retry}
              />
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default AllPropFirms;
