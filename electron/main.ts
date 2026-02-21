/**
 * Electron Main Process
 * Entry point for the desktop application
 */

// Diagnostic: Check if Electron's init has set up the environment
const _Module = require('module');
console.log('[DIAG] process.type:', process.type);
console.log('[DIAG] _resolveFilename patched:', _Module._resolveFilename.toString().includes('electron'));
console.log('[DIAG] _cache has electron:', 'electron' in _Module._cache);
console.log('[DIAG] process.resourcesPath:', process.resourcesPath);

import { app, BrowserWindow, ipcMain, type IpcMainInvokeEvent } from 'electron';
import path from 'path';
import { initDatabase, closeDatabase, queryAll, runStatement, saveDatabase } from './database/db';
import * as authService from './services/auth.service';
import * as journalService from './services/journal.service';
import * as adminService from './services/admin.service';
import * as syncService from './services/sync.service';
import * as studentService from './services/student.service';
import * as gradingService from './services/grading.service';
import * as repositoryService from './services/repository.service';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app?.isPackaged;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        },
        icon: path.join(__dirname, '../public/icon.ico'),
        show: false,
        titleBarStyle: 'default',
        autoHideMenuBar: true
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Register IPC handlers
function registerIpcHandlers(): void {
    // === AUTH HANDLERS ===
    ipcMain.handle('auth:login', async (_: IpcMainInvokeEvent, email: string, password: string) => {
        return authService.login(email, password);
    });

    ipcMain.handle('auth:register', async (_: IpcMainInvokeEvent, data: any) => {
        return authService.register(data);
    });

    ipcMain.handle('auth:logout', async () => {
        authService.logout();
    });

    ipcMain.handle('auth:getSession', async () => {
        return authService.getCurrentSession();
    });

    ipcMain.handle('auth:updateProfile', async (_: IpcMainInvokeEvent, userId: string, metadata: any) => {
        return authService.updateProfile(userId, metadata);
    });

    ipcMain.handle('auth:getAllUsers', async () => {
        return authService.getAllUsers();
    });

    ipcMain.handle('auth:isAdmin', async (_: IpcMainInvokeEvent, userId: string) => {
        return authService.isAdmin(userId);
    });

    ipcMain.handle('auth:googleLogin', async (_: IpcMainInvokeEvent, user: any) => {
        return authService.googleLogin(user);
    });

    // === JOURNAL HANDLERS ===
    ipcMain.handle('journal:getDaily', async (_: IpcMainInvokeEvent, teacherId: string, date: string) => {
        return journalService.getDailyJournal(teacherId, date);
    });

    ipcMain.handle('journal:addSession', async (_: IpcMainInvokeEvent, teacherId: string, date: string, session: any) => {
        return journalService.addSession(teacherId, date, session);
    });

    ipcMain.handle('journal:updateSession', async (_: IpcMainInvokeEvent, sessionId: string, session: any) => {
        return journalService.updateSession(sessionId, session);
    });

    ipcMain.handle('journal:deleteSession', async (_: IpcMainInvokeEvent, sessionId: string) => {
        return journalService.deleteSession(sessionId);
    });

    ipcMain.handle('journal:getTeacherJournals', async (_: IpcMainInvokeEvent, teacherId: string) => {
        return journalService.getTeacherJournals(teacherId);
    });

    // === ADMIN HANDLERS ===
    ipcMain.handle('admin:importData', async (_: IpcMainInvokeEvent, data: any) => {
        return adminService.importTeacherData(data);
    });

    // === STUDENT HANDLERS ===
    ipcMain.handle('student:getAll', async (_: IpcMainInvokeEvent, teacherId: string, grade?: string, group?: string) => {
        return studentService.getStudents(teacherId, grade, group);
    });

    ipcMain.handle('student:add', async (_: IpcMainInvokeEvent, student: any) => {
        return studentService.addStudent(student);
    });

    ipcMain.handle('student:update', async (_: IpcMainInvokeEvent, id: string, student: any) => {
        return studentService.updateStudent(id, student);
    });

    ipcMain.handle('student:delete', async (_: IpcMainInvokeEvent, id: string) => {
        return studentService.deleteStudent(id);
    });

    // === GRADING HANDLERS ===
    ipcMain.handle('grading:get', async (_: IpcMainInvokeEvent, teacherId: string, subject: string, term: string, grade?: string, group?: string) => {
        return gradingService.getGrades(teacherId, subject, term, grade, group);
    });

    ipcMain.handle('grading:save', async (_: IpcMainInvokeEvent, gradeData: any) => {
        return gradingService.saveGrade(gradeData);
    });

    // === DATABASE HANDLERS ===
    ipcMain.handle('db:query', async (_: IpcMainInvokeEvent, sql: string, params: any[] = []) => {
        try {
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                return queryAll(sql, params);
            } else {
                runStatement(sql, params);
                return { success: true };
            }
        } catch (error: any) {
            console.error('[DB] Query error:', error);
            throw error;
        }
    });

    // === APP HANDLERS ===
    ipcMain.handle('app:getVersion', async () => {
        return app.getVersion();
    });

    ipcMain.handle('app:getPath', async (_: IpcMainInvokeEvent, name: string) => {
        return app.getPath(name as any);
    });

    // === SYNC HANDLERS ===
    ipcMain.handle('sync:getPending', async () => {
        return syncService.getPendingSyncItems();
    });

    ipcMain.handle('sync:clearPending', async (_: IpcMainInvokeEvent, ids: number[]) => {
        return syncService.removeSyncItems(ids);
    });

    // === REPOSITORY HANDLERS ===
    ipcMain.handle('repository:getWilayas', async () => {
        return repositoryService.getAllWilayas();
    });

    ipcMain.handle('repository:getCurriculum', async (_: IpcMainInvokeEvent, yearId: string, streamId?: string) => {
        return repositoryService.getCurriculum(yearId, streamId);
    });
}

// App lifecycle
app.whenReady().then(async () => {
    // Initialize database (async for sql.js)
    console.log('[App] Initializing database...');
    await initDatabase();

    // Initialize Repository (Seed Data)
    console.log('[App] Initializing Knowledge Repository...');
    await repositoryService.initializeRepository();

    // Register IPC handlers
    registerIpcHandlers();

    // Create window
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        closeDatabase();
        app.quit();
    }
});

app.on('before-quit', () => {
    closeDatabase();
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (_: Electron.Event, contents: Electron.WebContents) => {
    contents.on('will-navigate', (event: Electron.Event, url: string) => {
        if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
            event.preventDefault();
        }
    });
});
