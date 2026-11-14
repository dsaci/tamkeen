const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDocs = [
  { id: '1YimvW2MFmutxf_dzyB49Mk-ob3u8mija', name: 'منهاج_س1_ثانوي.doc' },
  { id: '11S4FCt2TPzW3H0xr8Vi1pOtTxX9Br9T7', name: 'دليل_آداب_س1.doc' },
  { id: '1YqYY_O750Hbc1UYpAgA5T2fZo5PsUurB', name: 'دليل_علوم_تكنولوجية_س1.doc' },
  { id: '1sCf9IiMTqsun0iA0y3x4eay3re607xIo', name: 'منهاج_س2_أدب_وفلسفة.doc' },
  { id: '16scr2eLvgUi2rT26GK8SAZ85DepHaP5H', name: 'منهاج_س2_علوم_ورياضيات.doc' },
  { id: '1vs62BhBu52Ral7QcI3FXwwf36i7eD_Up', name: 'منهاج_س3_شعب_علمية.doc' },
  { id: '1rzNx_Ecadghj7PCeWiLoJ7Smvm_r9h29', name: 'منهاج_س3_آداب_وفلسفة_ولغات.doc' },
  { id: '1ttr5BUphdZHu_mt2Mm5MmMAVZnr65Ex1', name: 'الوثيقة_المرافقة_س3_جميع_الشعب.doc' },
  { id: '12_3K8cJw2InSBe_ygsSpGvrVX5W8mD2D', name: 'رزنامة_الندوات.docx' }
];

const destDir = path.join(__dirname, 'curriculum_docs');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

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

async function run() {
  for (const item of targetDocs) {
    const p = path.join(destDir, item.name);
    try {
      await downloadDriveFile(item.id, p);
    } catch(e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}
run();
