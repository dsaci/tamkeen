const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the electron executable path directly from the project root
const electronExe = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe');

let electronPath;
if (fs.existsSync(electronExe)) {
    electronPath = electronExe;
} else {
    // Check if it's in the global path or elsewhere (fallback)
    console.warn('Local electron.exe not found, trying global or fallback locations...');
    // You might want to add other checks here if needed, or just fail
    console.error('Could not find electron.exe in node_modules/electron/dist/');
    process.exit(1);
}

console.log('Starting Electron from:', electronPath);
console.log('Project directory:', __dirname);

const env = { ...process.env };

// CRITICAL: Ensure we do NOT run as Node. This env var might be set by some tools or previous sessions.
delete env.ELECTRON_RUN_AS_NODE;

// CRITICAL: Pass the project directory (.) to electron.exe, NOT the main.js file directly.
// Electron needs to load the project's package.json to properly initialize
// the app context (including process.type = 'browser' and the require('electron') hook).
// The package.json's "main" field tells Electron which file to load as the main process script.
const child = spawn(electronPath, [__dirname], { env, stdio: 'inherit' });

child.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    process.exit(code);
});

const handleTerminationSignal = (signal) => {
    process.on(signal, () => {
        if (!child.killed) {
            child.kill(signal);
        }
    });
};

handleTerminationSignal('SIGINT');
handleTerminationSignal('SIGTERM');
