import React, { useState } from 'react';
import type { DonorProfile, UserProfile, AvailabilityStatus } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ShieldCheck, MapPin, AlertCircle, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

interface DonorStatusCardProps {
  donorProfile: DonorProfile | null;
  userProfile: UserProfile | null;
  onStatusUpdated?: () => void;
}

export const DonorStatusCard: React.FC<DonorStatusCardProps> = ({
  donorProfile,
  userProfile,
  onStatusUpdated,
}) => {
  const [updating, setUpdating] = useState(false);

  const bloodGroup = donorProfile?.blood_group || 'O+';
  const availability = donorProfile?.availability_status || 'AVAILABLE';
  const verificationStatus = userProfile?.verification_status || donorProfile?.verification_status || 'PENDING';
  const cityLocation = donorProfile?.address_city || 'City Location';

  const isAvailable = availability === 'AVAILABLE';

  const toggleAvailability = async () => {
    if (verificationStatus === 'SUSPENDED') return;
    const newStatus: AvailabilityStatus = isAvailable ? 'UNAVAILABLE' : 'AVAILABLE';

    setUpdating(true);

    if (donorProfile?.id) {
      try {
        await supabase
          .from('donor_profiles')
          .update({ availability_status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', donorProfile.id);

        if (onStatusUpdated) onStatusUpdated();
      } catch (err) {
        console.warn('Could not persist availability to Supabase:', err);
      }
    }

    setUpdating(false);
  };

  return (
    <Card className="border-[#E7E5E4] bg-white shadow-xs">
      <CardHeader className="border-b border-[#F4F3F0] pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#171717]">Donor Status & Availability</CardTitle>

          {verificationStatus === 'VERIFIED' && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Donor</span>
            </Badge>
          )}

          {verificationStatus === 'PENDING' && (
            <Badge variant="warning" className="gap-1">
              <Clock className="w-3 h-3" />
              <span>Pending Review</span>
            </Badge>
          )}

          {verificationStatus === 'REJECTED' && (
            <Badge variant="critical" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Verification Rejected</span>
            </Badge>
          )}

          {verificationStatus === 'SUSPENDED' && (
            <Badge variant="critical" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Account Suspended</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        
        {/* Pending Verification Explanation */}
        {verificationStatus === 'PENDING' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Your donor profile is being reviewed.</strong> You will receive notifications when compatible urgent requests are matched to you.
            </span>
          </div>
        )}

        {/* Suspended Explanation */}
        {verificationStatus === 'SUSPENDED' && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span>
              <strong>Account Suspended:</strong> Your donor profile is currently restricted from receiving donation requests.
            </span>
          </div>
        )}

        {/* Status Toggle Box */}
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E7E5E4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C62828] text-white flex items-center justify-center font-serif-display font-extrabold text-2xl shadow-xs shrink-0">
              {bloodGroup}
            </div>
            <div className="text-left space-y-0.5">
              <div className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                Current Availability
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-[#16803C] animate-pulse' : 'bg-[#737373]'}`} />
                <span className="text-lg font-extrabold text-[#171717]">
                  {isAvailable ? 'AVAILABLE TO DONATE' : 'UNAVAILABLE'}
                </span>
              </div>
              <p className="text-xs text-[#737373]">
                {isAvailable
                  ? "You're currently visible to compatible blood requests in your area."
                  : "You won't receive new donation requests while unavailable."}
              </p>
            </div>
          </div>

          <Button
            onClick={toggleAvailability}
            disabled={updating || verificationStatus === 'SUSPENDED'}
            variant={isAvailable ? 'outline' : 'default'}
            className={isAvailable ? 'border-[#E7E5E4] hover:bg-white text-xs' : 'bg-[#C62828] hover:bg-[#8F1D2C] text-xs'}
          >
            {updating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isAvailable ? (
              '● Set Unavailable'
            ) : (
              '● Set Available'
            )}
          </Button>
        </div>

        {/* Location & Security Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#737373] gap-2 pt-1 border-t border-[#F4F3F0]">
          <span className="flex items-center gap-1.5 font-semibold text-[#171717]">
            <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
            <span>Primary Location: {cityLocation}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16803C]" />
            <span>Privacy-Shielded Location</span>
          </span>
        </div>

      </CardContent>
    </Card>
  );
};
