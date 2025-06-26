
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RatingFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  loading?: boolean;
}

const RatingFields = ({ formData, setFormData, errors, loading = false }: RatingFieldsProps) => {
  const inputClassName = (fieldName: string) => 
    `bg-slate-700 border-blue-500/20 text-white ${errors[fieldName] ? 'border-red-500' : ''}`;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="review_score" className="text-gray-300">Review Score (0-5)</Label>
        <Input
          id="review_score"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={formData.review_score}
          onChange={(e) => setFormData({...formData, review_score: Number(e.target.value)})}
          className={inputClassName('review_score')}
          disabled={loading}
        />
        {errors.review_score && <p className="text-red-400 text-sm mt-1">{errors.review_score}</p>}
      </div>
      <div>
        <Label htmlFor="trust_rating" className="text-gray-300">Trust Rating (0-10)</Label>
        <Input
          id="trust_rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={formData.trust_rating}
          onChange={(e) => setFormData({...formData, trust_rating: Number(e.target.value)})}
          className={inputClassName('trust_rating')}
          disabled={loading}
        />
        {errors.trust_rating && <p className="text-red-400 text-sm mt-1">{errors.trust_rating}</p>}
      </div>
      <div>
        <Label htmlFor="user_review_count" className="text-gray-300">User Reviews</Label>
        <Input
          id="user_review_count"
          type="number"
          min="0"
          value={formData.user_review_count}
          onChange={(e) => setFormData({...formData, user_review_count: Number(e.target.value)})}
          className={inputClassName('user_review_count')}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default RatingFields;
