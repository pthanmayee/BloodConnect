import React from 'react';
import type { BloodRequestStatus } from '../../types';
import { CheckCircle2, Clock, Droplet, Heart, AlertCircle } from 'lucide-react';

interface RequestProgressProps {
  status: BloodRequestStatus;
  unitsFulfilled: number;
  unitsRequired: number;
}

export const RequestProgress: React.FC<RequestProgressProps> = ({
  status,
  unitsFulfilled,
  unitsRequired,
}) => {
  // Determine active step index:
  // 0: DRAFT
  // 1: PENDING_VERIFICATION / UNDER_REVIEW
  // 2: APPROVED / ACTIVE (Matching)
  // 3: PARTIALLY_FULFILLED / DONOR_RESPONDED
  // 4: FULFILLED

  let currentStep = 1;
  if (status === 'DRAFT') currentStep = 0;
  else if (status === 'PENDING_VERIFICATION' || status === 'UNDER_REVIEW') currentStep = 1;
  else if (status === 'APPROVED' || status === 'ACTIVE') currentStep = 2;
  else if (status === 'PARTIALLY_FULFILLED' || unitsFulfilled > 0) currentStep = 3;
  if (status === 'FULFILLED' || unitsFulfilled >= unitsRequired) currentStep = 4;

  const isCancelled = status === 'CANCELLED' || status === 'REJECTED' || status === 'EXPIRED';

  if (isCancelled) {
    return (
      <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
        <span>Request Lifecycle Ended — Status: <strong>{status}</strong></span>
      </div>
    );
  }

  const steps = [
    { label: 'Submitted', desc: 'Request created' },
    { label: 'Verification', desc: 'Admin review' },
    { label: 'Matching Donors', desc: 'Alerting compatible donors' },
    { label: 'Donor Responded', desc: `${unitsFulfilled}/${unitsRequired} units confirmed` },
    { label: 'Fulfilled', desc: 'Transfusion completed' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Request Lifecycle Progress</div>

      {/* Responsive Step Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.label}
              className={`p-2.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : isCurrent
                  ? 'bg-red-50 border-red-200 text-red-950 font-bold shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping inline-block" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block" />
                )}
              </div>
              <div className="font-semibold text-[11px] leading-tight">{step.label}</div>
              <div className="text-[9px] text-stone-500 mt-0.5">{step.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
