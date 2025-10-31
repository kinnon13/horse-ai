export async function callGrok(prompt: string): Promise<string> {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROK_API_KEY}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: 'grok-4-latest' }),
  });
  if (!res.ok) throw new Error('Grok failed');
  return (await res.json()).choices[0].message.content;
}

export async function callOpenAI(prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: 'gpt-4' }),
  });
  if (!res.ok) throw new Error('OpenAI failed');
  return (await res.json()).choices[0].message.content;
}

export async function callGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error('Gemini failed');
  return (await res.json()).candidates[0].content.parts[0].text;
}

export async function callPerplexity(prompt: string): Promise<string> {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: 'llama-3.1-sonar-large-128k-online' }),
  });
  if (!res.ok) throw new Error('Perplexity failed');
  return (await res.json()).choices[0].message.content;
}
