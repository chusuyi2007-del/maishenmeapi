export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

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
}
