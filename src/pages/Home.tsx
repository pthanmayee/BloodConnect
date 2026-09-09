import React from 'react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/marketing/Hero'
import { StatsStrip } from '@/components/marketing/StatsStrip'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { MatchingVisualizer } from '@/components/marketing/MatchingVisualizer'
import { BloodGroupGrid } from '@/components/marketing/BloodGroupGrid'
import { BentoWhy } from '@/components/marketing/BentoWhy'
import { StorySection } from '@/components/marketing/StorySection'
import { FAQ } from '@/components/marketing/FAQ'
import { CTA } from '@/components/marketing/CTA'

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <HowItWorks />
        <MatchingVisualizer />
        <BloodGroupGrid />
        <BentoWhy />
        <StorySection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
