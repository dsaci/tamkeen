const https = require('https');
const fs = require('fs');

const subfolders = [
  { id: '1tSwRMLQ6RO05qb4LMqE6_fPR3x6UFMgQ', name: 'س1 ثانوي' },
  { id: '1_SR84EXESBqBk-sUAdBVTvH108FTkn69', name: 'س2 ثانوي' },
  { id: '1zPuxvHU61RqTGxkVq_jL4HVzpaqaOx9u', name: 'س3 ثانوي' },
  { id: '1VKhvxIuSgd9vsAUU7hGSAwpPiYFNC9TS', name: 'البلاغة' },
  { id: '1QcQr_s7koLYNyAKKf6C6XJJZ2JQ0T4ge', name: 'التعليمية' }
];

async function fetchFolder(f) {
  return new Promise((resolve) => {
    const url = `https://drive.google.com/drive/folders/${f.id}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const driveDataMatch = data.match(/_DRIVE_ivd\s*=\s*'([^']+)'/) || data.match(/window\[\'_DRIVE_ivd\'\]\s*=\s*'([^']+)'/);
        const files = [];
        if (driveDataMatch) {
          const decoded = driveDataMatch[1].replace(/\\x([0-9A-Fa-f]{2})/g, (m, c) => String.fromCharCode(parseInt(c, 16)))
                                           .replace(/\\u([0-9A-Fa-f]{4})/g, (m, c) => String.fromCharCode(parseInt(c, 16)));
          const regex = /\["([0-9a-zA-Z_-]{20,})",\["([0-9a-zA-Z_-]{20,})"\],"([^"\\]*(?:\\.[^"\\]*)*)","([^"\\]*(?:\\.[^"\\]*)*)"/g;
          let m;
          while ((m = regex.exec(decoded)) !== null) {
            files.push({
              id: m[1],
              name: m[3].replace(/\\\//g, '/').replace(/\\"/g, '"'),
              mimeType: m[4].replace(/\\\//g, '/')
            });
          }
        }
        console.log(`Folder [${f.name}] has ${files.length} items`);
        resolve({ folder: f.name, id: f.id, files });
      });
    }).on('error', () => resolve({ folder: f.name, id: f.id, files: [] }));
  });
}

async function main() {
  const allResults = [];
  for (const sf of subfolders) {
    const r = await fetchFolder(sf);
    allResults.push(r);
  }
  fs.writeFileSync('scratch/subfolders_files.json', JSON.stringify(allResults, null, 2), 'utf8');
}
main();
