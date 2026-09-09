import React, { useState, useEffect } from 'react';
import type { BloodRequest, DonorMatch } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { findCompatibleDonorsForRequest } from '../../lib/matchingEngine';
import type { CandidateDonorMatch } from '../../lib/matchingEngine';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '../ui/Dialog';
import { RequestProgress } from './RequestProgress';
import { DonorResponseList } from './DonorResponseList';
import { MapPin, Calendar, Hospital, AlertCircle, X, ShieldCheck, Heart, RefreshCw, Radar } from 'lucide-react';

interface ActiveRequestCardProps {
  request: BloodRequest;
  matches: DonorMatch[];
  onRefresh?: () => void;
}

export const ActiveRequestCard: React.FC<ActiveRequestCardProps> = ({
  request,
  matches,
  onRefresh,
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [candidateDonors, setCandidateDonors] = useState<CandidateDonorMatch[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    if (['APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED'].includes(request.status)) {
      setLoadingCandidates(true);
      findCompatibleDonorsForRequest(request.id).then(({ data }) => {
        setCandidateDonors(data);
        setLoadingCandidates(false);
      });
    }
  }, [request.id, request.status]);

  const unitsConfirmed = matches.filter((m) => ['ACCEPTED', 'NOTIFIED'].includes(m.status)).length;
  const fulfillmentPercentage = Math.min(
    100,
    Math.round((request.units_fulfilled || unitsConfirmed) / request.units_required * 100)
  );

  const handleCancelRequest = async () => {
    setCancelling(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({
          status: 'CANCELLED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (error) throw error;

      setShowCancelDialog(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error('Error cancelling request:', err);
      setErrorMsg(err.message || 'Failed to cancel request.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Card className="border-red-200 bg-white shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-stone-100 bg-stone-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={request.urgency === 'CRITICAL' ? 'critical' : 'warning'}>
                {request.urgency} URGENCY
              </Badge>
              <span className="text-xs font-bold text-stone-500">
                Ref #{request.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  request.status === 'APPROVED' || request.status === 'ACTIVE'
                    ? 'success'
                    : request.status === 'PENDING_VERIFICATION'
                    ? 'warning'
                    : 'outline'
                }
              >
                {request.status === 'PENDING_VERIFICATION'
                  ? '● VERIFICATION PENDING'
                  : request.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Main Specs Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-700 text-white font-serif-display text-3xl font-extrabold flex items-center justify-center shadow-sm shrink-0">
                {request.blood_group}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                  {request.blood_group} Blood Needed — {request.units_required} {request.units_required === 1 ? 'Unit' : 'Units'}
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                  <Hospital className="w-3.5 h-3.5 text-red-700 shrink-0" />
                  <span>{request.hospital_name_text}</span>
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Needed by: {request.required_date} {request.required_time ? `at ${request.required_time}` : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                className="text-red-700 border-red-200 hover:bg-red-50 text-xs font-semibold"
              >
                Cancel Request
              </Button>
            </div>
          </div>

          {/* PostGIS Donor Matching Banner */}
          {['APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED'].includes(request.status) && (
            <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 text-xs text-red-900 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Radar className="w-4 h-4 text-red-700 animate-spin" />
                <span>PostGIS Distance Matching Active</span>
              </div>
              <div className="text-xs font-bold text-red-700">
                {loadingCandidates
                  ? 'Calculating candidate donors...'
                  : `${candidateDonors.length} compatible donors nearby (within 25 km)`}
              </div>
            </div>
          )}

          {/* Fulfillment Progress Bar */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-800">Units Fulfillment Progress</span>
              <span className="text-red-700 font-extrabold">
                {request.units_fulfilled || unitsConfirmed} / {request.units_required} Units Confirmed ({fulfillmentPercentage}%)
              </span>
            </div>

            <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-red-700 h-full transition-all duration-500 rounded-full"
                style={{ width: `${fulfillmentPercentage}%` }}
              />
            </div>
          </div>

          {/* Lifecycle Progress */}
          <RequestProgress
            status={request.status}
            unitsFulfilled={request.units_fulfilled || unitsConfirmed}
            unitsRequired={request.units_required}
          />

          {/* Donor Responses List */}
          <DonorResponseList matches={matches} unitsRequired={request.units_required} />
        </CardContent>
      </Card>

      {/* CANCEL CONFIRMATION DIALOG */}
      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="Cancel this request?"
      >
        <div className="space-y-4 text-xs pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-stone-700 leading-relaxed">
            Donors may already be responding or preparing to donate for this <strong>{request.blood_group}</strong> request at <strong>{request.hospital_name_text}</strong>.
          </p>
          <p className="text-stone-500">
            Cancelling will stop this request from continuing and notify responding donors.
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
            <Button
              onClick={() => setShowCancelDialog(false)}
              variant="outline"
              className="w-1/2 text-xs"
            >
              Keep Request
            </Button>
            <Button
              onClick={handleCancelRequest}
              disabled={cancelling}
              variant="destructive"
              className="w-1/2 bg-red-700 hover:bg-red-800 text-xs font-bold"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Request'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
