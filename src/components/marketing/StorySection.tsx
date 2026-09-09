import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

export const StorySection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-24 md:py-36 bg-[#FAFAF8] relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Large Editorial Photography */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden border border-[#E7E5E4] shadow-[0_20px_50px_rgba(0,0,0,0.06)] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
                alt="Healthcare professional comforting a patient during care"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column: Editorial Statement using DM Serif Display */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 text-left space-y-6"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C62828] bg-red-50 px-3 py-1 rounded-full border border-red-100">
              HUMAN PURPOSE
            </span>

            <blockquote className="text-4xl sm:text-6xl font-serif-display text-[#171717] leading-[1.1] italic">
              “Sometimes help is closer than you think.”
            </blockquote>

            <p className="text-base sm:text-lg text-[#525252] leading-relaxed max-w-lg font-normal">
              Behind every urgent blood request is a person, a family, and a care team. BloodConnect bridges distance and time so that when an emergency happens, nearby donors can step forward with clarity and purpose.
            </p>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
