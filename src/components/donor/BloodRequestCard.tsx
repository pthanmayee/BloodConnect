import React from 'react';
import type { BloodRequest, DonorMatch } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BloodRequestCardProps {
  request: BloodRequest;
  match?: DonorMatch;
  responseStatus?: string | null;
  onSelectRequest?: (request: BloodRequest) => void;
  onSelect?: (request: BloodRequest) => void;
}

export const BloodRequestCard: React.FC<BloodRequestCardProps> = ({
  request,
  match,
  responseStatus,
  onSelectRequest,
  onSelect,
}) => {
  const isCritical = request.urgency === 'CRITICAL';
  const isUrgent = request.urgency === 'URGENT';
  const handleSelect = onSelectRequest || onSelect || (() => {});

  const currentMatchStatus = match?.status || responseStatus;

  return (
    <Card className="border-[#E7E5E4] hover:border-[#C62828] transition-all hover:shadow-md text-left space-y-4 flex flex-col justify-between p-5 bg-white rounded-xl">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#F4F3F0] pb-3">
          <div className="flex items-center gap-2">
            <Badge variant={isCritical ? 'critical' : isUrgent ? 'warning' : 'outline'}>
              {request.urgency}
            </Badge>
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Request
            </span>
          </div>

          {request.distance_km ? (
            <div className="flex items-center gap-1 text-xs font-bold text-[#C62828] bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              <MapPin className="w-3.5 h-3.5" />
              <span>{request.distance_km} km away</span>
            </div>
          ) : (
            <span className="text-[11px] text-stone-400">Verified</span>
          )}
        </div>

        {/* Content */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              {request.blood_group} Blood Required
            </h3>
            <p className="text-sm font-bold text-stone-800">
              {request.hospital_name_text}
            </p>
            <p className="text-xs text-stone-500">
              Required: {request.required_date} • {request.units_required} {request.units_required === 1 ? 'Unit' : 'Units'} needed
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#C62828] text-white flex items-center justify-center font-serif-display font-extrabold text-xl shrink-0 shadow-xs">
            {request.blood_group}
          </div>
        </div>
      </div>

      {/* Card Action / Response State */}
      <div className="pt-3 border-t border-[#F4F3F0]">
        {currentMatchStatus === 'ACCEPTED' || currentMatchStatus === 'NOTIFIED' ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Response Registered — Pending Request Flow</span>
          </div>
        ) : currentMatchStatus === 'MATCHED' ? (
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Response Pending</span>
          </div>
        ) : request.status === 'FULFILLED' ? (
          <div className="p-2.5 rounded-xl bg-[#F4F3F0] text-[#737373] text-xs font-bold text-center">
            Request Fulfilled
          </div>
        ) : (
          <Button
            onClick={() => handleSelect(request)}
            variant="default"
            className="w-full justify-center bg-[#C62828] hover:bg-[#8F1D2C] text-xs py-2 font-semibold"
          >
            View Request
          </Button>
        )}
      </div>
    </Card>
  );
};
