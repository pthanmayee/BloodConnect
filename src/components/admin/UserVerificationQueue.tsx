import React, { useState } from 'react';
import type { UserProfile } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '../ui/Dialog';
import { Users, UserCheck, ShieldAlert, CheckCircle2, Ban, AlertCircle, Clock } from 'lucide-react';

interface UserVerificationQueueProps {
  pendingUsers: UserProfile[];
  adminProfile: UserProfile | null;
  onRefreshQueue: () => void;
  isLoading?: boolean;
}

export const UserVerificationQueue: React.FC<UserVerificationQueueProps> = ({
  pendingUsers,
  adminProfile,
  onRefreshQueue,
  isLoading,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<'VERIFY' | 'REJECT' | 'SUSPEND' | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/3"></div>
        <div className="h-14 bg-stone-100 rounded w-full"></div>
      </div>
    );
  }

  const handleExecuteAction = async () => {
    if (!selectedUser || !actionType || !adminProfile?.id) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const newStatus = actionType === 'VERIFY' ? 'VERIFIED' : actionType === 'REJECT' ? 'REJECTED' : 'SUSPENDED';

      // 1. Update user profile verification status
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          verification_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id);

      if (updateErr) throw updateErr;

      // 2. Insert into admin_audit_logs
      await supabase.from('admin_audit_logs').insert({
        admin_id: adminProfile.id,
        action: `${actionType}_USER`,
        target_type: 'USER_PROFILE',
        target_id: selectedUser.id,
        previous_status: selectedUser.verification_status,
        new_status: newStatus,
        reason: reason.trim() || null,
        metadata: {
          user_email: selectedUser.email,
          user_name: selectedUser.full_name,
          role: selectedUser.role,
        },
      });

      setSubmitting(false);
      setSelectedUser(null);
      setActionType(null);
      setReason('');
      onRefreshQueue();
    } catch (err: any) {
      console.error('Error executing user moderation action:', err);
      setErrorMsg(err.message || 'Failed to update user status.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-stone-700" />
          <h2 className="text-lg font-bold text-stone-900">User Moderation & Verification Queue</h2>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
          {pendingUsers.length} Users
        </span>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="py-10 text-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50 space-y-1">
          <UserCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-stone-900 text-sm">No pending users.</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No donor or requester accounts are currently waiting for verification.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{user.full_name}</span>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant={user.verification_status === 'VERIFIED' ? 'success' : 'warning'}>
                    {user.verification_status}
                  </Badge>
                </div>
                <div className="text-stone-500 text-[11px] flex items-center gap-2">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>{user.phone || 'No phone recorded'}</span>
                  <span>•</span>
                  <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType('VERIFY');
                  }}
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs font-bold"
                >
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType('REJECT');
                  }}
                  className="text-amber-700 border-amber-200 hover:bg-amber-50 text-xs font-bold"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType('SUSPEND');
                  }}
                  className="text-red-700 border-red-200 hover:bg-red-50 text-xs font-bold"
                >
                  Suspend
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USER MODERATION ACTION DIALOG */}
      {selectedUser && actionType && (
        <Dialog
          isOpen={!!selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setActionType(null);
          }}
          title={`${actionType === 'VERIFY' ? 'Verify' : actionType === 'REJECT' ? 'Reject' : 'Suspend'} Account?`}
        >
          <div className="space-y-4 text-xs pt-1">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <p className="text-stone-700 leading-relaxed">
              You are about to set <strong>{selectedUser.full_name}</strong> ({selectedUser.email}) to status: <strong>{actionType}</strong>.
            </p>

            {actionType !== 'VERIFY' && (
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Reason / Notes (Required)</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context for this administrative moderation decision..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  setActionType(null);
                }}
                variant="outline"
                className="w-1/2 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExecuteAction}
                disabled={submitting || (actionType !== 'VERIFY' && !reason.trim())}
                variant={actionType === 'VERIFY' ? 'default' : 'destructive'}
                className={`w-1/2 text-xs font-bold ${
                  actionType === 'VERIFY' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {submitting ? 'Updating...' : 'Confirm Action'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
