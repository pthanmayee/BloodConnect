import React from 'react';
import type { BloodRequest } from '../../types';
import { History, Calendar, Hospital, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface RequestHistoryProps {
  historyRequests: BloodRequest[];
  isLoading?: boolean;
}

export const RequestHistory: React.FC<RequestHistoryProps> = ({
  historyRequests,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/4"></div>
        <div className="h-12 bg-stone-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-red-700" />
            Request History
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">Your past fulfilled or closed blood requests</p>
        </div>
        {historyRequests.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            {historyRequests.length} total
          </span>
        )}
      </div>

      {historyRequests.length === 0 ? (
        <div className="py-10 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50">
          <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="font-semibold text-stone-900 text-sm">No previous requests</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Your completed and past blood requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    {req.blood_group}
                  </span>
                  <span className="font-extrabold text-stone-900">
                    {req.units_required} {req.units_required === 1 ? 'Unit' : 'Units'}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Hospital className="w-3.5 h-3.5 text-stone-400" />
                    {req.hospital_name_text}
                  </span>
                </div>
                <div className="text-stone-500 text-[11px] flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Required: {req.required_date}</span>
                  <span>•</span>
                  <span>Ref #{req.id.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <div className="self-start sm:self-auto">
                <Badge
                  variant={
                    req.status === 'FULFILLED'
                      ? 'success'
                      : req.status === 'CANCELLED'
                      ? 'outline'
                      : 'warning'
                  }
                >
                  {req.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
