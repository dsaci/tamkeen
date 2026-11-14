const fs = require('fs');
const html = fs.readFileSync('scratch/drive_response.html', 'utf8');

// Search for JSON blocks or data arrays
// In Google Drive folder view, files are often stored in window['_DRIVE_ivd'] or similar
const matches = [];
// Match unicode-escaped strings or Arabic characters
const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\w\s\.\-_()]{4,100}/g;

// Let's find all occurrences of strings ending with typical file extensions or folder structures
const driveDataMatch = html.match(/_DRIVE_ivd\s*=\s*'([^']+)'/) || html.match(/window\[\'_DRIVE_ivd\'\]\s*=\s*'([^']+)'/);
if (driveDataMatch) {
    console.log("Found _DRIVE_ivd, length:", driveDataMatch[1].length);
    const decoded = driveDataMatch[1].replace(/\\x([0-9A-Fa-f]{2})/g, (m, c) => String.fromCharCode(parseInt(c, 16)))
                                     .replace(/\\u([0-9A-Fa-f]{4})/g, (m, c) => String.fromCharCode(parseInt(c, 16)));
    fs.writeFileSync('scratch/drive_decoded.txt', decoded);
} else {
    console.log("No _DRIVE_ivd directly found, searching for JSON strings...");
}

// Search for file items by regex in html
const fileRegex = /"([0-9a-zA-Z_-]{20,})",\["([0-9a-zA-Z_-]{20,})"\]/g;
// Search for filenames
const names = new Set();
const pattern = /"([^"\\]+\.(?:pdf|docx?|pptx?|xlsx?|txt|zip|rar|mp4|png|jpg))"/gi;
let m;
while ((m = pattern.exec(html)) !== null) {
    names.add(m[1]);
}

// Also check folder names or titles
const folderPattern = /\["([0-9a-zA-Z_-]{25,})",\[\],"[^"]*","([^"]+)"/g;
const folders = [];
while ((m = folderPattern.exec(html)) !== null) {
    folders.push({ id: m[1], name: m[2] });
}

console.log("Found files:", names.size);
console.log(Array.from(names));
console.log("Found folders:", folders);
