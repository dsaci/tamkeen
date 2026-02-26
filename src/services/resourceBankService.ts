/**
 * Resource Bank Service
 * Database-first, AI-last approach.
 * Searches Supabase resource_bank first, generates with AI only if not found.
 */

import { getSupabaseClient } from '../config/supabaseClient';
import { Resource, ResourceFile } from '../types';
import { GoogleGenAI } from '@google/genai';

// ── Title Normalization ──

export function normalizeTitle(title: string): string {
    return title
        .replace(/درس\s*/g, '')
        .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
        .replace(/[ًٌٍَُِّْ]/g, '')
        .trim()
        .toLowerCase();
}

// ── Search ──

export async function searchResource(params: {
    subject: string;
    level: string;
    grade: string;
    activity: string;
    title: string;
}): Promise<Resource | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const normalized = normalizeTitle(params.title);

    const { data, error } = await client
        .from('resource_bank')
        .select('*, files(*)')
        .eq('subject', params.subject)
        .eq('level', params.level)
        .eq('grade', params.grade)
        .eq('activity', params.activity)
        .eq('normalized_title', normalized)
        .limit(1)
        .single();

    if (error || !data) return null;

    // Increment usage
    await client
        .from('resource_bank')
        .update({ usage_count: (data.usage_count || 0) + 1 })
        .eq('id', data.id);

    return data as Resource;
}

// ── Browse / List ──

export async function listResources(filters?: {
    subject?: string;
    level?: string;
    grade?: string;
    activity?: string;
    search?: string;
}): Promise<Resource[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    let query = client
        .from('resource_bank')
        .select('*, files(*)');

    if (filters?.subject) query = query.eq('subject', filters.subject);
    if (filters?.level) query = query.eq('level', filters.level);
    if (filters?.grade) query = query.eq('grade', filters.grade);
    if (filters?.activity) query = query.eq('activity', filters.activity);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

    query = query.order('usage_count', { ascending: false }).limit(50);

    const { data, error } = await query;
    if (error) {
        console.error('[ResourceBank] List error:', error);
        return [];
    }
    return (data || []) as Resource[];
}

// ── CRUD (Admin) ──

export async function addResource(resource: Omit<Resource, 'id' | 'normalized_title' | 'usage_count' | 'created_at' | 'updated_at' | 'files'>): Promise<Resource | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
        .from('resource_bank')
        .insert({
            ...resource,
            normalized_title: normalizeTitle(resource.title),
            usage_count: 1,
            source: resource.source || 'admin',
        })
        .select()
        .single();

    if (error) {
        console.error('[ResourceBank] Insert error:', error);
        return null;
    }
    return data as Resource;
}

export async function updateResource(id: string, updates: Partial<Resource>): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const toUpdate: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.title) {
        toUpdate.normalized_title = normalizeTitle(updates.title);
    }
    delete toUpdate.id;
    delete toUpdate.files;

    const { error } = await client
        .from('resource_bank')
        .update(toUpdate)
        .eq('id', id);

    if (error) {
        console.error('[ResourceBank] Update error:', error);
        return false;
    }
    return true;
}

export async function deleteResource(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client
        .from('resource_bank')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[ResourceBank] Delete error:', error);
        return false;
    }
    return true;
}

// ── File Upload ──

export async function uploadFile(
    resourceId: string,
    file: File,
    uploadedBy?: string
): Promise<ResourceFile | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mediaType: 'document' | 'video' = ['mp4', 'webm'].includes(ext) ? 'video' : 'document';
    const filePath = `resources/${resourceId}/${Date.now()}_${file.name}`;

    // Upload to storage
    const { error: uploadError } = await client.storage
        .from('pedagogical-files')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (uploadError) {
        console.error('[ResourceBank] Upload error:', uploadError);
        return null;
    }

    // Get public URL
    const { data: urlData } = client.storage
        .from('pedagogical-files')
        .getPublicUrl(filePath);

    // Save file record
    const { data, error } = await client
        .from('files')
        .insert({
            resource_id: resourceId,
            file_name: file.name,
            file_type: ext,
            media_type: mediaType,
            file_url: urlData.publicUrl,
            file_size: file.size,
            uploaded_by: uploadedBy,
        })
        .select()
        .single();

    if (error) {
        console.error('[ResourceBank] File record error:', error);
        return null;
    }
    return data as ResourceFile;
}

export async function getFiles(resourceId: string): Promise<ResourceFile[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
        .from('files')
        .select('*')
        .eq('resource_id', resourceId)
        .order('uploaded_at', { ascending: false });

    if (error) return [];
    return (data || []) as ResourceFile[];
}

export async function deleteFile(fileId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client
        .from('files')
        .delete()
        .eq('id', fileId);

    return !error;
}

// ── AI Generation (Fallback Only) ──

export async function generateAndSaveResource(params: {
    subject: string;
    level: string;
    grade: string;
    unit?: string;
    activity: string;
    title: string;
}): Promise<Resource | null> {
    const apiKey = localStorage.getItem('tamkeen_gemini_key') || '';
    if (!apiKey) return null;

    try {
        const ai = new GoogleGenAI({ apiKey });

        const levelLabel = params.level === 'PRIMARY'
            ? 'التعليم الابتدائي'
            : params.level === 'MIDDLE'
                ? 'التعليم المتوسط'
                : 'التعليم الثانوي';

        const prompt = `أنت خبير بيداغوجي بوزارة التربية الوطنية الجزائرية.
ولّد محتوى بيداغوجي لحصة وفق المناهج الجزائرية (الجيل الثاني).

المادة: ${params.subject}
الطور: ${levelLabel}
المستوى: ${params.grade}
${params.unit ? `المقطع: ${params.unit}` : ''}
النشاط: ${params.activity}
عنوان الحصة: ${params.title}

أجب بـ JSON فقط:
{
  "objective": "الهدف التعلمي / مؤشر الكفاءة",
  "content": "سير الحصة بالتفصيل (وضعية انطلاق ← بناء التعلمات ← استثمار المكتسبات)",
  "tools": "الوسائل البيداغوجية المقترحة",
  "method": "طريقة العمل البيداغوجية"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        let text = response.text || '{}';
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(text);

        // Save to database immediately
        const saved = await addResource({
            subject: params.subject,
            level: params.level,
            grade: params.grade,
            unit: params.unit,
            activity: params.activity,
            title: params.title,
            objective: result.objective,
            content: result.content,
            tools: result.tools,
            method: result.method,
            source: 'ai',
        });

        return saved;
    } catch (error) {
        console.error('[ResourceBank] AI generation error:', error);
        return null;
    }
}

// ── Smart Fetch (Main entry point) ──

export async function smartFetchResource(params: {
    subject: string;
    level: string;
    grade: string;
    unit?: string;
    activity: string;
    title: string;
}): Promise<{ resource: Resource | null; source: 'database' | 'ai' | 'none' }> {
    // Step 1: Search database first
    const existing = await searchResource(params);
    if (existing) {
        return { resource: existing, source: 'database' };
    }

    // Step 2: AI fallback
    const generated = await generateAndSaveResource(params);
    if (generated) {
        return { resource: generated, source: 'ai' };
    }

    return { resource: null, source: 'none' };
}
