import React from 'react';
import type { DonorProfile } from '../../types';

interface DonorOverviewProps {
  donorProfile?: DonorProfile | null;
  activeResponsesCount?: number;
  completedDonationsCount?: number;
  isLoading?: boolean;
}

export const DonorOverview: React.FC<DonorOverviewProps> = ({
  donorProfile,
  activeResponsesCount = 0,
  completedDonationsCount = 0,
  isLoading = false,
}) => {
  const lastDonationFormatted = donorProfile?.last_donation_date
    ? new Date(donorProfile.last_donation_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const isAvailable = donorProfile?.availability_status === 'AVAILABLE';

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 text-left animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-[#E7E5E4] h-20"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 text-left">
      <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          RESPONDING TO
        </div>
        <div className="text-xl font-extrabold text-[#171717]">
          {activeResponsesCount > 0 ? `${activeResponsesCount} requests` : '0 requests'}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          DONATIONS
        </div>
        <div className="text-xl font-extrabold text-[#171717]">
          {completedDonationsCount > 0 ? `${completedDonationsCount} completed` : '—'}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          LAST DONATION
        </div>
        <div className="text-base font-extrabold text-[#171717] truncate">
          {lastDonationFormatted}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          STATUS
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#16803C]' : 'bg-[#737373]'}`} />
          <span className="text-sm font-extrabold text-[#171717]">
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
};
