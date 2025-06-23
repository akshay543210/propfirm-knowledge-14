
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface FilmProfile {
  id: string;
  name: string;
  rating: number;
  category: 'Beginner' | 'Intermediate' | 'Pro';
  image?: string;
  description?: string;
}

interface FilmProfileCardProps {
  profile: FilmProfile;
  index: number;
}

const FilmProfileCard = ({ profile, index }: FilmProfileCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Pro':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 animate-fade-in">
      <CardContent className="p-6">
        {/* Profile Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-6xl text-blue-400/60">🎬</div>
        </div>

        {/* Profile Name */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {profile.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {renderStars(profile.rating)}
          </div>
          <span className="text-gray-400 text-sm">({profile.rating}/5)</span>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <Badge 
            variant="outline" 
            className={`${getCategoryColor(profile.category)} border`}
          >
            {profile.category}
          </Badge>
        </div>

        {/* Description */}
        {profile.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {profile.description}
          </p>
        )}

        {/* Action Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          View Profile
        </button>
      </CardContent>
    </Card>
  );
};

export default FilmProfileCard;
