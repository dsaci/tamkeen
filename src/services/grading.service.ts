/**
 * Grading Service
 * Routes through DatabaseServiceFactory based on MODE.
 * Falls back to direct electronAPI calls for offline mode.
 */

import { getDatabaseService } from './database/DatabaseServiceFactory';
import { getMode } from '../config/envValidation';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

export const gradingService = {
    getGrades: async (teacherId: string, subject: string, term: string, grade?: string, group?: string) => {
        const mode = getMode();

        // For offline mode, use the existing optimized IPC calls
        if (mode === 'offline' && isElectron) {
            return await window.electronAPI.grading.get(teacherId, subject, term, grade, group);
        }

        // For hybrid/cloud, use the abstraction layer
        const db = getDatabaseService();
        const filters: Record<string, any> = {
            teacher_id: teacherId,
            subject,
            term,
        };
        if (grade) filters.grade = grade;
        if (group) filters.group_name = group;

        return await db.read('grades', filters);
    },

    saveGrade: async (gradeData: any) => {
        const mode = getMode();

        if (mode === 'offline' && isElectron) {
            return await window.electronAPI.grading.save(gradeData);
        }

        const db = getDatabaseService();

        if (gradeData.id) {
            // Update existing
            const { id, ...data } = gradeData;
            return await db.update('grades', id, data);
        } else {
            // Create new
            return await db.create('grades', gradeData);
        }
    }
};
