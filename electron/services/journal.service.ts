/**
 * Journal Service
 * Handles daily journal CRUD operations with sql.js
 */

import { generateId, queryOne, queryAll, runStatement } from '../database/db';

export interface SessionData {
    id: string;
    subject: string;
    activity: string;
    title: string;
    objective: string;
    content: string;
    tools: string;
    notes: string;
    startTime: string;
    endTime: string;
    category: string;
    period: string;
    sectionId: string;
    sectionName: string;
    sectionNumber: number;
    unityNumber: number;
    sessionNumber: number;
    holidayName: string;
    breakDuration?: number;
    examType?: string;
    supportType?: string;
    trainingType?: string;
    integrationType?: string;
}

export interface JournalData {
    id: string;
    teacherId: string;
    date: string;
    dayName: string;
    sessions: SessionData[];
}

/**
 * Get or create journal for a specific date
 */
function ensureJournalExists(teacherId: string, date: string): string {
    // Check if journal exists
    const existing = queryOne(
        'SELECT id FROM daily_journals WHERE teacher_id = ? AND journal_date = ?',
        [teacherId, date]
    );

    if (existing) {
        return existing.id;
    }

    // Create new journal
    const id = generateId();
    runStatement(
        'INSERT INTO daily_journals (id, teacher_id, journal_date) VALUES (?, ?, ?)',
        [id, teacherId, date]
    );

    return id;
}

/**
 * Get daily journal with sessions
 */
export function getDailyJournal(teacherId: string, date: string): JournalData | null {
    try {
        // Get journal
        const journal = queryOne(
            'SELECT id, teacher_id, journal_date FROM daily_journals WHERE teacher_id = ? AND journal_date = ?',
            [teacherId, date]
        );

        if (!journal) {
            return null;
        }

        // Get sessions
        const sessions = queryAll(
            'SELECT * FROM sessions WHERE journal_id = ? ORDER BY start_time ASC',
            [journal.id]
        );

        const dayName = new Date(date).toLocaleDateString('ar-DZ', { weekday: 'long' });

        return {
            id: journal.id,
            teacherId: journal.teacher_id,
            date: journal.journal_date,
            dayName,
            sessions: sessions.map(s => ({
                id: s.id,
                subject: s.subject || '',
                activity: s.activity || '',
                title: s.title || '',
                objective: s.objective || '',
                content: s.content || '',
                tools: s.tools || '',
                notes: s.notes || '',
                startTime: s.start_time || '',
                endTime: s.end_time || '',
                category: s.category || 'LESSON',
                period: s.period || 'MORNING',
                sectionId: s.section_id || '',
                sectionName: s.section_name || '',
                sectionNumber: s.section_number || 0,
                unityNumber: s.unity_number || 0,
                sessionNumber: s.session_number || 0,
                holidayName: s.holiday_name || '',
                breakDuration: s.break_duration,
                examType: s.exam_type,
                supportType: s.support_type,
                trainingType: s.training_type,
                integrationType: s.integration_type
            }))
        };
    } catch (error) {
        console.error('[Journal] Get journal error:', error);
        return null;
    }
}

/**
 * Add session to journal
 */
export function addSession(teacherId: string, date: string, session: SessionData): boolean {
    try {
        const journalId = ensureJournalExists(teacherId, date);
        const sessionId = session.id || generateId();

        // Log input for debugging
        console.log('[Journal] Adding session:', JSON.stringify(session));

        const params = [
            sessionId,
            journalId,
            session.subject ?? null,
            session.activity ?? null,
            session.title ?? null,
            session.objective ?? null,
            session.content ?? null,
            session.tools ?? null,
            session.notes ?? null,
            session.startTime ?? null,
            session.endTime ?? null,
            session.category ?? 'LESSON',
            session.period ?? 'MORNING',
            session.sectionId ?? null,
            session.sectionName ?? null,
            session.sectionNumber ?? 0,
            session.unityNumber ?? 0,
            session.sessionNumber ?? 0,
            session.holidayName ?? null,
            session.breakDuration ?? null,
            session.examType ?? null,
            session.supportType ?? null,
            session.trainingType ?? null,
            session.integrationType ?? null
        ];

        // Sanity check for undefined
        if (params.some(p => p === undefined)) {
            console.error('[Journal] Found undefined in params:', params);
            throw new Error('Undefined value in session parameters');
        }

        runStatement(`
      INSERT INTO sessions (
        id, journal_id, subject, activity, title, objective, content, 
        tools, notes, start_time, end_time, category, period,
        section_id, section_name, section_number, unity_number, session_number, 
        holiday_name, break_duration, exam_type, support_type, training_type, integration_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, params);

        // Add to Sync Queue
        runStatement(`
          INSERT INTO sync_queue (table_name, record_id, operation, payload)
          VALUES (?, ?, ?, ?)
        `, ['sessions', sessionId, 'INSERT', JSON.stringify(session)]);

        return true;
    } catch (error) {
        console.error('[Journal] Add session error:', error);
        return false;
    }
}

/**
 * Update session
 */
export function updateSession(sessionId: string, session: SessionData): boolean {
    try {
        // Log input for debugging
        console.log('[Journal] Updating session:', sessionId, JSON.stringify(session));

        const params = [
            session.subject ?? null,
            session.activity ?? null,
            session.title ?? null,
            session.objective ?? null,
            session.content ?? null,
            session.tools ?? null,
            session.notes ?? null,
            session.startTime ?? null,
            session.endTime ?? null,
            session.category ?? 'LESSON',
            session.period ?? 'MORNING',
            session.sectionId ?? null,
            session.sectionName ?? null,
            session.sectionNumber ?? 0,
            session.unityNumber ?? 0,
            session.sessionNumber ?? 0,
            session.holidayName ?? null,
            session.breakDuration ?? null,
            session.examType ?? null,
            session.supportType ?? null,
            session.trainingType ?? null,
            session.integrationType ?? null,
            sessionId
        ];

        // Sanity check for undefined
        if (params.some(p => p === undefined)) {
            console.error('[Journal] Found undefined in update params:', params);
            throw new Error('Undefined value in update parameters');
        }

        runStatement(`
      UPDATE sessions SET
        subject = ?, activity = ?, title = ?, objective = ?, content = ?,
        tools = ?, notes = ?, start_time = ?, end_time = ?, category = ?,
        period = ?, section_id = ?, section_name = ?, section_number = ?, unity_number = ?, 
        session_number = ?, holiday_name = ?, break_duration = ?, exam_type = ?, 
        support_type = ?, training_type = ?, integration_type = ?
      WHERE id = ?
    `, params);

        // Add to Sync Queue
        runStatement(`
          INSERT INTO sync_queue (table_name, record_id, operation, payload)
          VALUES (?, ?, ?, ?)
        `, ['sessions', sessionId, 'UPDATE', JSON.stringify(session)]);

        return true;
    } catch (error) {
        console.error('[Journal] Update session error:', error);
        return false;
    }
}

/**
 * Delete session
 */
export function deleteSession(sessionId: string): boolean {
    try {
        runStatement('DELETE FROM sessions WHERE id = ?', [sessionId]);

        // Add to Sync Queue
        runStatement(`
            INSERT INTO sync_queue (table_name, record_id, operation, payload)
            VALUES (?, ?, ?, ?)
        `, ['sessions', sessionId, 'DELETE', JSON.stringify({ id: sessionId })]);

        return true;
    } catch (error) {
        console.error('[Journal] Delete session error:', error);
        return false;
    }
}

/**
 * Get all journals for a teacher (for stats/dashboard)
 */
export function getTeacherJournals(teacherId: string): any[] {
    try {
        return queryAll(`
      SELECT dj.id, dj.journal_date, COUNT(s.id) as session_count
      FROM daily_journals dj
      LEFT JOIN sessions s ON s.journal_id = dj.id
      WHERE dj.teacher_id = ?
      GROUP BY dj.id
      ORDER BY dj.journal_date DESC
    `, [teacherId]);
    } catch (error) {
        console.error('[Journal] Get teacher journals error:', error);
        return [];
    }
}
