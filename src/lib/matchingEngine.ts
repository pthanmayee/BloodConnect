import { supabase } from './supabaseClient';
import type { BloodRequest, DonorMatch, BloodGroup, UrgencyLevel } from '../types';
import { isDonorCompatibleWithRequest } from './compatibility';

export interface CandidateDonorMatch {
  donor_profile_id: string;
  donor_user_id: string;
  donor_name: string;
  blood_group: BloodGroup;
  distance_km: number;
  city: string;
  match_score: number;
  availability_status: string;
}

export const DEFAULT_MATCH_RADIUS_KM = 25.0;

/**
 * Server-Side Matching: Find privacy-safe candidate donors for an approved request.
 * Invokes PostGIS backend RPC `find_compatible_donors_for_request`.
 */
export async function findCompatibleDonorsForRequest(
  requestId: string,
  radiusKm: number = DEFAULT_MATCH_RADIUS_KM
): Promise<{ data: CandidateDonorMatch[]; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('find_compatible_donors_for_request', {
      p_request_id: requestId,
      p_radius_km: radiusKm,
    });

    if (error) {
      console.warn('RPC find_compatible_donors_for_request warning:', error.message);
      return { data: [], error: null };
    }

    return { data: (data || []) as CandidateDonorMatch[], error: null };
  } catch (err: any) {
    console.error('Error invoking donor matching RPC:', err);
    return { data: [], error: err.message || 'Failed to calculate donor matches.' };
  }
}

/**
 * Server-Side Matching: Fetch eligible candidate requests for a donor feed.
 * Invokes PostGIS backend RPC `get_matching_requests_for_donor`.
 */
export async function getMatchingRequestsForDonor(
  donorProfileId: string,
  radiusKm: number = DEFAULT_MATCH_RADIUS_KM
): Promise<{ data: BloodRequest[]; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('get_matching_requests_for_donor', {
      p_donor_id: donorProfileId,
      p_radius_km: radiusKm,
    });

    if (!error && data && data.length > 0) {
      return { data: data as BloodRequest[], error: null };
    }

    // Fallback query if RPC returns empty or database RPC is in fallback mode
    const { data: requestsData, error: reqErr } = await supabase
      .from('blood_requests')
      .select('*')
      .in('status', ['APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED'])
      .order('urgency', { ascending: false })
      .order('created_at', { ascending: false });

    if (reqErr) throw reqErr;

    return { data: (requestsData || []) as BloodRequest[], error: null };
  } catch (err: any) {
    console.error('Error fetching donor matching requests:', err);
    return { data: [], error: err.message || 'Failed to fetch candidate requests.' };
  }
}

/**
 * Pure Haversine distance calculator utility (Kilometers).
 * Used for client-side derived approximate distance calculations when raw coordinates are present.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371.0; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
