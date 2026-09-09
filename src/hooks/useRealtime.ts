import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_request_id?: string;
  entity_type?: string;
  entity_id?: string;
  read: boolean;
  read_at?: string;
  created_at: string;
}

export type RealtimeConnectionStatus = 'CONNECTING' | 'LIVE' | 'RECONNECTING' | 'OFFLINE';

const isValidUuid = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
};

/**
 * Custom Hook: Realtime Notifications for current logged-in user
 */
export function useRealtimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<RealtimeConnectionStatus>('CONNECTING');
  const seenIds = useRef<Set<string>>(new Set());

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!user || !isValidUuid(user.id)) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (fetchErr) throw fetchErr;

      const items: NotificationItem[] = data || [];
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.read).length);
      items.forEach((n) => seenIds.current.add(n.id));
      setError(null);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    if (!user || !isValidUuid(user.id)) return;
    try {
      const now = new Date().toISOString();
      const { error: updateErr } = await supabase
        .from('notifications')
        .update({ read: true, read_at: now })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateErr) throw updateErr;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, read_at: now } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user || !isValidUuid(user.id) || notifications.length === 0) return;
    try {
      const now = new Date().toISOString();
      const { error: updateErr } = await supabase
        .from('notifications')
        .update({ read: true, read_at: now })
        .eq('user_id', user.id)
        .eq('read', false);

      if (updateErr) throw updateErr;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, read_at: now })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  useEffect(() => {
    if (!user || !isValidUuid(user.id)) {
      setNotifications([]);
      setUnreadCount(0);
      setConnectionStatus('OFFLINE');
      setLoading(false);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel(`user-notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<NotificationItem>) => {
          const newNotif = payload.new as NotificationItem;
          if (!newNotif || seenIds.current.has(newNotif.id)) return;

          seenIds.current.add(newNotif.id);
          setNotifications((prev) => {
            const next = [newNotif, ...prev];
            setUnreadCount(next.filter((n) => !n.read).length);
            return next;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<NotificationItem>) => {
          const updatedNotif = payload.new as NotificationItem;
          if (!updatedNotif) return;
          setNotifications((prev) => {
            const next = prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n));
            setUnreadCount(next.filter((n) => !n.read).length);
            return next;
          });
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('LIVE');
        } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('RECONNECTING');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('OFFLINE');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}

/**
 * Custom Hook: Realtime updates for Donors
 */
export function useRealtimeDonorUpdates(onUpdate?: () => void) {
  const { user } = useAuth();
  const [status, setStatus] = useState<RealtimeConnectionStatus>('CONNECTING');
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!user || !isValidUuid(user.id)) {
      setStatus('OFFLINE');
      return;
    }

    const channel = supabase
      .channel(`donor-feed:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_requests' },
        () => {
          if (onUpdateRef.current) onUpdateRef.current();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donor_matches' },
        () => {
          if (onUpdateRef.current) onUpdateRef.current();
        }
      )
      .subscribe((subStatus: string) => {
        if (subStatus === 'SUBSCRIBED') setStatus('LIVE');
        else if (subStatus === 'CLOSED' || subStatus === 'CHANNEL_ERROR') setStatus('OFFLINE');
        else setStatus('RECONNECTING');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { status };
}

/**
 * Custom Hook: Realtime updates for Requesters
 */
export function useRealtimeRequesterUpdates(onUpdate?: () => void) {
  const { user } = useAuth();
  const [status, setStatus] = useState<RealtimeConnectionStatus>('CONNECTING');
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!user || !isValidUuid(user.id)) {
      setStatus('OFFLINE');
      return;
    }

    const channel = supabase
      .channel(`requester-feed:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_requests', filter: `requester_id=eq.${user.id}` },
        () => {
          if (onUpdateRef.current) onUpdateRef.current();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donor_matches' },
        () => {
          if (onUpdateRef.current) onUpdateRef.current();
        }
      )
      .subscribe((subStatus: string) => {
        if (subStatus === 'SUBSCRIBED') setStatus('LIVE');
        else if (subStatus === 'CLOSED' || subStatus === 'CHANNEL_ERROR') setStatus('OFFLINE');
        else setStatus('RECONNECTING');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { status };
}

/**
 * Custom Hook: Realtime updates for Admins
 */
export function useRealtimeAdminUpdates(isAdmin: boolean, onUpdate?: () => void) {
  const [status, setStatus] = useState<RealtimeConnectionStatus>('CONNECTING');
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!isAdmin) {
      setStatus('OFFLINE');
      return;
    }

    const channel = supabase
      .channel('admin-live-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, () => {
        if (onUpdateRef.current) onUpdateRef.current();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        if (onUpdateRef.current) onUpdateRef.current();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donor_matches' }, () => {
        if (onUpdateRef.current) onUpdateRef.current();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_audit_logs' }, () => {
        if (onUpdateRef.current) onUpdateRef.current();
      })
      .subscribe((subStatus: string) => {
        if (subStatus === 'SUBSCRIBED') setStatus('LIVE');
        else if (subStatus === 'CLOSED' || subStatus === 'CHANNEL_ERROR') setStatus('OFFLINE');
        else setStatus('RECONNECTING');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return { status };
}
