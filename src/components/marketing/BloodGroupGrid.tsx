import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { BloodGroup } from '@/types'
import { getCompatibleDonorGroups, getCompatibleRecipientGroups } from '@/lib/compatibility'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/button'
import { Info, ShieldAlert } from 'lucide-react'

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

export const BloodGroupGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | null>(null)

  return (
    <section id="blood-groups" className="py-24 md:py-36 bg-[#FAFAF8]">
      <Container>
        
        <SectionHeading
          eyebrow="BLOOD GROUPS"
          title="Every type matters."
          description="Click any blood group to review compatible donor types and recipient suitability rules."
        />

        {/* Responsive Grid of 8 Blood Groups */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {ALL_BLOOD_GROUPS.map((group, idx) => {
            const isUniversalDonor = group === 'O-'
            const isUniversalRecipient = group === 'AB+'

            return (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                onClick={() => setSelectedGroup(group)}
                className="bg-white border border-[#E7E5E4] rounded-[24px] p-6 sm:p-8 text-left cursor-pointer hover:border-[#C62828] hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between h-44"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#C62828] group-hover:scale-105 transition-transform">
                    {group}
                  </span>

                  {isUniversalDonor && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#8F1D2C] text-white px-2.5 py-0.5 rounded-full">
                      Universal Donor
                    </span>
                  )}
                  {isUniversalRecipient && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#171717] text-white px-2.5 py-0.5 rounded-full">
                      Universal Recipient
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#737373] pt-4 border-t border-[#F4F3F0]">
                  <span>Blood Group Details</span>
                  <Info className="w-4 h-4 text-[#C62828] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Dialog for Blood Group Compatibility Info */}
        <Dialog
          isOpen={selectedGroup !== null}
          onClose={() => setSelectedGroup(null)}
          title={`Blood Group ${selectedGroup}`}
          description="Compatibility & Donor Matching Summary"
        >
          {selectedGroup && (
            <div className="space-y-5 pt-2">
              
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E7E5E4] space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                  Can receive blood from:
                </div>
                <div className="flex flex-wrap gap-2">
                  {getCompatibleDonorGroups(selectedGroup).map((g) => (
                    <span key={g} className="px-3 py-1 rounded-xl bg-[#C62828] text-white text-xs font-extrabold shadow-xs">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E7E5E4] space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                  Can donate blood to:
                </div>
                <div className="flex flex-wrap gap-2">
                  {getCompatibleRecipientGroups(selectedGroup).map((g) => (
                    <span key={g} className="px-3 py-1 rounded-xl bg-[#171717] text-white text-xs font-extrabold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Clinical Notice:</strong> Compatibility rules are for matching coordination. Actual blood product transfusion safety and final compatibility testing must be determined by qualified healthcare professionals.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => setSelectedGroup(null)} variant="default">
                  Close Details
                </Button>
              </div>

            </div>
          )}
        </Dialog>

      </Container>
    </section>
  )
}
