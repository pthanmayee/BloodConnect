import React from 'react';
import type { BloodRequest } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, ShieldAlert, Hospital, AlertCircle, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

interface RequestVerificationQueueProps {
  pendingRequests: BloodRequest[];
  onSelectRequest: (request: BloodRequest) => void;
  isLoading?: boolean;
}

export const RequestVerificationQueue: React.FC<RequestVerificationQueueProps> = ({
  pendingRequests,
  onSelectRequest,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/3"></div>
        <div className="h-16 bg-stone-100 rounded w-full"></div>
      </div>
    );
  }

  // Sort queue: CRITICAL > URGENT > NORMAL, then by created_at ascending (oldest first)
  const sortedQueue = [...pendingRequests].sort((a, b) => {
    const urgencyScore = { CRITICAL: 3, URGENT: 2, NORMAL: 1 };
    const scoreA = urgencyScore[a.urgency] || 1;
    const scoreB = urgencyScore[b.urgency] || 1;

    if (scoreA !== scoreB) return scoreB - scoreA;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
          <h2 className="text-lg font-bold text-stone-900">Request Verification Queue</h2>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
          {sortedQueue.length} Pending Review
        </span>
      </div>

      {sortedQueue.length === 0 ? (
        <div className="py-10 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50 space-y-1">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-stone-900 text-sm">Verification queue is clear.</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            All submitted blood requests have been reviewed. New requests will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedQueue.map((req) => {
            const isCritical = req.urgency === 'CRITICAL';
            const isUrgent = req.urgency === 'URGENT';
            const ageMinutes = Math.max(
              1,
              Math.floor((new Date().getTime() - new Date(req.created_at).getTime()) / 60000)
            );

            return (
              <div
                key={req.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                  isCritical
                    ? 'bg-red-50/40 border-red-200'
                    : isUrgent
                    ? 'bg-amber-50/30 border-amber-200'
                    : 'bg-stone-50/50 border-stone-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={isCritical ? 'critical' : isUrgent ? 'warning' : 'outline'}>
                      {req.urgency}
                    </Badge>
                    <span className="font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {req.blood_group} • {req.units_required} {req.units_required === 1 ? 'Unit' : 'Units'}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      Ref #{req.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Hospital className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{req.hospital_name_text}</span>
                  </div>

                  <div className="text-[11px] text-stone-500 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>Submitted {ageMinutes} min ago</span>
                    <span>•</span>
                    <span>Patient: {req.patient_name} ({req.requester_relationship})</span>
                  </div>
                </div>

                <div className="self-start sm:self-auto shrink-0">
                  <Button
                    onClick={() => onSelectRequest(req)}
                    variant="default"
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2"
                  >
                    Review Request <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
