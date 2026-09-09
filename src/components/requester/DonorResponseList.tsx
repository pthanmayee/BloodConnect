import React from 'react';
import type { DonorMatch } from '../../types';
import { ShieldCheck, Heart, Clock, UserCheck, CheckCircle2 } from 'lucide-react';

interface DonorResponseListProps {
  matches: DonorMatch[];
  unitsRequired: number;
}

export const DonorResponseList: React.FC<DonorResponseListProps> = ({
  matches,
  unitsRequired,
}) => {
  const confirmedMatches = matches.filter((m) => ['ACCEPTED', 'NOTIFIED'].includes(m.status));

  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-700 fill-red-700" />
            Donor Responses ({matches.length})
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Privacy-shielded responses from verified local donors
          </p>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
          {confirmedMatches.length} / {unitsRequired} Units Confirmed
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="py-8 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50 space-y-1">
          <Clock className="w-6 h-6 text-stone-400 mx-auto" />
          <p className="font-semibold text-stone-900 text-xs">Waiting for donor responses</p>
          <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
            Compatible verified donors in your area will be alerted once the request is approved.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {matches.map((match, idx) => (
            <div
              key={match.id}
              className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                  #{idx + 1}
                </div>
                <div>
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span>Verified Donor</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>Distance: Approx {match.distance_km || 3.2} km</span>
                    <span>•</span>
                    <span>Match Score: {match.match_score || 100}%</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    ['ACCEPTED', 'NOTIFIED'].includes(match.status)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {match.status === 'ACCEPTED' ? 'Donation Confirmed' : match.status}
                </span>
                {match.responded_at && (
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {new Date(match.responded_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
