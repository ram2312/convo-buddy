import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, scenarioId } = req.body;

  if (!email || !scenarioId) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  try {
    const { error } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("user_email", email)
      .eq("scenario_id", scenarioId);

    if (error) {
      console.error("Error removing favorite:", error);
      return res.status(500).json({ error: "Database delete error" });
    }

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
