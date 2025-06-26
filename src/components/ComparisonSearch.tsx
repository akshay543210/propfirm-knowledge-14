
import { useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PropFirm } from "../types/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComparisonSearchProps {
  propFirms: PropFirm[];
  selectedFirms: PropFirm[];
  onAddFirm: (firm: PropFirm) => void;
}

const ComparisonSearch = ({ propFirms, selectedFirms, onAddFirm }: ComparisonSearchProps) => {
  const [selectedFirm1, setSelectedFirm1] = useState<string>('');
  const [selectedFirm2, setSelectedFirm2] = useState<string>('');
  const [selectedFirm3, setSelectedFirm3] = useState<string>('');

  const availableFirms = propFirms.filter(firm => 
    !selectedFirms.find(f => f.id === firm.id)
  );

  const handleFirmSelect = (firmId: string, slotNumber: number) => {
    const firm = propFirms.find(f => f.id === firmId);
    if (firm) {
      onAddFirm(firm);
      // Reset the select value after adding
      if (slotNumber === 1) setSelectedFirm1('');
      if (slotNumber === 2) setSelectedFirm2('');
      if (slotNumber === 3) setSelectedFirm3('');
    }
  };

  const renderFirmSlot = (slotNumber: number, selectedValue: string, setValue: (value: string) => void) => {
    const selectedFirm = selectedFirms[slotNumber - 1];
    
    return (
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Firm {slotNumber}</h3>
          </div>
          
          {selectedFirm ? (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{selectedFirm.name}</h4>
                  <p className="text-sm text-gray-400">{selectedFirm.brand || 'N/A'} • ${selectedFirm.price}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const firmIndex = selectedFirms.findIndex(f => f.id === selectedFirm.id);
                    if (firmIndex !== -1) {
                      // This would need to be handled by parent component
                      // For now, we'll just show the selected firm
                    }
                  }}
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-slate-900"
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <Select value={selectedValue} onValueChange={(value) => {
              setValue(value);
              handleFirmSelect(value, slotNumber);
            }}>
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select a firm" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {availableFirms.map((firm) => (
                  <SelectItem 
                    key={firm.id} 
                    value={firm.id}
                    className="text-white hover:bg-slate-700"
                  >
                    {firm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {!selectedFirm && (
            <div className="mt-4 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Select a firm to compare</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderFirmSlot(1, selectedFirm1, setSelectedFirm1)}
        {renderFirmSlot(2, selectedFirm2, setSelectedFirm2)}
        {renderFirmSlot(3, selectedFirm3, setSelectedFirm3)}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Selected: {selectedFirms.length}/3 firms
        </p>
      </div>
    </div>
  );
};

export default ComparisonSearch;
