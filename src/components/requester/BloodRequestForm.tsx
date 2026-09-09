import React, { useState } from 'react';
import type { BloodGroup, UrgencyLevel, UserProfile, RequesterProfile } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '../ui/Dialog';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Droplet,
  Hospital,
  User,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface BloodRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  requesterProfile: RequesterProfile | null;
  onRequestSubmitted: () => void;
}

export const BloodRequestForm: React.FC<BloodRequestFormProps> = ({
  isOpen,
  onClose,
  userProfile,
  requesterProfile,
  onRequestSubmitted,
}) => {
  const [step, setStep] = useState<number>(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [requiredDate, setRequiredDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [requiredTime, setRequiredTime] = useState<string>('18:30');

  const [hospitalName, setHospitalName] = useState<string>('Apollo Hospitals');
  const [hospitalAddress, setHospitalAddress] = useState<string>('Jubilee Hills, Road No 72');
  const [hospitalCity, setHospitalCity] = useState<string>('Hyderabad');

  const [patientName, setPatientName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>(
    requesterProfile?.relationship_to_patient || 'Parent'
  );
  const [requesterPhone, setRequesterPhone] = useState<string>(
    userProfile?.phone || requesterProfile?.phone || ''
  );
  const [notes, setNotes] = useState<string>('');

  // Location Hook
  const { location, requestGeolocation, setManualLocation } = useGeolocation();

  if (!isOpen) return null;

  // Validation before step progression
  const canProceedStep = () => {
    if (step === 1) return units > 0 && requiredDate.length > 0;
    if (step === 2) return hospitalName.trim().length > 0 && hospitalAddress.trim().length > 0;
    if (step === 3) return patientName.trim().length > 0 && requesterPhone.trim().length > 0;
    return true;
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    if (!userProfile?.id) {
      setErrorMsg('You must be logged in to submit a request.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Create blood request record in Supabase
      const newRequest = {
        requester_id: userProfile.id,
        patient_name: patientName,
        blood_group: bloodGroup,
        units_required: units,
        units_fulfilled: 0,
        urgency: urgency,
        required_date: requiredDate,
        required_time: requiredTime || null,
        hospital_name_text: hospitalName,
        hospital_address_text: `${hospitalAddress}, ${hospitalCity}`,
        description: notes || null,
        requester_phone: requesterPhone,
        requester_relationship: relationship,
        status: 'PENDING_VERIFICATION', // MANDATORY initial verification queue state
      };

      const { error: insertErr } = await supabase.from('blood_requests').insert(newRequest);

      if (insertErr) throw insertErr;

      setSubmitting(false);
      setShowConfirmDialog(false);
      onRequestSubmitted();
      onClose();
    } catch (err: any) {
      console.error('Error submitting blood request:', err);
      setErrorMsg(err.message || 'Failed to submit blood request. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-stone-200 text-left max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          
          {/* Top Wizard Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="burgundy">Step {step} of 5</Badge>
              <span className="text-xs font-bold text-stone-900">Blood Request Wizard</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-red-700 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* STEP 1: REQUIREMENT */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-700" />
                  Step 1 — Blood Requirement
                </h3>
                <p className="text-stone-500 text-xs">Specify blood group, units, and urgency level</p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Blood Group Required</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setBloodGroup(group)}
                      className={`py-2.5 rounded-xl border text-sm font-extrabold transition-all ${
                        bloodGroup === group
                          ? 'bg-red-700 text-white border-red-700 shadow-xs'
                          : 'bg-white text-stone-800 border-stone-300 hover:border-red-300'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Units Required</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={units}
                    onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold bg-white text-red-700 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="CRITICAL">🔴 Critical (Immediate Emergency)</option>
                    <option value="URGENT">🟠 Urgent (Needed within hours)</option>
                    <option value="NORMAL">⚪ Normal (Scheduled requirement)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Required Date</label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Required Time</label>
                  <input
                    type="time"
                    value={requiredTime}
                    onChange={(e) => setRequiredTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HOSPITAL */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Hospital className="w-5 h-5 text-red-700" />
                  Step 2 — Hospital Facility Details
                </h3>
                <p className="text-stone-500 text-xs">Specify where the donation should be fulfilled</p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hospital Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospitals, City General Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Hospital Address / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Jubilee Hills, Road No 72"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={hospitalCity}
                    onChange={(e) => setHospitalCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT & CONTACT DETAILS */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-red-700" />
                  Step 3 — Patient & Request Context
                </h3>
                <p className="text-stone-500 text-xs">Essential information for donor coordination</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    placeholder="Full name of patient"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Relationship to Patient</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none bg-white"
                  >
                    <option value="Self">Self</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Relevant Medical Context / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Scheduled emergency surgery at 6:30 PM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: LOCATION CAPTURE */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-700" />
                  Step 4 — Location Capture
                </h3>
                <p className="text-stone-500 text-xs">Used to find nearby compatible donors</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-3">
                <MapPin className="w-8 h-8 text-red-700 mx-auto" />
                <div className="text-xs font-semibold text-stone-800">
                  {location.city || 'Location captured'}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={requestGeolocation}
                    disabled={location.loading}
                    className="text-xs"
                  >
                    {location.loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Locating...
                      </>
                    ) : (
                      'Use My Current Location'
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Privacy Shield Active: Exact coordinates are never exposed to donors.</span>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {step === 5 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Step 5 — Review Request
                </h3>
                <p className="text-stone-500 text-xs">Review details before sending for verification</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Blood Group & Units:</span>
                  <span className="font-bold text-stone-900">{bloodGroup} • {units} Units</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Urgency:</span>
                  <span className="font-bold text-red-700">{urgency}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Required Date/Time:</span>
                  <span className="font-bold text-stone-900">{requiredDate} at {requiredTime}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Hospital:</span>
                  <span className="font-bold text-stone-900">{hospitalName}, {hospitalCity}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Patient / Relationship:</span>
                  <span className="font-bold text-stone-900">{patientName} ({relationship})</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Wizard Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button
                type="button"
                variant="default"
                onClick={() => canProceedStep() && setStep(step + 1)}
                disabled={!canProceedStep()}
                className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                onClick={() => setShowConfirmDialog(true)}
                className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
              >
                Submit Request
              </Button>
            )}
          </div>

        </div>
      </div>

      {/* SUBMISSION CONFIRMATION DIALOG */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Submit blood request?"
      >
        <div className="space-y-4 text-xs pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-stone-700 leading-relaxed">
            Your request for <strong>{units} units</strong> of <strong>{bloodGroup}</strong> blood will be sent to the administrative queue for verification.
          </p>
          <p className="text-stone-500">
            It will only become visible to compatible donors after it has been approved.
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
            <Button
              onClick={() => setShowConfirmDialog(false)}
              variant="outline"
              className="w-1/2 text-xs"
            >
              Go Back
            </Button>
            <Button
              onClick={handleFinalSubmit}
              disabled={submitting}
              variant="default"
              className="w-1/2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
