
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PropFirmCard from './PropFirmCard';
import { getCheapestFirms, getTopRatedFirms } from '@/hooks/useSupabaseData';
import { PropFirm } from '@/types/supabase';

interface FilteredFirmsListProps {
  type: 'cheapest' | 'top-rated' | null;
  onClose: () => void;
}

const FilteredFirmsList = ({ type, onClose }: FilteredFirmsListProps) => {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) return;

    const fetchFirms = async () => {
      setLoading(true);
      try {
        let data: PropFirm[] = [];
        if (type === 'cheapest') {
          data = await getCheapestFirms(10);
        } else if (type === 'top-rated') {
          data = await getTopRatedFirms(5);
        }
        setFirms(data);
      } catch (error) {
        console.error('Error fetching filtered firms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirms();
  }, [type]);

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
            {firms.map((firm, index) => (
              <PropFirmCard key={firm.id} firm={firm} index={index} />
            ))}
          </div>
        )}

        {!loading && firms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No firms found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredFirmsList;
