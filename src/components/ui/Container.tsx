import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: 'default' | 'narrow' | 'wide'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'default',
  ...props
}) => {
  const maxWidths = {
    narrow: 'max-w-4xl',
    default: 'max-w-[1280px]',
    wide: 'max-w-[1400px]',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-16',
        maxWidths[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
