module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini key not configured' });

  const { messages, system, max_tokens = 1200 } = req.body;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: Array.isArray(m.content)
      ? m.content.map(c => {
          if (c.type === 'text') return { text: c.text };
          if (c.type === 'image') return { inlineData: { mimeType: c.source.media_type, data: c.source.data } };
          return { text: '' };
        })
      : [{ text: m.content }]
  }));

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: { maxOutputTokens: max_tokens, temperature: 0.7 }
      })
    });
    const data = await r.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ content: [{ type: 'text', text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
