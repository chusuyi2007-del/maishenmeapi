const express = require('express');
const path = require('path');
// v2
const app = express();

// CORS headers for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '10mb' }));

// ── Serve static files (HTML, SW, manifest, icons) ──
app.use(express.static(path.join(__dirname, 'public')));

// ── Anthropic API 代理 ──
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: req.body.model || 'claude-sonnet-4-20250514',
        max_tokens: req.body.max_tokens || 1200,
        system: req.body.system,
        messages: req.body.messages,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Google Places API 代理 ──
app.get('/api/places/nearby', async (req, res) => {
  const gKey = process.env.GOOGLE_PLACES_KEY;
  if (!gKey) return res.status(500).json({ error: 'Google key not configured' });
  const { lat, lng, keyword, radius = 5000 } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat/lng required' });
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword||'supermarket')}&key=${gKey}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Google Places 详情 ──
app.get('/api/places/details', async (req, res) => {
  const gKey = process.env.GOOGLE_PLACES_KEY;
  if (!gKey) return res.status(500).json({ error: 'Google key not configured' });
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: 'place_id required' });
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_address,opening_hours,website&key=${gKey}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 健康检查 ──
app.get('/health', (req, res) => res.json({ status: 'ok', name: 'MaiShenMe API' }));

// ── Fallback to index.html for SPA ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MaiShenMe running on port ${PORT}`));
