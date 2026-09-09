import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Heart, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { useAuth } from '@/context/AuthContext'

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()
  const { user, role } = useAuth()

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : custom * 0.1 },
    }),
  }

  // Role aware CTA destinations
  const donorLink = !user ? '/auth?mode=register&role=donor' : role === 'donor' ? '/donor' : '/donor'
  const requesterLink = !user ? '/auth?mode=register&role=requester' : role === 'requester' || role === 'hospital' ? '/request' : '/request'

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 bg-[#FAFAF8]">
      {/* Subtle Background Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#E7E5E4_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column ~55% */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Eyebrow */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F3F0] border border-[#E7E5E4] text-xs font-bold text-[#171717]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C62828] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C62828]"></span>
              </span>
              <span>Verified blood requests. Nearby donors.</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#171717] tracking-tight leading-[1.02]"
            >
              Someone nearby could be{' '}
              <span className="font-serif-display font-normal text-[#C62828] italic">
                waiting for your help.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base sm:text-xl text-[#525252] max-w-2xl leading-relaxed font-normal"
            >
              BloodConnect connects verified blood requests with compatible donors nearby — helping critical needs reach the right people faster.
            </motion.p>

            {/* CTAs: Primary Red Button + Subtle Text Link for Secondary */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 pt-2"
            >
              <Link to={donorLink}>
                <Button size="lg" className="w-full sm:w-auto bg-[#C62828] hover:bg-[#8F1D2C] text-white shadow-sm font-semibold px-8">
                  <Heart className="w-5 h-5 fill-white mr-2" />
                  Donate Blood
                </Button>
              </Link>

              <Link
                to={requesterLink}
                className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-[#171717] hover:text-[#C62828] transition-colors py-2 group"
              >
                <span>Request Blood</span>
                <ArrowRight className="w-4 h-4 text-[#C62828] group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

          {/* Right Column ~45%: Editorial Photo + Floating Live Match Card */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[28px] md:rounded-[32px] overflow-hidden border border-[#E7E5E4] bg-[#F4F3F0] shadow-[0_20px_50px_rgba(0,0,0,0.06)] aspect-[4/3] sm:aspect-[14/11]">
              
              {/* Authentic High-Quality Editorial Image */}
              <img
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80"
                alt="Blood donor giving blood in a modern medical clinic"
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Image Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* FLOATING PRODUCT CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.6 }}
                className="absolute bottom-6 left-6 right-6 sm:left-6 sm:right-auto sm:max-w-xs bg-white rounded-2xl p-4 border border-[#E7E5E4] shadow-xl text-left space-y-2 backdrop-blur-xs bg-white/95"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16803C] animate-pulse"></span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#171717]">
                      LIVE MATCH
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#16803C] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    Available now
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-[#C62828] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                    O+
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#171717]">O+ donor found</div>
                    <div className="text-[11px] text-[#737373] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C62828]" />
                      <span>3.2 km away</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}
