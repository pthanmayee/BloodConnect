import React, { useState } from 'react';
import type { BloodRequest } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Filter, Hospital, Calendar, ChevronRight, FileText } from 'lucide-react';

interface RequestManagementTableProps {
  allRequests: BloodRequest[];
  onSelectRequest: (request: BloodRequest) => void;
  isLoading?: boolean;
}

export const RequestManagementTable: React.FC<RequestManagementTableProps> = ({
  allRequests,
  onSelectRequest,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/4"></div>
        <div className="h-14 bg-stone-100 rounded w-full"></div>
      </div>
    );
  }

  // Filter requests
  const filteredRequests = allRequests.filter((req) => {
    const matchesSearch =
      req.hospital_name_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.blood_group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'PENDING' && (req.status === 'PENDING_VERIFICATION' || req.status === 'UNDER_REVIEW')) ||
      req.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { id: 'ALL', label: 'All Requests' },
    { id: 'PENDING', label: 'Pending Review' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'ACTIVE', label: 'Active Matching' },
    { id: 'FULFILLED', label: 'Fulfilled' },
    { id: 'CANCELLED', label: 'Cancelled' },
    { id: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Request Management Center</h2>
          <p className="text-xs text-stone-500 mt-0.5">Search, inspect, and moderate all platform blood requests</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref, hospital, blood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statusOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedStatus(opt.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === opt.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="py-10 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50 space-y-1">
          <FileText className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="font-semibold text-stone-900 text-sm">No blood requests match filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    {req.blood_group}
                  </span>
                  <span className="font-extrabold text-stone-900">
                    {req.units_required} {req.units_required === 1 ? 'Unit' : 'Units'}
                  </span>
                  <Badge variant={req.urgency === 'CRITICAL' ? 'critical' : 'warning'}>
                    {req.urgency}
                  </Badge>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-mono text-[11px]">
                    Ref #{req.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="text-stone-700 font-semibold flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{req.hospital_name_text}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-normal">Patient: {req.patient_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                <Badge
                  variant={
                    req.status === 'APPROVED' || req.status === 'ACTIVE'
                      ? 'success'
                      : req.status === 'PENDING_VERIFICATION'
                      ? 'warning'
                      : 'outline'
                  }
                >
                  {req.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectRequest(req)}
                  className="text-xs font-semibold"
                >
                  Inspect <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
