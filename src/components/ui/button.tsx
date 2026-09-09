import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer'

    const variants = {
      default:
        'bg-[#C62828] text-white hover:bg-[#8F1D2C] shadow-sm hover:shadow-md hover:-translate-y-0.5',
      secondary:
        'bg-[#F4F3F0] text-[#171717] hover:bg-[#E7E5E4] border border-[#E7E5E4]',
      outline:
        'border border-[#E7E5E4] bg-white text-[#171717] hover:bg-[#FAFAF8] hover:border-[#C62828]',
      ghost:
        'bg-transparent text-[#171717] hover:bg-[#F4F3F0]',
      destructive:
        'bg-[#B91C1C] text-white hover:bg-[#991B1B]',
      dark:
        'bg-[#171717] text-white hover:bg-[#262626]',
    }

    const sizes = {
      sm: 'h-9 px-3.5 text-xs rounded-[8px]',
      md: 'h-11 px-5 text-sm rounded-[10px]',
      lg: 'h-13 px-7 text-base rounded-[12px]',
      icon: 'h-10 w-10 p-0 rounded-[10px]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
