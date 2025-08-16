
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropFirm } from "../types/supabase";
import { Loader2, Edit, Trash2, ExternalLink } from "lucide-react";

interface AdminFirmsListProps {
  propFirms: PropFirm[];
  onEdit: (firm: PropFirm) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const AdminFirmsList = ({ propFirms, onEdit, onDelete, loading = false }: AdminFirmsListProps) => {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <Card className="bg-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">
          Existing Prop Firms ({propFirms.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading firms...</span>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {propFirms.map((firm) => (
              <div key={firm.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-foreground font-semibold">{firm.name}</h4>
                      {firm.brand && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {firm.brand}
                        </span>
                      )}
                      {firm.show_on_homepage && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded">
                          Homepage
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {firm.description || 'No description available'}
                    </p>
                  </div>
                  {firm.affiliate_url && (
                    <a 
                      href={firm.affiliate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-xs text-foreground">
                  <div>
                    <span className="text-muted-foreground">Price:</span> ${firm.price}
                    {firm.original_price !== firm.price && (
                      <span className="line-through text-muted-foreground ml-1">${firm.original_price}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Funding:</span> {firm.funding_amount}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span> ⭐ {firm.review_score}/5 ({firm.user_review_count} reviews)
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trust:</span> {firm.trust_rating}/10
                  </div>
                  <div>
                    <span className="text-muted-foreground">Profit Split:</span> {firm.profit_split}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payout:</span> {firm.payout_rate}%
                  </div>
                </div>

                {(firm.platform || firm.regulation) && (
                  <div className="mb-3 text-xs text-muted-foreground">
                    {firm.platform && <span>Platform: {firm.platform}</span>}
                    {firm.platform && firm.regulation && <span className="mx-2">•</span>}
                    {firm.regulation && <span>Regulation: {firm.regulation}</span>}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(firm.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(firm)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      disabled={loading}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(firm.id, firm.name)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      disabled={loading}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {propFirms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No prop firms found.</p>
                <p className="text-muted-foreground text-sm mt-1">Add your first prop firm using the form on the left.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminFirmsList;
