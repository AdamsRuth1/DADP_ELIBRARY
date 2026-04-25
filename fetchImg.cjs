const https = require('https');

const options = {
  hostname: 'en.wikipedia.org',
  path: '/w/api.php?action=query&list=allimages&aiprefix=Nigerian_Army&format=json',
  headers: { 'User-Agent': 'AntigravityAgent/1.0 (test@example.com)' }
};

https.get(options, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
        let json = JSON.parse(d);
        console.log(json.query.allimages.map(i => i.url));
    } catch(e) { console.log(d); }
  });
});
