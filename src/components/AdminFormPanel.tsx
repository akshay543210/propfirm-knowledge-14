
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropFirm } from "../types/supabase";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "../hooks/useCategories";
import { Loader2, AlertCircle, Save, Plus } from "lucide-react";
import { validateAdminForm } from "../utils/formValidation";
import BasicInfoFields from "./admin/BasicInfoFields";
import PricingFields from "./admin/PricingFields";
import RatingFields from "./admin/RatingFields";
import TradingFields from "./admin/TradingFields";
import ContentFields from "./admin/ContentFields";

interface AdminFormPanelProps {
  onAdd: (firm: Partial<PropFirm>) => Promise<any>;
  onUpdate: (id: string, firm: Partial<PropFirm>) => Promise<any>;
  editingFirm: PropFirm | null;
  setEditingFirm: (firm: PropFirm | null) => void;
  loading?: boolean;
}

const AdminFormPanel = ({ onAdd, onUpdate, editingFirm, setEditingFirm, loading = false }: AdminFormPanelProps) => {
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: null as string | null,
    price: 0,
    original_price: 0,
    coupon_code: '',
    review_score: 0,
    trust_rating: 0,
    description: '',
    features: '',
    logo_url: '/placeholder.svg',
    profit_split: 0,
    payout_rate: 0,
    funding_amount: '',
    user_review_count: 0,
    pros: '',
    cons: '',
    affiliate_url: '',
    brand: '',
    slug: '',
    platform: '',
    max_funding: '',
    evaluation_model: '',
    starting_fee: 0,
    regulation: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: null,
      price: 0,
      original_price: 0,
      coupon_code: '',
      review_score: 0,
      trust_rating: 0,
      description: '',
      features: '',
      logo_url: '/placeholder.svg',
      profit_split: 0,
      payout_rate: 0,
      funding_amount: '',
      user_review_count: 0,
      pros: '',
      cons: '',
      affiliate_url: '',
      brand: '',
      slug: '',
      platform: '',
      max_funding: '',
      evaluation_model: '',
      starting_fee: 0,
      regulation: ''
    });
    setEditingFirm(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAdminForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const firmData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        pros: formData.pros.split(',').map(f => f.trim()).filter(f => f),
        cons: formData.cons.split(',').map(f => f.trim()).filter(f => f),
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        category_id: formData.category_id,
        starting_fee: formData.starting_fee > 0 ? formData.starting_fee : null,
      };

      let result;
      if (editingFirm) {
        result = await onUpdate(editingFirm.id, firmData);
      } else {
        result = await onAdd(firmData);
      }

      if (result.success) {
        resetForm();
        toast({
          title: "Success",
          description: editingFirm ? "Prop firm updated successfully!" : "Prop firm added successfully!",
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (firm: PropFirm) => {
    setFormData({
      name: firm.name,
      category_id: firm.category_id,
      price: firm.price,
      original_price: firm.original_price,
      coupon_code: firm.coupon_code || '',
      review_score: firm.review_score || 0,
      trust_rating: firm.trust_rating || 0,
      description: firm.description || '',
      features: firm.features?.join(', ') || '',
      logo_url: firm.logo_url || '/placeholder.svg',
      profit_split: firm.profit_split,
      payout_rate: firm.payout_rate,
      funding_amount: firm.funding_amount,
      user_review_count: firm.user_review_count || 0,
      pros: firm.pros?.join(', ') || '',
      cons: firm.cons?.join(', ') || '',
      affiliate_url: firm.affiliate_url || '',
      brand: firm.brand || '',
      slug: firm.slug,
      platform: firm.platform || '',
      max_funding: firm.max_funding || '',
      evaluation_model: firm.evaluation_model || '',
      starting_fee: firm.starting_fee || 0,
      regulation: firm.regulation || ''
    });
    setEditingFirm(firm);
    setErrors({});
  };

  useEffect(() => {
    if (editingFirm) {
      handleEdit(editingFirm);
    }
  }, [editingFirm]);

  const isFormValid = formData.name.trim() && formData.funding_amount.trim();

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {editingFirm ? (
            <>
              <Save className="h-5 w-5" />
              Edit Prop Firm
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add New Prop Firm
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <BasicInfoFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            categories={categories}
            categoriesLoading={categoriesLoading}
            loading={loading}
          />
          
          <PricingFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={loading}
          />
          
          <RatingFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={loading}
          />
          
          <TradingFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={loading}
          />
          
          <ContentFields
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingFirm ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {editingFirm ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Firm
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Firm
                    </>
                  )}
                </>
              )}
            </Button>
            {editingFirm && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm} 
                className="border-gray-400 text-gray-400 hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Please fix the following errors:</span>
              </div>
              <ul className="list-disc list-inside text-red-400 text-sm mt-2">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminFormPanel;
