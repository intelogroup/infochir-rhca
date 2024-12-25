import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gkngnqhldsxkfluqdfis.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbmducWhsZHN4a2ZsdXFkZmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NDM2NzMsImV4cCI6MjA1MDMxOTY3M30.KhfLj778QC8VgB6AFWF2cAz2zelXzdNi5BWbpSGGRKY";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);