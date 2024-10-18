import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client using the service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert the new user into the database
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([{ email, password, profile_completed: false }]);

    if (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }

    // Send back success response with the profile redirection URL
    res.status(201).json({ message: "Registration successful", email, redirectTo: "/profile" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
