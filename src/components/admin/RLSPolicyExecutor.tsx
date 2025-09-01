import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, AlertTriangle, CheckCircle, XCircle, Play, RefreshCw, Info } from "lucide-react";
import { executeRLSPolicyFix, executeRLSPolicyFixDirect, getEnvironmentInfo, type RLSFixResult } from "@/utils/rlsPolicyExecutor";
import { toast } from "sonner";

const RLSPolicyExecutor = () => {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<RLSFixResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const envInfo = getEnvironmentInfo();
  
  const handleExecuteRLSFix = async (useDirectMethod = false) => {
    setExecuting(true);
    setResult(null);
    
    try {
      console.log(`🚀 Starting RLS policy fix (${useDirectMethod ? 'direct' : 'standard'} method)...`);
      
      const fixResult = useDirectMethod 
        ? await executeRLSPolicyFixDirect()
        : await executeRLSPolicyFix();
        
      setResult(fixResult);
      
      if (fixResult.success) {
        toast.success('✅ RLS policies fixed successfully!');
        // Trigger a page refresh after a short delay to see the changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('❌ RLS policy fix failed: ' + fixResult.message);
      }
      
    } catch (error: any) {
      console.error('💥 RLS policy execution error:', error);
      const errorResult: RLSFixResult = {
        success: false,
        message: 'Failed to execute RLS policy fix',
        error: error.message,
        details: error
      };
      setResult(errorResult);
      toast.error('❌ Execution failed: ' + error.message);
    } finally {
      setExecuting(false);
    }
  };
  
  const copyServiceRoleInstructions = () => {
    const instructions = `
# Set up Supabase Service Role Key

1. Go to Supabase Dashboard → Settings → API
2. Copy the "service_role" key (NOT the anon key)
3. Add to your environment variables:

For development (.env.local):
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

For production:
Set the environment variable in your hosting platform

⚠️ SECURITY WARNING: Service role key has admin privileges. 
Keep it secure and never expose it in client-side code.
    `.trim();
    
    navigator.clipboard.writeText(instructions);
    toast.success('📋 Service role setup instructions copied to clipboard');
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle className="text-white text-xl">RLS Policy Executor</CardTitle>
              <p className="text-gray-400 text-sm">
                Fix Budget & Top PropFirms loading issues using API
              </p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            API Method
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Environment Check */}
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Environment Status
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Supabase URL:</span>
              <Badge variant="outline" className="text-xs">
                {envInfo.supabaseUrl ? '✅ Configured' : '❌ Missing'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Service Role Key:</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${envInfo.hasServiceRoleKey ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
              >
                {envInfo.hasServiceRoleKey ? `✅ Set (${envInfo.serviceRoleKeyLength} chars)` : '❌ Not Set'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Environment:</span>
              <Badge variant="outline" className="text-xs">
                {envInfo.environment}
              </Badge>
            </div>
          </div>
          
          {!envInfo.hasServiceRoleKey && (
            <Alert className="mt-4 bg-yellow-900/20 border-yellow-500/30">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                Service role key not configured. Click the button below for setup instructions.
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 border-yellow-500 text-yellow-400"
                  onClick={copyServiceRoleInstructions}
                >
                  📋 Copy Setup Instructions
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Execution Controls */}
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-3">Execute RLS Policy Fix</h3>
          <p className="text-gray-400 text-sm mb-4">
            This will programmatically create the necessary RLS policies to allow Budget and Top PropFirms 
            to load for all users, not just admins.
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => handleExecuteRLSFix(false)}
              disabled={executing || !envInfo.hasServiceRoleKey}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {executing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {executing ? 'Executing...' : 'Execute RLS Fix'}
            </Button>
            
            <Button 
              onClick={() => handleExecuteRLSFix(true)}
              disabled={executing || !envInfo.hasServiceRoleKey}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              {executing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Direct Method
            </Button>
          </div>
          
          {!envInfo.hasServiceRoleKey && (
            <p className="text-red-400 text-sm mt-2">
              ⚠️ Service role key required for API execution. See setup instructions above.
            </p>
          )}
        </div>
        
        {/* Results */}
        {result && (
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <h3 className={`text-lg font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? 'Success!' : 'Failed'}
              </h3>
            </div>
            
            <p className={`text-sm mb-3 ${result.success ? 'text-green-200' : 'text-red-200'}`}>
              {result.message}
            </p>
            
            {result.error && (
              <Alert className="mb-3 bg-red-900/20 border-red-500/30">
                <XCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  Error: {result.error}
                </AlertDescription>
              </Alert>
            )}
            
            {result.details && (
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="border-gray-500 text-gray-400"
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
                
                {showDetails && (
                  <pre className="mt-3 text-xs text-gray-300 bg-slate-800 p-3 rounded overflow-auto max-h-60">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
            
            {result.success && (
              <Alert className="mt-3 bg-green-900/20 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  🎉 Budget PropFirms and Top PropFirms should now load for all users! 
                  The page will refresh automatically to show the changes.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        {/* Manual Fallback */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <h4 className="text-amber-300 font-semibold mb-2">Manual Fallback</h4>
          <p className="text-amber-200 text-sm mb-3">
            If the API method doesn't work, you can still run the SQL manually in Supabase SQL Editor.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="border-amber-500 text-amber-400"
            onClick={() => {
              const sql = `
-- Copy this SQL and run it in Supabase SQL Editor
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;

CREATE POLICY "allow_public_read_budget_prop" ON public.budget_prop FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_top5_prop" ON public.top5_prop FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_table_review_firms" ON public.table_review_firms FOR SELECT TO anon, authenticated USING (true);
              `.trim();
              
              navigator.clipboard.writeText(sql);
              toast.success('📋 Manual SQL copied to clipboard');
            }}
          >
            📋 Copy Manual SQL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RLSPolicyExecutor;