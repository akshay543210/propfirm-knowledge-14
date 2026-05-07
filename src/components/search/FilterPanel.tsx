import { Search, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PropFirmFilters, SortKey } from '@/hooks/usePropFirmsSearch';

const PLATFORMS = ['MT4', 'MT5', 'cTrader', 'DXtrade', 'Match-Trader', 'TradingView'];
const ASSET_CLASSES = ['Forex', 'Futures', 'Crypto', 'Indices', 'Stocks', 'Commodities'];
const FEATURE_TAGS = ['Scaling', 'Lifetime', 'No Time Limit', 'Weekend Holding', 'News Trading', 'EA Allowed'];
const MARKETS = ['forex', 'futures', 'crypto'];

interface FilterPanelProps {
  filters: PropFirmFilters;
  onChange: (next: PropFirmFilters) => void;
  totalActive: number;
}

const toggleArr = (arr: string[] | undefined, v: string) =>
  arr?.includes(v) ? arr.filter((x) => x !== v) : [...(arr ?? []), v];

export const FilterPanel = ({ filters, onChange, totalActive }: FilterPanelProps) => {
  const set = <K extends keyof PropFirmFilters>(key: K, value: PropFirmFilters[K]) =>
    onChange({ ...filters, [key]: value, page: 1 });

  const feeRange = [filters.min_fee ?? 0, filters.max_fee ?? 2000] as [number, number];

  const Chip = ({
    label,
    active,
    onClick,
  }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <h3 className="text-sm font-semibold">Filters</h3>
          {totalActive > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onChange({ sort: filters.sort, page: 1, page_size: filters.page_size })}
            >
              <X className="h-3 w-3 mr-1" /> Clear ({totalActive})
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search firms..."
              value={filters.search ?? ''}
              onChange={(e) => set('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3"><h4 className="text-sm font-semibold">Sort by</h4></CardHeader>
        <CardContent>
          <select
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            value={filters.sort ?? 'rating'}
            onChange={(e) => set('sort', e.target.value as SortKey)}
          >
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="newest">Newest</option>
            <option value="relevance">Relevance</option>
          </select>
        </CardContent>
      </Card>

      {/* Platforms */}
      <Card>
        <CardHeader className="pb-3"><h4 className="text-sm font-semibold">Platforms</h4></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={!!filters.platforms?.includes(p)}
                onClick={() => set('platforms', toggleArr(filters.platforms, p))}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset classes */}
      <Card>
        <CardHeader className="pb-3"><h4 className="text-sm font-semibold">Asset classes</h4></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {ASSET_CLASSES.map((a) => (
              <Chip
                key={a}
                label={a}
                active={!!filters.asset_classes?.includes(a)}
                onClick={() => set('asset_classes', toggleArr(filters.asset_classes, a))}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Markets */}
      <Card>
        <CardHeader className="pb-3"><h4 className="text-sm font-semibold">Market</h4></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {MARKETS.map((m) => (
              <Chip
                key={m}
                label={m.charAt(0).toUpperCase() + m.slice(1)}
                active={!!filters.market_type?.includes(m)}
                onClick={() => set('market_type', toggleArr(filters.market_type, m))}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3"><h4 className="text-sm font-semibold">Features</h4></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {FEATURE_TAGS.map((f) => (
              <Chip
                key={f}
                label={f}
                active={!!filters.feature_tags?.includes(f)}
                onClick={() => set('feature_tags', toggleArr(filters.feature_tags, f))}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fee range */}
      <Card>
        <CardHeader className="pb-3">
          <h4 className="text-sm font-semibold">Entry fee</h4>
          <p className="text-xs text-muted-foreground">${feeRange[0]} – ${feeRange[1]}</p>
        </CardHeader>
        <CardContent>
          <Slider
            min={0}
            max={2000}
            step={25}
            value={feeRange}
            onValueChange={(v) => onChange({ ...filters, min_fee: v[0], max_fee: v[1], page: 1 })}
          />
        </CardContent>
      </Card>

      {/* Min rating */}
      <Card>
        <CardHeader className="pb-3"><h4 className="text-sm font-semibold">Minimum rating</h4></CardHeader>
        <CardContent>
          <div className="flex gap-1">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <Chip
                key={r}
                label={r === 0 ? 'Any' : `${r}+`}
                active={(filters.min_rating ?? 0) === r}
                onClick={() => set('min_rating', r === 0 ? undefined : r)}
              />
            ))}
            <Star className="h-4 w-4 text-yellow-400 self-center ml-1" />
          </div>
        </CardContent>
      </Card>

      {/* Verified */}
      <Card>
        <CardContent className="pt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Verified only</p>
            <p className="text-xs text-muted-foreground">Vetted by our team</p>
          </div>
          <Switch
            checked={!!filters.verified}
            onCheckedChange={(v) => set('verified', v || undefined)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
