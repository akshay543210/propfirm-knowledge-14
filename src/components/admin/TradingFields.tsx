
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TradingFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  loading?: boolean;
}

const TradingFields = ({ formData, setFormData, errors, loading = false }: TradingFieldsProps) => {
  const inputClassName = (fieldName: string) => 
    `bg-slate-700 border-blue-500/20 text-white ${errors[fieldName] ? 'border-red-500' : ''}`;

  return (
    <>
      <div>
        <Label htmlFor="funding_amount" className="text-gray-300">Funding Amount *</Label>
        <Input
          id="funding_amount"
          value={formData.funding_amount}
          onChange={(e) => setFormData({...formData, funding_amount: e.target.value})}
          className={inputClassName('funding_amount')}
          placeholder="e.g., $100,000"
          disabled={loading}
        />
        {errors.funding_amount && <p className="text-red-400 text-sm mt-1">{errors.funding_amount}</p>}
      </div>

      <div>
        <Label htmlFor="max_funding" className="text-gray-300">Max Funding</Label>
        <Input
          id="max_funding"
          value={formData.max_funding}
          onChange={(e) => setFormData({...formData, max_funding: e.target.value})}
          className={inputClassName('max_funding')}
          placeholder="e.g., $500,000"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="platform" className="text-gray-300">Platform</Label>
        <Input
          id="platform"
          value={formData.platform}
          onChange={(e) => setFormData({...formData, platform: e.target.value})}
          className={inputClassName('platform')}
          placeholder="e.g., MetaTrader 4, cTrader"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="evaluation_model" className="text-gray-300">Evaluation Model</Label>
        <Input
          id="evaluation_model"
          value={formData.evaluation_model}
          onChange={(e) => setFormData({...formData, evaluation_model: e.target.value})}
          className={inputClassName('evaluation_model')}
          placeholder="e.g., Two-step, One-step"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="regulation" className="text-gray-300">Regulation</Label>
        <Input
          id="regulation"
          value={formData.regulation}
          onChange={(e) => setFormData({...formData, regulation: e.target.value})}
          className={inputClassName('regulation')}
          placeholder="e.g., ASIC, FCA, CYSEC"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="affiliate_url" className="text-gray-300">Affiliate URL</Label>
        <Input
          id="affiliate_url"
          type="url"
          value={formData.affiliate_url}
          onChange={(e) => setFormData({...formData, affiliate_url: e.target.value})}
          className={inputClassName('affiliate_url')}
          placeholder="https://..."
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="logo_url" className="text-gray-300">Logo URL</Label>
        <Input
          id="logo_url"
          type="url"
          value={formData.logo_url}
          onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
          className={inputClassName('logo_url')}
          placeholder="https://... or /path/to/image"
          disabled={loading}
        />
      </div>
    </>
  );
};

export default TradingFields;
