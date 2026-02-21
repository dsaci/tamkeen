/**
 * Educational Knowledge Repository Service
 * Handles data seeding and retrieval for the Algerian National Curriculum
 */

import path from 'path';
import fs from 'fs';
import { getDatabase, queryAll, saveDatabase } from '../database/db';

const SEED_DIR = path.join(__dirname, '../../src/lib/repository/seed');

export async function initializeRepository(): Promise<void> {
    const db = getDatabase();

    // Check if we need to seed (simple check: if wilayas is empty)
    // We use try-catch because the table might not exist if migrations failed (though they shouldn't)
    try {
        const results = queryAll('SELECT COUNT(*) as count FROM wilayas');
        const wilayaCount = results.length > 0 ? results[0].count : 0;

        if (wilayaCount === 0) {
            console.log('[Repository] Seeding initial data...');
            if (fs.existsSync(SEED_DIR)) {
                seedWilayas();
                seedLevelsAndYears();
                seedSubjects();
                seedCurriculum();
                saveDatabase(); // Save once after all seeding
                console.log('[Repository] Seeding completed successfully.');
            } else {
                console.warn('[Repository] Seed directory not found:', SEED_DIR);
            }
        }
    } catch (error) {
        console.error('[Repository] Error during seeding:', error);
    }
}

function seedWilayas() {
    const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'wilayas.json'), 'utf-8'));
    const db = getDatabase();

    for (const w of data) {
        db.run('INSERT INTO wilayas (id, code, name_ar, name_en) VALUES (?, ?, ?, ?)', [w.id, w.code, w.name_ar, w.name_en]);
    }
    console.log(`[Repository] Seeded ${data.length} wilayas.`);
}

function seedLevelsAndYears() {
    const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'levels.json'), 'utf-8'));
    const db = getDatabase();

    // Levels
    for (const l of data.levels) {
        db.run('INSERT INTO education_levels (id, name_ar, name_en) VALUES (?, ?, ?)', [l.id, l.name_ar, l.name_en]);
    }

    // Years
    for (const y of data.years) {
        db.run('INSERT INTO education_years (id, level_id, name_ar, ordering) VALUES (?, ?, ?, ?)', [y.id, y.level_id, y.name_ar, y.ordering]);
    }

    // Streams
    for (const s of data.streams) {
        db.run('INSERT INTO streams (id, name_ar, name_en) VALUES (?, ?, ?)', [s.id, s.name_ar, s.name_en]);
    }

    console.log('[Repository] Seeded Levels, Years, and Streams.');
}

function seedSubjects() {
    const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'subjects.json'), 'utf-8'));
    const db = getDatabase();

    for (const s of data) {
        db.run('INSERT INTO subjects (id, name_ar, category) VALUES (?, ?, ?)', [s.id, s.name_ar, s.category]);
    }

    console.log(`[Repository] Seeded ${data.length} subjects.`);
}

function seedCurriculum() {
    const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'curriculum.json'), 'utf-8'));
    const db = getDatabase();

    for (const c of data) {
        const id = `${c.year_id}_${c.subject_id}_${c.stream_id || 'COMMON'}`;
        db.run(`
      INSERT INTO curriculum (id, year_id, stream_id, subject_id, coefficient, weekly_hours)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, c.year_id, c.stream_id || null, c.subject_id, c.coefficient, c.weekly_hours]);
    }

    console.log(`[Repository] Seeded ${data.length} curriculum entries.`);
}

export function getAllWilayas() {
    return queryAll('SELECT * FROM wilayas ORDER BY id ASC');
}

export function getCurriculum(yearId: string, streamId?: string) {
    let sql = `
    SELECT c.*, s.name_ar as subject_name, s.category
    FROM curriculum c
    JOIN subjects s ON c.subject_id = s.id
    WHERE c.year_id = ?
  `;
    const params = [yearId];

    if (streamId) {
        sql += ' AND c.stream_id = ?';
        params.push(streamId);
    } else {
        sql += ' AND c.stream_id IS NULL';
    }

    return queryAll(sql, params);
}
