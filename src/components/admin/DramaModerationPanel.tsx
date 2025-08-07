import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Trash2, ExternalLink, AlertTriangle } from "lucide-react";
import { useAdminDramaReports } from "@/hooks/useDramaReports";
import { DramaReport, DramaSeverity, DramaType } from "@/types/dramaReports";
import { useToast } from "@/hooks/use-toast";

const DramaModerationPanel = () => {
  const { dramaReports, loading, updateReportStatus, deleteReport } = useAdminDramaReports();
  const { toast } = useToast();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: DramaSeverity) => {
    switch (severity) {
      case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Scam Alert': return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: DramaType) => {
    switch (type) {
      case 'Payout Delay': return '💰';
      case 'Account Ban': return '🚫';
      case 'Rule Change': return '📋';
      case 'Suspicious Activity': return '🔍';
      case 'Shutdown': return '⚠️';
      case 'Other': return '❓';
      default: return '📢';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const handleApprove = async (id: string, firmName: string) => {
    const result = await updateReportStatus(id, 'Approved');
    if (result.success) {
      toast({
        title: "Report Approved ✅",
        description: `Drama report for ${firmName} has been approved and is now public.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to approve report",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string, firmName: string) => {
    const result = await updateReportStatus(id, 'Rejected');
    if (result.success) {
      toast({
        title: "Report Rejected ❌",
        description: `Drama report for ${firmName} has been rejected.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to reject report",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, firmName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the drama report for ${firmName}?`)) {
      return;
    }

    const result = await deleteReport(id);
    if (result.success) {
      toast({
        title: "Report Deleted 🗑️",
        description: `Drama report for ${firmName} has been permanently deleted.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const pendingReports = dramaReports.filter(report => report.status === 'Pending');
  const reviewedReports = dramaReports.filter(report => report.status !== 'Pending');

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-300">Loading drama reports...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Reports Section */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Pending Drama Reports ({pendingReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReports.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No pending reports to review.</p>
          ) : (
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <Card key={report.id} className="bg-slate-700/50 border-yellow-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-semibold text-lg">{report.firm_name}</h4>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-lg">{getTypeIcon(report.drama_type)}</span>
                          <span>{report.drama_type}</span>
                          <span>•</span>
                          <span>{new Date(report.date_reported).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Submitted {new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(report.id, report.firm_name)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(report.id, report.firm_name)}
                          variant="outline"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleDelete(report.id, report.firm_name)}
                          variant="outline"
                          className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {expandedCards.has(report.id) 
                          ? report.description 
                          : `${report.description.slice(0, 200)}${report.description.length > 200 ? '...' : ''}`
                        }
                      </p>
                      
                      {report.description.length > 200 && (
                        <Button
                          variant="link"
                          onClick={() => toggleExpanded(report.id)}
                          className="text-blue-400 p-0 h-auto font-normal text-sm mt-2"
                        >
                          {expandedCards.has(report.id) ? 'Show less' : 'Read more'}
                        </Button>
                      )}
                    </div>

                    {/* Source Links */}
                    {report.source_links && report.source_links.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-white text-sm font-medium">Sources:</h5>
                        <div className="flex flex-wrap gap-2">
                          {report.source_links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 hover:border-blue-400/40 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Source {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Reports Section */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Recently Reviewed ({reviewedReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedReports.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No reviewed reports yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reviewedReports.slice(0, 10).map((report) => (
                <div key={report.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{report.firm_name}</span>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {report.drama_type} • {new Date(report.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(report.id, report.firm_name)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DramaModerationPanel;