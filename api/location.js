module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Get client IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    // Use ip-api.com (free, no key needed)
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon,city,status`);
    const data = await r.json();
    if (data.status === 'success') {
      res.json({ lat: data.lat, lng: data.lon, city: data.city });
    } else {
      res.status(400).json({ error: 'Location lookup failed' });
    }
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
