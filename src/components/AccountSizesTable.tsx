import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { AccountSize } from "../types/supabaseTypes";
import { useAccountSizes } from "../hooks/useAccountSizes";

interface AccountSizesTableProps {
  firmId: string;
  firmName: string;
}

const AccountSizesTable = ({ firmId, firmName }: AccountSizesTableProps) => {
  const { accountSizes } = useAccountSizes();
  
  // Filter account sizes for this specific firm
  const firmAccountSizes = accountSizes.filter(size => size.firm_id === firmId);
  const handleBuyNow = (buyingLink?: string) => {
    if (buyingLink) {
      window.open(buyingLink, '_blank');
    }
  };

  return (
    <Card className="bg-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Account Sizes & Pricing</CardTitle>
        <p className="text-muted-foreground">Choose the account size that fits your trading needs</p>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Account Size</TableHead>
                <TableHead className="text-muted-foreground">Discounted Price</TableHead>
                <TableHead className="text-muted-foreground">Original Price</TableHead>
                <TableHead className="text-muted-foreground">Promo Code</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firmAccountSizes.map((account) => {
                const discountPercentage = Math.round(((account.original_price - account.discounted_price) / account.original_price) * 100);
                
                return (
                  <TableRow key={account.id} className="border-border hover:bg-muted/50">
                    <TableCell className="text-foreground font-semibold text-lg">
                      ${account.size}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold text-lg">${account.discounted_price}</span>
                        <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
                          -{discountPercentage}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground line-through">${account.original_price}</span>
                    </TableCell>
                    <TableCell>
                      {account.promo_code ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {account.promo_code}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleBuyNow(account.buying_link)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {firmAccountSizes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No account sizes available for this firm yet.
            </div>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-primary text-sm">
            💡 <strong>Pro Tip:</strong> Use the promo codes above to get the best discounts on {firmName} accounts!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSizesTable;