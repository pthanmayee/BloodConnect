import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { BloodRequest, DonorMatch, NotificationItem } from '../types';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { RequesterOverview } from '../components/requester/RequesterOverview';
import { ActiveRequestCard } from '../components/requester/ActiveRequestCard';
import { FulfillmentTracker } from '../components/requester/FulfillmentTracker';
import { BloodRequestForm } from '../components/requester/BloodRequestForm';
import { RequestHistory } from '../components/requester/RequestHistory';
import { RequesterProfileSheet } from '../components/requester/RequesterProfileSheet';
import { NotificationPanel } from '../components/donor/NotificationPanel';
import { MobileBottomNav } from '../components/requester/MobileBottomNav';
import { useRealtimeRequesterUpdates } from '../hooks/useRealtime';
import {
  Bell,
  User as UserIcon,
  RefreshCw,
  AlertCircle,
  Plus,
  Droplet,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const RequestDashboard: React.FC = () => {
  const { userProfile, requesterProfile, refreshProfiles, loading: authLoading } = useAuth();

  const [activeRequest, setActiveRequest] = useState<BloodRequest | null>(null);
  const [historyRequests, setHistoryRequests] = useState<BloodRequest[]>([]);
  const [matches, setMatches] = useState<DonorMatch[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Subscribe to live requester request & match updates
  const { status: realtimeStatus } = useRealtimeRequesterUpdates(() => {
    loadDashboardData();
  });

  // Helper to validate UUID format before Postgres queries
  const isValidUuid = (id?: string | null): boolean => {
    if (!id) return false;
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  };

  // Load Requester Dashboard Data from Supabase
  const loadDashboardData = useCallback(async () => {
    if (!userProfile?.id || !isValidUuid(userProfile.id)) {
      setActiveRequest(null);
      setHistoryRequests([]);
      setMatches([]);
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    setFetchError(null);

    try {
      // 1. Fetch user's blood requests
      const { data: requestsData, error: reqErr } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('requester_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (reqErr) throw reqErr;

      const active = (requestsData || []).find((r: BloodRequest) =>
        ['DRAFT', 'PENDING_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED'].includes(r.status)
      );
      const past = (requestsData || []).filter((r: BloodRequest) =>
        ['FULFILLED', 'EXPIRED', 'CANCELLED', 'REJECTED'].includes(r.status)
      );

      setActiveRequest(active || null);
      setHistoryRequests(past);

      // 2. If active request exists, fetch donor responses / matches
      if (active?.id) {
        const { data: matchesData, error: matchErr } = await supabase
          .from('donor_matches')
          .select('*')
          .eq('request_id', active.id)
          .order('created_at', { ascending: false });

        if (!matchErr && matchesData) {
          setMatches(matchesData as DonorMatch[]);
        }
      } else {
        setMatches([]);
      }

      // 3. Fetch notifications
      const { data: notifData, error: notifErr } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (!notifErr && notifData) {
        setNotifications(notifData as NotificationItem[]);
      }
    } catch (err: any) {
      console.error('Error fetching requester dashboard data:', err);
      // Detailed error fallback
      const msg = err?.message || err?.details || 'Something went wrong while loading your requests.';
      setFetchError(msg);
    } finally {
      setIsLoadingData(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const isVerified = (userProfile?.verification_status || requesterProfile?.verification_status) === 'VERIFIED';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-500 font-medium">Loading Requester Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-stone-900 font-sans pb-20 md:pb-0">
      <Navbar currentRole="requester" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Top Header & Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                realtimeStatus === 'LIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  realtimeStatus === 'LIVE' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                }`}
              />
              {realtimeStatus === 'LIVE' ? 'Live Realtime' : 'Syncing'}
            </span>

            <button
              onClick={loadDashboardData}
              disabled={isLoadingData}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
              title="Refresh workspace"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-stone-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-xs transition-colors"
            >
              <UserIcon className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Profile & Settings</span>
            </button>
          </div>

          <RequesterOverview
            userProfile={userProfile}
            requesterProfile={requesterProfile}
            hasActiveRequest={!!activeRequest}
            onRequestClick={() => setIsFormOpen(true)}
          />
        </div>

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="font-bold underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        )}

        {/* Section Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-6 border-b border-stone-200 pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-bold transition-colors relative ${
                activeTab === 'overview' ? 'text-red-700' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Active Request Workspace {activeRequest ? '(1 Active)' : '(0)'}
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 text-sm font-bold transition-colors relative ${
                activeTab === 'history' ? 'text-red-700' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Request History ({historyRequests.length})
              {activeTab === 'history' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 rounded-full" />
              )}
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ACTIVE REQUEST */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {isLoadingData ? (
                <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-xs animate-pulse space-y-4">
                  <div className="h-6 bg-stone-200 rounded w-1/4"></div>
                  <div className="h-10 bg-stone-100 rounded w-full"></div>
                </div>
              ) : activeRequest ? (
                <div className="space-y-6">
                  <FulfillmentTracker
                    request={activeRequest}
                    matches={matches}
                    onRefresh={loadDashboardData}
                  />
                  <ActiveRequestCard
                    request={activeRequest}
                    matches={matches}
                    onRefresh={loadDashboardData}
                  />
                </div>
              ) : (
                /* Empty Active Request State */
                <div className="bg-white rounded-2xl p-10 border border-stone-200 shadow-xs text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
                    <Droplet className="w-6 h-6 opacity-60" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">No active blood requests</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    You currently have no active emergency blood requests. Create a verified blood request to begin connecting with compatible donors.
                  </p>
                  {isVerified && (
                    <div className="pt-2">
                      <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Blood Request</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REQUEST HISTORY */}
          {activeTab === 'history' && (
            <RequestHistory historyRequests={historyRequests} isLoading={isLoadingData} />
          )}
        </div>

      </main>

      {/* BLOOD REQUEST CREATION MULTI-STEP WIZARD */}
      <BloodRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        userProfile={userProfile}
        requesterProfile={requesterProfile}
        onRequestSubmitted={loadDashboardData}
      />

      {/* NOTIFICATIONS PANEL */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onRefresh={loadDashboardData}
      />

      {/* REQUESTER PROFILE & SETTINGS SHEET */}
      <RequesterProfileSheet
        userProfile={userProfile}
        requesterProfile={requesterProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={refreshProfiles}
      />

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRequest={() => setIsFormOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        isVerified={isVerified}
      />

      <Footer />
    </div>
  );
};
