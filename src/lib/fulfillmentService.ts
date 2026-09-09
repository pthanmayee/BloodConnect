import { supabase } from './supabaseClient';
import type { DonationFulfillment } from '../types';

export interface FulfillmentResult {
  success: boolean;
  error?: string;
  fulfillment_id?: string;
  units_fulfilled?: number;
  units_required?: number;
  request_status?: string;
}

/**
 * Confirm a donation fulfillment for a matched donor.
 * Executes atomic RPC server-side with over-fulfillment check and unit accounting.
 */
export async function confirmDonation(
  matchId: string,
  unitsDonated: number = 1,
  notes?: string
): Promise<FulfillmentResult> {
  try {
    const { data, error } = await supabase.rpc('confirm_donation_fulfillment', {
      p_match_id: matchId,
      p_units_donated: unitsDonated,
      p_notes: notes || null,
    });

    if (error) throw error;
    return data as FulfillmentResult;
  } catch (err: any) {
    console.error('Error confirming donation:', err);
    return {
      success: false,
      error: err.message || 'Failed to confirm donation.',
    };
  }
}

/**
 * Donor withdraws / cancels their active match participation.
 */
export async function cancelDonorMatch(
  matchId: string,
  reason: string = 'Donor unavailable'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('cancel_donor_match', {
      p_match_id: matchId,
      p_reason: reason,
    });

    if (error) throw error;
    return data as { success: boolean; error?: string };
  } catch (err: any) {
    console.error('Error cancelling match:', err);
    return {
      success: false,
      error: err.message || 'Failed to withdraw from donation.',
    };
  }
}

/**
 * Requester or Admin cancels a blood request.
 */
export async function cancelBloodRequest(
  requestId: string,
  reason: string = 'Cancelled by user'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('cancel_blood_request', {
      p_request_id: requestId,
      p_reason: reason,
    });

    if (error) throw error;
    return data as { success: boolean; error?: string };
  } catch (err: any) {
    console.error('Error cancelling blood request:', err);
    return {
      success: false,
      error: err.message || 'Failed to cancel blood request.',
    };
  }
}

/**
 * Fetch all fulfillment records for a specific request.
 */
export async function getFulfillmentsForRequest(requestId: string): Promise<DonationFulfillment[]> {
  try {
    const { data, error } = await supabase
      .from('donation_fulfillments')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DonationFulfillment[];
  } catch (err) {
    console.error('Error loading request fulfillments:', err);
    return [];
  }
}

/**
 * Fetch all fulfillment records for admin oversight.
 */
export async function getAllFulfillments(): Promise<DonationFulfillment[]> {
  try {
    const { data, error } = await supabase
      .from('donation_fulfillments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DonationFulfillment[];
  } catch (err) {
    console.error('Error loading all fulfillments:', err);
    return [];
  }
}
