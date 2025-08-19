import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

export async function getAiAdvice({ prompt, context }) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  const systemPrimer = `
You are "Ava", an AI avatar for a group discussion practice app (like Google Meet).
Speak concisely and constructively. Only answer the user's question; do not
interject unprompted. If asked for tips, analyze the recent chat and participation
summary to suggest actionable improvements (e.g., structuring arguments, clarity,
asking follow-ups, time management, inclusivity). Prefer bullet points.
`;

  const recentChatText = (context?.recentChat || [])
    .slice(-30)
    .map(m => `[${new Date(m.ts).toLocaleTimeString()}] ${m.name}: ${m.message}`)
    .join('\n');

  const speakersText = Object.entries(context?.speakers || {})
    .map(([name, count]) => `${name}: ${count} message(s)`)
    .join('\n');

  const userPrompt = `
User question: ${prompt}

Context:
- Room: ${context?.roomId || 'unknown'}
- Recent chat (last ~30): 
${recentChatText || '(no chat yet)'}
- Participation (approx by chat count):
${speakersText || '(no data)'}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: systemPrimer.trim() }] },
      { role: 'user', parts: [{ text: userPrompt.trim() }] }
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.95,
      maxOutputTokens: 600
    }
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Gemini error ${r.status}: ${text}`);
  }
  const data = await r.json();
  // Extract text safely
  const text =
    data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Sorry — I could not generate a response.';
  return text;
}
