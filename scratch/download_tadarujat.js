const https = require('https');
const fs = require('fs');

function downloadDriveFile(fileId, destPath) {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    function fetchUrl(u, redirects = 0) {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed with status ${res.statusCode}`));
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const stats = fs.statSync(destPath);
            console.log(`Downloaded ${fileId} -> ${destPath} (${stats.size} bytes)`);
            resolve(stats.size);
          });
        });
      }).on('error', reject);
    }
    fetchUrl(url);
  });
}

downloadDriveFile('11__eLs-D9hNVSGIyXV2m0Vo280Mzhu9D', 'scratch/tadarujat_2022.zip')
  .then(() => console.log('Tadarujat downloaded!'))
  .catch(err => console.error(err));
