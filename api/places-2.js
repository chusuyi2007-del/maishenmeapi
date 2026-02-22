module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const gKey = process.env.GOOGLE_PLACES_KEY;
  if (!gKey) return res.status(500).json({ error: 'Google key not configured' });

  let { lat, lng, keyword, radius = 5000 } = req.query;

  // Auto-detect location from IP if no coords provided
  if (!lat || !lng) {
    try {
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
      const ipRes = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon,city,status`);
      const ipData = await ipRes.json();
      if (ipData.status === 'success') {
        lat = ipData.lat;
        lng = ipData.lon;
      }
    } catch(e) {}
  }

  if (!lat || !lng) return res.status(400).json({ error: 'Could not determine location' });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword||'supermarket')}&key=${gKey}`;
    const r = await fetch(url);
    const data = await r.json();
    // Include detected coords in response
    res.json({ ...data, _lat: lat, _lng: lng });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
