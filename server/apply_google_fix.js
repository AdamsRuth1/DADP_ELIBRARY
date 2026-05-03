const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');
const lines = c.split(/\r?\n/);

// Helper to find a handler block
function replaceHandler(startMarker, endMarker, replacement) {
  const startIdx = lines.findIndex(l => l.includes(startMarker));
  if (startIdx === -1) {
    console.error('Start marker not found:', startMarker);
    return false;
  }
  
  const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes(endMarker));
  if (endIdx === -1) {
    console.error('End marker not found:', endMarker);
    return false;
  }
  
  lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
  return true;
}

const cacheInit = [
  "// In-memory cache for Google Books results to prevent rate limiting",
  "const googleBooksCache = new Map();",
  "const CACHE_TTL = 10 * 60 * 1000; // 10 minutes",
  ""
];

// Add cache init before the route
const routeIdx = lines.findIndex(l => l.includes("app.get('/api/google-books'"));
if (routeIdx !== -1) {
  lines.splice(routeIdx, 0, ...cacheInit);
}

const googleBooksReplacement = [
  "app.get('/api/google-books', async (req, res) => {",
  "  const query = req.query.q;",
  "  const maxResults = req.query.maxResults || 12;",
  "",
  "  if (!query) {",
  "    return res.status(400).json({ error: 'Query parameter q is required' });",
  "  }",
  "",
  "  // Check cache",
  "  const cacheKey = `${query}_${maxResults}`;",
  "  const cached = googleBooksCache.get(cacheKey);",
  "  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {",
  "    console.log('Serving Google Books result from cache:', query);",
  "    return res.json(cached.data);",
  "  }",
  "",
  "  try {",
  "    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;",
  "    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;",
  "    if (apiKey) url += `&key=${apiKey}`;",
  "",
  "    const response = await fetch(url);",
  "",
  "    if (!response.ok) {",
  "      if (response.status === 429) {",
  "        return res.status(429).json({ error: 'Google Books API rate limit reached. Please wait a minute and try again.' });",
  "      }",
  "      throw new Error(`Google Books API error: ${response.status}`);",
  "    }",
  "",
  "    const data = await response.json();",
  "    ",
  "    // Store in cache",
  "    googleBooksCache.set(cacheKey, {",
  "      data,",
  "      timestamp: Date.now()",
  "    });",
  "",
  "    res.json(data);",
  "  } catch (err) {",
  "    console.error('Google Books proxy error:', err);",
  "    res.status(500).json({ error: 'Failed to fetch from Google Books' });",
  "  }",
  "});"
];

replaceHandler("app.get('/api/google-books'", "res.status(500).json({ error: 'Failed to fetch from Google Books' });", googleBooksReplacement);

fs.writeFileSync('app.js', lines.join('\n'));
console.log('Google Books fix complete');
