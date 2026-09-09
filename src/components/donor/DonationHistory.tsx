import React from 'react';
import type { DonationRecord } from '../../types';
import { Calendar, Hospital, Droplet, CheckCircle2, History } from 'lucide-react';

interface DonationHistoryProps {
  donations: DonationRecord[];
  isLoading?: boolean;
}

export const DonationHistory: React.FC<DonationHistoryProps> = ({ donations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/4"></div>
        <div className="h-12 bg-stone-100 rounded w-full"></div>
        <div className="h-12 bg-stone-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-red-700" />
            Donation History
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">Your recorded blood donations</p>
        </div>
        {donations.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            {donations.length} total
          </span>
        )}
      </div>

      {donations.length === 0 ? (
        <div className="py-10 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 mx-auto flex items-center justify-center mb-3">
            <Droplet className="w-6 h-6 opacity-60" />
          </div>
          <p className="font-semibold text-stone-900 text-sm">No donations recorded yet</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Your completed donations will appear here once you make your first contribution.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Compact Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-medium">
                  <th className="pb-3 pl-2">Date</th>
                  <th className="pb-3">Hospital / Facility</th>
                  <th className="pb-3">Blood Group</th>
                  <th className="pb-3">Units</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 pl-2 font-medium text-stone-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(donation.donation_date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="py-3 font-medium text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <Hospital className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{donation.hospital_name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-red-700 bg-red-50 text-[11px]">
                        {donation.blood_group}
                      </span>
                    </td>
                    <td className="py-3 text-stone-700">{donation.units} {donation.units === 1 ? 'unit' : 'units'}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="md:hidden space-y-3">
            {donations.map((donation) => (
              <div key={donation.id} className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    {donation.blood_group}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                </div>
                <div className="font-semibold text-stone-900 text-sm">{donation.hospital_name}</div>
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-200/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(donation.donation_date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>{donation.units} {donation.units === 1 ? 'unit' : 'units'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
