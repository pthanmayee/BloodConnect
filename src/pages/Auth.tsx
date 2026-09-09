import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/Dialog'
import type { UserRole, BloodGroup } from '@/types'
import { Heart, Droplet, Building2, ShieldCheck, ArrowRight, MapPin, CheckCircle2, Eye, EyeOff, Lock, AlertCircle, Upload, Navigation } from 'lucide-react'

export const Auth: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn, signUp, resetPassword, loading: authLoading } = useAuth()
  const { location, requestGeolocation, setManualLocation } = useGeolocation()
  const shouldReduceMotion = useReducedMotion()

  // Views: 'login' | 'register' | 'role_select' | 'onboarding'
  const [view, setView] = useState<'login' | 'register' | 'role_select' | 'onboarding'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  )

  // Auth Inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Selected Role (Strictly donor | requester | hospital ONLY on frontend)
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor')

  // Multi-step Onboarding State
  const [onboardingStep, setOnboardingStep] = useState<number>(1)
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+')
  const [dob, setDob] = useState('')
  const [lastDonation, setLastDonation] = useState('')
  const [availabilityToggle, setAvailabilityToggle] = useState<boolean>(true)
  const [eligibilityAgreed, setEligibilityAgreed] = useState<boolean>(false)
  const [relationship, setRelationship] = useState('Self / Family')
  const [manualCity, setManualCity] = useState('Mumbai, Maharashtra')

  // Hospital Onboarding State
  const [hospitalName, setHospitalName] = useState('')
  const [hospitalReg, setHospitalReg] = useState('')
  const [hospitalAddress, setHospitalAddress] = useState('')
  const [hospitalDocName, setHospitalDocName] = useState<string | null>(null)

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await signIn(email, password);
    if (res.error) {
      setAuthError(res.error);
    } else {
      if (email.includes('request')) {
        navigate('/request');
      } else if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/donor');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please enter the same password in both fields.')
      return
    }
    setView('role_select')
  }

  const handleRoleSelectConfirm = () => {
    setView('onboarding')
    setOnboardingStep(1)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    const res = await resetPassword(email)
    if (res.error) {
      setAuthError(res.error)
    } else {
      setResetSuccess(true)
    }
  }

  const handleOnboardingComplete = async () => {
    setAuthError(null)
    const res = await signUp(email, password, fullName, phone, selectedRole)
    if (res.error) {
      setAuthError(res.error)
      return
    }

    if (selectedRole === 'donor') navigate('/donor')
    else navigate('/request')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 flex items-center justify-center">
        <div className="max-w-[1280px] w-full mx-auto px-5 sm:px-8 lg:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: AUTH & ONBOARDING FORMS (~55%) */}
            <div className="lg:col-span-7 w-full max-w-xl mx-auto lg:mx-0">
              
              {/* LOGIN VIEW */}
              {view === 'login' && (
                <Card className="border-[#E7E5E4] shadow-md text-left space-y-6">
                  <CardHeader className="border-b border-[#F4F3F0] pb-6 space-y-1">
                    <CardTitle className="text-3xl font-extrabold text-[#171717]">Sign in to BloodConnect</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your verified profile and active matches
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {authError && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#B91C1C] flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setResetModalOpen(true)}
                            className="text-xs font-bold text-[#C62828] hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 pl-4 pr-12 rounded-xl border border-[#E7E5E4] text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3.5 text-[#737373] hover:text-[#171717]"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        isLoading={authLoading}
                        className="w-full h-13 text-base font-bold bg-[#C62828] hover:bg-[#8F1D2C] mt-2 shadow-sm"
                      >
                        Sign In
                      </Button>
                    </form>

                    {/* Quick Demo Logins */}
                    <div className="mt-6 pt-5 border-t border-[#F4F3F0] space-y-2">
                      <div className="text-[10px] font-extrabold text-[#737373] text-center uppercase tracking-wider">
                        Or Sign In with Demo Account
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            setAuthError(null);
                            setEmail('donor.demo@bloodconnect.org');
                            setPassword('password123');
                            const res = await signIn('donor.demo@bloodconnect.org', 'password123');
                            if (!res.error) navigate('/donor');
                            else setAuthError(res.error);
                          }}
                          className="py-2.5 px-1 rounded-xl bg-red-50 hover:bg-red-100 text-[#C62828] text-xs font-bold border border-red-200 text-center transition-colors"
                        >
                          Donor Demo
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setAuthError(null);
                            setEmail('requester.demo@bloodconnect.org');
                            setPassword('password123');
                            const res = await signIn('requester.demo@bloodconnect.org', 'password123');
                            if (!res.error) navigate('/request');
                            else setAuthError(res.error);
                          }}
                          className="py-2.5 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 text-center transition-colors"
                        >
                          Requester Demo
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setAuthError(null);
                            setEmail('admin.demo@bloodconnect.org');
                            setPassword('password123');
                            const res = await signIn('admin.demo@bloodconnect.org', 'password123');
                            if (!res.error) navigate('/admin');
                            else setAuthError(res.error);
                          }}
                          className="py-2.5 px-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold border border-stone-300 text-center transition-colors"
                        >
                          Admin Demo
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#F4F3F0] text-center text-xs text-[#737373]">
                      Don't have an account yet?{' '}
                      <button
                        onClick={() => { setView('register'); setAuthError(null); }}
                        className="font-extrabold text-[#C62828] hover:underline"
                      >
                        Create an account
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* REGISTER VIEW */}
              {view === 'register' && (
                <Card className="border-[#E7E5E4] shadow-md text-left space-y-6">
                  <CardHeader className="border-b border-[#F4F3F0] pb-6 space-y-1">
                    <CardTitle className="text-3xl font-extrabold text-[#171717]">Create Your Account</CardTitle>
                    <CardDescription>
                      Join BloodConnect to request or donate blood securely
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      {authError && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#B91C1C] flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-13 text-base font-bold bg-[#C62828] hover:bg-[#8F1D2C] mt-2 shadow-sm"
                      >
                        Continue to Role Selection <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#F4F3F0] text-center text-xs text-[#737373]">
                      Already have an account?{' '}
                      <button
                        onClick={() => { setView('login'); setAuthError(null); }}
                        className="font-extrabold text-[#C62828] hover:underline"
                      >
                        Sign In
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ROLE SELECTION VIEW */}
              {view === 'role_select' && (
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <Badge variant="burgundy">Step 1 of Onboarding</Badge>
                    <h2 className="text-3xl font-extrabold text-[#171717] tracking-tight">
                      What are you here to do?
                    </h2>
                    <p className="text-sm text-[#737373]">
                      Select your primary role. This determines your default workspace and security permissions.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* DONATE BLOOD CARD */}
                    <div
                      tabIndex={0}
                      onClick={() => setSelectedRole('donor')}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('donor')}
                      className={`p-6 rounded-[24px] border cursor-pointer transition-all flex items-start gap-4 ${
                        selectedRole === 'donor'
                          ? 'border-[#C62828] bg-white ring-2 ring-[#C62828]/20 shadow-md'
                          : 'border-[#E7E5E4] bg-[#FAFAF8] hover:bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#C62828] text-white flex items-center justify-center shrink-0">
                        <Heart className="w-6 h-6 fill-white" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-lg text-[#171717]">DONATE BLOOD</h3>
                          {selectedRole === 'donor' && <CheckCircle2 className="w-5 h-5 text-[#C62828]" />}
                        </div>
                        <p className="text-xs text-[#525252] leading-relaxed">
                          Help people nearby when they need it. Receive verified compatible requests.
                        </p>
                      </div>
                    </div>

                    {/* REQUEST BLOOD CARD */}
                    <div
                      tabIndex={0}
                      onClick={() => setSelectedRole('requester')}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('requester')}
                      className={`p-6 rounded-[24px] border cursor-pointer transition-all flex items-start gap-4 ${
                        selectedRole === 'requester'
                          ? 'border-[#C62828] bg-white ring-2 ring-[#C62828]/20 shadow-md'
                          : 'border-[#E7E5E4] bg-[#FAFAF8] hover:bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#8F1D2C] text-white flex items-center justify-center shrink-0">
                        <Droplet className="w-6 h-6 fill-white" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-lg text-[#171717]">REQUEST BLOOD</h3>
                          {selectedRole === 'requester' && <CheckCircle2 className="w-5 h-5 text-[#C62828]" />}
                        </div>
                        <p className="text-xs text-[#525252] leading-relaxed">
                          Find compatible donors for a blood requirement for yourself or a patient.
                        </p>
                      </div>
                    </div>

                    {/* REGISTER A HOSPITAL CARD */}
                    <div
                      tabIndex={0}
                      onClick={() => setSelectedRole('hospital')}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('hospital')}
                      className={`p-6 rounded-[24px] border cursor-pointer transition-all flex items-start gap-4 ${
                        selectedRole === 'hospital'
                          ? 'border-[#C62828] bg-white ring-2 ring-[#C62828]/20 shadow-md'
                          : 'border-[#E7E5E4] bg-[#FAFAF8] hover:bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-lg text-[#171717]">REGISTER A HOSPITAL</h3>
                          {selectedRole === 'hospital' && <CheckCircle2 className="w-5 h-5 text-[#C62828]" />}
                        </div>
                        <p className="text-xs text-[#525252] leading-relaxed">
                          Register your hospital or blood bank for verified blood requests.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleRoleSelectConfirm} className="w-full h-13 text-base font-bold bg-[#C62828] hover:bg-[#8F1D2C]">
                    Continue to Onboarding <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* ONBOARDING VIEW */}
              {view === 'onboarding' && (
                <Card className="border-[#E7E5E4] shadow-md text-left space-y-6">
                  <CardHeader className="border-b border-[#F4F3F0] pb-6 space-y-1">
                    <Badge variant="burgundy">
                      {selectedRole === 'donor' ? `Step ${onboardingStep} of 6` : 'Onboarding Setup'}
                    </Badge>
                    <CardTitle className="text-2xl font-extrabold text-[#171717]">
                      {selectedRole === 'donor' && 'Donor Profile Setup'}
                      {selectedRole === 'requester' && 'Requester Profile Setup'}
                      {selectedRole === 'hospital' && 'Hospital Registration'}
                    </CardTitle>
                    <CardDescription>
                      Provide essential information to activate your profile
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {/* DONOR MULTI-STEP FORM */}
                    {selectedRole === 'donor' && (
                      <div className="space-y-6">
                        
                        {/* STEP 1: Basic Info */}
                        {onboardingStep === 1 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#171717]">Step 1 — Basic Information</h4>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#171717] uppercase">Full Name</label>
                              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#171717] uppercase">Phone Number</label>
                              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#171717] uppercase">Date of Birth</label>
                              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                            </div>
                          </div>
                        )}

                        {/* STEP 2: Blood Information */}
                        {onboardingStep === 2 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#171717]">Step 2 — Blood Group Information</h4>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#171717] uppercase">Select Blood Group</label>
                              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value as BloodGroup)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base font-extrabold text-[#C62828] bg-white">
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* STEP 3: Availability */}
                        {onboardingStep === 3 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#171717]">Step 3 — Donor Availability</h4>
                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E7E5E4] flex items-center justify-between">
                              <span className="text-sm font-bold text-[#171717]">Available to donate blood</span>
                              <input type="checkbox" checked={availabilityToggle} onChange={(e) => setAvailabilityToggle(e.target.checked)} className="w-5 h-5 accent-[#C62828]" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#171717] uppercase">Last Donation Date (Optional)</label>
                              <input type="date" value={lastDonation} onChange={(e) => setLastDonation(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                            </div>
                          </div>
                        )}

                        {/* STEP 4: Location */}
                        {onboardingStep === 4 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#171717]">Step 4 — Proximity Location</h4>
                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E7E5E4] space-y-3">
                              <Button type="button" variant="outline" onClick={requestGeolocation} isLoading={location.loading} className="w-full justify-center gap-2">
                                <Navigation className="w-4 h-4 text-[#C62828]" />
                                <span>Use Current Browser Geolocation</span>
                              </Button>

                              {location.error && (
                                <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg">{location.error}</p>
                              )}

                              <div className="text-center text-xs text-[#737373] uppercase font-bold">Or enter city manually</div>

                              <input
                                type="text"
                                value={manualCity}
                                onChange={(e) => { setManualCity(e.target.value); setManualLocation(e.target.value); }}
                                placeholder="City or Area (e.g. Bandra West, Mumbai)"
                                className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base bg-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* STEP 5: Eligibility Declaration */}
                        {onboardingStep === 5 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#171717]">Step 5 — Eligibility Declaration</h4>
                            <div className="p-4 rounded-2xl bg-white border border-[#E7E5E4] space-y-3 text-xs text-[#525252]">
                              <p>✓ I am at least 18 years of age and in good health.</p>
                              <p>✓ I understand platform eligibility is for matching coordination, and final eligibility will be confirmed by healthcare professionals.</p>
                              <label className="flex items-center gap-2 font-bold text-[#171717] pt-2 border-t border-[#F4F3F0]">
                                <input type="checkbox" checked={eligibilityAgreed} onChange={(e) => setEligibilityAgreed(e.target.checked)} className="w-4 h-4 accent-[#C62828]" />
                                <span>I confirm the above statements</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* STEP 6: Review */}
                        {onboardingStep === 6 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#171717]">Step 6 — Profile Summary Review</h4>
                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E7E5E4] space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-[#737373]">Full Name:</span>
                                <span className="font-bold text-[#171717]">{fullName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#737373]">Blood Group:</span>
                                <span className="font-bold text-[#C62828]">{bloodGroup}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#737373]">Availability:</span>
                                <span className="font-bold text-[#16803C]">{availabilityToggle ? 'AVAILABLE' : 'UNAVAILABLE'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step Navigation Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#F4F3F0]">
                          {onboardingStep > 1 ? (
                            <Button type="button" variant="outline" onClick={() => setOnboardingStep(onboardingStep - 1)}>
                              Back
                            </Button>
                          ) : <div />}

                          {onboardingStep < 6 ? (
                            <Button type="button" variant="default" onClick={() => setOnboardingStep(onboardingStep + 1)} className="bg-[#C62828]">
                              Next Step
                            </Button>
                          ) : (
                            <Button type="button" variant="default" onClick={handleOnboardingComplete} isLoading={authLoading} className="bg-[#C62828]">
                              Complete Donor Profile
                            </Button>
                          )}
                        </div>

                      </div>
                    )}

                    {/* REQUESTER ONBOARDING */}
                    {selectedRole === 'requester' && (
                      <div className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase">Full Name</label>
                          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase">Phone Number</label>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase">Relationship to Patient</label>
                          <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Spouse / Parent / Self" className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                        </div>
                        <Button type="button" onClick={handleOnboardingComplete} isLoading={authLoading} className="w-full h-13 text-base font-bold bg-[#C62828] mt-2">
                          Complete Requester Setup
                        </Button>
                      </div>
                    )}

                    {/* HOSPITAL ONBOARDING */}
                    {selectedRole === 'hospital' && (
                      <div className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase">Hospital Name</label>
                          <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="City General Hospital" className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase">Registration Number</label>
                          <input type="text" value={hospitalReg} onChange={(e) => setHospitalReg(e.target.value)} placeholder="REG-2026-9901" className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#171717] uppercase">Facility Address</label>
                          <input type="text" value={hospitalAddress} onChange={(e) => setHospitalAddress(e.target.value)} placeholder="12 Medical Drive, Central Ward" className="w-full h-12 px-4 rounded-xl border border-[#E7E5E4] text-base" />
                        </div>
                        <div className="p-4 border-2 border-dashed border-[#E7E5E4] rounded-2xl text-center space-y-2 bg-[#FAFAF8]">
                          <Upload className="w-6 h-6 text-[#C62828] mx-auto" />
                          <div className="text-xs text-[#737373]">Attach Official License Document (Private Bucket)</div>
                          <Button type="button" variant="outline" size="sm" onClick={() => setHospitalDocName('hospital_license.pdf')}>
                            Select Document
                          </Button>
                          {hospitalDocName && <span className="text-xs text-[#16803C] font-bold block">{hospitalDocName} Attached</span>}
                        </div>
                        <Button type="button" onClick={handleOnboardingComplete} isLoading={authLoading} className="w-full h-13 text-base font-bold bg-[#C62828] mt-2">
                          Submit Registration for Verification
                        </Button>
                      </div>
                    )}

                  </CardContent>
                </Card>
              )}

            </div>

            {/* RIGHT COLUMN: EDITORIAL PHOTOGRAPHY PANEL (~45%) */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden border border-[#E7E5E4] bg-[#F4F3F0] shadow-xl aspect-[11/14]">
                <img
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80"
                  alt="Medical professional reviewing verified healthcare record"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white text-left space-y-2">
                  <Badge variant="burgundy">PROXIMITY COORDINATION</Badge>
                  <h3 className="text-2xl font-serif-display font-normal italic">
                    “Connecting verified emergencies with ready donors.”
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Encrypted storage • Privacy shielded • Administrative verification
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* FORGOT PASSWORD RESET DIALOG */}
      <Dialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Your Password"
        description="Enter your email address to receive password reset instructions"
      >
        {resetSuccess ? (
          <div className="p-4 rounded-2xl bg-green-50 text-green-900 text-xs space-y-2">
            <strong>Password Reset Email Sent!</strong>
            <p>Please check your inbox for instructions to reset your password.</p>
            <Button onClick={() => setResetModalOpen(false)} className="w-full mt-2">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-[#171717] uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-[#E7E5E4] text-sm"
              />
            </div>
            <Button type="submit" isLoading={authLoading} className="w-full bg-[#C62828]">
              Send Reset Link
            </Button>
          </form>
        )}
      </Dialog>

      <Footer />
    </div>
  )
}
