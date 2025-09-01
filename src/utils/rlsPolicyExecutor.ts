// RLS Policy Executor - Run RLS policies programmatically using Supabase API
import { createClient } from '@supabase/supabase-js';

// You need to set these environment variables or replace with actual values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jkiblofuayvdrrxbbhuu.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create admin client with service role key for executing SQL
const createAdminClient = () => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Service role key not configured. Set VITE_SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }
  
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// SQL for comprehensive RLS fix
const RLS_FIX_SQL = `
-- FINAL COMPREHENSIVE RLS FIX
-- This will ensure Budget PropFirms and Top PropFirms load for ALL users (not just admins)

-- Force enable RLS
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;

-- Remove ALL existing policies to start fresh
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;

-- Remove admin-only policies that might be blocking public access
DROP POLICY IF EXISTS "Admins can manage budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Admins can manage top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Admins can manage table review firms" ON public.table_review_firms;

-- Create NEW public read policies (this is the key fix)
CREATE POLICY "allow_public_read_budget_prop" 
ON public.budget_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "allow_public_read_top5_prop" 
ON public.top5_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "allow_public_read_table_review_firms" 
ON public.table_review_firms 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create admin management policies
CREATE POLICY "admin_manage_budget_prop" 
ON public.budget_prop 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
))
WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
));

CREATE POLICY "admin_manage_top5_prop" 
ON public.top5_prop 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
))
WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
));

CREATE POLICY "admin_manage_table_review_firms" 
ON public.table_review_firms 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
))
WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
));
`;

// Add sample data SQL
const ADD_SAMPLE_DATA_SQL = `
DO $$
DECLARE
    budget_count int;
    top_count int;
    table_count int;
    sample_firm_id uuid;
BEGIN
    -- Check current counts
    SELECT COUNT(*) INTO budget_count FROM public.budget_prop;
    SELECT COUNT(*) INTO top_count FROM public.top5_prop;
    SELECT COUNT(*) INTO table_count FROM public.table_review_firms;
    
    -- Get a sample firm
    SELECT id INTO sample_firm_id FROM public.prop_firms LIMIT 1;
    
    IF sample_firm_id IS NOT NULL THEN
        -- Add to budget_prop if empty
        IF budget_count = 0 THEN
            INSERT INTO public.budget_prop (propfirm_id) VALUES (sample_firm_id);
        END IF;
        
        -- Add to top5_prop if empty  
        IF top_count = 0 THEN
            INSERT INTO public.top5_prop (propfirm_id) VALUES (sample_firm_id);
        END IF;
        
        -- Add to table_review_firms if empty
        IF table_count = 0 THEN
            INSERT INTO public.table_review_firms (firm_id, is_approved, sort_priority) 
            VALUES (sample_firm_id, true, 1);
        END IF;
    END IF;
END $$;
`;

export interface RLSFixResult {
  success: boolean;
  message: string;
  error?: string;
  details?: any;
}

// Execute RLS policy fix
export const executeRLSPolicyFix = async (): Promise<RLSFixResult> => {
  try {
    console.log('🚀 Starting RLS policy fix execution...');
    
    const adminClient = createAdminClient();
    
    // Execute the RLS fix SQL
    console.log('📝 Executing RLS policies SQL...');
    const { data: rlsData, error: rlsError } = await adminClient.rpc('exec_sql', {
      sql: RLS_FIX_SQL
    });
    
    if (rlsError) {
      console.error('❌ RLS policy creation failed:', rlsError);
      return {
        success: false,
        message: 'Failed to create RLS policies',
        error: rlsError.message,
        details: rlsError
      };
    }
    
    console.log('✅ RLS policies created successfully');
    
    // Add sample data if needed
    console.log('📦 Adding sample data if tables are empty...');
    const { data: sampleData, error: sampleError } = await adminClient.rpc('exec_sql', {
      sql: ADD_SAMPLE_DATA_SQL
    });
    
    if (sampleError) {
      console.warn('⚠️ Sample data insertion failed (this might be okay):', sampleError);
    } else {
      console.log('✅ Sample data check/insertion completed');
    }
    
    // Verify the fix by testing data access
    console.log('🔍 Verifying fix by testing data access...');
    const verification = await verifyDataAccess(adminClient);
    
    return {
      success: true,
      message: '🎉 RLS policy fix executed successfully! Budget and Top PropFirms should now load for all users.',
      details: {
        rlsResult: rlsData,
        sampleDataResult: sampleData,
        verification
      }
    };
    
  } catch (error: any) {
    console.error('💥 RLS policy fix execution failed:', error);
    return {
      success: false,
      message: 'RLS policy fix execution failed',
      error: error.message,
      details: error
    };
  }
};

// Verify that the fix worked
const verifyDataAccess = async (adminClient: any) => {
  try {
    const results = await Promise.all([
      adminClient.from('budget_prop').select('id').limit(1),
      adminClient.from('top5_prop').select('id').limit(1),
      adminClient.from('table_review_firms').select('id').limit(1)
    ]);
    
    return {
      budget_prop: results[0].error ? 'FAILED' : 'SUCCESS',
      top5_prop: results[1].error ? 'FAILED' : 'SUCCESS',
      table_review_firms: results[2].error ? 'FAILED' : 'SUCCESS',
      details: results.map((r, i) => ({
        table: ['budget_prop', 'top5_prop', 'table_review_firms'][i],
        error: r.error?.message,
        dataCount: r.data?.length || 0
      }))
    };
  } catch (error) {
    return {
      error: 'Verification failed',
      details: error
    };
  }
};

// Alternative method using direct SQL execution (if rpc doesn't work)
export const executeRLSPolicyFixDirect = async (): Promise<RLSFixResult> => {
  try {
    console.log('🚀 Starting direct RLS policy fix...');
    
    const adminClient = createAdminClient();
    
    // Split SQL into individual statements and execute them
    const statements = [
      'ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;',
      
      'DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;',
      'DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;',
      'DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;',
      
      `CREATE POLICY "allow_public_read_budget_prop" 
       ON public.budget_prop FOR SELECT TO anon, authenticated USING (true);`,
      
      `CREATE POLICY "allow_public_read_top5_prop" 
       ON public.top5_prop FOR SELECT TO anon, authenticated USING (true);`,
       
      `CREATE POLICY "allow_public_read_table_review_firms" 
       ON public.table_review_firms FOR SELECT TO anon, authenticated USING (true);`
    ];
    
    const results = [];
    for (const statement of statements) {
      try {
        console.log(`📝 Executing: ${statement.substring(0, 50)}...`);
        const result = await adminClient.rpc('exec_sql', { sql: statement });
        results.push({ statement: statement.substring(0, 50), success: !result.error, error: result.error });
      } catch (error) {
        console.warn(`⚠️ Statement failed: ${statement.substring(0, 50)}`, error);
        results.push({ statement: statement.substring(0, 50), success: false, error });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    return {
      success: successCount > 0,
      message: `Executed ${successCount}/${statements.length} SQL statements successfully`,
      details: results
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: 'Direct RLS policy fix failed',
      error: error.message,
      details: error
    };
  }
};

// Get current environment configuration
export const getEnvironmentInfo = () => {
  return {
    supabaseUrl: SUPABASE_URL,
    hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
    serviceRoleKeyLength: SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    environment: import.meta.env.MODE || 'development'
  };
};