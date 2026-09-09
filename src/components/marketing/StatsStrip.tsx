import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

interface StatItem {
  value: string
  label: string
}

const statsList: StatItem[] = [
  { value: '1,200+', label: 'Registered Donors' },
  { value: '340+', label: 'Requests Fulfilled' },
  { value: '92%', label: 'Fulfillment Rate' },
  { value: '4.8 km', label: 'Average Match Distance' },
]

export const StatsStrip: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="bg-white border-y border-[#E7E5E4] py-10 md:py-12">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsList.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
              className="text-left space-y-1 border-l-2 border-[#C62828] pl-4 sm:pl-6"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-[#525252]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
