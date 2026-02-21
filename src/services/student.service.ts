/**
 * Student Service
 * Routes through DatabaseServiceFactory based on MODE.
 * Falls back to direct electronAPI calls for offline mode.
 */

import { getDatabaseService } from './database/DatabaseServiceFactory';
import { getMode } from '../config/envValidation';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export const studentService = {
    getAll: async (teacherId: string, grade?: string, group?: string) => {
        if (!teacherId) {
            console.error('[StudentService] Error: teacherId is missing or undefined');
            return [];
        }

        const mode = getMode();

        // For offline mode, use the existing optimized IPC calls
        if (mode === 'offline' && isElectron) {
            return await window.electronAPI.student.getAll(teacherId, grade, group);
        }

        // For hybrid/cloud, use the abstraction layer
        const db = getDatabaseService();
        const filters: Record<string, any> = { teacher_id: teacherId };
        if (grade) filters.grade = grade;
        if (group) filters.group_name = group;

        return await db.read('students', filters);
    },

    add: async (student: any) => {
        const mode = getMode();

        if (mode === 'offline' && isElectron) {
            return await window.electronAPI.student.add(student);
        }

        const db = getDatabaseService();
        return await db.create('students', student);
    },

    update: async (id: string, student: any) => {
        const mode = getMode();

        if (mode === 'offline' && isElectron) {
            return await window.electronAPI.student.update(id, student);
        }

        const db = getDatabaseService();
        return await db.update('students', id, student);
    },

    delete: async (id: string) => {
        const mode = getMode();

        if (mode === 'offline' && isElectron) {
            return await window.electronAPI.student.delete(id);
        }

        const db = getDatabaseService();
        return await db.delete('students', id);
    }
};
