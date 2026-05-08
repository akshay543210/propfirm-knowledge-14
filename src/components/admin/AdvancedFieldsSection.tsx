import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  formData: any;
  setFormData: (d: any) => void;
  loading?: boolean;
}

const cls = "bg-slate-700 border-blue-500/20 text-white";

const AdvancedFieldsSection = ({ formData, setFormData, loading }: Props) => {
  const arrField = (key: string, label: string, placeholder: string) => (
    <div>
      <Label className="text-gray-300">{label}</Label>
      <Input
        className={cls}
        disabled={loading}
        placeholder={placeholder}
        value={formData[key] ?? ""}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
      <p className="text-xs text-gray-500 mt-1">Comma-separated values</p>
    </div>
  );

  const numField = (key: string, label: string, step = "1") => (
    <div>
      <Label className="text-gray-300">{label}</Label>
      <Input
        type="number"
        step={step}
        className={cls}
        disabled={loading}
        value={formData[key] ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            [key]: e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
    </div>
  );

  return (
    <div className="space-y-4 border-t border-blue-500/10 pt-4">
      <h3 className="text-white font-semibold">Advanced Search & Filter Fields</h3>

      {arrField("platforms", "Platforms", "MT4, MT5, cTrader")}
      {arrField("asset_classes", "Asset Classes", "Forex, Indices, Crypto")}
      {arrField("feature_tags", "Feature Tags", "instant-funding, scaling-plan")}
      {arrField("countries", "Countries", "US, UK, IN")}

      <div className="grid grid-cols-2 gap-3">
        {numField("fee_min", "Fee Min ($)")}
        {numField("fee_max", "Fee Max ($)")}
        {numField("account_min", "Account Min ($)")}
        {numField("account_max", "Account Max ($)")}
        {numField("profit_split_min", "Profit Split Min (%)")}
        {numField("profit_split_max", "Profit Split Max (%)")}
        {numField("year_established", "Year Established")}
        {numField("rating_avg", "Rating Avg (0-5)", "0.1")}
      </div>

      <div className="flex items-center justify-between bg-slate-700/40 rounded-lg p-3">
        <div>
          <Label className="text-gray-300">Verified</Label>
          <p className="text-xs text-gray-500">Mark as verified by FPK</p>
        </div>
        <Switch
          checked={!!formData.verified}
          disabled={loading}
          onCheckedChange={(v) => setFormData({ ...formData, verified: v })}
        />
      </div>
    </div>
  );
};

export default AdvancedFieldsSection;
