import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`
  }
  return `${km.toFixed(1)} km away`
}

export function getBloodGroupBadgeColor(group: string): string {
  switch (group) {
    case 'O-':
    case 'O+':
      return 'bg-[#7F1D1D] text-white'
    case 'A-':
    case 'A+':
      return 'bg-[#8F1D2C] text-white'
    case 'B-':
    case 'B+':
      return 'bg-[#C62828] text-white'
    default:
      return 'bg-[#B91C1C] text-white'
  }
}
