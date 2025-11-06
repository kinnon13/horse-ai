// AI helper functions with HorseGPT system prompts

const SYSTEM_PROMPT = `You are HorseGPT, the world's most knowledgeable AI expert on horses and the equine industry. You provide expert advice on:

- ALL equine disciplines: barrel racing, dressage, reining, cutting, jumping, western pleasure, trail riding, endurance, racing, and more
- Horse training, behavior, and handling
- Horse health, veterinary care, nutrition, and supplements
- Breeding, genetics, and bloodlines
- Competition strategy and performance optimization
- Tack, equipment, and gear recommendations
- Buying, selling, and evaluating horses
- Barn management and horse care

You are helpful, knowledgeable, and conversational. You give practical, actionable advice. You NEVER claim to be any other AI (like "I'm Grok" or "I'm ChatGPT"). You are HorseGPT, period.

Answer questions directly and thoroughly. Be friendly but professional. If you don't know something specific, say so - but always provide the best guidance you can.`;

export async function callGrok(prompt: string, conversationHistory?: any[]): Promise<string> {
  // Build messages with conversation history
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  
  // Add previous conversation (last 10 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory.slice(-10))
  }
  
  // Add current prompt
  messages.push({ role: 'user', content: prompt })
  
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROK_API_KEY}` },
    body: JSON.stringify({ 
      messages,
      model: 'grok-2-1212',
      temperature: 0.7
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error('Grok error:', error);
    throw new Error(`Grok failed: ${error.error || res.statusText}`);
  }
  return (await res.json()).choices[0].message.content;
}

export async function callOpenAI(prompt: string, conversationHistory?: any[]): Promise<string> {
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory.slice(-10))
  }
  messages.push({ role: 'user', content: prompt })
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ 
      messages,
      model: 'gpt-4o',
      temperature: 0.7
    }),
  });
  if (!res.ok) throw new Error('OpenAI failed');
  return (await res.json()).choices[0].message.content;
}

export async function callGemini(prompt: string, conversationHistory?: any[]): Promise<string> {
  let fullPrompt = SYSTEM_PROMPT
  if (conversationHistory && conversationHistory.length > 0) {
    fullPrompt += '\n\nConversation:\n'
    conversationHistory.slice(-10).forEach(msg => {
      fullPrompt += `${msg.role}: ${msg.content}\n`
    })
  }
  fullPrompt += `\nUser: ${prompt}\n\nHorseGPT:`
  
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.7 }
    }),
  });
  if (!res.ok) throw new Error('Gemini failed');
  return (await res.json()).candidates[0].content.parts[0].text;
}

export async function callPerplexity(prompt: string, conversationHistory?: any[]): Promise<string> {
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory.slice(-10))
  }
  messages.push({ role: 'user', content: prompt })
  
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}` },
    body: JSON.stringify({ 
      messages,
      model: 'llama-3.1-sonar-large-128k-online',
      temperature: 0.7
    }),
  });
  if (!res.ok) throw new Error('Perplexity failed');
  return (await res.json()).choices[0].message.content;
}
