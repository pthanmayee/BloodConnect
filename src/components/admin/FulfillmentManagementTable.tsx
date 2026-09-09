import React from 'react';
import type { DonationFulfillment } from '../../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building,
  RefreshCw,
} from 'lucide-react';

interface FulfillmentManagementTableProps {
  fulfillments: DonationFulfillment[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const FulfillmentManagementTable: React.FC<FulfillmentManagementTableProps> = ({
  fulfillments,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-left space-y-4">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-stone-900 tracking-tight">
            Active & Historical Donation Operations
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational tracking of donor completions, unit verification, and timestamps.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
          title="Refresh operations list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-stone-400" />
          Loading fulfillment records...
        </div>
      ) : fulfillments.length === 0 ? (
        <div className="p-10 text-center space-y-2">
          <FileCheck className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-xs font-bold text-stone-700">No fulfillment records found</p>
          <p className="text-[11px] text-stone-500">
            Fulfillments recorded by donors or admins will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Fulfillment ID</th>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Confirmed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {fulfillments.map((f) => (
                <tr key={f.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-4 py-3.5 text-stone-900 font-mono text-[11px]">
                    {f.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3.5 text-stone-700 font-mono text-[11px]">
                    {f.request_id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3.5 font-bold text-red-700">
                    {f.units_donated} Unit(s)
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        f.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : f.status === 'CANCELLED'
                          ? 'bg-stone-100 text-stone-600 border-stone-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 text-[11px]">
                    {f.confirmed_at ? new Date(f.confirmed_at).toLocaleString() : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
