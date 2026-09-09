import React from 'react';
import type { AuditLogItem } from '../../types';
import { Activity, Clock, ShieldCheck, AlertCircle, CheckCircle2, Ban } from 'lucide-react';

interface AdminActivityFeedProps {
  logs: AuditLogItem[];
  isLoading?: boolean;
}

export const AdminActivityFeed: React.FC<AdminActivityFeedProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/4"></div>
        <div className="h-12 bg-stone-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-700" />
          <h2 className="text-lg font-bold text-stone-900">Admin Activity & Audit Feed</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
          {logs.length} Logged Actions
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="py-10 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50 space-y-1">
          <Activity className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="font-semibold text-stone-900 text-sm">No recent administrative activity.</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Audit logs for request approvals, user verifications, and suspensions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const isApprove = log.action.includes('APPROVE') || log.action.includes('VERIFY');
            const isReject = log.action.includes('REJECT') || log.action.includes('SUSPEND');

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isApprove
                        ? 'bg-emerald-100 text-emerald-800'
                        : isReject
                        ? 'bg-red-100 text-red-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isApprove ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isReject ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900">
                      Action: {log.action.replace('_', ' ')}
                    </div>
                    <div className="text-stone-600 text-[11px]">
                      Target: {log.target_type} ({log.target_id.slice(0, 8)}) • Status:{' '}
                      <span className="font-semibold">{log.new_status}</span>
                    </div>
                    {log.reason && (
                      <div className="text-stone-500 italic text-[11px] pt-0.5">
                        "Reason: {log.reason}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
