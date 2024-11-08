// pages/api/favorites/add.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, scenarioId } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert([{ user_email: email, scenario_id: scenarioId }]);

    if (error) {
      // Handle unique constraint violation (duplicate entry)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Favorite already exists' });
      }
      throw error;
    }

    res.status(200).json({ message: 'Favorite added successfully', data });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
