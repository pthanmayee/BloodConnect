import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ShieldCheck, MapPin, Lock, Zap } from 'lucide-react'

export const BentoWhy: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="why-bloodconnect" className="py-24 md:py-36 bg-white border-b border-[#E7E5E4]">
      <Container>
        
        <SectionHeading
          eyebrow="WHY BLOODCONNECT"
          title="Built for the moments when time matters."
          description="Replacing fragmented messaging groups with verified, privacy-safe, and real-time emergency blood coordination."
        />

        {/* Varied Bento Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Verified Requests (7 Col) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 bg-[#FAFAF8] border border-[#E7E5E4] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:border-[#C62828] transition-all hover:shadow-md text-left group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C62828] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                Verified Requests
              </h3>
              <p className="text-base text-[#525252] leading-relaxed max-w-lg font-normal">
                Only approved requests enter donor matching. Every request must be verified with official hospital details before reaching donors.
              </p>
            </div>

            {/* Sub-composition: Verification Status Pill */}
            <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#737373] font-semibold">
              <span className="flex items-center gap-1.5 text-[#16803C]">
                <span className="w-2 h-2 rounded-full bg-[#16803C]" />
                Hospital & Admin Authenticated
              </span>
              <span>No Expired Broadcasts</span>
            </div>
          </motion.div>

          {/* Bento Card 2: Nearby Matching (5 Col) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="md:col-span-5 bg-white border border-[#E7E5E4] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:border-[#C62828] transition-all hover:shadow-md text-left group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8F1D2C] text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                Nearby Matching
              </h3>
              <p className="text-base text-[#525252] leading-relaxed font-normal">
                Prioritize compatible donors geographically. PostGIS spatial indexing searches nearby radiuses first to reduce emergency transit times.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex items-center justify-between text-xs font-semibold text-[#737373]">
              <span>Proximity Priority</span>
              <span className="text-[#C62828]">5 km → 50 km Expansion</span>
            </div>
          </motion.div>

          {/* Bento Card 3: Privacy First (5 Col) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="md:col-span-5 bg-white border border-[#E7E5E4] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:border-[#C62828] transition-all hover:shadow-md text-left group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                Privacy First
              </h3>
              <p className="text-base text-[#525252] leading-relaxed font-normal">
                Only necessary information is exposed. Donor exact home addresses and phone numbers are never publicly broadcasted.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex items-center justify-between text-xs font-semibold text-[#737373]">
              <span>Privacy Shield Active</span>
              <span className="text-[#171717]">Controlled Contact Exchange</span>
            </div>
          </motion.div>

          {/* Bento Card 4: Real-Time Updates (7 Col) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
            className="md:col-span-7 bg-[#FAFAF8] border border-[#E7E5E4] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between hover:border-[#C62828] transition-all hover:shadow-md text-left group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#16803C] text-white flex items-center justify-center shadow-xs">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                Real-Time Updates
              </h3>
              <p className="text-base text-[#525252] leading-relaxed max-w-lg font-normal">
                Status changes appear instantly. Track donor acceptances, hospital arrival, and unit fulfillment progress live via Supabase Realtime.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#737373] font-semibold">
              <span>Live Progress Bar</span>
              <span className="text-[#16803C]">Supabase Realtime Sync</span>
            </div>
          </motion.div>

        </div>

      </Container>
    </section>
  )
}
