import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// These should be set in your environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jkiblofuayvdrrxbbhuu.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraWJsb2Z1YXl2ZHJyeGJiaHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODE0MjAsImV4cCI6MjA2Njc1NzQyMH0.p18BeXmlbh_5RPF54KF0yahyJ0fCC17GOOHk4bE2wLg";

// Create the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});