/**
 * Resource Bank Service
 * Database-first, AI-last approach.
 * Searches Supabase resource_bank first, generates with AI only if not found.
 */

import { getSupabaseClient } from '../config/supabaseClient';
import { Resource, ResourceFile } from '../types';

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
        .select('id, subject, level, grade, unit, activity, title, objective, content, tools, method, source, usage_count, created_at');

    if (filters?.subject) query = query.eq('subject', filters.subject);
    if (filters?.level) query = query.eq('level', filters.level);
    if (filters?.grade) query = query.eq('grade', filters.grade);
    if (filters?.activity) query = query.eq('activity', filters.activity);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

    query = query.order('usage_count', { ascending: false }).limit(20);

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
    return uploadFileWithProgress(resourceId, file, undefined, uploadedBy);
}

export async function uploadFileWithProgress(
    resourceId: string,
    file: File,
    onProgress?: (percent: number) => void,
    uploadedBy?: string
): Promise<ResourceFile | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mediaType: 'document' | 'video' = ['mp4', 'webm'].includes(ext) ? 'video' : 'document';
    const filePath = `resources/${resourceId}/${Date.now()}_${file.name}`;

    // Get the Supabase URL & key for XHR upload
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kqfyovljkjdxqyvpzqum.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
        || import.meta.env.VITE_SUPABASE_ANON_KEY
        || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZnlvdmxqa2pkeHF5dnB6cXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDYyMTksImV4cCI6MjA4NTY4MjIxOX0.aVoohtaslgXArVWAKhOh7yqYlm_iPCT7fehq1_iVhPM';

    // Get session token for auth header
    const { data: sessionData } = await client.auth.getSession();
    const accessToken = sessionData?.session?.access_token || supabaseKey;

    try {
        // XHR upload with progress
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const uploadUrl = `${supabaseUrl}/storage/v1/object/pedagogical-files/${filePath}`;

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));

            xhr.open('POST', uploadUrl, true);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('x-upsert', 'false');
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
            xhr.setRequestHeader('Cache-Control', 'max-age=3600');
            xhr.send(file);
        });
    } catch (uploadError) {
        console.error('[ResourceBank] Upload error:', uploadError);
        onProgress?.(0);
        return null;
    }

    onProgress?.(100);

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
        const { GoogleGenAI } = await import('@google/genai');
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
