const fs = require('fs');
const content = fs.readFileSync('scratch/drive_decoded.txt', 'utf8');

// Match ["id", ["parentId"], "name", "mimeType", ...
const regex = /\["([0-9a-zA-Z_-]{20,})",\["([0-9a-zA-Z_-]{20,})"\],"([^"\\]*(?:\\.[^"\\]*)*)","([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;
const parsed = [];
while ((match = regex.exec(content)) !== null) {
  const name = match[3].replace(/\\\//g, '/').replace(/\\"/g, '"');
  const mimeType = match[4].replace(/\\\//g, '/');
  parsed.push({
    id: match[1],
    parentId: match[2],
    name: name,
    mimeType: mimeType
  });
}

console.log('Total files found:', parsed.length);
parsed.forEach((f, idx) => {
  console.log(`${idx + 1}. [${f.id}] ${f.name} (${f.mimeType})`);
});

fs.writeFileSync('scratch/drive_files_list.json', JSON.stringify(parsed, null, 2), 'utf8');
