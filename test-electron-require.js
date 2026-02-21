// Test to understand how require('electron') works
const Module = require('module');

// Check if _resolveFilename is patched
const resolveStr = Module._resolveFilename.toString();
console.log('_resolveFilename looks patched:', resolveStr.includes('electron'));
console.log('_resolveFilename first 200 chars:', resolveStr.substring(0, 200));

// Check cache
console.log('Module._cache has electron:', 'electron' in Module._cache);
if (Module._cache['electron']) {
    const cached = Module._cache['electron'];
    console.log('Cached module id:', cached.id);
    console.log('Cached module loaded:', cached.loaded);
    console.log('Cached module filename:', cached.filename);
}

// Check process.type 
console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);

// Try to resolve electron
try {
    const resolved = Module._resolveFilename('electron', module);
    console.log('Resolved electron to:', resolved);
} catch (e) {
    console.log('Resolve error:', e.message);
}

// Try requiring
try {
    const electron = require('electron');
    console.log('typeof electron:', typeof electron);
    if (typeof electron === 'string') {
        console.log('ERROR: Got path string:', electron);
    } else {
        console.log('typeof electron.app:', typeof electron.app);
        if (electron.app) {
            console.log('SUCCESS!');
            electron.app.quit();
        }
    }
} catch (e) {
    console.log('Require error:', e.message);
}

// Force quit
setTimeout(() => process.exit(0), 1000);
