import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, AlertTriangle, CheckCircle, RefreshCw, Copy } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RLSPolicyExecutor from './RLSPolicyExecutor';

const DatabaseFixPanel = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [fixResults, setFixResults] = useState<any[]>([]);
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  // SQL to fix RLS policies
  const rlsFixSQL = `
-- COMPREHENSIVE RLS FIX for Budget & Top PropFirms
-- Enable RLS and create proper public read policies

-- Step 1: Enable RLS on all section tables
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;

-- Step 3: Create new public read policies with explicit TO public
CREATE POLICY "Public read access for budget prop" 
ON public.budget_prop 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public read access for top5 prop" 
ON public.top5_prop 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public read access for explore firms" 
ON public.explore_firms 
FOR SELECT 
TO public
USING (true);

-- Step 4: Verify policies were created
SELECT 
    tablename, 
    policyname, 
    cmd as operation,
    roles
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms')
AND policyname LIKE '%Public read access%'
ORDER BY tablename;
`.trim();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(rlsFixSQL);
      toast.success('SQL copied to clipboard! Paste it in Supabase SQL Editor.');
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  const applyAutoFix = async () => {
    setIsAutoFixing(true);
    
    try {
      // Since direct SQL execution via RPC may not be available,
      // we'll provide clear instructions and copy the SQL to clipboard
      
      toast.info('📝 Auto-fix copying SQL to clipboard...');
      
      // Copy the fix SQL to clipboard
      const success = copyToClipboard();
      
      if (success) {
        toast.success('✅ SQL copied! Please paste in Supabase SQL Editor and run it.');
        
        // Wait a moment then test to see if user applied the fix
        setTimeout(() => {
          toast.info('🔍 Testing data access in 5 seconds...');
          setTimeout(() => {
            testDataAccess();
          }, 5000);
        }, 2000);
      } else {
        toast.error('❌ Could not copy to clipboard. Please manually copy the SQL below.');
      }
      
    } catch (error) {
      console.error('Auto-fix failed:', error);
      toast.error('Auto-fix failed. Please use manual SQL approach.');
    } finally {
      setIsAutoFixing(false);
    }
  };

  const testDataAccess = async () => {
    setIsTesting(true);
    
    try {
      const tests = [
        { name: 'Budget Firms', table: 'budget_prop' },
        { name: 'Top Firms', table: 'top5_prop' },
        { name: 'Explore Firms', table: 'explore_firms' }
      ];
      
      const results = [];
      
      for (const { name, table } of tests) {
        try {
          // Test basic table access
          const { data, error } = await supabase
            .from(table as any)
            .select('id')
            .limit(1);

          // Also test the actual query used by the app
          let joinTestError = null;
          if (table === 'budget_prop' || table === 'top5_prop') {
            const { error: joinError } = await supabase
              .from(table as any)
              .select(`
                id,
                propfirm_id,
                prop_firms(
                  id,
                  name,
                  price
                )
              `)
              .limit(1);
            joinTestError = joinError;
          }
            
          results.push({
            table,
            policy: name + ' Access Test',
            success: !error && !joinTestError,
            error: error?.message || joinTestError?.message || null,
            count: data?.length || 0,
            details: error ? `Basic access failed: ${error.message}` : 
                    joinTestError ? `Join query failed: ${joinTestError.message}` : 
                    `✅ Access successful (${data?.length || 0} rows accessible)`
          });
        } catch (err) {
          results.push({
            table,
            policy: name + ' Access Test',
            success: false,
            error: err instanceof Error ? err.message : String(err),
            details: `Exception: ${err instanceof Error ? err.message : String(err)}`
          });
        }
      }
      
      setFixResults(results);
      
      const successCount = results.filter(r => r.success).length;
      if (successCount === results.length) {
        toast.success('✅ All section tables accessible!');
        
        // Check if tables have data
        const emptyTables = results.filter(r => r.count === 0);
        if (emptyTables.length > 0) {
          toast.info(`ℹ️ Some tables are empty: ${emptyTables.map(t => t.table).join(', ')}. Add firms via Admin Panel.`);
        }
      } else {
        toast.error('❌ Some section tables have access issues - RLS policies need to be fixed');
      }
      
    } catch (error) {
      toast.error('Failed to test data access');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API-based RLS Policy Executor */}
      <RLSPolicyExecutor />
      
      {/* Traditional Database Fix Panel */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-yellow-400" />
              <div>
                <CardTitle className="text-white text-xl">Manual Database Fix Panel</CardTitle>
                <p className="text-gray-400 text-sm">
                  Alternative manual method for RLS policy fixes
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Manual Method
            </Badge>
          </div>
        </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-300 font-semibold">Issue Detected</span>
            </div>
            <p className="text-yellow-200 text-sm">
              Budget PropFirms and Top PropFirms sections are not loading because the database tables 
              are missing public read policies. This prevents client-side access to the data.
            </p>
          </div>
          
          <div className="flex gap-3 mb-4">
            <Button 
              onClick={testDataAccess}
              disabled={isTesting || isAutoFixing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isTesting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Test Data Access
            </Button>
            
            <Button 
              onClick={applyAutoFix}
              disabled={isTesting || isAutoFixing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isAutoFixing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Quick Fix (Copy SQL)
            </Button>
            
            <Button 
              onClick={copyToClipboard}
              disabled={isTesting || isAutoFixing}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy SQL
            </Button>
          </div>
          
          {fixResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-gray-300 text-sm font-medium">Results:</h4>
              {fixResults.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success 
                      ? 'bg-green-900/20 border border-green-500/30' 
                      : 'bg-red-900/20 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-white text-sm">
                      {result.table}: {result.policy}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {result.error && (
                      <span className="text-red-300 text-xs mb-1">
                        Error: {result.error}
                      </span>
                    )}
                    {result.details && (
                      <span className="text-gray-300 text-xs">
                        {result.details}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm mb-3">
                <strong>Solution Options:</strong>
              </p>
              <div className="space-y-2 text-blue-200 text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-semibold">1. Auto Fix:</span>
                  <span>Click "Auto Fix RLS Policies" to attempt automatic resolution</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">2. Manual Fix:</span>
                  <span>Click "Copy SQL" and paste in Supabase SQL Editor</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-900/20 border border-gray-500/30 rounded-lg">
              <p className="text-gray-300 text-xs">
                <strong>SQL to fix RLS policies:</strong>
              </p>
              <pre className="text-gray-400 text-xs mt-2 font-mono bg-gray-800/50 p-2 rounded overflow-x-auto">
                {rlsFixSQL}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseFixPanel;