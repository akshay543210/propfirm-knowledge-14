import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PropFirmCard from './PropFirmCard';
import { usePropFirms } from '@/hooks/useSupabaseData';
import { PropFirm } from '@/types/supabase';

interface FilteredFirmsListProps {
  type: 'cheapest' | 'top-rated' | null;
  onClose: () => void;
}

const FilteredFirmsList = ({ type, onClose }: FilteredFirmsListProps) => {
  const { propFirms, loading } = usePropFirms();
  const [displayFirms, setDisplayFirms] = useState<PropFirm[]>([]);

  useEffect(() => {
    if (!type) return;

    let filteredFirms = [...propFirms];
    
    if (type === 'cheapest') {
      filteredFirms.sort((a, b) => a.price - b.price);
      filteredFirms = filteredFirms.slice(0, 10);
    } else if (type === 'top-rated') {
      filteredFirms.sort((a, b) => (b.review_score || 0) - (a.review_score || 0));
      filteredFirms = filteredFirms.slice(0, 5);
    }
    
    setDisplayFirms(filteredFirms);
  }, [type, propFirms]);

  if (!type) return null;

  const title = type === 'cheapest' ? '📉 Cheapest Cost PropFirms' : '🔥 Top 5 PropFirms';

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-slate-900"
          >
            Close
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading firms...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayFirms.map((firm, index) => (
              <PropFirmCard key={firm.id} firm={firm} index={index} />
            ))}
          </div>
        )}

        {!loading && displayFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No firms found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredFirmsList;