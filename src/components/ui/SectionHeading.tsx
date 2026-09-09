import React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  titleSerif?: boolean
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  titleSerif = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'space-y-3 mb-12 sm:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-3xl',
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C62828] bg-red-50 px-3 py-1 rounded-full border border-red-100/80">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#171717] tracking-tight leading-[1.1]',
          titleSerif ? 'font-serif-display font-normal italic' : 'font-sans'
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-[#525252] leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  )
}
