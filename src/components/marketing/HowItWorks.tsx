import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

interface StepItem {
  number: string
  title: string
  description: string
}

const steps: StepItem[] = [
  {
    number: '01',
    title: 'REQUEST',
    description: 'Submit the blood requirement along with hospital details.',
  },
  {
    number: '02',
    title: 'VERIFY',
    description: 'The request is reviewed and verified by authorized administrators or hospitals.',
  },
  {
    number: '03',
    title: 'MATCH',
    description: 'Compatible nearby donors are prioritized using geospatial spatial queries.',
  },
  {
    number: '04',
    title: 'DONATE',
    description: 'A donor accepts and the request moves toward hospital fulfillment.',
  },
]

export const HowItWorks: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="how-it-works" className="py-24 md:py-36 bg-[#FAFAF8]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 text-left space-y-4 lg:sticky lg:top-28">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C62828] bg-red-50 px-3 py-1 rounded-full border border-red-100">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight leading-[1.1]">
              From a request to a real donor.
            </h2>
            <p className="text-base sm:text-lg text-[#525252] leading-relaxed">
              BloodConnect creates a clean, transparent coordination pipeline so patient emergency requests reach compatible nearby donors without friction or delays.
            </p>
          </div>

          {/* Right Column: 4 Numbered Steps */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
                className="relative pl-12 sm:pl-16 pb-8 border-l border-[#E7E5E4] last:border-l-transparent last:pb-0 group"
              >
                {/* Number Circle Badge */}
                <div className="absolute left-[-20px] top-0 w-10 h-10 rounded-full bg-white border-2 border-[#E7E5E4] text-[#C62828] font-serif-display font-extrabold text-lg flex items-center justify-center shadow-xs group-hover:border-[#C62828] transition-colors">
                  {step.number}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#171717] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}
