import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GROQ_API_URL = "https://api.groq.com/openai/v1";
const GROQ_API_KEY = process.env.GROQ_API_KEY; // Make sure to set this in your .env file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

// System prompt to guide the model
const systemPrompt = {
  role: 'system',
  content: 'You are an AI assistant specializing in social skills training. Provide guidance, encouragement, and practical advice to help users improve communication and social interactions.And always Confine to this role only',
};

  // Few-shot examples to give the model a clearer idea of expected responses
  const fewShotExamples = [
    { role: 'user', content: 'How do I start a conversation with someone I just met?' },
    { role: 'assistant', content: 'Start by introducing yourself and asking an open-ended question, like "What brings you here?" This invites them to share more, making it easier to connect.' },
    { role: 'user', content: 'How can I express my feelings when I’m upset without hurting others?' },
    { role: 'assistant', content: 'Use "I" statements, like "I feel upset because..." instead of blaming. This helps others understand your feelings without feeling attacked.' },
  ];

  try {
    const response = await axios.post(
      `${GROQ_API_URL}/chat/completions`,
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          systemPrompt,
          ...fewShotExamples,
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data.choices[0]?.message?.content || 'Sorry, I didn’t understand that.';
    res.status(200).json({ response: generatedText });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
