const electron = require('electron');
console.log('Electron require type:', typeof electron);
console.log('Electron keys:', Object.keys(electron));

if (typeof electron === 'string') {
    console.error('FAIL: Electron is a string (path).');
    process.exit(1);
} else {
    console.log('SUCCESS: Electron is an object.');
    const { app } = electron;
    console.log('App version:', app.getVersion());
    app.quit();
}
