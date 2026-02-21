
import { getDatabase, queryAll, runStatement } from '../database/db';
import crypto from 'crypto';

export async function getGrades(teacherId: string, subject: string, term: string, grade?: string, group?: string) {
    let sql = `
        SELECT g.*, s.full_name, s.registration_number 
        FROM grades g
        JOIN students s ON g.student_id = s.id
        WHERE g.teacher_id = ? AND g.subject = ? AND g.term = ?
    `;
    const params = [teacherId, subject, term];

    if (grade) {
        sql += ' AND s.grade = ?';
        params.push(grade);
    }
    if (group) {
        sql += ' AND s.group_name = ?';
        params.push(group);
    }

    return queryAll(sql, params);
}

export async function saveGrade(gradeData: any) {
    // Check if exists
    const existing = queryAll(
        'SELECT id FROM grades WHERE student_id = ? AND subject = ? AND term = ?',
        [gradeData.studentId, gradeData.subject, gradeData.term]
    );

    if (existing.length > 0) {
        // Update
        runStatement(`
            UPDATE grades SET evaluation1 = ?, evaluation2 = ?, evaluation3 = ?, exam = ?, average = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            gradeData.evaluation1,
            gradeData.evaluation2,
            gradeData.evaluation3,
            gradeData.exam,
            gradeData.average,
            gradeData.notes,
            existing[0].id
        ]);
        return { success: true, id: existing[0].id };
    } else {
        // Insert
        const id = crypto.randomUUID();
        runStatement(`
            INSERT INTO grades (id, student_id, teacher_id, subject, term, evaluation1, evaluation2, evaluation3, exam, average, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id,
            gradeData.studentId,
            gradeData.teacherId,
            gradeData.subject,
            gradeData.term,
            gradeData.evaluation1,
            gradeData.evaluation2,
            gradeData.evaluation3,
            gradeData.exam,
            gradeData.average,
            gradeData.notes
        ]);
        return { success: true, id };
    }
}
