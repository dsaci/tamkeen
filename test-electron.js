const electron = require('electron');
console.log('Electron export type:', typeof electron);
console.log('Electron export:', electron);
console.log('Process versions:', process.versions);

if (typeof electron === 'string') {
    console.error('FAILURE: Electron exported a string (path) instead of the API object.');
} else {
    console.log('SUCCESS: Electron API loaded.');
}
