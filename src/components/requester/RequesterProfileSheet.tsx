import React, { useState } from 'react';
import type { UserProfile, RequesterProfile } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Dialog } from '../ui/Dialog';
import { User, Phone, MapPin, ShieldCheck, AlertCircle, Loader2, Save } from 'lucide-react';

interface RequesterProfileSheetProps {
  userProfile: UserProfile | null;
  requesterProfile: RequesterProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export const RequesterProfileSheet: React.FC<RequesterProfileSheetProps> = ({
  userProfile,
  requesterProfile,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || requesterProfile?.phone || '');
  const [relationship, setRelationship] = useState(requesterProfile?.relationship_to_patient || 'Self');
  const [city, setCity] = useState(requesterProfile?.address_city || '');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (userProfile) setFullName(userProfile.full_name || '');
    if (userProfile?.phone || requesterProfile?.phone) setPhone(userProfile?.phone || requesterProfile?.phone || '');
    if (requesterProfile?.relationship_to_patient) setRelationship(requesterProfile.relationship_to_patient);
    if (requesterProfile?.address_city) setCity(requesterProfile.address_city);
  }, [userProfile, requesterProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      if (userProfile?.id) {
        const { error: pErr } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            phone: phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userProfile.id);

        if (pErr) throw pErr;
      }

      if (requesterProfile?.id) {
        const { error: rErr } = await supabase
          .from('requester_profiles')
          .update({
            phone: phone,
            relationship_to_patient: relationship,
            address_city: city,
            updated_at: new Date().toISOString(),
          })
          .eq('id', requesterProfile.id);

        if (rErr) throw rErr;
      }

      setSuccessMsg('Profile updated successfully.');
      if (onProfileUpdated) onProfileUpdated();

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error updating requester profile:', err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Requester Profile & Settings">
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">
                {userProfile?.full_name || 'Requester Profile'}
              </div>
              <div className="text-stone-500 text-[11px]">{userProfile?.email}</div>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                userProfile?.verification_status === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {userProfile?.verification_status || 'PENDING'}
            </span>
            <div className="text-[10px] text-stone-400 mt-0.5">Admin Managed</div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" /> Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-500" /> Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" /> Primary City / Area
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Patient Relationship</label>
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

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
