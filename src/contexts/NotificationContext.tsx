import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../config/supabaseClient';
import { useAuth } from './AuthContext';

interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    lastError: string | null;
    refresh: () => Promise<void>;
    dismiss: (notifId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLastError(null); // Clear previous errors
        const client = getSupabaseClient();
        if (!client || !auth.user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        try {
            console.log('[NotificationContext] 🔍 Checking DB for active notifications & private messages...');

            // 1. Get active admin broadcast notifications
            const { data: notifs, error: notifError } = await client
                .from('admin_notifications')
                .select('id, title, message, created_at')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(10);

            if (notifError) {
                console.error('[NotificationContext] ❌ DB Error (AdminNotifs):', notifError.message);
                setLastError(notifError.message);
                return;
            }

            // 2. Get user's dismissals for those broadcasts
            const { data: dismissals, error: disError } = await client
                .from('notification_dismissals')
                .select('notification_id')
                .eq('user_id', auth.user.id);

            const dismissedIds = new Set((dismissals || []).map((d: any) => d.notification_id));
            const activeBroadcasts = (notifs || []).filter(n => !dismissedIds.has(n.id));

            // 3. Get UNREAD private messages count
            const { count: unreadMsgs, error: msgError } = await client
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_id', auth.user.id)
                .eq('read', false);

            if (msgError) {
                console.error('[NotificationContext] ⚠️ Messages fetch error:', msgError.message);
            }

            const privateCount = unreadMsgs || 0;
            const broadcastCount = activeBroadcasts.length;
            const totalUnread = privateCount + broadcastCount;

            console.log(`[NotificationContext] ✅ Sync Complete: Broadcasts(${broadcastCount}) + PrivateMsg(${privateCount}) = Total(${totalUnread})`);

            // Debug globally
            (window as any).TAMKEEN_NOTIFS = {
                broadcasts: activeBroadcasts,
                privateUnread: privateCount,
                total: totalUnread,
                user: auth.user.id
            };

            setNotifications(activeBroadcasts);
            setUnreadCount(totalUnread);
        } catch (err: any) {
            console.error('[NotificationContext] 🔥 Critical Failure:', err);
            setLastError(err.message || 'Unknown failure check console');
        }
    }, [auth.user]);

    const dismiss = async (notifId: string) => {
        const client = getSupabaseClient();
        if (!client || !auth.user) return;

        try {
            await client
                .from('notification_dismissals')
                .insert({ notification_id: notifId, user_id: auth.user.id });

            setNotifications(prev => prev.filter(n => n.id !== notifId));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('[NotificationContext] Error dismissing:', err);
        }
    };

    useEffect(() => {
        if (auth.user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 20000); // 20 sec sync
            return () => clearInterval(interval);
        }
    }, [auth.user, fetchNotifications]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, lastError, refresh: fetchNotifications, dismiss }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};
