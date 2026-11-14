const fs = require('fs');
const content = fs.readFileSync('scratch/drive_decoded.txt', 'utf8');

// Parse drive items JSON structure
// Typically Google Drive folder items have [id, [parents], name, mimeType, description, ...]
const regex = /\["([0-9a-zA-Z_-]{25,})",\["([0-9a-zA-Z_-]{25,})"\],"([^"]+)",([0-9]+)/g;
let match;
const parsed = [];
while ((match = regex.exec(content)) !== null) {
  parsed.push({
    id: match[1],
    parent: match[2],
    name: match[3],
    type: match[4]
  });
}
console.log('Parsed count:', parsed.length);
console.log(parsed.slice(0, 15));
fs.writeFileSync('scratch/drive_items.json', JSON.stringify(parsed, null, 2), 'utf8');
