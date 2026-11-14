const https = require('https');
const url = 'https://drive.google.com/drive/folders/1wQ4sRhAYt6udqjpeQjJqer0ZQtD68fql?usp=drive_link';

function get(u) {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirect to:', res.headers.location);
      get(res.headers.location);
      return;
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Received bytes:', data.length);
      const fs = require('fs');
      fs.writeFileSync('scratch/drive_response.html', data);
      const title = data.match(/<title>([^<]+)<\/title>/i);
      console.log('Title:', title ? title[1] : 'No title');
    });
  }).on('error', err => console.error(err));
}
get(url);
