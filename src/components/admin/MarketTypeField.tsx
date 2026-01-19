import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MARKET_OPTIONS, MarketType } from "@/contexts/MarketContext";

interface MarketTypeFieldProps {
  formData: {
    market_type: MarketType[];
  };
  setFormData: (data: any) => void;
  loading?: boolean;
}

const MarketTypeField = ({ formData, setFormData, loading = false }: MarketTypeFieldProps) => {
  const activeMarkets = MARKET_OPTIONS.filter(opt => 
    opt.value === 'forex' || opt.value === 'futures'
  );

  const handleMarketToggle = (market: MarketType, checked: boolean) => {
    const currentMarkets = formData.market_type || ['forex'];
    let newMarkets: MarketType[];
    
    if (checked) {
      newMarkets = [...currentMarkets, market];
    } else {
      newMarkets = currentMarkets.filter(m => m !== market);
      // Ensure at least one market is selected
      if (newMarkets.length === 0) {
        newMarkets = ['forex'];
      }
    }
    
    setFormData({ ...formData, market_type: newMarkets });
  };

  return (
    <div className="space-y-3">
      <Label className="text-white">Market Type</Label>
      <div className="flex flex-wrap gap-4">
        {activeMarkets.map((option) => {
          const isChecked = (formData.market_type || ['forex']).includes(option.value);
          
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`market-${option.value}`}
                checked={isChecked}
                onCheckedChange={(checked) => handleMarketToggle(option.value, checked as boolean)}
                disabled={loading}
                className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label 
                htmlFor={`market-${option.value}`} 
                className="text-gray-300 text-sm cursor-pointer flex items-center gap-2"
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </Label>
            </div>
          );
        })}
      </div>
      <p className="text-gray-400 text-xs">
        Select which markets this prop firm operates in. At least one market must be selected.
      </p>
    </div>
  );
};

export default MarketTypeField;
