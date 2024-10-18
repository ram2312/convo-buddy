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

  const { id, fullName, nickName, role, gender, language } = req.body; // Remove unused `email`

  try {
    // Ensure id is provided and is an integer
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Update the user profile in the database
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        full_name: fullName,
        nick_name: nickName,
        role,
        gender,
        language
      })
      .eq('id', id);  // Ensure you use integer comparison for the 'id'

    if (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
