import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { useAuth } from '@/context/AuthContext'

export const CTA: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()
  const { user, role } = useAuth()

  const donorLink = !user ? '/auth?mode=register&role=donor' : role === 'donor' ? '/donor' : '/donor'
  const requesterLink = !user ? '/auth?mode=register&role=requester' : role === 'requester' || role === 'hospital' ? '/request' : '/request'

  return (
    <section className="py-24 md:py-36 bg-[#4A1018] text-white relative overflow-hidden">
      {/* Background subtle radial texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0,transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs border border-white/20"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>COMMUNITY ACTION</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Be the reason someone gets another chance.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Whether you're ready to donate or need help finding blood, BloodConnect helps make the connection faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to={donorLink}>
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#4A1018] hover:bg-neutral-100 font-extrabold px-9 shadow-lg h-13 text-base">
                Donate Blood
              </Button>
            </Link>
            <Link to={requesterLink}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-bold px-8 h-13 text-base gap-2">
                <span>Request Blood</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
