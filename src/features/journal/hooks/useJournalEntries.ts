import { useState, useCallback, useEffect } from 'react';
import { useJournalStore } from '../store/journalStore';
import { Session } from '../../../types';
import {
    getDailyJournal,
    addSessionToJournal,
    updateSessionInJournal,
    deleteSessionFromJournal
} from '../../../lib/services/dailyJournal.service';
import { useAuth } from '../../../contexts/AuthContext';

export const useJournalEntries = () => {
    const { user } = useAuth();
    const { selectedDate } = useJournalStore();
    const [entries, setEntries] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        setError(null);
        try {
            const journal = await getDailyJournal(user.id, selectedDate);
            if (journal && journal.sessions) {
                const sorted = [...journal.sessions].sort((a, b) => {
                    if (a.timing.period === b.timing.period) return (a.timing.startTime || '').localeCompare(b.timing.startTime || '');
                    return a.timing.period === 'MORNING' ? -1 : 1;
                });
                setEntries(sorted);
            } else {
                setEntries([]);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "فشل تحميل اليوميات");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, selectedDate]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const addSession = async (session: Session) => {
        if (!user?.id) return;
        // Optimistic update
        setEntries(prev => [...prev, session].sort((a, b) => (a.timing.startTime || '').localeCompare(b.timing.startTime || '')));
        try {
            await addSessionToJournal(user.id, selectedDate, session);
            await fetchEntries(); // Refresh to get valid ID if needed or confirm
        } catch (err: any) {
            console.error(err);
            setError("فشل الحفظ");
            fetchEntries(); // Revert
        }
    };

    const updateSession = async (session: Session) => {
        if (!user?.id) return;
        setEntries(prev => prev.map(e => e.id === session.id ? session : e));
        try {
            await updateSessionInJournal(user.id, selectedDate, session);
        } catch (err) {
            console.error(err);
            setError("فشل التحديث");
            fetchEntries();
        }
    };

    const deleteSession = async (id: string) => {
        if (!user?.id) return;
        setEntries(prev => prev.filter(e => e.id !== id));
        try {
            await deleteSessionFromJournal(user.id, selectedDate, id);
        } catch (err) {
            console.error(err);
            setError("فشل الحذف");
            fetchEntries();
        }
    };

    return {
        entries,
        isLoading,
        error,
        addSession,
        updateSession,
        deleteSession,
        refresh: fetchEntries
    };
};
