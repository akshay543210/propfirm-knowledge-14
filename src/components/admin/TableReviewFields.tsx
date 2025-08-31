import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TableReviewFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  loading?: boolean;
}

const TableReviewFields = ({ formData, setFormData, loading = false }: TableReviewFieldsProps) => {
  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white">Table Review Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="table_price" className="text-gray-300">
              Table Price (USD)
            </Label>
            <Input
              id="table_price"
              type="number"
              value={formData.table_price || ''}
              onChange={(e) => setFormData({ ...formData, table_price: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override price for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_profit_split" className="text-gray-300">
              Table Profit Split (%)
            </Label>
            <Input
              id="table_profit_split"
              type="number"
              value={formData.table_profit_split || ''}
              onChange={(e) => setFormData({ ...formData, table_profit_split: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override profit split for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_payout_rate" className="text-gray-300">
              Table Payout Rate (%)
            </Label>
            <Input
              id="table_payout_rate"
              type="number"
              value={formData.table_payout_rate || ''}
              onChange={(e) => setFormData({ ...formData, table_payout_rate: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override payout rate for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_platform" className="text-gray-300">
              Table Platform
            </Label>
            <Input
              id="table_platform"
              value={formData.table_platform || ''}
              onChange={(e) => setFormData({ ...formData, table_platform: e.target.value || null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override platform for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_trust_rating" className="text-gray-300">
              Table Trust Rating
            </Label>
            <Input
              id="table_trust_rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.table_trust_rating || ''}
              onChange={(e) => setFormData({ ...formData, table_trust_rating: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override trust rating for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_evaluation_rules" className="text-gray-300">
              Table Evaluation Rules
            </Label>
            <Input
              id="table_evaluation_rules"
              value={formData.table_evaluation_rules || ''}
              onChange={(e) => setFormData({ ...formData, table_evaluation_rules: e.target.value || null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override evaluation rules for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_fee" className="text-gray-300">
              Table Fee (USD)
            </Label>
            <Input
              id="table_fee"
              type="number"
              value={formData.table_fee || ''}
              onChange={(e) => setFormData({ ...formData, table_fee: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override fee for table view"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="table_coupon_code" className="text-gray-300">
              Table Coupon Code
            </Label>
            <Input
              id="table_coupon_code"
              value={formData.table_coupon_code || ''}
              onChange={(e) => setFormData({ ...formData, table_coupon_code: e.target.value || null })}
              className="bg-slate-700 border-blue-500/20 text-white"
              placeholder="Override coupon code for table view"
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableReviewFields;