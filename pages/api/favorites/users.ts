import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Define the structure of a favorite item
interface Favorite {
  scenario_id: number; // Change this to your actual data type
}

// Define the response structure
interface FavoritesResponse {
  favorites: Favorite[];
  count: number; // Count of favorites
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<FavoritesResponse | { error: string }>) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email provided." });
  }

  try {
    // Fetch only scenario IDs from the favorites table
    const { data, error } = await supabaseAdmin
      .from("favorites")
      .select("scenario_id")
      .eq("user_email", email);

    if (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ error: "Database fetch error" });
    }

    // Map the scenario IDs and return them
    const userFavorites = (data || []).map((fav: Favorite) => ({
      scenario_id: fav.scenario_id, // Return only the scenario_id
    }));

    // Count of favorites
    const count = userFavorites.length;

    return res.status(200).json({ favorites: userFavorites, count });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
