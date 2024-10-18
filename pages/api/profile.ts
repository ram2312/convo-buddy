// pages/api/profile/update.ts

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
  if (req.method === "GET") {
    const { email } = req.query;

    try {
      // Fetch user from the 'users' table based on email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    const { email, fullName, nickName, role, gender, language } = req.body;

    try {
      // Update the user's profile in the 'users' table
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          nick_name: nickName,
          role,
          gender,
          language,
        })
        .eq('email', email);

      if (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ error: "Failed to update profile" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
