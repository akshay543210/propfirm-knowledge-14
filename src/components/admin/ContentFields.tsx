
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContentFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  loading?: boolean;
}

const ContentFields = ({ formData, setFormData, loading = false }: ContentFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="bg-slate-700 border-blue-500/20 text-white"
          disabled={loading}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="features" className="text-gray-300">Features (comma separated)</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({...formData, features: e.target.value})}
          className="bg-slate-700 border-blue-500/20 text-white"
          placeholder="Feature 1, Feature 2, Feature 3"
          disabled={loading}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="pros" className="text-gray-300">Pros (comma separated)</Label>
        <Textarea
          id="pros"
          value={formData.pros}
          onChange={(e) => setFormData({...formData, pros: e.target.value})}
          className="bg-slate-700 border-blue-500/20 text-white"
          placeholder="Pro 1, Pro 2, Pro 3"
          disabled={loading}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="cons" className="text-gray-300">Cons (comma separated)</Label>
        <Textarea
          id="cons"
          value={formData.cons}
          onChange={(e) => setFormData({...formData, cons: e.target.value})}
          className="bg-slate-700 border-blue-500/20 text-white"
          placeholder="Con 1, Con 2, Con 3"
          disabled={loading}
          rows={2}
        />
      </div>
    </>
  );
};

export default ContentFields;
