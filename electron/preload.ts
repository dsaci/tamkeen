/**
 * Electron Preload Script
 * Exposes secure IPC bridge to renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose electronAPI to renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Auth methods
    auth: {
        login: (email: string, password: string) =>
            ipcRenderer.invoke('auth:login', email, password),

        register: (data: { email: string; password: string; fullName: string; metadata: any }) =>
            ipcRenderer.invoke('auth:register', data),

        logout: () =>
            ipcRenderer.invoke('auth:logout'),

        getSession: () =>
            ipcRenderer.invoke('auth:getSession'),

        updateProfile: (userId: string, metadata: any) =>
            ipcRenderer.invoke('auth:updateProfile', userId, metadata),

        getAllUsers: () =>
            ipcRenderer.invoke('auth:getAllUsers'),

        isAdmin: (userId: string) =>
            ipcRenderer.invoke('auth:isAdmin', userId),

        googleLogin: (user: any) =>
            ipcRenderer.invoke('auth:googleLogin', user)
    },

    // Journal methods
    journal: {
        getDaily: (teacherId: string, date: string) =>
            ipcRenderer.invoke('journal:getDaily', teacherId, date),

        addSession: (teacherId: string, date: string, session: any) =>
            ipcRenderer.invoke('journal:addSession', teacherId, date, session),

        updateSession: (sessionId: string, session: any) =>
            ipcRenderer.invoke('journal:updateSession', sessionId, session),

        deleteSession: (sessionId: string) =>
            ipcRenderer.invoke('journal:deleteSession', sessionId),

        getTeacherJournals: (teacherId: string) =>
            ipcRenderer.invoke('journal:getTeacherJournals', teacherId)
    },

    // Database utilities
    db: {
        query: (sql: string, params?: any[]) =>
            ipcRenderer.invoke('db:query', sql, params)
    },

    // Admin methods
    admin: {
        importData: (data: any) => ipcRenderer.invoke('admin:importData', data)
    },

    // Student methods
    student: {
        getAll: (teacherId: string, grade?: string, group?: string) =>
            ipcRenderer.invoke('student:getAll', teacherId, grade, group),
        add: (student: any) => ipcRenderer.invoke('student:add', student),
        update: (id: string, student: any) => ipcRenderer.invoke('student:update', id, student),
        delete: (id: string) => ipcRenderer.invoke('student:delete', id)
    },

    // Grading methods
    grading: {
        get: (teacherId: string, subject: string, term: string, grade?: string, group?: string) =>
            ipcRenderer.invoke('grading:get', teacherId, subject, term, grade, group),
        save: (gradeData: any) => ipcRenderer.invoke('grading:save', gradeData)
    },

    // App info
    app: {
        getVersion: () => ipcRenderer.invoke('app:getVersion'),
        getPath: (name: string) => ipcRenderer.invoke('app:getPath', name)
    },

    // Sync
    sync: {
        getPending: () => ipcRenderer.invoke('sync:getPending'),
        clearPending: (ids: number[]) => ipcRenderer.invoke('sync:clearPending', ids)
    },

    // Repository
    repository: {
        getWilayas: () => ipcRenderer.invoke('repository:getWilayas'),
        getCurriculum: (yearId: string, streamId?: string) => ipcRenderer.invoke('repository:getCurriculum', yearId, streamId)
    }
});

// TypeScript declarations for renderer
declare global {
    interface Window {
        electronAPI: {
            auth: {
                login: (email: string, password: string) => Promise<any>;
                register: (data: { email: string; password: string; fullName: string; metadata: any }) => Promise<any>;
                logout: () => Promise<void>;
                getSession: () => Promise<any>;
                updateProfile: (userId: string, metadata: any) => Promise<boolean>;
                getAllUsers: () => Promise<any[]>;
                isAdmin: (userId: string) => Promise<boolean>;
                googleLogin: (user: any) => Promise<any>;
            };
            journal: {
                getDaily: (teacherId: string, date: string) => Promise<any>;
                addSession: (teacherId: string, date: string, session: any) => Promise<boolean>;
                updateSession: (sessionId: string, session: any) => Promise<boolean>;
                deleteSession: (sessionId: string) => Promise<boolean>;
                getTeacherJournals: (teacherId: string) => Promise<any[]>;
            };
            db: {
                query: (sql: string, params?: any[]) => Promise<any>;
            };
            admin: {
                importData: (data: any) => Promise<boolean>;
            };
            student: {
                getAll: (teacherId: string, grade?: string, group?: string) => Promise<any[]>;
                add: (student: any) => Promise<any>;
                update: (id: string, student: any) => Promise<boolean>;
                delete: (id: string) => Promise<boolean>;
            };
            grading: {
                get: (teacherId: string, subject: string, term: string, grade?: string, group?: string) => Promise<any[]>;
                save: (gradeData: any) => Promise<any>;
            };
            app: {
                getVersion: () => Promise<string>;
                getPath: (name: string) => Promise<string>;
            };
            repository: {
                getWilayas: () => Promise<any[]>;
                getCurriculum: (yearId: string, streamId?: string) => Promise<any[]>;
            };
        };
    }
}

export { };
