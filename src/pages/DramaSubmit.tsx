import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Plus, Trash2, FileText, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { submitDramaReport } from "@/hooks/useDramaReports";
import { DramaType, DramaSeverity } from "@/types/dramaReports";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DramaSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firm_name: '',
    date_reported: new Date().toISOString().split('T')[0],
    drama_type: '' as DramaType,
    description: '',
    severity: '' as DramaSeverity,
    source_links: ['']
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a drama report.",
          variant: "destructive",
        });
        navigate('/admin-login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSourceLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.source_links];
    newLinks[index] = value;
    setFormData({ ...formData, source_links: newLinks });
  };

  const addSourceLink = () => {
    setFormData({ ...formData, source_links: [...formData.source_links, ''] });
  };

  const removeSourceLink = (index: number) => {
    const newLinks = formData.source_links.filter((_, i) => i !== index);
    setFormData({ ...formData, source_links: newLinks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a drama report.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.firm_name || !formData.drama_type || !formData.description || !formData.severity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const filteredLinks = formData.source_links.filter(link => link.trim() !== '');
      
      const result = await submitDramaReport({
        firm_name: formData.firm_name,
        date_reported: formData.date_reported,
        drama_type: formData.drama_type,
        description: formData.description,
        severity: formData.severity,
        source_links: filteredLinks.length > 0 ? filteredLinks : undefined,
        submitted_by: user.id
      });

      if (result.success) {
        toast({
          title: "Report Submitted Successfully! ✅",
          description: "Thanks! Your report will be reviewed by our team and published if approved.",
        });
        
        // Reset form
        setFormData({
          firm_name: '',
          date_reported: new Date().toISOString().split('T')[0],
          drama_type: '' as DramaType,
          description: '',
          severity: '' as DramaSeverity,
          source_links: ['']
        });
        
        // Redirect to drama tracker
        navigate('/drama-tracker');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting your report.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
        <Navbar isAdminMode={false} setIsAdminMode={() => {}} />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-foreground text-lg">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      <Navbar isAdminMode={false} setIsAdminMode={() => {}} />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/drama-tracker')}
              className="mb-4 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Drama Tracker
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Report Prop Firm Drama 📢
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Help the trading community stay informed about prop firm issues. 
              Your report will be reviewed before being published.
            </p>
          </div>

          {/* Form */}
          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Drama Report Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Firm Name */}
                <div className="space-y-2">
                  <Label htmlFor="firm_name" className="text-foreground">
                    Prop Firm Name *
                  </Label>
                  <Input
                    id="firm_name"
                    value={formData.firm_name}
                    onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
                    placeholder="e.g., FTMO, MyForexFunds, etc."
                    className="bg-muted border-border text-foreground"
                    required
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date_reported" className="text-foreground">
                    Date of Incident *
                  </Label>
                  <Input
                    id="date_reported"
                    type="date"
                    value={formData.date_reported}
                    onChange={(e) => setFormData({ ...formData, date_reported: e.target.value })}
                    className="bg-muted border-border text-foreground"
                    required
                  />
                </div>

                {/* Drama Type */}
                <div className="space-y-2">
                  <Label htmlFor="drama_type" className="text-foreground">
                    Type of Issue *
                  </Label>
                  <Select 
                    value={formData.drama_type} 
                    onValueChange={(value) => setFormData({ ...formData, drama_type: value as DramaType })}
                  >
                    <SelectTrigger className="bg-muted border-border text-foreground">
                      <SelectValue placeholder="Select type of drama" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Payout Delay" className="text-foreground">💰 Payout Delay</SelectItem>
                      <SelectItem value="Account Ban" className="text-foreground">🚫 Account Ban</SelectItem>
                      <SelectItem value="Rule Change" className="text-foreground">📋 Rule Change</SelectItem>
                      <SelectItem value="Suspicious Activity" className="text-foreground">🔍 Suspicious Activity</SelectItem>
                      <SelectItem value="Shutdown" className="text-foreground">⚠️ Shutdown</SelectItem>
                      <SelectItem value="Other" className="text-foreground">❓ Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-foreground">
                    Severity Level *
                  </Label>
                  <Select 
                    value={formData.severity} 
                    onValueChange={(value) => setFormData({ ...formData, severity: value as DramaSeverity })}
                  >
                    <SelectTrigger className="bg-muted border-border text-foreground">
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Low" className="text-foreground">🟢 Low - Minor issue</SelectItem>
                      <SelectItem value="Medium" className="text-foreground">🟡 Medium - Concerning</SelectItem>
                      <SelectItem value="High" className="text-foreground">🟠 High - Serious problem</SelectItem>
                      <SelectItem value="Scam Alert" className="text-foreground">🔴 Scam Alert - Dangerous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Detailed Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed information about what happened, when it occurred, and any relevant context..."
                    className="bg-muted border-border text-foreground min-h-[120px]"
                    required
                  />
                  <p className="text-muted-foreground text-sm">
                    Be specific and factual. Include dates, amounts, and any relevant details.
                  </p>
                </div>

                {/* Source Links */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Source Links (Optional)
                  </Label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Add links to Reddit posts, Discord screenshots, or other evidence
                  </p>
                  
                  {formData.source_links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) => handleSourceLinkChange(index, e.target.value)}
                        placeholder="https://reddit.com/r/..."
                        className="bg-muted border-border text-foreground"
                      />
                      {formData.source_links.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSourceLink(index)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSourceLink}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Link
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Submit Drama Report
                      </>
                    )}
                  </Button>
                  
                  <p className="text-muted-foreground text-sm mt-3 text-center">
                    Your report will be reviewed by our team before being published. 
                    Please ensure all information is accurate and factual.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DramaSubmit;