console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);
const { app, BrowserWindow } = require('electron');
console.log('app:', typeof app);
console.log('BrowserWindow:', typeof BrowserWindow);
app.whenReady().then(() => {
    console.log('App is ready!');
    app.quit();
});
