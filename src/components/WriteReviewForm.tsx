
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, X, Upload, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeFormData } from '@/utils/sanitization';

interface WriteReviewFormProps {
  firmId: string;
  firmName: string;
  onClose: () => void;
}

const WriteReviewForm = ({ firmId, firmName, onClose }: WriteReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: "Error",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive"
      });
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !content.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rating and review content.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first if any
      const imageUrls: string[] = [];
      
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `${firmId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('review-images')
            .upload(filePath, image);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('review-images')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
      }

      // Sanitize all user inputs to prevent XSS attacks
      const sanitizedData = sanitizeFormData({
        title: title.trim() || null,
        content: content.trim(),
        reviewer_name: reviewerName.trim() || 'Anonymous'
      });

      const { error } = await supabase
        .from('reviews')
        .insert({
          firm_id: firmId,
          rating,
          images: imageUrls,
          ...sanitizedData
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been submitted successfully!"
      });

      // Reset form
      setRating(0);
      setHoverRating(0);
      setTitle('');
      setContent('');
      setReviewerName('');
      setImages([]);
      setImagePreviews([]);
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-slate-700/50 border-blue-500/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Write a Review for {firmName}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Rating *
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    i < (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-600 hover:text-yellow-400'
                  }`}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Your Name (optional)
            </label>
            <Input
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Leave blank to post as Anonymous"
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Review Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Great experience with fast payouts"
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Your Review *
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this prop firm..."
              rows={4}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Add Images (optional, max 5)
            </label>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-600 border-2 border-dashed border-slate-500 rounded-lg p-4 hover:bg-slate-500 transition-colors">
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">Click to upload images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={images.length >= 5}
                />
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-slate-900"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WriteReviewForm;
