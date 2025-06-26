
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PricingFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  loading?: boolean;
}

const PricingFields = ({ formData, setFormData, errors, loading = false }: PricingFieldsProps) => {
  const inputClassName = (fieldName: string) => 
    `bg-slate-700 border-blue-500/20 text-white ${errors[fieldName] ? 'border-red-500' : ''}`;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-gray-300">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            className={inputClassName('price')}
            disabled={loading}
          />
          {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <Label htmlFor="original_price" className="text-gray-300">Original Price ($)</Label>
          <Input
            id="original_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.original_price}
            onChange={(e) => setFormData({...formData, original_price: Number(e.target.value)})}
            className={inputClassName('original_price')}
            disabled={loading}
          />
          {errors.original_price && <p className="text-red-400 text-sm mt-1">{errors.original_price}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="starting_fee" className="text-gray-300">Starting Fee ($)</Label>
          <Input
            id="starting_fee"
            type="number"
            value={formData.starting_fee}
            onChange={(e) => setFormData({...formData, starting_fee: Number(e.target.value)})}
            className={inputClassName('starting_fee')}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="coupon_code" className="text-gray-300">Coupon Code</Label>
          <Input
            id="coupon_code"
            value={formData.coupon_code}
            onChange={(e) => setFormData({...formData, coupon_code: e.target.value})}
            className={inputClassName('coupon_code')}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="profit_split" className="text-gray-300">Profit Split (%)</Label>
          <Input
            id="profit_split"
            type="number"
            min="0"
            max="100"
            value={formData.profit_split}
            onChange={(e) => setFormData({...formData, profit_split: Number(e.target.value)})}
            className={inputClassName('profit_split')}
            disabled={loading}
          />
          {errors.profit_split && <p className="text-red-400 text-sm mt-1">{errors.profit_split}</p>}
        </div>
        <div>
          <Label htmlFor="payout_rate" className="text-gray-300">Payout Rate (%)</Label>
          <Input
            id="payout_rate"
            type="number"
            min="0"
            max="100"
            value={formData.payout_rate}
            onChange={(e) => setFormData({...formData, payout_rate: Number(e.target.value)})}
            className={inputClassName('payout_rate')}
            disabled={loading}
          />
          {errors.payout_rate && <p className="text-red-400 text-sm mt-1">{errors.payout_rate}</p>}
        </div>
      </div>
    </>
  );
};

export default PricingFields;
