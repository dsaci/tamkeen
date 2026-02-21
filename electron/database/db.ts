/**
 * SQLite Database Service using sql.js
 * Handles database connection and provides query methods
 * sql.js is a pure JavaScript implementation that doesn't require native compilation
 */

// @ts-ignore - sql.js doesn't have proper TypeScript declarations
import initSqlJs from 'sql.js';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Type definitions for sql.js
interface SqlJsDatabase {
  run(sql: string, params?: any[]): void;
  exec(sql: string, params?: any[]): { columns: string[]; values: any[][] }[];
  export(): Uint8Array;
  close(): void;
}

let db: SqlJsDatabase | null = null;
let dbPath: string = '';

/**
 * Initialize the SQLite database
 */
export async function initDatabase(): Promise<SqlJsDatabase> {
  if (db) return db;

  // Initialize sql.js
  const SQL = await initSqlJs();

  // Get user data directory
  const userDataPath = app.getPath('userData');
  dbPath = path.join(userDataPath, 'tamkeen.db');

  console.log('[DB] Database path:', dbPath);

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('[DB] Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('[DB] Created new database');
  }

  // Run migrations
  runMigrations(db!);

  // Create default admin if none exists
  createDefaultAdmin();
  // Seed dummy students for demo
  seedDummyStudents(db!);

  // Save database
  saveDatabase();

  return db!;
}

/**
 * Run database migrations
 */
function runMigrations(database: SqlJsDatabase): void {
  // Enable foreign keys
  database.run('PRAGMA foreign_keys = ON');

  // Create profiles table
  database.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'teacher',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create daily_journals table
  database.run(`
    CREATE TABLE IF NOT EXISTS daily_journals (
      id TEXT PRIMARY KEY,
      teacher_id TEXT NOT NULL,
      journal_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE CASCADE,
      UNIQUE(teacher_id, journal_date)
    )
  `);

  // Create sessions table
  database.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      journal_id TEXT NOT NULL,
      subject TEXT,
      activity TEXT,
      title TEXT,
      objective TEXT,
      content TEXT,
      tools TEXT,
      notes TEXT,
      start_time TEXT,
      end_time TEXT,
      category TEXT DEFAULT 'LESSON',
      period TEXT DEFAULT 'MORNING',
      section_id TEXT,
      section_name TEXT,
      section_number INTEGER,
      unity_number INTEGER,
      session_number INTEGER,
      holiday_name TEXT,
      break_duration INTEGER,
      exam_type TEXT,
      support_type TEXT,
      training_type TEXT,
      integration_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (journal_id) REFERENCES daily_journals(id) ON DELETE CASCADE
    )
  `);

  // Create admin_messages table
  database.run(`
    CREATE TABLE IF NOT EXISTS admin_messages (
      id TEXT PRIMARY KEY,
      to_user TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (to_user) REFERENCES profiles(id) ON DELETE CASCADE
    )
  `);

  // Create sync_queue table
  database.run(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
      payload TEXT, -- JSON data for INSERT/UPDATE
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create students table
  database.run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      teacher_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      registration_number TEXT,
      birth_date TEXT,
      level TEXT, -- PRIMARY, MIDDLE, SECONDARY
      grade TEXT, -- 1, 2, 3...
      group_name TEXT, -- A, B, 1, 2...
      parent_phone TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE CASCADE
    )
  `);

  // Create grades table
  database.run(`
    CREATE TABLE IF NOT EXISTS grades (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      term TEXT DEFAULT '1', -- 1, 2, 3
      evaluation1 REAL,
      evaluation2 REAL,
      evaluation3 REAL, -- Projects/Duty
      exam REAL,
      average REAL,
      notes TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE CASCADE,
      UNIQUE(student_id, subject, term)
    )
  `);

  // === EDUCATIONAL KNOWLEDGE REPOSITORY ===

  // Wilayas (Provinces)
  database.run(`
    CREATE TABLE IF NOT EXISTS wilayas (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE NOT NULL, -- 01, 02...
      name_ar TEXT NOT NULL,
      name_en TEXT,
      name_fr TEXT
    )
  `);

  // Education Levels (Primary, Middle, Secondary)
  database.run(`
    CREATE TABLE IF NOT EXISTS education_levels (
      id TEXT PRIMARY KEY, -- PRIMARY, MIDDLE, SECONDARY
      name_ar TEXT NOT NULL,
      name_en TEXT,
      description TEXT
    )
  `);

  // Education Years (1AP, 2AP... 1AM...)
  database.run(`
    CREATE TABLE IF NOT EXISTS education_years (
      id TEXT PRIMARY KEY, -- 1AP, 5AP, 4AM, 3AS...
      level_id TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT,
      ordering INTEGER,
      FOREIGN KEY (level_id) REFERENCES education_levels(id)
    )
  `);

  // Streams (for Secondary)
  database.run(`
    CREATE TABLE IF NOT EXISTS streams (
      id TEXT PRIMARY KEY, -- SCIENCE, MATH, LETTERS...
      name_ar TEXT NOT NULL,
      name_en TEXT
    )
  `);

  // Subjects (Global List)
  database.run(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY, -- ARABIC, MATH, PHYSICS...
      name_ar TEXT NOT NULL,
      name_en TEXT,
      name_fr TEXT,
      category TEXT -- CORE, LANGUAGES, SOCIAL...
    )
  `);

  // Curriculum (Link Year + Stream + Subject)
  database.run(`
    CREATE TABLE IF NOT EXISTS curriculum (
      id TEXT PRIMARY KEY,
      year_id TEXT NOT NULL,
      stream_id TEXT, -- Nullable for Primary/Middle
      subject_id TEXT NOT NULL,
      coefficient REAL DEFAULT 1,
      weekly_hours REAL DEFAULT 1,
      FOREIGN KEY (year_id) REFERENCES education_years(id),
      FOREIGN KEY (stream_id) REFERENCES streams(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
  `);

  // Competencies (Pedagogical Standards)
  database.run(`
    CREATE TABLE IF NOT EXISTS competencies (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      year_id TEXT NOT NULL,
      domain TEXT, -- Oral, Written, etc.
      competency_text TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (year_id) REFERENCES education_years(id)
    )
  `);

  // Create indexes for performance
  database.run('CREATE INDEX IF NOT EXISTS idx_journals_teacher ON daily_journals(teacher_id)');
  database.run('CREATE INDEX IF NOT EXISTS idx_journals_date ON daily_journals(journal_date)');
  database.run('CREATE INDEX IF NOT EXISTS idx_sessions_journal ON sessions(journal_id)');
  database.run('CREATE INDEX IF NOT EXISTS idx_messages_user ON admin_messages(to_user)');
  database.run('CREATE INDEX IF NOT EXISTS idx_sync_queue_created ON sync_queue(created_at)');
  database.run('CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id)');
  database.run('CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id)');

  // Ensure new curriculum columns exist for existing tables
  const columnsToAdd = [
    { name: 'section_id', type: 'TEXT' },
    { name: 'section_name', type: 'TEXT' },
    { name: 'section_number', type: 'INTEGER' },
    { name: 'unity_number', type: 'INTEGER' },
    { name: 'session_number', type: 'INTEGER' },
    { name: 'holiday_name', type: 'TEXT' },
    { name: 'break_duration', type: 'INTEGER' },
    { name: 'exam_type', type: 'TEXT' },
    { name: 'support_type', type: 'TEXT' },
    { name: 'training_type', type: 'TEXT' },
    { name: 'integration_type', type: 'TEXT' }
  ];

  try {
    const tableInfo = database.exec('PRAGMA table_info(sessions)');
    if (tableInfo.length > 0) {
      const existingCols = tableInfo[0].values.map((v: any) => v[1]);
      columnsToAdd.forEach(col => {
        if (!existingCols.includes(col.name)) {
          console.log(`[DB] Adding missing column: ${col.name}`);
          database.run(`ALTER TABLE sessions ADD COLUMN ${col.name} ${col.type}`);
        }
      });
    }
  } catch (err) {
    console.error('[DB] Migration error:', err);
  }

  console.log('[DB] Migrations completed successfully');
}

/**
 * Get the database instance
 */
export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Save database to disk
 */
export function saveDatabase(): void {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    console.log('[DB] Database saved to disk');
  }
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    console.log('[DB] Database connection closed');
  }
}

/**
 * Seed Dummy Students for Demo
 */
function seedDummyStudents(database: SqlJsDatabase): void {
  // Check if we have an admin
  const adminRes = database.exec("SELECT id FROM profiles WHERE role = 'admin' LIMIT 1");
  if (adminRes.length > 0 && adminRes[0].values.length > 0) {
    const adminId = adminRes[0].values[0][0] as string;

    // Check if students exist
    const countRes = database.exec("SELECT COUNT(*) FROM students WHERE teacher_id = ?", [adminId]);
    const count = countRes[0].values[0][0] as number;

    if (count === 0) {
      console.log("[DB] Seeding dummy students...");
      const dummyStudents = [
        ['أحمد بن محمد', '1', 'أ'],
        ['سارة علي', '1', 'أ'],
        ['يوسف كمال', '1', 'أ'],
        ['فاطمة الزهراء', '1', 'أ'],
        ['عمر خالد', '1', 'أ']
      ];

      dummyStudents.forEach(st => {
        database.run(`INSERT INTO students (id, teacher_id, full_name, grade, group_name) VALUES (?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), adminId, st[0], st[1], st[2]]);
      });
    }
  }
}

/**
 * Create default admin account on first run
 */
function createDefaultAdmin(): void {
  const database = getDatabase();

  // Check if any admin exists
  const result = database.exec('SELECT COUNT(*) as count FROM profiles WHERE role = ?', ['admin']);
  const adminCount = result.length > 0 ? result[0].values[0][0] as number : 0;

  if (adminCount === 0) {
    const id = crypto.randomUUID();
    const email = 'admin@tamkeen.local';
    const passwordHash = bcrypt.hashSync('admin123', 10);

    database.run(`
      INSERT INTO profiles (id, email, password_hash, full_name, role, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      id,
      email,
      passwordHash,
      'مدير النظام',
      'admin',
      JSON.stringify({
        tamkeenId: id.substring(0, 8).toUpperCase(),
        name: 'مدير النظام',
        email: email,
        institution: 'إدارة تمكين',
        level: 'ADMIN',
        grades: [],
        academicYear: '2024/2025',
        province: '',
        preferredShift: 'FULL',
        teachingLanguage: 'ar',
        teachingSubject: ''
      })
    ]);

    saveDatabase();
    console.log('[DB] Default admin created: admin@tamkeen.local / admin123');
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Helper to run a query and get all results
 */
export function queryAll(sql: string, params: any[] = []): any[] {
  const database = getDatabase();
  const result = database.exec(sql, params);
  if (result.length === 0) return [];

  const columns = result[0].columns;
  return result[0].values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Helper to run a query and get first result
 */
export function queryOne(sql: string, params: any[] = []): any | undefined {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : undefined;
}

/**
 * Helper to run a statement (INSERT, UPDATE, DELETE)
 */
export function runStatement(sql: string, params: any[] = []): void {
  const database = getDatabase();
  database.run(sql, params);
  saveDatabase();
}
