import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqList: FAQItem[] = [
  {
    question: 'How are blood requests verified?',
    answer: 'Every submitted blood request enters a PENDING_VERIFICATION state. Authorized administrators or verified hospitals review the patient details and supporting hospital requisition documents before approving the request for donor matching.',
  },
  {
    question: 'How are compatible donors selected?',
    answer: 'BloodConnect uses PostgreSQL and PostGIS spatial queries to filter donors based on blood group compatibility (ABO/Rh matrix), donor availability status, eligibility rules, and geographic proximity to prioritize nearby donors.',
  },
  {
    question: 'Is my exact home location public?',
    answer: 'No. Exact donor home addresses and GPS coordinates are never publicly displayed or broadcasted. Donors only see the hospital location, and requesters only see approximate donor distance (e.g. 3.2 km away).',
  },
  {
    question: 'Can anyone request blood on the platform?',
    answer: 'Registered requesters and hospitals can create blood requests. However, no request reaches matched donors until it passes the mandatory administrative or hospital verification review.',
  },
  {
    question: 'How do I become a registered donor?',
    answer: 'Sign up on BloodConnect, select "Donate Blood", complete your profile with your blood group and last donation date, set your availability toggle to "AVAILABLE", and you will be notified whenever a compatible request is verified nearby.',
  },
]

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-t border-[#E7E5E4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C62828] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#737373]">
            Everything you need to know about verification, matching, and donor privacy.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqList.map((item, idx) => {
            const isOpen = openIdx === idx

            return (
              <div
                key={idx}
                className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-2xl transition-colors overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-lg text-[#171717] hover:text-[#C62828] transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#737373] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#C62828]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-sm text-[#525252] leading-relaxed border-t border-[#E7E5E4]/60 pt-4"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
