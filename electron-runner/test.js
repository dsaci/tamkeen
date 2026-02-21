// Minimal test to check if require('electron') works correctly
try {
    const electron = require('electron');
    console.log('electron type:', typeof electron);
    console.log('has app:', typeof electron.app);
    if (typeof electron === 'string') {
        console.log('ERROR: electron resolved to path string:', electron);
    } else if (electron.app) {
        console.log('SUCCESS: electron module loaded correctly');
        console.log('app.name:', electron.app.name);
        electron.app.quit();
    } else {
        console.log('keys:', Object.keys(electron));
    }
} catch (e) {
    console.log('ERROR loading electron:', e.message);
}
