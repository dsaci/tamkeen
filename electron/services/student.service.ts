
import { getDatabase, queryAll, runStatement } from '../database/db';
import crypto from 'crypto';

export async function getStudents(teacherId: string, grade?: string, group?: string) {
    let sql = 'SELECT * FROM students WHERE teacher_id = ?';
    const params = [teacherId];

    if (grade) {
        sql += ' AND grade = ?';
        params.push(grade);
    }
    if (group) {
        sql += ' AND group_name = ?';
        params.push(group);
    }

    return queryAll(sql, params);
}

export async function addStudent(student: any) {
    const id = crypto.randomUUID();
    runStatement(`
        INSERT INTO students (id, teacher_id, full_name, registration_number, birth_date, level, grade, group_name, parent_phone, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        id,
        student.teacherId,
        student.fullName,
        student.registrationNumber,
        student.birthDate,
        student.level,
        student.grade,
        student.groupName,
        student.parentPhone,
        student.notes
    ]);
    return { success: true, id };
}

export async function updateStudent(id: string, student: any) {
    runStatement(`
        UPDATE students SET full_name = ?, registration_number = ?, birth_date = ?, level = ?, grade = ?, group_name = ?, parent_phone = ?, notes = ?
        WHERE id = ?
    `, [
        student.fullName,
        student.registrationNumber,
        student.birthDate,
        student.level,
        student.grade,
        student.groupName,
        student.parentPhone,
        student.notes,
        id
    ]);
    return { success: true };
}

export async function deleteStudent(id: string) {
    runStatement('DELETE FROM students WHERE id = ?', [id]);
    return { success: true };
}
