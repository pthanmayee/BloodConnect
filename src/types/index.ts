export type UserRole = 'donor' | 'requester' | 'hospital' | 'admin';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'TEMPORARILY_UNAVAILABLE' | 'RECENTLY_DONATED' | 'SUSPENDED';

export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING_REVIEW';

export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'CRITICAL';

export type BloodRequestStatus = 
  | 'DRAFT' 
  | 'PENDING_VERIFICATION' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'ACTIVE' 
  | 'PARTIALLY_FULFILLED' 
  | 'FULFILLED' 
  | 'EXPIRED' 
  | 'CANCELLED';

export type MatchStatus = 'MATCHED' | 'NOTIFIED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface DonorProfile {
  id: string;
  user_id: string;
  blood_group: BloodGroup;
  date_of_birth?: string;
  phone?: string;
  verification_status?: VerificationStatus;
  last_donation_date?: string;
  availability_status: AvailabilityStatus;
  eligibility_status: EligibilityStatus;
  latitude?: number;
  longitude?: number;
  address_city?: string;
  created_at: string;
  updated_at: string;
}

export interface RequesterProfile {
  id: string;
  user_id: string;
  phone?: string;
  relationship_to_patient?: string;
  latitude?: number;
  longitude?: number;
  address_city?: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface HospitalProfile {
  id: string;
  user_id?: string;
  name: string;
  registration_number: string;
  address: string;
  phone: string;
  email: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  hospital_id?: string;
  patient_name: string;
  blood_group: BloodGroup;
  units_required: number;
  units_fulfilled: number;
  urgency: UrgencyLevel;
  required_date: string;
  required_time?: string;
  hospital_name_text: string;
  hospital_address_text: string;
  description?: string;
  requester_phone: string;
  requester_relationship: string;
  status: BloodRequestStatus;
  verified_by?: string;
  verified_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  // Computed fields for UI display
  distance_km?: number;
  matched_donors_count?: number;
  confirmed_donors_count?: number;
}

export interface DonorMatch {
  id: string;
  request_id: string;
  donor_id: string;
  distance_km: number;
  match_score: number;
  status: MatchStatus;
  notified_at?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  request?: BloodRequest;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_request_id?: string;
  read: boolean;
  created_at: string;
}

export interface DonationRecord {
  id: string;
  donor_id: string;
  request_id?: string;
  hospital_name: string;
  blood_group: BloodGroup;
  units: number;
  donation_date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  admin_id: string;
  admin_name?: string;
  action: string;
  target_type: string;
  target_id: string;
  previous_status?: string;
  new_status: string;
  reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export type FulfillmentStatus = 'PENDING' | 'COORDINATED' | 'DONOR_CONFIRMED' | 'HOSPITAL_CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface DonationFulfillment {
  id: string;
  request_id: string;
  match_id?: string;
  donor_id: string;
  units_donated: number;
  status: FulfillmentStatus;
  confirmed_at?: string;
  confirmed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  request?: BloodRequest;
  donor?: DonorProfile;
}

