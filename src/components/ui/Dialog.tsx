import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-[24px] bg-white p-6 sm:p-8 shadow-2xl border border-[#E7E5E4] text-left space-y-4',
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#737373] hover:bg-[#F4F3F0] hover:text-[#171717] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {title && (
              <div className="space-y-1 pr-6">
                <h3 className="text-2xl font-extrabold text-[#171717] tracking-tight">{title}</h3>
                {description && (
                  <p className="text-xs text-[#737373] leading-relaxed">{description}</p>
                )}
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
