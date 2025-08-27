import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, ExternalLink, FileText, Search, Filter } from "lucide-react";
import { useDramaReports } from "@/hooks/useDramaReports";
import { DramaReport, DramaType, DramaSeverity } from "@/types/dramaReports";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DramaTracker = () => {
  const { dramaReports, loading, error } = useDramaReports();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<DramaType | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<DramaSeverity | "all">("all");
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

  const filteredReports = dramaReports.filter((report) => {
    const matchesSearch = report.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.drama_type === filterType;
    const matchesSeverity = filterSeverity === "all" || report.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={false} setIsAdminMode={() => {}} />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-3 text-white text-lg">Loading drama reports...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={false} setIsAdminMode={() => {}} />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Reports</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={false} setIsAdminMode={() => {}} />
      
      <div className="container mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prop Firm Drama Tracker 📢
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Stay informed about issues, controversies, and problems with prop trading firms. 
            Community-driven transparency for safer trading.
          </p>
          
          <Link to="/drama-tracker/submit">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
              <FileText className="mr-2 h-5 w-5" />
              Know something shady? Report drama 📝
            </Button>
          </Link>
        </div>

        {/* Filters Section */}
        <Card className="bg-slate-800/50 border-blue-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by firm name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <Select value={filterType} onValueChange={(value) => setFilterType(value as DramaType | "all")}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="Payout Delay" className="text-white">Payout Delay</SelectItem>
                  <SelectItem value="Account Ban" className="text-white">Account Ban</SelectItem>
                  <SelectItem value="Rule Change" className="text-white">Rule Change</SelectItem>
                  <SelectItem value="Suspicious Activity" className="text-white">Suspicious Activity</SelectItem>
                  <SelectItem value="Shutdown" className="text-white">Shutdown</SelectItem>
                  <SelectItem value="Other" className="text-white">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSeverity} onValueChange={(value) => setFilterSeverity(value as DramaSeverity | "all")}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white">All Severities</SelectItem>
                  <SelectItem value="Low" className="text-white">Low</SelectItem>
                  <SelectItem value="Medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="High" className="text-white">High</SelectItem>
                  <SelectItem value="Scam Alert" className="text-white">Scam Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {filteredReports.length} of {dramaReports.length} drama reports
          </p>
        </div>

        {/* Drama Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card 
              key={report.id} 
              className="bg-slate-800/50 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 animate-fade-in"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg">{report.firm_name}</CardTitle>
                  <div className="flex flex-col gap-2">
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-lg">{getTypeIcon(report.drama_type)}</span>
                  <span>{report.drama_type}</span>
                  <span>•</span>
                  <span>{new Date(report.date_reported).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {expandedCards.has(report.id) 
                      ? report.description 
                      : `${report.description.slice(0, 150)}${report.description.length > 150 ? '...' : ''}`
                    }
                  </p>
                  
                  {report.description.length > 150 && (
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
                    <h4 className="text-white text-sm font-medium">Sources:</h4>
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

        {/* No Results */}
        {filteredReports.length === 0 && (
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Drama Reports Found</h3>
            <p className="text-gray-400 mb-6">
              {dramaReports.length === 0 
                ? "No drama reports have been approved yet." 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link to="/drama-tracker/submit">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit First Report
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DramaTracker;