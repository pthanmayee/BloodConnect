import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'critical' | 'outline' | 'burgundy' | 'muted' | 'dark'
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[#C62828] text-white',
    success: 'bg-[#16803C]/10 text-[#16803C] border border-[#16803C]/20',
    warning: 'bg-[#C2410C]/10 text-[#C2410C] border border-[#C2410C]/20',
    critical: 'bg-[#B91C1C] text-white animate-pulse',
    outline: 'border border-[#E7E5E4] text-[#171717] bg-white',
    burgundy: 'bg-[#8F1D2C] text-white',
    muted: 'bg-[#F4F3F0] text-[#737373] border border-[#E7E5E4]',
    dark: 'bg-[#171717] text-white',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
