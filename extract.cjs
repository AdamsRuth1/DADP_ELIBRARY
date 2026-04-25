const fs = require('fs');
const html = fs.readFileSync('search.html', 'utf8');
const match = html.match(/src="([^"]+\.jpg|[^"]+\.jpeg)"/i) || html.match(/src="(\/\/external[^\"]+)"/i);
console.log(match ? match[1] : "No match found");
