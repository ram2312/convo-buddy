import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, scenarioId } = req.body;

  try {
    console.log(`Received email: ${email}, Scenario ID: ${scenarioId}`);

    // Fetch user ID using email
    const { data: user, error: userFetchError } = await supabaseAdmin
      .from('users')
      .select('id, scenarios_completed')
      .eq('email', email)
      .single();

    if (userFetchError || !user) {
      console.error('Error fetching user ID:', userFetchError);
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user.id;
    const currentScenariosCompleted = user.scenarios_completed || 0;

    // Check if the scenario has already been completed
    const { data: completedScenario, error: completionCheckError } = await supabaseAdmin
      .from('completed_scenarios')
      .select('id')
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId)
      .single();

    if (completionCheckError && completionCheckError.code !== 'PGRST116') {
      console.error('Error checking scenario completion:', completionCheckError);
      return res.status(500).json({ error: 'Error checking scenario completion' });
    }

    // If the scenario is already completed, return early
    if (completedScenario) {
      return res.status(200).json({ message: 'Scenario already completed' });
    }

    // Insert the completion record into the 'completed_scenarios' table
    const { error: insertError } = await supabaseAdmin
      .from('completed_scenarios')
      .insert([
        { user_id: userId, email, scenario_id: scenarioId, completed_at: new Date() },
      ]);

    if (insertError) {
      console.error('Error marking scenario as complete:', insertError);
      return res.status(500).json({ error: 'Failed to mark scenario as complete' });
    }

    // Increment the 'scenarios_completed' count in the 'users' table
    const updatedScenariosCompleted = currentScenariosCompleted + 1;

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ scenarios_completed: updatedScenariosCompleted })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating scenarios_completed count:', updateError);
      return res.status(500).json({ error: "Failed to update user's scenario completion count" });
    }

    res.status(200).json({ message: 'Scenario marked as complete and user progress updated' });
  } catch (error) {
    console.error('Scenario completion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
