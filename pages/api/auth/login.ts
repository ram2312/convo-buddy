// pages/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client using the anon key for public requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a separate Supabase client for server-side (admin) operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    // Query the Supabase database for the user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single(); // Fetch a single user

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the password matches (assuming plain text, use bcrypt or other hashing for production)
    if (user.password === password) {
      // Redirect directly to the dashboard after successful login
      res.status(200).json({ message: "Login successful", email, redirectTo: "/dashboard" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
