import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Inbox } from 'lucide-react';
import PropFirmCard from '@/components/PropFirmCard';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import type { PropFirm } from '@/types/supabase';

interface SearchResultsProps {
  firms: PropFirm[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onRetry: () => void;
}

export const SearchResults = ({
  firms,
  total,
  loading,
  error,
  page,
  pageSize,
  onPageChange,
  onRetry,
}: SearchResultsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (error && firms.length === 0) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <p className="text-foreground font-semibold mb-1">Couldn't load firms</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Try again
        </Button>
      </div>
    );
  }

  if (loading && firms.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (firms.length === 0) {
    return (
      <div className="text-center py-16">
        <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-foreground font-semibold">No firms match your filters</p>
        <p className="text-sm text-muted-foreground">Try widening your search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'result' : 'results'}
        </p>
        {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {firms.map((firm, index) => (
            <motion.div
              key={firm.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <PropFirmCard firm={firm} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};
