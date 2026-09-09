import React from 'react';
import { Card } from '../ui/card';
import { Shield, Users, Droplet, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AdminKPIsProps {
  totalDonors: number | null;
  totalRequesters: number | null;
  pendingRequestsCount: number | null;
  activeRequestsCount: number | null;
  fulfilledRequestsCount: number | null;
  pendingUsersCount: number | null;
  isLoading?: boolean;
}

export const AdminKPIs: React.FC<AdminKPIsProps> = ({
  totalDonors,
  totalRequesters,
  pendingRequestsCount,
  activeRequestsCount,
  fulfilledRequestsCount,
  pendingUsersCount,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-stone-200 h-24"></div>
        ))}
      </div>
    );
  }

  const formatValue = (val: number | null) => (val !== null ? val.toLocaleString() : '—');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
      <Card className="p-4 border-stone-200 bg-white shadow-xs space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-stone-500 tracking-wider">
          TOTAL DONORS
        </div>
        <div className="text-2xl font-extrabold text-stone-900">
          {formatValue(totalDonors)}
        </div>
        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <Users className="w-3 h-3" /> Registered
        </div>
      </Card>

      <Card className="p-4 border-stone-200 bg-white shadow-xs space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-stone-500 tracking-wider">
          REQUESTERS
        </div>
        <div className="text-2xl font-extrabold text-stone-900">
          {formatValue(totalRequesters)}
        </div>
        <div className="text-[11px] text-stone-500">Platform users</div>
      </Card>

      <Card className="p-4 border-amber-200 bg-amber-50/40 shadow-xs space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
          PENDING VERIFICATION
        </div>
        <div className="text-2xl font-extrabold text-amber-700">
          {formatValue(pendingRequestsCount)}
        </div>
        <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" /> Queue review
        </div>
      </Card>

      <Card className="p-4 border-red-200 bg-red-50/30 shadow-xs space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-red-700 tracking-wider">
          ACTIVE MATCHING
        </div>
        <div className="text-2xl font-extrabold text-red-700">
          {formatValue(activeRequestsCount)}
        </div>
        <div className="text-[11px] text-red-800 font-semibold flex items-center gap-1">
          <Droplet className="w-3 h-3" /> Live requests
        </div>
      </Card>

      <Card className="p-4 border-emerald-200 bg-emerald-50/30 shadow-xs space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
          FULFILLED
        </div>
        <div className="text-2xl font-extrabold text-emerald-800">
          {formatValue(fulfilledRequestsCount)}
        </div>
        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </div>
      </Card>

      <Card className="p-4 border-stone-200 bg-white shadow-xs space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-stone-500 tracking-wider">
          PENDING USERS
        </div>
        <div className="text-2xl font-extrabold text-stone-900">
          {formatValue(pendingUsersCount)}
        </div>
        <div className="text-[11px] text-stone-500">Awaiting verification</div>
      </Card>
    </div>
  );
};
