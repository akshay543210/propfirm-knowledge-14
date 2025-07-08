import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePropFirms } from "../../hooks/useSupabaseData";
import { useAccountSizes } from "../../hooks/useAccountSizes";
import { AccountSize } from "../../types/supabaseTypes";

const AccountSizesManager = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { propFirms } = usePropFirms();
  const { accountSizes, loading, addAccountSize, updateAccountSize, deleteAccountSize } = useAccountSizes();
  const { toast } = useToast();

  const [selectedAccountType, setSelectedAccountType] = useState<string>('1-step');
  const [formData, setFormData] = useState({
    firm_id: '',
    size: '',
    discounted_price: 0,
    original_price: 0,
    promo_code: '',
    buying_link: ''
  });

  const accountTypes = [
    { value: '1-step', label: '1 Step Account' },
    { value: '2-step', label: '2 Step Account' },
    { value: 'instant', label: 'Instant Funding Account' }
  ];

  const resetForm = () => {
    setFormData({
      firm_id: '',
      size: '',
      discounted_price: 0,
      original_price: 0,
      promo_code: '',
      buying_link: ''
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = async () => {
    if (!formData.firm_id || !formData.size || formData.discounted_price <= 0 || formData.original_price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await addAccountSize({
      firm_id: formData.firm_id,
      size: formData.size,
      discounted_price: formData.discounted_price,
      original_price: formData.original_price,
      promo_code: formData.promo_code || undefined,
      buying_link: formData.buying_link || undefined
    });

    if (result.success) {
      resetForm();
    }
  };

  const handleEdit = (accountSize: AccountSize) => {
    setFormData({
      firm_id: accountSize.firm_id,
      size: accountSize.size,
      discounted_price: accountSize.discounted_price,
      original_price: accountSize.original_price,
      promo_code: accountSize.promo_code || '',
      buying_link: accountSize.buying_link || ''
    });
    setEditingId(accountSize.id);
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!formData.firm_id || !formData.size || formData.discounted_price <= 0 || formData.original_price <= 0 || !editingId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await updateAccountSize(editingId, {
      firm_id: formData.firm_id,
      size: formData.size,
      discounted_price: formData.discounted_price,
      original_price: formData.original_price,
      promo_code: formData.promo_code || undefined,
      buying_link: formData.buying_link || undefined
    });

    if (result.success) {
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this account size?")) {
      await deleteAccountSize(id);
    }
  };

  const getFirmName = (firmId: string) => {
    const firm = propFirms.find(f => f.id === firmId);
    return firm?.name || firmId;
  };

  return (
    <div className="space-y-6">
      {/* Account Type Filter */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Table className="h-5 w-5" />
            Account Type Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-gray-300 text-sm font-medium">
              Filter by Account Type:
            </label>
            <Select value={selectedAccountType} onValueChange={setSelectedAccountType}>
              <SelectTrigger className="w-64 bg-slate-600 border-slate-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-600">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {accountTypes.find(t => t.value === selectedAccountType)?.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {isAdding || editingId ? (
              <>
                {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingId ? 'Edit Account Size' : 'Add New Account Size'}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Account Sizes Management
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(isAdding || editingId) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Prop Firm *
                </label>
                <Select value={formData.firm_id} onValueChange={(value) => setFormData({...formData, firm_id: value})}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Select a prop firm" />
                  </SelectTrigger>
                  <SelectContent>
                    {propFirms.map((firm) => (
                      <SelectItem key={firm.id} value={firm.id}>
                        {firm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Size *
                </label>
                <Input
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="e.g., 5K, 10K, 25K"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Discounted Price *
                </label>
                <Input
                  type="number"
                  value={formData.discounted_price}
                  onChange={(e) => setFormData({...formData, discounted_price: Number(e.target.value)})}
                  placeholder="155"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Original Price *
                </label>
                <Input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => setFormData({...formData, original_price: Number(e.target.value)})}
                  placeholder="175"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Promo Code
                </label>
                <Input
                  value={formData.promo_code}
                  onChange={(e) => setFormData({...formData, promo_code: e.target.value})}
                  placeholder="SAVE20"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Buying Link
                </label>
                <Input
                  value={formData.buying_link}
                  onChange={(e) => setFormData({...formData, buying_link: e.target.value})}
                  placeholder="https://example.com/buy"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Add'} Account Size
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-400 text-gray-400 hover:bg-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Account Size
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Account Sizes Table */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">
            Existing Account Sizes ({accountSizes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Prop Firm</TableHead>
                  <TableHead className="text-gray-300">Size</TableHead>
                  <TableHead className="text-gray-300">Discounted Price</TableHead>
                  <TableHead className="text-gray-300">Original Price</TableHead>
                  <TableHead className="text-gray-300">Discount</TableHead>
                  <TableHead className="text-gray-300">Promo Code</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountSizes.map((accountSize) => {
                  const discountPercentage = Math.round(((accountSize.original_price - accountSize.discounted_price) / accountSize.original_price) * 100);
                  
                  return (
                    <TableRow key={accountSize.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">
                        {getFirmName(accountSize.firm_id)}
                      </TableCell>
                      <TableCell className="text-blue-400 font-semibold">
                        ${accountSize.size}
                      </TableCell>
                      <TableCell className="text-green-400 font-semibold">
                        ${accountSize.discounted_price}
                      </TableCell>
                      <TableCell className="text-gray-400 line-through">
                        ${accountSize.original_price}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          -{discountPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {accountSize.promo_code ? (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {accountSize.promo_code}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(accountSize)}
                            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(accountSize.id)}
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {accountSizes.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No account sizes found. Add your first account size above.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSizesManager;