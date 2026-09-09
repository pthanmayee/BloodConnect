import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, RefreshCw, AlertCircle, Heart, Shield, PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRealtimeNotifications } from '../../hooks/useRealtime';
import type { NotificationItem } from '../../hooks/useRealtime';
import { useNavigate } from 'react-router-dom';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, error, connectionStatus, markAsRead, markAllAsRead, refetch } = useRealtimeNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    setIsOpen(false);

    // Route context aware navigation
    if (item.type.includes('MATCH') || item.type.includes('DONOR')) {
      navigate('/donor');
    } else if (item.type.includes('REQUEST')) {
      navigate('/request');
    } else if (item.type.includes('VERIFICATION') || item.type.includes('SYSTEM')) {
      navigate('/admin');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_APPROVED':
      case 'VERIFICATION_APPROVED':
        return <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'REQUEST_REJECTED':
      case 'VERIFICATION_REJECTED':
      case 'VERIFICATION_SUSPENDED':
        return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
      case 'NEW_DONOR_RESPONSE':
      case 'DONOR_ACCEPTED':
        return <Heart className="w-4 h-4 text-red-600 fill-red-600 shrink-0" />;
      case 'MATCH_FOUND':
        return <PlusCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 text-stone-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-red-600 rounded-full border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 px-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Notifications
              </h3>
              {/* Connection Status Badge */}
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  connectionStatus === 'LIVE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : connectionStatus === 'RECONNECTING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === 'LIVE'
                      ? 'bg-emerald-500 animate-ping'
                      : connectionStatus === 'RECONNECTING'
                      ? 'bg-amber-500 animate-bounce'
                      : 'bg-stone-400'
                  }`}
                />
                {connectionStatus === 'LIVE' ? 'Live' : connectionStatus}
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-stone-400" />
                Loading live updates...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-xs text-red-600 bg-red-50/50">
                <p>{error}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-1 text-[11px] underline font-semibold text-red-700"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-stone-700">You're all caught up</p>
                <p className="text-[11px] text-stone-500 mt-0.5">No new notifications right now.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 px-4 cursor-pointer hover:bg-stone-50 transition-colors flex items-start gap-3 ${
                    !item.read ? 'bg-red-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5">{getNotificationIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs font-bold truncate ${
                          !item.read ? 'text-stone-900' : 'text-stone-700'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-stone-400 font-medium shrink-0 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 px-4 bg-stone-50 border-t border-stone-200 text-center">
            <span className="text-[10px] text-stone-500 font-medium">
              Realtime secure channel active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
