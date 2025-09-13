import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use the actual Supabase project configuration
const SUPABASE_URL = 'https://wiqcawxfidobsbfgpboa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcWNhd3hmaWRvYnNiZmdwYm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDgwMTcsImV4cCI6MjA2NTg4NDAxN30.Di_s4Cx8yQrvSe7oY0oKIgTETRdloD0bwVs7ivNvX4c';

// Create the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});