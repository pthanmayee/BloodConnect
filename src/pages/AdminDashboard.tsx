import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { BloodRequest, UserProfile, AuditLogItem } from '../types';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { AdminKPIs } from '../components/admin/AdminKPIs';
import { RequestVerificationQueue } from '../components/admin/RequestVerificationQueue';
import { RequestReviewSheet } from '../components/admin/RequestReviewSheet';
import { UserVerificationQueue } from '../components/admin/UserVerificationQueue';
import { RequestManagementTable } from '../components/admin/RequestManagementTable';
import { AdminActivityFeed } from '../components/admin/AdminActivityFeed';
import { AdminCharts } from '../components/admin/AdminCharts';
import { FulfillmentManagementTable } from '../components/admin/FulfillmentManagementTable';
import { getAllFulfillments } from '../lib/fulfillmentService';
import type { DonationFulfillment } from '../types';
import {
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Users,
  Droplet,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useRealtimeAdminUpdates } from '../hooks/useRealtime';

export const AdminDashboard: React.FC = () => {
  const { userProfile, role, loading: authLoading } = useAuth();

  const [allRequests, setAllRequests] = useState<BloodRequest[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [fulfillments, setFulfillments] = useState<DonationFulfillment[]>([]);

  const [selectedReviewRequest, setSelectedReviewRequest] = useState<BloodRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'operations' | 'users' | 'audit'>('overview');

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Live Admin updates subscription
  const isAdmin = role === 'admin' || userProfile?.role === 'admin';
  const { status: realtimeStatus } = useRealtimeAdminUpdates(isAdmin, () => {
    loadAdminData();
  });

  // Load Admin Workspace Data from Supabase
  const loadAdminData = useCallback(async () => {
    setIsLoadingData(true);
    setFetchError(null);

    try {
      // 1. Fetch all blood requests
      const { data: requestsData, error: reqErr } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!reqErr && requestsData) {
        setAllRequests(requestsData as BloodRequest[]);
      }

      // 2. Fetch all user profiles
      const { data: usersData, error: usersErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!usersErr && usersData) {
        setAllUsers(usersData as UserProfile[]);
      }

      // 3. Fetch admin audit logs
      const { data: auditData, error: auditErr } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!auditErr && auditData) {
        setAuditLogs(auditData as AuditLogItem[]);
      }

      // 4. Fetch operational fulfillments
      const fulfillmentList = await getAllFulfillments();
      setFulfillments(fulfillmentList);
    } catch (err: any) {
      console.error('Error fetching admin workspace data:', err);
      setFetchError('Something went wrong while loading admin operations data.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Derived KPI metrics
  const totalDonors = allUsers.filter((u) => u.role === 'donor').length;
  const totalRequesters = allUsers.filter((u) => u.role === 'requester').length;
  const pendingRequests = allRequests.filter((r) =>
    ['PENDING_VERIFICATION', 'UNDER_REVIEW'].includes(r.status)
  );
  const activeRequestsCount = allRequests.filter((r) =>
    ['APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED'].includes(r.status)
  ).length;
  const fulfilledRequestsCount = allRequests.filter((r) => r.status === 'FULFILLED').length;
  const pendingUsers = allUsers.filter((u) => u.verification_status === 'PENDING');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-500 font-medium">Loading Admin Operations Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-stone-900 font-sans">
      <Navbar currentRole="admin" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Admin Control Center
              </h1>
              <Badge variant="dark" className="gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Admin</span>
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Platform oversight, blood request verification, user moderation, and audit logs.
            </p>
          </div>

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
              {realtimeStatus === 'LIVE' ? 'Realtime Operations' : 'Syncing'}
            </span>

            <button
              onClick={loadAdminData}
              disabled={isLoadingData}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
              title="Refresh admin workspace"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Operational KPIs */}
        <AdminKPIs
          totalDonors={totalDonors}
          totalRequesters={totalRequesters}
          pendingRequestsCount={pendingRequests.length}
          activeRequestsCount={activeRequestsCount}
          fulfilledRequestsCount={fulfilledRequestsCount}
          pendingUsersCount={pendingUsers.length}
          isLoading={isLoadingData}
        />

        {/* Error Banner */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{fetchError}</span>
            </div>
            <button onClick={loadAdminData} className="font-bold underline hover:text-red-900">
              Try again
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-6 border-b border-stone-200 pb-3 overflow-x-auto">
            {[
              { id: 'overview', label: `Verification Queue (${pendingRequests.length})` },
              { id: 'requests', label: `All Requests (${allRequests.length})` },
              { id: 'operations', label: `Fulfillment Operations (${fulfillments.length})` },
              { id: 'users', label: `User Moderation (${pendingUsers.length})` },
              { id: 'audit', label: `Audit Log (${auditLogs.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 text-sm font-bold whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-red-700'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & VERIFICATION QUEUE */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <RequestVerificationQueue
                pendingRequests={pendingRequests}
                onSelectRequest={(req) => setSelectedReviewRequest(req)}
                isLoading={isLoadingData}
              />

              <AdminCharts />

              <AdminActivityFeed logs={auditLogs.slice(0, 5)} isLoading={isLoadingData} />
            </div>
          )}

          {/* TAB 2: ALL REQUESTS MANAGEMENT */}
          {activeTab === 'requests' && (
            <RequestManagementTable
              allRequests={allRequests}
              onSelectRequest={(req) => setSelectedReviewRequest(req)}
              isLoading={isLoadingData}
            />
          )}

          {/* TAB 3: FULFILLMENT OPERATIONS */}
          {activeTab === 'operations' && (
            <FulfillmentManagementTable
              fulfillments={fulfillments}
              isLoading={isLoadingData}
              onRefresh={loadAdminData}
            />
          )}

          {/* TAB 3: USER MODERATION QUEUE */}
          {activeTab === 'users' && (
            <UserVerificationQueue
              pendingUsers={pendingUsers}
              adminProfile={userProfile}
              onRefreshQueue={loadAdminData}
              isLoading={isLoadingData}
            />
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === 'audit' && (
            <AdminActivityFeed logs={auditLogs} isLoading={isLoadingData} />
          )}
        </div>

      </main>

      {/* REQUEST REVIEW SHEET */}
      {selectedReviewRequest && (
        <RequestReviewSheet
          request={selectedReviewRequest}
          adminProfile={userProfile}
          isOpen={!!selectedReviewRequest}
          onClose={() => setSelectedReviewRequest(null)}
          onDecisionComplete={loadAdminData}
        />
      )}

      <Footer />
    </div>
  );
};
