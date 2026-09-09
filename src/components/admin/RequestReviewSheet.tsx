import React, { useState } from 'react';
import type { BloodRequest, UserProfile } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '../ui/Dialog';
import { X, ShieldCheck, Hospital, User, Calendar, MapPin, AlertCircle, CheckCircle2, FileText, Ban } from 'lucide-react';

interface RequestReviewSheetProps {
  request: BloodRequest | null;
  adminProfile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onDecisionComplete: () => void;
}

export const RequestReviewSheet: React.FC<RequestReviewSheetProps> = ({
  request,
  adminProfile,
  isOpen,
  onClose,
  onDecisionComplete,
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const handleApprove = async () => {
    if (submitting) return;
    if (!adminProfile?.id) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Update blood request to APPROVED
      const { error: updateErr } = await supabase
        .from('blood_requests')
        .update({
          status: 'APPROVED',
          verified_by: adminProfile.id,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (updateErr) throw updateErr;

      // 2. Insert into admin_audit_logs
      await supabase.from('admin_audit_logs').insert({
        admin_id: adminProfile.id,
        action: 'APPROVE_REQUEST',
        target_type: 'BLOOD_REQUEST',
        target_id: request.id,
        previous_status: request.status,
        new_status: 'APPROVED',
        metadata: {
          blood_group: request.blood_group,
          units: request.units_required,
          hospital: request.hospital_name_text,
        },
      });

      setSubmitting(false);
      setShowApproveModal(false);
      onDecisionComplete();
      onClose();
    } catch (err: any) {
      console.error('Error approving request:', err);
      setErrorMsg(err.message || 'Failed to approve request.');
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (submitting) return;
    if (!adminProfile?.id || !rejectionReason.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Update blood request to REJECTED
      const { error: updateErr } = await supabase
        .from('blood_requests')
        .update({
          status: 'REJECTED',
          verified_by: adminProfile.id,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (updateErr) throw updateErr;

      // 2. Insert into admin_audit_logs with reason
      await supabase.from('admin_audit_logs').insert({
        admin_id: adminProfile.id,
        action: 'REJECT_REQUEST',
        target_type: 'BLOOD_REQUEST',
        target_id: request.id,
        previous_status: request.status,
        new_status: 'REJECTED',
        reason: rejectionReason.trim(),
        metadata: {
          blood_group: request.blood_group,
          units: request.units_required,
          hospital: request.hospital_name_text,
        },
      });

      setSubmitting(false);
      setShowRejectModal(false);
      onDecisionComplete();
      onClose();
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setErrorMsg(err.message || 'Failed to reject request.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white rounded-t-[28px] sm:rounded-[32px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-stone-200 text-left max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant={request.urgency === 'CRITICAL' ? 'critical' : 'warning'}>
                {request.urgency} URGENCY
              </Badge>
              <span className="text-xs font-mono text-stone-500 font-semibold">
                Ref #{request.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Request Header Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-stone-900">
                {request.blood_group} Blood Request
              </h3>
              <p className="text-sm font-bold text-red-700 mt-0.5">
                {request.hospital_name_text}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-700 text-white flex items-center justify-center font-serif-display font-extrabold text-2xl shadow-xs shrink-0">
              {request.blood_group}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">Units Required:</span>
              <span className="font-bold text-stone-900">{request.units_required} Units</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">Required Date/Time:</span>
              <span className="font-bold text-stone-900">{request.required_date} {request.required_time ? `at ${request.required_time}` : ''}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">Requester Contact:</span>
              <span className="font-bold text-stone-900">{request.requester_phone || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">Patient / Relationship:</span>
              <span className="font-bold text-stone-900">{request.patient_name} ({request.requester_relationship})</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">Hospital Address:</span>
              <span className="font-bold text-stone-900">{request.hospital_address_text}</span>
            </div>
            {request.description && (
              <div className="pt-1 text-stone-700">
                <strong>Medical Notes:</strong> {request.description}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={() => setShowRejectModal(true)}
              variant="outline"
              className="w-1/2 text-red-700 border-red-200 hover:bg-red-50 text-xs font-bold py-2.5"
            >
              <Ban className="w-4 h-4 mr-1.5" />
              Reject Request
            </Button>
            <Button
              onClick={() => setShowApproveModal(true)}
              variant="default"
              className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Approve Request
            </Button>
          </div>

        </div>
      </div>

      {/* APPROVE CONFIRMATION DIALOG */}
      <Dialog
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve this request?"
      >
        <div className="space-y-4 text-xs pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-stone-700 leading-relaxed">
            Once approved, this request for <strong>{request.units_required} units</strong> of <strong>{request.blood_group}</strong> blood at <strong>{request.hospital_name_text}</strong> will become eligible for compatible donor matching.
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
            <Button
              onClick={() => setShowApproveModal(false)}
              variant="outline"
              className="w-1/2 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={submitting}
              variant="default"
              className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
            >
              {submitting ? 'Approving...' : 'Approve Request'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* REJECT CONFIRMATION DIALOG */}
      <Dialog
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject this request?"
      >
        <div className="space-y-4 text-xs pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-stone-700 leading-relaxed">
            Please provide a reason so the requester understands why this request could not be verified.
          </p>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Rejection Reason (Required)</label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Hospital requisition document unreadable or details incomplete..."
              className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
            <Button
              onClick={() => setShowRejectModal(false)}
              variant="outline"
              className="w-1/2 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={submitting || !rejectionReason.trim()}
              variant="destructive"
              className="w-1/2 bg-red-700 hover:bg-red-800 text-xs font-bold disabled:opacity-50"
            >
              {submitting ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
