import React, { useState } from 'react';
import type { BloodRequest, DonorMatch } from '../../types';
import { confirmDonation, cancelDonorMatch } from '../../lib/fulfillmentService';
import {
  Heart,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Droplet,
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/button';

interface ActiveDonationCardProps {
  match: DonorMatch;
  request: BloodRequest;
  onRefresh: () => void;
}

export const ActiveDonationCard: React.FC<ActiveDonationCardProps> = ({
  match,
  request,
  onRefresh,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [unitsDonated, setUnitsDonated] = useState(1);
  const [notes, setNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmDonation = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const result = await confirmDonation(match.id, unitsDonated, notes);
      if (!result.success) {
        throw new Error(result.error || 'Failed to record donation');
      }

      setIsConfirmOpen(false);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not record donation confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelParticipation = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const result = await cancelDonorMatch(match.id, cancelReason || 'Donor unavailable');
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel participation');
      }

      setIsCancelOpen(false);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not withdraw from donation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-red-200/90 shadow-md p-6 space-y-5 text-left relative overflow-hidden">
      {/* Top Banner Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-amber-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
            {request.blood_group}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-700">
                Active Donation Task
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Accepted
              </span>
            </div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight mt-0.5">
              {request.hospital_name_text}
            </h3>
          </div>
        </div>

        <span className="text-xs font-bold text-stone-500 shrink-0">
          {match.distance_km ? `${match.distance_km} km away` : 'Nearby'}
        </span>
      </div>

      {/* Coordination Details */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2.5 text-xs text-stone-700">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-500">Required Units:</span>
          <span className="font-bold text-stone-900">{request.units_required} Units ({request.blood_group})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-500">Urgency:</span>
          <span className="font-bold text-red-700 uppercase">{request.urgency}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-500">Location Area:</span>
          <span className="font-bold text-stone-900">{request.hospital_address_text}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-stone-200">
          <span className="font-semibold text-stone-500">Next Step:</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Coordinate with hospital & confirm completion
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
        <Button
          onClick={() => setIsConfirmOpen(true)}
          className="w-full sm:w-auto flex-1 bg-red-700 hover:bg-red-800 text-white font-bold text-xs gap-1.5 shadow-sm py-2.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm I Donated Blood</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsCancelOpen(true)}
          className="w-full sm:w-auto text-stone-600 hover:text-red-700 border-stone-300 text-xs font-bold py-2.5"
        >
          <span>Withdraw Participation</span>
        </Button>
      </div>

      {/* CONFIRM DONATION DIALOG */}
      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Your Donation"
        description={`Please record the blood donation completed at ${request.hospital_name_text}.`}
      >
        <div className="space-y-4 pt-2 text-left">
          <div>
            <label className="text-xs font-bold text-stone-700">Units Donated</label>
            <input
              type="number"
              min={1}
              max={Math.max(1, request.units_required - request.units_fulfilled)}
              value={unitsDonated}
              onChange={(e) => setUnitsDonated(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs p-3 mt-1 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700">Notes / Reference (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed donation at blood bank ward #3..."
              className="w-full text-xs p-3 mt-1 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500/20"
              rows={2}
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmDonation}
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-800 text-white font-bold"
            >
              {isSubmitting ? 'Recording...' : 'Record Completion'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* WITHDRAW / CANCEL PARTICIPATION DIALOG */}
      <Dialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title="Withdraw from Donation?"
        description="If you are no longer able to donate, withdrawing allows BloodConnect to notify another compatible donor."
      >
        <div className="space-y-4 pt-2 text-left">
          <div>
            <label className="text-xs font-bold text-stone-700">Reason (Optional)</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Health update / schedule conflict..."
              className="w-full text-xs p-3 mt-1 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500/20"
              rows={2}
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelOpen(false)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancelParticipation}
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-800"
            >
              {isSubmitting ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
