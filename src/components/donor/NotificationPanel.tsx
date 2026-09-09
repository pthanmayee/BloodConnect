import React, { useState } from 'react';
import type { NotificationItem } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Bell, CheckCheck, Clock, X } from 'lucide-react';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const markAsRead = async (id: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (!error && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (!error && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-stone-800" />
            <h3 className="font-bold text-stone-900 text-base">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-700 text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-red-700 hover:text-red-800 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200/60 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">You're all caught up.</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                There are no active notifications at this time.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.read && markAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-white border-stone-200 opacity-75'
                    : 'bg-red-50/40 border-red-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block shrink-0"></span>
                    )}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-stone-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-center text-xs text-stone-500">
          BloodConnect System Notifications
        </div>
      </div>
    </div>
  );
};
