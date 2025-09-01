# 🚀 RLS Policy API Fix Guide

## Problem Overview
Budget PropFirms and Top PropFirms sections only load for admin users because of missing RLS (Row Level Security) policies. This guide shows how to fix it using API keys programmatically.

## Quick Solution Options

### Option 1: API Method (Recommended) ⚡
Use the admin panel to execute RLS policies via API.

#### Setup Steps:
1. **Get Service Role Key**:
   - Go to [Supabase Dashboard → Settings → API](https://app.supabase.com/project/jkiblofuayvdrrxbbhuu/settings/api)
   - Copy the **service_role** key (NOT the anon key)

2. **Configure Environment**:
   ```bash
   # Add to .env.local
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Execute Fix**:
   - Go to Admin Dashboard → Section Management
   - Use the "RLS Policy Executor" component
   - Click "Execute RLS Fix"

### Option 2: Manual SQL Method 📝
If API method doesn't work, use manual SQL execution.

#### Steps:
1. Go to [Supabase SQL Editor](https://app.supabase.com/project/jkiblofuayvdrrxbbhuu/sql)
2. Copy and paste this SQL:

```sql
-- Enable RLS on section tables
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;

-- Remove existing policies
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;

-- Create new public read policies
CREATE POLICY "allow_public_read_budget_prop" ON public.budget_prop FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_top5_prop" ON public.top5_prop FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_public_read_table_review_firms" ON public.table_review_firms FOR SELECT TO anon, authenticated USING (true);
```

3. Click "RUN" in the SQL editor
4. Refresh your application

## Files Created/Modified

### New Files:
- `src/utils/rlsPolicyExecutor.ts` - API execution utility
- `src/components/admin/RLSPolicyExecutor.tsx` - Admin UI component
- `.env.example` - Environment variable template

### Modified Files:
- `src/components/admin/DatabaseFixPanel.tsx` - Added API executor

## Security Notes ⚠️

**Service Role Key**:
- Has admin privileges
- Keep secure and never expose in client code
- Only use for server-side operations
- Store in environment variables

**Environment Variables**:
```bash
# Development
VITE_SUPABASE_SERVICE_ROLE_KEY=your_key_here

# Production (set in hosting platform)
VITE_SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

## Verification

After applying the fix:
1. ✅ Budget PropFirms section loads for all users
2. ✅ Top PropFirms section loads for all users  
3. ✅ Table Review continues to work
4. ✅ Admin functions remain secure

## How It Works

The fix creates RLS policies that allow both anonymous (`anon`) and authenticated users to read from the section tables:

- `budget_prop` table
- `top5_prop` table  
- `table_review_firms` table

This matches the pattern that already works for the Table Review section.

## Troubleshooting

**Service Role Key Issues**:
- Ensure key is set in environment variables
- Restart development server after adding key
- Check key has correct format (starts with `eyJ`)

**Still Not Working**:
- Try the manual SQL method
- Check browser console for errors
- Verify tables have data (add firms via admin panel)

**Empty Sections**:
- Use Admin Panel → Section Management to add firms
- Budget firms go to "Budget Firms" tab
- Top firms go to "Top 5 Firms" tab

## Support

If you encounter issues:
1. Check environment variables are set correctly
2. Try manual SQL method as fallback
3. Verify service role key permissions in Supabase dashboard
4. Check browser console for detailed error messages