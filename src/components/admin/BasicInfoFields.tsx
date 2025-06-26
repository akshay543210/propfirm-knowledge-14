
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types/supabase";
import { Loader2 } from "lucide-react";

interface BasicInfoFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  categories: Category[];
  categoriesLoading: boolean;
  loading?: boolean;
}

const BasicInfoFields = ({ 
  formData, 
  setFormData, 
  errors, 
  categories, 
  categoriesLoading, 
  loading = false 
}: BasicInfoFieldsProps) => {
  const inputClassName = (fieldName: string) => 
    `bg-slate-700 border-blue-500/20 text-white ${errors[fieldName] ? 'border-red-500' : ''}`;

  const handleCategoryChange = (value: string) => {
    const categoryId = value === "none" ? null : value;
    setFormData({...formData, category_id: categoryId});
  };

  return (
    <>
      <div>
        <Label htmlFor="name" className="text-gray-300">Firm Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={inputClassName('name')}
          disabled={loading}
          placeholder="Enter firm name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="brand" className="text-gray-300">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
          className={inputClassName('brand')}
          disabled={loading}
          placeholder="Enter brand name"
        />
      </div>

      <div>
        <Label htmlFor="slug" className="text-gray-300">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          className={inputClassName('slug')}
          placeholder="auto-generated from name if empty"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="category_id" className="text-gray-300">Category</Label>
        {categoriesLoading ? (
          <div className="flex items-center gap-2 text-gray-400 p-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading categories...
          </div>
        ) : (
          <Select 
            value={formData.category_id || "none"} 
            onValueChange={handleCategoryChange} 
            disabled={loading}
          >
            <SelectTrigger className="bg-slate-700 border-blue-500/20 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-blue-500/20">
              <SelectItem value="none" className="text-white hover:bg-slate-700">No Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="text-white hover:bg-slate-700">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
};

export default BasicInfoFields;
