import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function classifyEmail(subject: string, body: string) {
  const prompt = You are a strict classifier. Choose one of the labels exactly: Interested, Meeting Booked, Not Interested, Spam, Out of Office. Return only the label with no extra text.\n\nSubject: ${subject}\nBody: ${body};

  try {
    const resp = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      max_output_tokens: 30
    });
    // The new API returns structured output; extract text
    const output = resp.output?.[0]?.content?.[0]?.text || '';
    const label = output.trim().split('\n')[0].trim();
    const allowed = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];
    if (allowed.includes(label)) return label as (typeof allowed)[number];
    return 'Not Interested';
  } catch (err) {
    console.error('Classifier error', err);
    return 'Not Interested';
  }
}