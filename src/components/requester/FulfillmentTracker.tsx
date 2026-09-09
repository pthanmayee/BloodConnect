import React, { useState } from 'react';
import type { BloodRequest, DonorMatch } from '../../types';
import { cancelBloodRequest } from '../../lib/fulfillmentService';
import {
  CheckCircle2,
  Clock,
  Heart,
  AlertCircle,
  XCircle,
  PlusCircle,
  Droplet,
  Users,
  Building,
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/button';

interface FulfillmentTrackerProps {
  request: BloodRequest;
  matches: DonorMatch[];
  onRefresh: () => void;
}

export const FulfillmentTracker: React.FC<FulfillmentTrackerProps> = ({
  request,
  matches,
  onRefresh,
}) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const percentage = Math.min(
    100,
    Math.round((request.units_fulfilled / request.units_required) * 100)
  );

  const acceptedMatches = matches.filter((m) => m.status === 'ACCEPTED');
  const totalMatchesCount = matches.length;

  const handleCancelRequest = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const result = await cancelBloodRequest(request.id, cancelReason || 'Cancelled by requester');
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel request');
      }

      setIsCancelDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not cancel blood request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFulfilled = request.status === 'FULFILLED';
  const isCancelled = request.status === 'CANCELLED';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6 text-left">
      
      {/* 1. TOP HEADER & STATUS BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-red-50 text-red-700 font-extrabold text-sm flex items-center justify-center border border-red-100">
              {request.blood_group}
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                {request.patient_name}'s Request Progress
              </h2>
              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-stone-400" />
                <span>{request.hospital_name_text}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isFulfilled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isCancelled
                ? 'bg-stone-100 text-stone-700 border-stone-200'
                : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isFulfilled
                  ? 'bg-emerald-600'
                  : isCancelled
                  ? 'bg-stone-400'
                  : 'bg-red-600'
              }`}
            />
            {request.status.replace('_', ' ')}
          </span>

          {!isFulfilled && !isCancelled && (
            <button
              onClick={() => setIsCancelDialogOpen(true)}
              className="text-xs text-stone-500 hover:text-red-700 font-bold underline transition-colors"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>

      {/* 2. SUCCESS COMPLETION BANNER IF FULFILLED */}
      {isFulfilled && (
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <h3 className="text-sm font-bold text-emerald-900">
              Your request has been completely fulfilled!
            </h3>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            All {request.units_required} required units of {request.blood_group} blood have been confirmed. Thank you to the generous donors who responded to save a life.
          </p>
        </div>
      )}

      {/* 3. VISUAL PROGRESS BAR & UNIT METRICS */}
      <div className="space-y-3 bg-stone-50/70 rounded-xl p-5 border border-stone-200/80">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span>Fulfillment Progress</span>
          <span className="text-red-700">
            {request.units_fulfilled} / {request.units_required} Units Confirmed ({percentage}%)
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFulfilled
                ? 'bg-emerald-600'
                : percentage > 0
                ? 'bg-gradient-to-r from-red-600 to-amber-500'
                : 'bg-stone-300'
            }`}
            style={{ width: `${Math.max(4, percentage)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <p className="text-[10px] uppercase font-bold text-stone-400">Required</p>
            <p className="text-sm font-extrabold text-stone-900">{request.units_required} Units</p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <p className="text-[10px] uppercase font-bold text-stone-400">Confirmed</p>
            <p className="text-sm font-extrabold text-emerald-700">{request.units_fulfilled} Units</p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200">
            <p className="text-[10px] uppercase font-bold text-stone-400">Remaining</p>
            <p className="text-sm font-extrabold text-red-700">
              {Math.max(0, request.units_required - request.units_fulfilled)} Units
            </p>
          </div>
        </div>
      </div>

      {/* 4. STEP-BY-STEP DONATION TIMELINE */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
          Fulfillment Operational Timeline
        </h4>

        <div className="space-y-3 pl-2 border-l-2 border-stone-200">
          {/* Step 1: Request Approved */}
          <div className="relative pl-6 pb-2">
            <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 fill-emerald-600 text-white" />
            </span>
            <p className="text-xs font-bold text-stone-900">Request Approved & Verified</p>
            <p className="text-[11px] text-stone-500">Verified by platform safety coordinator.</p>
          </div>

          {/* Step 2: Matching Active */}
          <div className="relative pl-6 pb-2">
            <span
              className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${
                totalMatchesCount > 0
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 animate-ping text-white'
              } flex items-center justify-center`}
            >
              <CheckCircle2 className="w-3 h-3 fill-current text-white" />
            </span>
            <p className="text-xs font-bold text-stone-900">
              PostGIS Donor Matching ({totalMatchesCount} Donors Notified)
            </p>
            <p className="text-[11px] text-stone-500">
              Screening compatible nearby blood group donors.
            </p>
          </div>

          {/* Step 3: Donor Confirmed */}
          <div className="relative pl-6 pb-2">
            <span
              className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${
                acceptedMatches.length > 0
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-300 text-stone-600'
              } flex items-center justify-center`}
            >
              <Heart className="w-2.5 h-2.5 fill-current" />
            </span>
            <p className="text-xs font-bold text-stone-900">
              Donor Accepted ({acceptedMatches.length} Donor(s) Responded)
            </p>
            <p className="text-[11px] text-stone-500">
              {acceptedMatches.length > 0
                ? `${acceptedMatches.length} donor has responded "I CAN DONATE". Coordination active.`
                : 'Awaiting donor responses...'}
            </p>
          </div>

          {/* Step 4: Full Fulfillment */}
          <div className="relative pl-6">
            <span
              className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ${
                isFulfilled ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'
              } flex items-center justify-center`}
            >
              <Droplet className="w-2.5 h-2.5 fill-current" />
            </span>
            <p className="text-xs font-bold text-stone-900">Request Completion</p>
            <p className="text-[11px] text-stone-500">
              {isFulfilled
                ? 'All required blood units successfully collected & recorded.'
                : `Waiting for ${request.units_required - request.units_fulfilled} more unit(s).`}
            </p>
          </div>
        </div>
      </div>

      {/* CANCEL REQUEST CONFIRMATION DIALOG */}
      <Dialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        title="Cancel Blood Request?"
        description={`Are you sure you want to cancel this request for ${request.patient_name}? Active donors will be notified.`}
      >
        <div className="space-y-4 pt-2 text-left">
          <div>
            <label className="text-xs font-bold text-stone-700">Reason for cancellation (optional)</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Patient requirement fulfilled elsewhere..."
              className="w-full text-xs p-3 mt-1 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500/20"
              rows={2}
            />
          </div>

          {errorMessage && <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isSubmitting}
            >
              Keep Active
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancelRequest}
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-800"
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
