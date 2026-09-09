import React from 'react';
import type { UserProfile, RequesterProfile } from '../../types';
import { Plus, ShieldCheck, Clock, AlertCircle, Droplet } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface RequesterOverviewProps {
  userProfile: UserProfile | null;
  requesterProfile: RequesterProfile | null;
  hasActiveRequest: boolean;
  onRequestClick: () => void;
}

export const RequesterOverview: React.FC<RequesterOverviewProps> = ({
  userProfile,
  requesterProfile,
  hasActiveRequest,
  onRequestClick,
}) => {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Requester';
  const verificationStatus = userProfile?.verification_status || requesterProfile?.verification_status || 'PENDING';

  return (
    <div className="space-y-6">
      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {getGreetingTime()}, {firstName}.
            </h1>
            {verificationStatus === 'VERIFIED' && (
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Requester
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Let's help get the blood you need, safely and quickly.
          </p>
        </div>

        {/* Primary CTA */}
        {verificationStatus === 'VERIFIED' && !hasActiveRequest && (
          <Button
            onClick={onRequestClick}
            variant="default"
            className="bg-[#C62828] hover:bg-[#8F1D2C] text-white font-bold gap-2 px-5 py-2.5 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>REQUEST BLOOD</span>
          </Button>
        )}
      </div>

      {/* Verification Banners */}
      {verificationStatus === 'PENDING' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
          <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-amber-950">Your account is being reviewed.</h4>
            <p className="text-amber-800 leading-relaxed">
              Your requester registration has been submitted and is undergoing administrative review. You will be able to submit blood requests as soon as your account verification is approved.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'REJECTED' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-red-950">Account Verification Rejected</h4>
            <p className="text-red-800 leading-relaxed">
              Your verification details require updates before blood requests can be created. Please review your profile settings or contact support.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'SUSPENDED' && (
        <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-stone-900">Account Currently Restricted</h4>
            <p className="text-stone-600 leading-relaxed">
              Your requester account is currently restricted from submitting new blood requests. Please contact platform support for assistance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
