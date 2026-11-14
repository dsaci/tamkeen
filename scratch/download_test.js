const https = require('https');
const fs = require('fs');

function downloadDriveFile(fileId, destPath) {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
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

async function test() {
  try {
    // Test download docx card: 1fhDmYELgeUkV6T-j3mnwDJOLUfIyZFq4
    await downloadDriveFile('1fhDmYELgeUkV6T-j3mnwDJOLUfIyZFq4', 'scratch/sample_card.docx');
    console.log('Sample card downloaded successfully!');
  } catch (err) {
    console.error('Download error:', err.message);
  }
}
test();
