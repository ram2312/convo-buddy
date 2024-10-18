import { createClient } from '@supabase/supabase-js';

// Ensure the environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Public client for client-side access (anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Service key for server-side (admin privileges)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client for client-side (anonymous key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client for server-side operations (service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
