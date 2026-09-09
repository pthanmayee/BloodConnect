import React from 'react'
import { Link } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { Container } from '@/components/ui/Container'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171717] text-white pt-16 pb-12 border-t border-neutral-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800 text-left">
          
          {/* Logo & Intro */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C62828] text-white flex items-center justify-center">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                BloodConnect
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A verified, location-aware blood donation coordination platform connecting emergency requirements with nearby donors.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why-bloodconnect" className="hover:text-white transition-colors">
                  Why BloodConnect
                </a>
              </li>
              <li>
                <a href="#blood-groups" className="hover:text-white transition-colors">
                  Blood Groups
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>Verified Verification Standards</li>
              <li>PostGIS Location Protection</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>Emergency Support Desk</li>
              <li>support@bloodconnect.org</li>
              <li>Hospital Integration Portal</li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p className="max-w-2xl leading-relaxed text-center md:text-left">
            <strong>Medical Disclaimer:</strong> BloodConnect coordinates blood donation requests and does not replace medical screening or professional healthcare decisions. Transfusion compatibility must be verified by qualified medical professionals.
          </p>
          <div className="text-neutral-400 text-center md:text-right">
            © {new Date().getFullYear()} BloodConnect. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  )
}
