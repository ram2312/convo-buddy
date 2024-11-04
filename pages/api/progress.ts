import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email parameter" });
  }

  try {
    // Fetch user ID and role based on email
    const { data: user, error: userFetchError } = await supabaseAdmin
      .from("users")
      .select("id, role") // Select both id and role
      .eq("email", email)
      .single();

    if (userFetchError || !user) {
      console.error("Error fetching user:", userFetchError);
      return res.status(404).json({ error: "User not found" });
    }

    const { id: userId, role } = user;

    // Fetch the count of completed scenarios for this user
    const { count, error: countError } = await supabaseAdmin
      .from("completed_scenarios")
      .select("id", { count: "exact" })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error fetching completed scenarios count:", countError);
      return res.status(500).json({ error: "Failed to fetch completed scenarios" });
    }

    // Return the count of completed scenarios and the user's role
    res.status(200).json({ scenariosCompleted: count, role });
  } catch (error) {
    console.error("Progress fetching error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
