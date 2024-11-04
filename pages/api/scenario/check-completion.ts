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
      .from('completed_scenarios')
      .select('id')
      .eq('email', email)
      .eq('scenario_id', scenarioId)
      .single(); // Use 'single' to expect only one result

    // If no row found, it means the scenario is not completed
    if (error && error.code === 'PGRST116') {
      return res.status(200).json({ alreadyCompleted: false });
    }

    // If row found, the scenario is completed
    if (data) {
      return res.status(200).json({ alreadyCompleted: true });
    }

    // Handle other errors
    if (error) {
      return res.status(500).json({ error: 'Error checking scenario completion' });
    }
  } catch (error) {
    console.error('Scenario completion check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
