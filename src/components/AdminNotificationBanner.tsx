import React from 'react';
import { X, Bell, Megaphone } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const AdminNotificationBanner: React.FC = () => {
    const { notifications, dismiss } = useNotifications();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[999] flex flex-col gap-2 p-3">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className="notification-banner mx-auto w-full max-w-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl shadow-2xl shadow-red-500/30 border border-red-400/30 overflow-hidden animate-in slide-in-from-top-4 duration-500"
                >
                    <div className="relative flex items-start gap-3 p-4">
                        {/* Pulsing Bell Icon */}
                        <div className="relative flex-shrink-0 mt-0.5">
                            <div className="absolute inset-0 animate-ping bg-white/20 rounded-full"></div>
                            <div className="relative p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                <Megaphone size={18} className="animate-bounce" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {notif.title && (
                                <h4 className="font-black text-sm mb-1 text-white/95 flex items-center gap-2">
                                    <Bell size={14} className="animate-pulse" />
                                    {notif.title}
                                </h4>
                            )}
                            <p className="text-sm font-bold text-white/90 leading-relaxed">
                                {notif.message}
                            </p>
                            <p className="text-[10px] text-white/50 mt-2 font-mono">
                                {new Date(notif.created_at).toLocaleDateString('ar-DZ', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => dismiss(notif.id)}
                            className="flex-shrink-0 p-1.5 bg-white/10 hover:bg-white/25 rounded-xl transition-all active:scale-90"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Glowing bottom border */}
                    <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse"></div>
                </div>
            ))}
        </div>
    );
};

export default AdminNotificationBanner;
