import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface VisualizerNode {
  id: string
  label: string
  group: string
  dist: string
  km: number
  top: string
  left: string
  isClosest?: boolean
}

const donorNodes: VisualizerNode[] = [
  { id: '1', label: 'Closest Donor', group: 'O+', dist: '3.2 km', km: 3.2, top: '25%', left: '22%', isClosest: true },
  { id: '2', label: 'Compatible Donor', group: 'O-', dist: '4.8 km', km: 4.8, top: '65%', left: '76%' },
  { id: '3', label: 'Compatible Donor', group: 'A+', dist: '6.1 km', km: 6.1, top: '20%', left: '70%' },
  { id: '4', label: 'Standby Donor', group: 'O+', dist: '8.4 km', km: 8.4, top: '75%', left: '25%' },
  { id: '5', label: 'Standby Donor', group: 'O-', dist: '11.2 km', km: 11.2, top: '45%', left: '85%' },
]

export const MatchingVisualizer: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()
  const [selectedNode, setSelectedNode] = useState<VisualizerNode>(donorNodes[0])

  return (
    <section className="py-24 md:py-36 bg-white border-y border-[#E7E5E4]">
      <Container>
        
        <SectionHeading
          eyebrow="PROXIMITY ENGINE"
          title="Designed for precise location matching."
          description="BloodConnect prioritizes donors geographically closer to the hospital before expanding outward — minimizing travel time during emergencies."
        />

        <div className="relative w-full h-[460px] sm:h-[500px] rounded-[32px] bg-[#FAFAF8] border border-[#E7E5E4] p-6 sm:p-10 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex items-center justify-center">
          
          {/* Subtle Concentric Radiuses */}
          <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-[#C62828]/20 pointer-events-none" />
          <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-[#E7E5E4] pointer-events-none" />
          <div className="absolute w-[480px] h-[480px] rounded-full border border-dashed border-[#E7E5E4]/60 pointer-events-none" />

          {/* Central REQUEST Node */}
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="z-20 flex flex-col items-center text-center cursor-default"
          >
            <div className="w-18 h-18 rounded-2xl bg-[#C62828] text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">REQUEST</span>
              <span className="text-xl font-extrabold">O+</span>
            </div>
            <div className="mt-2.5 bg-white px-3.5 py-1 rounded-full border border-[#E7E5E4] shadow-xs text-xs font-bold text-[#171717] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16803C]" />
              <span>City General Hospital</span>
            </div>
          </motion.div>

          {/* Donor Nodes & Connecting Lines */}
          {donorNodes.map((donor, idx) => {
            const isSelected = selectedNode.id === donor.id
            return (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.2 + idx * 0.1 }}
                onClick={() => setSelectedNode(donor)}
                style={{ top: donor.top, left: donor.left }}
                className={`absolute z-20 cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all ${
                  donor.isClosest || isSelected
                    ? 'bg-[#171717] text-white border-[#171717] shadow-md ring-4 ring-[#C62828]/20 scale-105'
                    : 'bg-white text-[#171717] border-[#E7E5E4] hover:border-[#C62828] shadow-xs'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${donor.isClosest ? 'bg-[#C62828]' : 'bg-[#16803C]'}`}></span>
                <span className="text-xs font-bold">{donor.group}</span>
                <span className="text-[11px] opacity-75">{donor.dist}</span>
              </motion.div>
            )
          })}

          {/* Floating Information Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute top-6 right-6 bg-white border border-[#E7E5E4] rounded-2xl p-4 shadow-xl text-left space-y-2 max-w-xs z-30"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C62828]">
                MATCH FOUND
              </span>
              <span className="text-[10px] font-bold text-[#16803C] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                Available now
              </span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#171717]">
                {selectedNode.group} compatible donor
              </div>
              <div className="text-xs text-[#737373] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C62828]" />
                <span>{selectedNode.dist} away</span>
              </div>
            </div>
          </motion.div>

        </div>

      </Container>
    </section>
  )
}
