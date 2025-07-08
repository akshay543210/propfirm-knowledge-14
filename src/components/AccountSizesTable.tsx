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
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Account Sizes & Pricing</CardTitle>
        <p className="text-gray-400">Choose the account size that fits your trading needs</p>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-gray-300">Account Size</TableHead>
                <TableHead className="text-gray-300">Discounted Price</TableHead>
                <TableHead className="text-gray-300">Original Price</TableHead>
                <TableHead className="text-gray-300">Promo Code</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firmAccountSizes.map((account) => {
                const discountPercentage = Math.round(((account.original_price - account.discounted_price) / account.original_price) * 100);
                
                return (
                  <TableRow key={account.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white font-semibold text-lg">
                      ${account.size}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold text-lg">${account.discounted_price}</span>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                          -{discountPercentage}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 line-through">${account.original_price}</span>
                    </TableCell>
                    <TableCell>
                      {account.promo_code ? (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {account.promo_code}
                        </Badge>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleBuyNow(account.buying_link)}
                        className="bg-green-600 hover:bg-green-700 text-white"
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
            <div className="text-center py-8 text-gray-400">
              No account sizes available for this firm yet.
            </div>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 <strong>Pro Tip:</strong> Use the promo codes above to get the best discounts on {firmName} accounts!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSizesTable;