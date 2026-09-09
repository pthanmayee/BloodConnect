import type { BloodGroup } from '@/types'

// Matrix mapping of recipient blood group to list of compatible donor blood groups
export const RECIPIENT_TO_DONOR_MATRIX: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
}

// Matrix mapping of donor blood group to list of compatible recipient blood groups
export const DONOR_TO_RECIPIENT_MATRIX: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
}

/**
 * Checks if a donor's blood group can donate to a request requiring recipientGroup.
 */
export function isDonorCompatibleWithRequest(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowedRecipients = DONOR_TO_RECIPIENT_MATRIX[donorGroup] || []
  return allowedRecipients.includes(recipientGroup)
}

/**
 * Returns list of donor blood groups compatible for a given recipient blood group.
 */
export function getCompatibleDonorGroups(recipientGroup: BloodGroup): BloodGroup[] {
  return RECIPIENT_TO_DONOR_MATRIX[recipientGroup] || []
}

/**
 * Returns list of recipient blood groups a donor can donate to.
 */
export function getCompatibleRecipientGroups(donorGroup: BloodGroup): BloodGroup[] {
  return DONOR_TO_RECIPIENT_MATRIX[donorGroup] || []
}
