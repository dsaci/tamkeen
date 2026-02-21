/**
 * Daily Journal Service
 * Supports both Electron (local SQLite) and Cloud (Supabase) modes
 */

import { DailyJournal, Session } from '../../types';
import { getMode } from '../../config/envValidation';
import { getSupabaseClient } from '../../config/supabaseClient';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;
const mode = getMode();

export function createSession(data: Partial<Session>): Session {
  return {
    id: data.id || crypto.randomUUID(),
    timing: data.timing || {
      date: new Date().toISOString().split('T')[0],
      category: 'LESSON',
      period: 'MORNING',
      startTime: '08:00',
      endTime: '09:00'
    },
    subject: data.subject || '',
    activity: data.activity || '',
    title: data.title || '',
    sectionNumber: data.sectionNumber || 1,
    sectionName: data.sectionName || '',
    unityNumber: data.unityNumber || 1,
    objective: data.objective || '',
    content: data.content || '',
    tools: data.tools || '',
    notes: data.notes || ''
  };
}

// ============================================================
// SUPABASE (Cloud) implementations
// ============================================================

async function getJournalSupabase(teacherId: string, date: string): Promise<DailyJournal | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    // 1. Get or create the daily_journal row
    let { data: journal, error } = await client
      .from('daily_journals')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('journal_date', date)
      .maybeSingle();

    if (error) {
      console.error('[Journal Cloud] Fetch error:', error.message);
      return null;
    }

    if (!journal) return null;

    // 2. Get sessions for this journal
    const { data: sessions, error: sessError } = await client
      .from('sessions')
      .select('*')
      .eq('journal_id', journal.id)
      .order('start_time', { ascending: true });

    if (sessError) {
      console.error('[Journal Cloud] Sessions fetch error:', sessError.message);
    }

    // 3. Transform to frontend format
    const mappedSessions: Session[] = (sessions || []).map((s: any) => ({
      id: s.id,
      subject: s.subject || '',
      activity: s.activity || '',
      title: s.title || '',
      objective: s.objective || '',
      content: s.content || '',
      tools: s.tools || '',
      notes: s.notes || '',
      sectionNumber: s.section_number || 0,
      sectionName: s.section_name || '',
      unityNumber: s.unity_number || 0,
      timing: {
        date: date,
        category: s.category || 'LESSON',
        period: s.period || 'MORNING',
        startTime: s.start_time || '',
        endTime: s.end_time || '',
        holidayName: s.holiday_name,
        breakDuration: s.break_duration,
        examType: s.exam_type,
        supportType: s.support_type,
        trainingType: s.training_type,
        integrationType: s.integration_type
      }
    }));

    return {
      id: journal.id,
      teacherId: journal.teacher_id,
      date: journal.journal_date,
      dayName: journal.day_name || '',
      sessions: mappedSessions
    };
  } catch (e) {
    console.error('[Journal Cloud] Error:', e);
    return null;
  }
}

async function ensureJournalExists(teacherId: string, date: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  // Check if journal exists
  let { data: journal } = await client
    .from('daily_journals')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('journal_date', date)
    .maybeSingle();

  if (journal) return journal.id;

  // Create new journal
  const { data: newJournal, error } = await client
    .from('daily_journals')
    .insert({
      teacher_id: teacherId,
      journal_date: date,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Journal Cloud] Create journal error:', error.message);
    return null;
  }

  return newJournal.id;
}

async function addSessionSupabase(teacherId: string, date: string, session: Session): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not available');

  const journalId = await ensureJournalExists(teacherId, date);
  if (!journalId) throw new Error('Failed to create/find journal');

  const { error } = await client
    .from('sessions')
    .insert({
      id: session.id,
      journal_id: journalId,
      subject: session.subject,
      activity: session.activity,
      title: session.title,
      objective: session.objective,
      content: session.content,
      tools: session.tools,
      notes: session.notes,
      start_time: session.timing.startTime,
      end_time: session.timing.endTime,
      category: session.timing.category,
      period: session.timing.period,
      section_name: session.sectionName,
      section_number: session.sectionNumber,
      unity_number: session.unityNumber,
      holiday_name: session.timing.holidayName,
      break_duration: session.timing.breakDuration,
      exam_type: session.timing.examType,
      support_type: session.timing.supportType,
      training_type: session.timing.trainingType,
      integration_type: session.timing.integrationType
    });

  if (error) {
    console.error('[Journal Cloud] Add session error:', error.message);
    throw new Error(`Failed to add session: ${error.message}`);
  }
}

async function updateSessionSupabase(teacherId: string, date: string, session: Session): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not available');

  const { error } = await client
    .from('sessions')
    .update({
      subject: session.subject,
      activity: session.activity,
      title: session.title,
      objective: session.objective,
      content: session.content,
      tools: session.tools,
      notes: session.notes,
      start_time: session.timing.startTime,
      end_time: session.timing.endTime,
      category: session.timing.category,
      period: session.timing.period,
      section_name: session.sectionName,
      section_number: session.sectionNumber,
      unity_number: session.unityNumber,
      holiday_name: session.timing.holidayName,
      break_duration: session.timing.breakDuration,
      exam_type: session.timing.examType,
      support_type: session.timing.supportType,
      training_type: session.timing.trainingType,
      integration_type: session.timing.integrationType,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.id);

  if (error) {
    console.error('[Journal Cloud] Update session error:', error.message);
    throw new Error(`Failed to update session: ${error.message}`);
  }
}

async function deleteSessionSupabase(teacherId: string, date: string, sessionId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not available');

  const { error } = await client
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('[Journal Cloud] Delete session error:', error.message);
    throw new Error(`Failed to delete session: ${error.message}`);
  }
}

// ============================================================
// ELECTRON (Local) implementations — original code
// ============================================================

async function getJournalElectron(teacherId: string, date: string): Promise<DailyJournal | null> {
  if (!isElectron) return null;
  try {
    const journal = await window.electronAPI.journal.getDaily(teacherId, date);
    if (!journal) return null;

    const sessions: Session[] = (journal.sessions || []).map((s: any) => ({
      id: s.id,
      subject: s.subject || '',
      activity: s.activity || '',
      title: s.title || '',
      objective: s.objective || '',
      content: s.content || '',
      tools: s.tools || '',
      notes: s.notes || '',
      sectionNumber: s.sectionNumber || 0,
      sectionName: s.sectionName || '',
      unityNumber: s.unityNumber || 0,
      timing: {
        date: journal.date,
        category: s.category || 'LESSON',
        period: s.period || 'MORNING',
        startTime: s.startTime || '',
        endTime: s.endTime || '',
        holidayName: s.holidayName,
        breakDuration: s.breakDuration,
        examType: s.examType,
        supportType: s.supportType,
        trainingType: s.trainingType,
        integrationType: s.integrationType
      }
    }));

    return { id: journal.id, teacherId: journal.teacherId, date: journal.date, dayName: journal.dayName, sessions };
  } catch (e) {
    console.error("Error fetching journal:", e);
    return null;
  }
}

async function addSessionElectron(teacherId: string, date: string, session: Session): Promise<void> {
  if (!isElectron) return;
  const sessionData = {
    id: session.id,
    subject: session.subject,
    activity: session.activity,
    title: session.title,
    objective: session.objective,
    content: session.content,
    tools: session.tools,
    notes: session.notes,
    startTime: session.timing.startTime,
    endTime: session.timing.endTime,
    category: session.timing.category,
    period: session.timing.period,
    sectionName: session.sectionName,
    sectionNumber: session.sectionNumber,
    unityNumber: session.unityNumber,
    holidayName: session.timing.holidayName,
    breakDuration: session.timing.breakDuration,
    examType: session.timing.examType,
    supportType: session.timing.supportType,
    trainingType: session.timing.trainingType,
    integrationType: session.timing.integrationType
  };
  console.log("[Electron Service] Adding session to backend:", sessionData);
  const success = await window.electronAPI.journal.addSession(teacherId, date, sessionData);
  if (!success) {
    console.error("[Electron Service] addSession returned false");
    throw new Error("فشل الحفظ في قاعدة البيانات المحلية (Local API Error)");
  }
}

async function updateSessionElectron(teacherId: string, date: string, session: Session): Promise<void> {
  if (!isElectron) return;
  const sessionData = {
    subject: session.subject,
    activity: session.activity,
    title: session.title,
    objective: session.objective,
    content: session.content,
    tools: session.tools,
    notes: session.notes,
    startTime: session.timing.startTime,
    endTime: session.timing.endTime,
    category: session.timing.category,
    period: session.timing.period,
    sectionName: session.sectionName,
    sectionNumber: session.sectionNumber,
    unityNumber: session.unityNumber,
    holidayName: session.timing.holidayName,
    breakDuration: session.timing.breakDuration,
    examType: session.timing.examType,
    supportType: session.timing.supportType,
    trainingType: session.timing.trainingType,
    integrationType: session.timing.integrationType
  };
  console.log("[Electron Service] Updating session in backend:", sessionData);
  const success = await window.electronAPI.journal.updateSession(session.id, sessionData);
  if (!success) {
    console.error("[Electron Service] updateSession returned false");
    throw new Error("فشل تحديث التدوينة في قاعدة البيانات المحلية");
  }
}

async function deleteSessionElectron(teacherId: string, date: string, sessionId: string): Promise<void> {
  if (!isElectron) return;
  const success = await window.electronAPI.journal.deleteSession(sessionId);
  if (!success) throw new Error("Failed to delete session");
}

// ============================================================
// EXPORTS — route to the correct implementation based on mode
// ============================================================

export async function getDailyJournal(teacherId: string, date: string): Promise<DailyJournal | null> {
  if (mode === 'cloud') return getJournalSupabase(teacherId, date);
  return getJournalElectron(teacherId, date);
}

export async function addSessionToJournal(teacherId: string, date: string, session: Session): Promise<void> {
  if (mode === 'cloud') return addSessionSupabase(teacherId, date, session);
  return addSessionElectron(teacherId, date, session);
}

export async function updateSessionInJournal(teacherId: string, date: string, session: Session): Promise<void> {
  if (mode === 'cloud') return updateSessionSupabase(teacherId, date, session);
  return updateSessionElectron(teacherId, date, session);
}

export async function deleteSessionFromJournal(teacherId: string, date: string, sessionId: string): Promise<void> {
  if (mode === 'cloud') return deleteSessionSupabase(teacherId, date, sessionId);
  return deleteSessionElectron(teacherId, date, sessionId);
}
