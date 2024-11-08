// pages/api/favorites/count.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select('scenario_id');

    if (error) {
      console.error('Error fetching favorite counts:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const counts = data?.reduce((acc: Record<string, number>, curr) => {
      const scenarioId = curr.scenario_id;
      acc[scenarioId] = (acc[scenarioId] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ counts });
  } catch (error) {
    console.error('Unexpected error fetching favorite counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
