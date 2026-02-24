import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Grid, Table as TableIcon, ChevronUp, ChevronDown, Minus, RefreshCw, AlertCircle, ShoppingCart } from "lucide-react";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PropFirm } from "@/types/supabase";
import { toast } from "sonner";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { GlassCard } from "@/components/ui/glass-card";

const TableFirmLogo = ({ logoUrl, name }: { logoUrl?: string | null; name: string }) => {
  const [hasError, setHasError] = useState(false);
  if (!logoUrl || hasError) {
    return <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center text-foreground font-bold">{name.charAt(0)}</div>;
  }
  return <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-contain" loading="lazy" onError={() => setHasError(true)} />;
};

const TableReview = () => {
  const { tableReviewFirms, loading, error, refetch, hasInitialized } = useSectionMemberships();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState({ minPayoutRate: 0, maxFee: 1000, minTrustRating: 0 });
  const [filteredFirms, setFilteredFirms] = useState<PropFirm[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    if (retryCount < 3) { setRetryCount(prev => prev + 1); await refetch(); }
    else { toast.error("Maximum retry attempts reached. Please refresh the page."); }
  };

  useEffect(() => {
    if (error && retryCount === 0) { setTimeout(() => { handleRetry(); }, 1000); }
  }, [error, retryCount]);

  useEffect(() => {
    let result = [...tableReviewFirms];
    result = result.filter(firm => {
      const payoutRate = (firm as any).table_payout_rate ?? firm.payout_rate;
      const fee = (firm as any).table_fee ?? firm.price;
      const trustRating = (firm as any).table_trust_rating ?? firm.trust_rating;
      return payoutRate >= filters.minPayoutRate && fee <= filters.maxFee && trustRating >= filters.minTrustRating;
    });
    if (sortConfig !== null) {
      result.sort((a, b) => {
        let aValue: any, bValue: any;
        switch (sortConfig.key) {
          case "price": aValue = a.table_fee ?? a.price; bValue = b.table_fee ?? b.price; break;
          case "profitSplit": aValue = a.table_profit_split ?? a.profit_split; bValue = b.table_profit_split ?? b.profit_split; break;
          case "payoutRate": aValue = a.table_payout_rate ?? a.payout_rate; bValue = b.table_payout_rate ?? b.payout_rate; break;
          case "trustRating": aValue = a.table_trust_rating ?? a.trust_rating; bValue = b.table_trust_rating ?? b.trust_rating; break;
          case "name": aValue = a.name.toLowerCase(); bValue = b.name.toLowerCase(); break;
          default: aValue = a[sortConfig.key as keyof typeof a]; bValue = b[sortConfig.key as keyof typeof b];
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredFirms(result);
  }, [tableReviewFirms, sortConfig, filters]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (col: string) => {
    if (!sortConfig || sortConfig.key !== col) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    return sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  const handleFilterChange = (name: string, value: number) => setFilters(prev => ({ ...prev, [name]: value }));

  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen bg-background font-body noise-overlay">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <div className="text-foreground">Loading table review...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background font-body noise-overlay">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-24 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <div className="text-foreground text-lg mb-2">Failed to load table review</div>
          <div className="text-muted-foreground text-sm mb-4">{error}</div>
          <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />{loading ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body noise-overlay">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />

      <SectionWrapper divider={false} className="pt-56 sm:pt-36">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 text-sm">
                <ArrowLeft className="h-4 w-4 mr-1" />Back
              </Link>
              <h1 className="text-3xl font-bold text-foreground font-heading">Table Review</h1>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={viewMode === "table" ? "default" : "outline"} onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground"}>
                <TableIcon className="h-4 w-4 mr-1.5" />Table
              </Button>
              <Button size="sm" variant={viewMode === "card" ? "default" : "outline"} onClick={() => setViewMode("card")}
                className={viewMode === "card" ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground"}>
                <Grid className="h-4 w-4 mr-1.5" />Cards
              </Button>
            </div>
          </div>

          {/* Filters */}
          <GlassCard className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Min Payout Rate (%)", key: "minPayoutRate", min: 0, max: 100, step: 1, val: filters.minPayoutRate, fmt: (v: number) => `${v}%` },
                { label: "Max Fee (USD)", key: "maxFee", min: 0, max: 1000, step: 10, val: filters.maxFee, fmt: (v: number) => `$${v}` },
                { label: "Min Trust Rating", key: "minTrustRating", min: 0, max: 10, step: 0.5, val: filters.minTrustRating, fmt: (v: number) => `${v}/10` },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
                  <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                    onChange={(e) => handleFilterChange(f.key, Number(e.target.value))}
                    className="w-full accent-primary" />
                  <div className="text-center text-foreground text-sm tabular-nums">{f.fmt(f.val)}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {viewMode === "table" ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse">
                <thead className="bg-secondary sticky top-0 z-10">
                  <tr>
                    {[
                      { key: "name", label: "Firm Name" },
                      { key: "price", label: "Price" },
                      { key: "profitSplit", label: "Profit Split" },
                      { key: "payoutRate", label: "Payout Rate" },
                      { key: null, label: "Platforms" },
                      { key: "trustRating", label: "Trust" },
                      { key: null, label: "Rules" },
                      { key: null, label: "Coupon" },
                      { key: null, label: "Action" },
                    ].map((col, i) => (
                      <th key={i}
                        className={`text-left p-3 text-foreground font-semibold text-xs uppercase tracking-wider ${col.key ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
                        onClick={() => col.key && requestSort(col.key)}>
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.key && getSortIcon(col.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFirms.map((firm) => (
                    <tr key={firm.id} className="border-t border-border hover:bg-muted/20 transition-colors group">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center shrink-0">
                            <TableFirmLogo logoUrl={firm.logo_url} name={firm.name} />
                          </div>
                          <div>
                            <div className="text-foreground font-medium text-sm">{firm.name}</div>
                            {firm.brand && <Badge className="mt-0.5 bg-primary/15 text-primary border-primary/25 text-[9px]">{firm.brand}</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-success font-semibold text-sm tabular-nums">
                        ${(firm as any).table_fee ?? firm.price}
                        {((firm as any).table_fee !== null && (firm as any).table_fee !== firm.price) && firm.price && (
                          <div className="text-muted-foreground text-xs line-through">${firm.price}</div>
                        )}
                      </td>
                      <td className="p-3 text-primary font-semibold text-sm tabular-nums">{(firm as any).table_profit_split ?? firm.profit_split}%</td>
                      <td className="p-3 text-accent font-semibold text-sm tabular-nums">{(firm as any).table_payout_rate ?? firm.payout_rate}%</td>
                      <td className="p-3 text-foreground text-sm">{(firm as any).table_platform ?? firm.platform ?? "N/A"}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success/15 text-success text-xs font-bold tabular-nums">
                          {(firm as any).table_trust_rating ?? firm.trust_rating}
                        </span>
                      </td>
                      <td className="p-3 text-foreground text-sm">{(firm as any).table_evaluation_rules ?? "Standard"}</td>
                      <td className="p-3">
                        {((firm as any).table_coupon_code ?? firm.coupon_code) ? (
                          <Badge className="bg-warning/15 text-warning border-warning/25 text-[10px]">{(firm as any).table_coupon_code ?? firm.coupon_code}</Badge>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                      <td className="p-3">
                        {firm.affiliate_url ? (
                          <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground text-xs font-medium"
                            onClick={() => window.open(firm.affiliate_url!, '_blank')}>
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" />Buy
                          </Button>
                        ) : (
                          <Button size="sm" disabled className="bg-muted text-muted-foreground text-xs"><Minus className="h-3.5 w-3.5 mr-1" />N/A</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredFirms.length === 0 && <div className="text-center py-12 text-muted-foreground">No firms match the current filters.</div>}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFirms.map((firm) => (
                  <GlassCard key={firm.id} className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-foreground font-heading">{firm.name}</h3>
                      {firm.brand && <Badge className="bg-primary/15 text-primary border-primary/25 text-[10px]">{firm.brand}</Badge>}
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: "Price", value: `$${(firm as any).table_fee ?? firm.price}`, cls: "text-success" },
                        { label: "Profit Split", value: `${(firm as any).table_profit_split ?? firm.profit_split}%`, cls: "text-primary" },
                        { label: "Payout Rate", value: `${(firm as any).table_payout_rate ?? firm.payout_rate}%`, cls: "text-accent" },
                        { label: "Platform", value: (firm as any).table_platform ?? firm.platform ?? "N/A", cls: "text-foreground" },
                        { label: "Trust Rating", value: `${(firm as any).table_trust_rating ?? firm.trust_rating}/10`, cls: "text-success" },
                        { label: "Evaluation", value: (firm as any).table_evaluation_rules ?? "Standard", cls: "text-foreground" },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className={`font-semibold tabular-nums ${row.cls}`}>{row.value}</span>
                        </div>
                      ))}
                      {((firm as any).table_coupon_code ?? firm.coupon_code) && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Coupon</span>
                          <Badge className="bg-warning/15 text-warning border-warning/25 text-[10px]">{(firm as any).table_coupon_code ?? firm.coupon_code}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      {firm.affiliate_url ? (
                        <Button className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium text-sm"
                          onClick={() => window.open(firm.affiliate_url!, '_blank')}>
                          <ShoppingCart className="h-4 w-4 mr-2" />Buy Now
                        </Button>
                      ) : (
                        <Button disabled className="w-full bg-muted text-muted-foreground"><Minus className="h-4 w-4 mr-2" />No Link</Button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
              {filteredFirms.length === 0 && <div className="text-center py-12 text-muted-foreground">No firms match the current filters.</div>}
            </>
          )}
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default TableReview;
