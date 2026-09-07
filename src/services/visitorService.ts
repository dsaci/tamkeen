import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../config/supabaseClient';

const STORAGE_KEY = 'tamkeen_visitors_count';
const INITIAL_BASELINE = 3500;

let visitPromise: Promise<number> | null = null;

function getStoredCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : INITIAL_BASELINE;
    return Math.max(isNaN(parsed) ? INITIAL_BASELINE : parsed, INITIAL_BASELINE);
  } catch {
    return INITIAL_BASELINE;
  }
}

/**
 * Records a page visit / reload and returns the updated visitor count.
 * Connects to Supabase RPC 'increment_visitor_count', with fallback to localStorage.
 */
export async function recordAndGetVisitCount(): Promise<number> {
  const localVal = getStoredCount();

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.rpc('increment_visitor_count');
      if (!error && typeof data === 'number') {
        const finalCount = Math.max(data, INITIAL_BASELINE);
        localStorage.setItem(STORAGE_KEY, finalCount.toString());
        return finalCount;
      }
      if (error) {
        console.warn('[VisitorService] Supabase RPC error:', error.message);
      }
    }
  } catch (err) {
    console.warn('[VisitorService] Network error during visitor counting:', err);
  }

  // Fallback: increment local count
  const updatedLocal = localVal + 1;
  localStorage.setItem(STORAGE_KEY, updatedLocal.toString());
  return updatedLocal;
}

/**
 * Retrieves the current visitor count without incrementing.
 */
export async function getVisitorCount(): Promise<number> {
  const localVal = getStoredCount();

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_stats')
        .select('visitors_count')
        .eq('id', 'main_counter')
        .single();

      if (!error && data && typeof data.visitors_count === 'number') {
        const finalCount = Math.max(data.visitors_count, INITIAL_BASELINE);
        localStorage.setItem(STORAGE_KEY, finalCount.toString());
        return finalCount;
      }
    }
  } catch (err) {
    console.warn('[VisitorService] Could not fetch current count:', err);
  }

  return localVal;
}

/**
 * Ensures visit is recorded once per page load/refresh, preventing multiple increments
 * when multiple components mount on the same page.
 */
export function recordVisitOncePerLoad(): Promise<number> {
  if (!visitPromise) {
    visitPromise = recordAndGetVisitCount();
  }
  return visitPromise;
}

/**
 * React hook to get and track the real-time visitor count.
 */
export function useVisitorCount(autoIncrement: boolean = true) {
  const [count, setCount] = useState<number>(getStoredCount);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const val = autoIncrement
          ? await recordVisitOncePerLoad()
          : await getVisitorCount();

        if (isMounted) {
          setCount(val);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [autoIncrement]);

  return { count, loading };
}
