import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type {
  BloodRequest,
  DonorMatch,
  DonationRecord,
  NotificationItem,
} from '../types';
import { isDonorCompatibleWithRequest } from '../lib/compatibility';
import { getMatchingRequestsForDonor } from '../lib/matchingEngine';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { DonorStatusCard } from '../components/donor/DonorStatusCard';
import { DonorOverview } from '../components/donor/DonorOverview';
import { BloodRequestCard } from '../components/donor/BloodRequestCard';
import { BloodRequestSheet } from '../components/donor/BloodRequestSheet';
import { DonationHistory } from '../components/donor/DonationHistory';
import { NotificationPanel } from '../components/donor/NotificationPanel';
import { DonorProfileSheet } from '../components/donor/DonorProfileSheet';
import { MobileBottomNav } from '../components/donor/MobileBottomNav';
import { ActiveDonationCard } from '../components/donor/ActiveDonationCard';
import { useRealtimeDonorUpdates } from '../hooks/useRealtime';
import {
  Bell,
  User as UserIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Droplet,
  Heart,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { userProfile, donorProfile, refreshProfiles, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donorMatches, setDonorMatches] = useState<DonorMatch[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'history'>('overview');
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Subscribe to live database updates for donors
  const { status: realtimeStatus } = useRealtimeDonorUpdates(() => {
    loadDashboardData();
  });

  // Time-based greeting helper
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Donor';

  const isValidUuid = (id?: string | null): boolean => {
    if (!id) return false;
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  };

  // Fetch Dashboard Data from Supabase
  const loadDashboardData = useCallback(async () => {
    if (!userProfile?.id || !donorProfile?.id || !isValidUuid(donorProfile.id)) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    setFetchError(null);

    try {
      // 1. Fetch active verified/approved blood requests via PostGIS matching engine
      const { data: matchedReqs, error: reqErr } = await getMatchingRequestsForDonor(donorProfile.id);

      if (reqErr) throw new Error(reqErr);

      // Filter compatible blood requests
      const compatibleRequests = (matchedReqs || []).filter((req: BloodRequest) =>
        isDonorCompatibleWithRequest(donorProfile.blood_group, req.blood_group)
      );
      setRequests(compatibleRequests);

      // 2. Fetch matches for current donor
      const { data: matchesData, error: matchErr } = await supabase
        .from('donor_matches')
        .select('*')
        .eq('donor_id', donorProfile.id);

      if (!matchErr && matchesData) {
        setDonorMatches(matchesData as DonorMatch[]);
      }

      // 3. Fetch completed donation records
      const { data: historyData, error: histErr } = await supabase
        .from('donation_records')
        .select('*')
        .eq('donor_id', donorProfile.id)
        .order('donation_date', { ascending: false });

      if (!histErr && historyData) {
        setDonations(historyData as DonationRecord[]);
      }

      // 4. Fetch notifications for authenticated user
      const { data: notifData, error: notifErr } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (!notifErr && notifData) {
        setNotifications(notifData as NotificationItem[]);
      }
    } catch (err: any) {
      console.error('Error fetching donor dashboard data:', err);
      const msg = err?.message || err?.details || 'Something went wrong while loading your requests.';
      setFetchError(msg);
    } finally {
      setIsLoadingData(false);
    }
  }, [userProfile?.id, donorProfile?.id, donorProfile?.blood_group]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived metrics for Donor Overview
  const activeResponsesCount = donorMatches.filter((m) =>
    ['MATCHED', 'NOTIFIED', 'ACCEPTED'].includes(m.status)
  ).length;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-500 font-medium">Loading Donor Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-stone-900 font-sans pb-20 md:pb-0">
      <Navbar currentRole="donor" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* 1. TOP HEADER & GREETING */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {getGreetingTime()}, {firstName}.
              </h1>
              {userProfile?.verification_status === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Your willingness to help can make a real difference.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
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
              {realtimeStatus === 'LIVE' ? 'Live Channel' : 'Syncing'}
            </span>

            <button
              onClick={loadDashboardData}
              disabled={isLoadingData}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
              title="Refresh dashboard data"
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
        </div>

        {/* 2. DONOR VERIFICATION & STATUS CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <DonorStatusCard
              donorProfile={donorProfile}
              userProfile={userProfile}
              onStatusUpdated={refreshProfiles}
            />
          </div>

          <div className="lg:col-span-4">
            <DonorOverview
              donorProfile={donorProfile}
              activeResponsesCount={activeResponsesCount}
              completedDonationsCount={donations.length}
              isLoading={isLoadingData}
            />
          </div>
        </div>

        {/* 3. ERROR BANNER IF FETCH FAILS */}
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

        {/* 4. DASHBOARD SECTION TABS (Desktop / Tablet) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-sm font-bold transition-colors relative ${
                  activeTab === 'overview'
                    ? 'text-red-700'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Requests that need you ({requests.length})
                {activeTab === 'overview' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 text-sm font-bold transition-colors relative ${
                  activeTab === 'history'
                    ? 'text-red-700'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Donation History
                {activeTab === 'history' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 rounded-full" />
                )}
              </button>
            </div>

            <div className="text-xs text-stone-500 hidden sm:block">
              Matching Blood Group:{' '}
              <span className="font-bold text-red-700">{donorProfile?.blood_group || '—'}</span>
            </div>
          </div>

          {/* TAB CONTENT: REQUESTS FEED */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Accepted Match Card */}
              {(() => {
                const activeMatch = donorMatches.find((m) => m.status === 'ACCEPTED');
                if (!activeMatch) return null;
                const matchedReq = requests.find((r) => r.id === activeMatch.request_id);
                if (!matchedReq) return null;

                return (
                  <ActiveDonationCard
                    key={activeMatch.id}
                    match={activeMatch}
                    request={matchedReq}
                    onRefresh={loadDashboardData}
                  />
                );
              })()}

              <div>
                <h2 className="text-lg font-bold text-stone-900">Requests that need you</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verified blood requests compatible with your blood group ({donorProfile?.blood_group || '—'}).
                </p>
              </div>

              {isLoadingData ? (
                /* Skeleton Loading Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm animate-pulse space-y-4"
                    >
                      <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                      <div className="h-6 bg-stone-200 rounded w-2/3"></div>
                      <div className="h-10 bg-stone-100 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : requests.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl p-10 border border-stone-200 shadow-xs text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
                    <Droplet className="w-6 h-6 opacity-60" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">You're all caught up.</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    There are no verified requests that match your blood group right now.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
                    >
                      Update availability
                    </button>
                  </div>
                </div>
              ) : (
                /* Compatible Request Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requests.map((request) => {
                    const existingMatch = donorMatches.find((m) => m.request_id === request.id);
                    return (
                      <BloodRequestCard
                        key={request.id}
                        request={request}
                        match={existingMatch}
                        onSelectRequest={(req) => setSelectedRequest(req)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: DONATION HISTORY */}
          {activeTab === 'history' && (
            <DonationHistory donations={donations} isLoading={isLoadingData} />
          )}
        </div>

        {/* 5. HELPFUL DONOR INFORMATION SECTION */}
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-red-400" />
              Donor Safety & Guidelines
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Every drop brings hope to a family in need.
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Before donating, ensure you are well-hydrated, have eaten a healthy meal, and are feeling completely well. Your location is privacy-shielded until you choose to respond to a request.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all shadow-md"
            >
              Manage Preferences
            </button>
          </div>
        </div>

      </main>

      {/* REQUEST DETAIL SHEET MODAL */}
      {selectedRequest && (
        <BloodRequestSheet
          request={selectedRequest}
          donorProfile={donorProfile}
          match={donorMatches.find((m) => m.request_id === selectedRequest.id)}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onMatchUpdated={loadDashboardData}
        />
      )}

      {/* NOTIFICATION PANEL */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onRefresh={loadDashboardData}
      />

      {/* DONOR PROFILE & SETTINGS SHEET */}
      <DonorProfileSheet
        userProfile={userProfile}
        donorProfile={donorProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={refreshProfiles}
      />

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'requests') setActiveTab('overview');
          else setActiveTab(tab);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <Footer />
    </div>
  );
};
