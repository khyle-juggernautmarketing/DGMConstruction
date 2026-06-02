'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Hammer,
  Home,
  Layers,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Umbrella,
  Wrench,
  X,
} from 'lucide-react'
import { AppointmentCalendar } from '@/components/AppointmentCalendar'
import { FORM_FALLBACK_MS, formatAppointmentDisplay } from '@/lib/booking'

const BRAND = {
  name: 'DGM Construction LLC',
  phone: '+1 (732) 231-5321',
  phoneHref: 'tel:+17322315321',
  email: 'info@dgmconstructionllc.com',
  address: '2009 Greenwood Ave, Neptune City, NJ 07753, United States',
}

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Process', href: '#process' },
  { label: 'Areas', href: '#areas' },
]

const VALUE_PROPS = [
  '100% Complimentary Professional Inspections & Estimates',
  'Premium Manufacturer-Backed Warranties Included',
  'Licensed, Vetted, and Fully Insured Crews',
]

const SERVICE_OPTIONS = [
  { value: 'roof-replacement', label: 'Roof Replacement', icon: Hammer },
  { value: 'roof-installation', label: 'Roof Installation', icon: Layers },
  { value: 'siding', label: 'Siding Services', icon: Home },
  { value: 'gutters', label: 'Gutter Services & Maintenance', icon: Droplets },
  { value: 'roof-inspection', label: 'Detailed Roof Inspection', icon: Search },
]

const TIMELINE_OPTIONS = [
  { value: 'asap-emergency', label: 'ASAP / Active Emergency Leak' },
  { value: '1-2-weeks', label: 'Within 1-2 Weeks' },
  { value: 'planning-ahead', label: 'Just Planning Ahead' },
]

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'NJ Fully Licensed & Insured' },
  { icon: Home, title: 'Protecting Local Properties Successfully' },
  { icon: Award, title: 'Authorized System Integrator of Leading Brands' },
  { icon: Umbrella, title: 'Multi-Million Dollar Liability Coverage' },
  { icon: BadgeCheck, title: 'Free Zero-Obligation Estimates' },
]

const SERVICE_ROWS = [
  {
    title: 'Roof Replacement',
    description:
      'Tailored replacement services for homes reaching their lifespan or suffering extensive storm damage.',
    image: '/images/roofing-1.jpg',
    alt: 'Roof replacement project on a New Jersey home by DGM Construction LLC',
    featured: true,
  },
  {
    title: 'Gutter Services',
    description:
      'Proper installation, clearing, and maintenance protecting home foundations from water damage within a 50-mile radius.',
    image: '/images/siding-4.jpeg',
    alt: 'Gutter and exterior maintenance protecting a Monmouth County property',
    featured: false,
  },
  {
    title: 'Roof Installation',
    description:
      'Precise structural builds, installations, and premium material protection serving all of New Jersey.',
    image: '/images/roofing-2.jpeg',
    alt: 'New roof installation by DGM Construction LLC in New Jersey',
    featured: false,
  },
  {
    title: 'Siding Services',
    description:
      'Elevating home curb appeal while providing heavy-duty weather resistance and optimized wall insulation.',
    image: '/images/siding-1.webp',
    alt: 'Premium siding installation improving curb appeal and weather resistance',
    featured: false,
  },
  {
    title: 'Detailed Roof Inspections',
    description:
      'Rigorous structural checkups detecting active leaks and weaknesses before they become expensive repairs.',
    image: '/images/siding-5.jpeg',
    alt: 'Detailed roof inspection identifying structural issues before costly repairs',
    featured: false,
  },
]

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Schedule Assessment',
    description: 'Submit project data through our zero-obligation quote portal.',
  },
  {
    num: '02',
    title: 'Precision Inspection',
    description: 'Vetted dispatch crews map out structural metrics.',
  },
  {
    num: '03',
    title: 'Transparent Quote',
    description: 'Receive a thorough line-item breakdown with fixed cost parameters.',
  },
  {
    num: '04',
    title: 'Professional Build',
    description: 'Safe structural project execution, cleanup, and debris extraction.',
  },
]

const GEO_LOCATIONS = [
  'Neptune City',
  'Asbury Park',
  'Belmar',
  'Long Branch',
  'Red Bank',
  'Toms River',
  'Brick',
  'Freehold',
  'Middletown',
  'Wall Township',
  'Manasquan',
  'Ocean Township',
  'Eatontown',
  'Howell',
  'Lakewood',
]

const FORM_STEPS = [
  { id: 1, title: 'Select your service' },
  { id: 2, title: 'Project timeline' },
  { id: 3, title: 'Your contact details' },
  { id: 4, title: 'Schedule your inspection' },
]

const HTML_TAG = /<[^>]*>/g
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

function sanitizeInput(value: string): string {
  return value.replace(HTML_TAG, '').replace(CONTROL_CHARS, '')
}

function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-brand-navy">DGM</span>{' '}
      <span className="text-brand-crimson">Construction LLC</span>
    </span>
  )
}

function useStepAdvanceDelay() {
  const [ms, setMs] = useState(300)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMs(0)
    })
    return () => cancelAnimationFrame(id)
  }, [])
  return ms
}

function TopRibbon() {
  return (
    <div className="bg-brand-crimson py-2 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-white sm:py-2.5 sm:text-xs sm:tracking-wider md:text-sm">
      <span className="hidden sm:inline" aria-hidden>
        🚨{' '}
      </span>
      <span className="sm:hidden">Storm Damage? 24/7 — </span>
      <span className="hidden sm:inline">Storm Damage or Exterior Wear? 24/7 Support — </span>
      <a href={BRAND.phoneHref} className="underline underline-offset-2 hover:text-white/90">
        {BRAND.phone}
      </a>
    </div>
  )
}

function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-brand-navy bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)] lg:hidden">
      <div
        className="mx-auto flex max-w-lg items-stretch gap-2 px-3 py-2"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <a
          href="#contact"
          className="flex min-h-12 flex-1 items-center justify-center bg-brand-navy px-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Free Quote
        </a>
        <a
          href={BRAND.phoneHref}
          className="animate-pulse-call-ring flex min-h-12 flex-1 items-center justify-center gap-2 bg-brand-crimson px-3 text-sm font-bold text-white"
        >
          <Phone className="h-4 w-4 shrink-0" aria-hidden />
          Call Now
        </a>
      </div>
    </div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 overflow-hidden">
      <TopRibbon />
      <div
        className={`border-b-4 border-brand-navy bg-white transition-shadow ${scrolled ? 'shadow-card' : ''}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="#" className="flex min-h-12 items-center gap-3" aria-label={`${BRAND.name} home`}>
            <Image
              src="/favicon.svg"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0"
              priority
            />
            <span className="hidden text-lg sm:inline">
              <BrandWordmark />
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-12 content-center text-sm font-semibold uppercase tracking-wide text-brand-charcoal transition-colors hover:text-brand-crimson"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={BRAND.phoneHref}
            className="hidden min-h-12 items-center gap-2 bg-brand-navy px-5 text-sm font-bold text-white transition-colors hover:bg-brand-crimson lg:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {BRAND.phone}
          </a>

          <button
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center border-2 border-brand-navy text-brand-navy lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <button
            type="button"
            className="absolute inset-0 bg-brand-navy/70"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,340px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b-4 border-brand-crimson bg-brand-navy px-4 py-4 text-white">
              <BrandWordmark className="text-base !text-white [&_span:first-child]:text-white [&_span:last-child]:text-red-200" />
              <button
                type="button"
                className="inline-flex min-h-12 min-w-12 items-center justify-center border border-white/30"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col p-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-mobile-link flex min-h-12 items-center border-b border-gray-100 px-2 text-base font-semibold text-brand-navy hover:text-brand-crimson"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={BRAND.phoneHref}
                className="nav-mobile-link mt-6 flex min-h-12 items-center justify-center gap-2 bg-brand-crimson text-sm font-bold text-white"
                style={{ animationDelay: `${NAV_LINKS.length * 50}ms` }}
                onClick={() => setOpen(false)}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {BRAND.phone}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-5 flex gap-2">
      {FORM_STEPS.map((s) => (
        <div
          key={s.id}
          className={`h-1.5 flex-1 transition-colors ${step >= s.id ? 'bg-brand-crimson' : 'bg-gray-200'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

function SuccessMarks() {
  return (
    <svg className="h-24 w-24 text-brand-crimson" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="28" fill="rgba(166,10,10,0.1)" />
      <path
        className="animate-check-stroke"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 34l8 8 20-22"
      />
    </svg>
  )
}

interface LeadFormState {
  service: string
  timeline: string
  fullName: string
  email: string
  phone: string
  address: string
  privacyAccepted: boolean
}

const initialLeadForm: LeadFormState = {
  service: '',
  timeline: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  privacyAccepted: false,
}

function LeadForm() {
  const router = useRouter()
  const stepAdvanceDelayMs = useStepAdvanceDelay()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<LeadFormState>(initialLeadForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'scheduling'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const submittedRef = useRef(false)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }, [])

  const buildPayload = useCallback(
    (submissionType: 'scheduled' | 'form_only') => {
      const fullName = sanitizeInput(data.fullName.trim())
      const email = sanitizeInput(data.email.trim())
      const phone = sanitizeInput(data.phone.trim())
      const address = sanitizeInput(data.address.trim())

      return {
        service: data.service,
        timeline: data.timeline,
        fullName,
        email,
        phone,
        address,
        privacyAccepted: data.privacyAccepted,
        submissionType,
        appointmentDate: submissionType === 'scheduled' ? appointmentDate : undefined,
        appointmentTime: submissionType === 'scheduled' ? appointmentTime : undefined,
        website: honeypot,
      }
    },
    [appointmentDate, appointmentTime, data, honeypot],
  )

  const postLead = useCallback(async (payload: ReturnType<typeof buildPayload>) => {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    return res
  }, [])

  const sendToWebhook = useCallback(
    async (submissionType: 'scheduled' | 'form_only') => {
      if (submittedRef.current) return true
      submittedRef.current = true
      clearFallbackTimer()

      const payload = buildPayload(submissionType)
      let res = await postLead(payload)

      if (res.status === 503 || res.status === 502) {
        await new Promise((r) => setTimeout(r, 800))
        res = await postLead(payload)
      }

      if (!res.ok) {
        submittedRef.current = false
        const j = (await res.json().catch(() => null)) as { error?: string } | null
        setErrorMsg(
          j?.error ??
            `Something went wrong (error ${res.status}). Please call us at ${BRAND.phone}.`,
        )
        return false
      }

      return true
    },
    [buildPayload, clearFallbackTimer, postLead],
  )

  const goToThankYou = useCallback(
    (scheduled: boolean, when?: string) => {
      const params = new URLSearchParams({ scheduled: scheduled ? '1' : '0' })
      if (when) params.set('when', when)
      router.push(`/thank-you?${params.toString()}`)
    },
    [router],
  )

  useEffect(() => {
    return () => clearFallbackTimer()
  }, [clearFallbackTimer])

  const startFallbackTimer = useCallback(() => {
    clearFallbackTimer()
    fallbackTimerRef.current = setTimeout(async () => {
      if (submittedRef.current) return
      setStatus('loading')
      const ok = await sendToWebhook('form_only')
      if (ok) {
        goToThankYou(false)
      } else {
        setStatus('scheduling')
      }
    }, FORM_FALLBACK_MS)
  }, [clearFallbackTimer, goToThankYou, sendToWebhook])

  const selectService = useCallback(
    (value: string) => {
      setData((d) => ({ ...d, service: value }))
      setErrorMsg('')
      setTimeout(() => setStep(2), stepAdvanceDelayMs)
    },
    [stepAdvanceDelayMs],
  )

  const selectTimeline = useCallback(
    (value: string) => {
      setData((d) => ({ ...d, timeline: value }))
      setErrorMsg('')
      setTimeout(() => setStep(3), stepAdvanceDelayMs)
    },
    [stepAdvanceDelayMs],
  )

  const goNext = () => {
    setErrorMsg('')
    if (step === 1 && !data.service) {
      setErrorMsg('Please select a service.')
      return
    }
    if (step === 2 && !data.timeline) {
      setErrorMsg('Please select a timeline.')
      return
    }
    setStep((s) => Math.min(s + 1, 4))
  }

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    const fullName = sanitizeInput(data.fullName.trim())
    const email = sanitizeInput(data.email.trim())
    const phone = sanitizeInput(data.phone.trim())
    const address = sanitizeInput(data.address.trim())

    if (!fullName || !email || !phone || !address) {
      setErrorMsg('Please fill in all fields.')
      return
    }
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setErrorMsg('Please enter a valid phone number.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email.')
      return
    }
    if (address.length < 3) {
      setErrorMsg('Please enter your address or city.')
      return
    }
    if (!data.privacyAccepted) {
      setErrorMsg('Please accept the privacy agreement to continue.')
      return
    }

    setData((d) => ({ ...d, fullName, email, phone, address }))
    setStep(4)
    setStatus('scheduling')
    startFallbackTimer()
  }

  const confirmAppointment = async () => {
    setErrorMsg('')
    if (!appointmentDate || !appointmentTime) {
      setErrorMsg('Please select a date and time for your inspection.')
      return
    }

    setStatus('loading')
    const ok = await sendToWebhook('scheduled')
    if (ok) {
      const when = formatAppointmentDisplay(appointmentDate, appointmentTime)
      goToThankYou(true, when)
    } else {
      setStatus('scheduling')
    }
  }

  return (
    <div className="overflow-hidden border-2 border-brand-navy bg-white shadow-card-lg">
      <div className="bg-brand-navy px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-red-200">Free Quote</p>
        <h3 className="text-lg font-bold">Get Your Inspection &amp; Estimate</h3>
      </div>

      <div className="p-5 sm:p-6">
        <StepIndicator step={step} />
        <p className="mb-4 text-sm font-bold text-brand-navy">{FORM_STEPS[step - 1].title}</p>

        <div key={step} className="animate-form-step">
          {step === 1 && (
            <div className="space-y-2">
              {SERVICE_OPTIONS.map((opt, i) => {
                const selected = data.service === opt.value
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectService(opt.value)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`animate-form-option flex min-h-12 w-full cursor-pointer items-center gap-3 border-2 p-3 text-left transition-all ${
                      selected
                        ? 'border-brand-crimson bg-red-50'
                        : 'border-gray-200 bg-white hover:border-brand-navy'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                        selected ? 'bg-brand-crimson text-white' : 'bg-gray-100 text-brand-navy'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-brand-charcoal">{opt.label}</span>
                    {selected && <CheckCircle2 className="h-5 w-5 text-brand-crimson" aria-hidden />}
                  </button>
                )
              })}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              {TIMELINE_OPTIONS.map((opt, i) => {
                const selected = data.timeline === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectTimeline(opt.value)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`animate-form-option min-h-12 w-full border-2 px-4 py-3 text-left text-sm font-semibold transition-all ${
                      selected
                        ? 'border-brand-crimson bg-red-50 text-brand-navy'
                        : 'border-gray-200 hover:border-brand-navy'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}

          {step === 3 && (
            <form onSubmit={submitContact} className="space-y-3">
              <label className="sr-only" aria-hidden>
                Website
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />
              </label>
              {(
                [
                  { id: 'lead-fullName', label: 'Full Name', key: 'fullName' as const, type: 'text', auto: 'name' },
                  { id: 'lead-email', label: 'Email', key: 'email' as const, type: 'email', auto: 'email' },
                  { id: 'lead-phone', label: 'Phone Number', key: 'phone' as const, type: 'tel', auto: 'tel' },
                ] as const
              ).map((field) => (
                <label key={field.id} className="block" htmlFor={field.id}>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-charcoal">
                    {field.label}
                  </span>
                  <input
                    id={field.id}
                    type={field.type}
                    required
                    autoComplete={field.auto}
                    value={data[field.key]}
                    onChange={(e) => setData({ ...data, [field.key]: sanitizeInput(e.target.value) })}
                    className="min-h-12 w-full border-2 border-gray-200 px-3 text-base focus:border-brand-navy focus:outline-none sm:text-sm"
                  />
                </label>
              ))}
              <label className="block" htmlFor="lead-address">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-charcoal">
                  Address
                </span>
                <input
                  id="lead-address"
                  required
                  autoComplete="street-address"
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: sanitizeInput(e.target.value) })}
                  placeholder="123 Main St, Neptune City, NJ 07753"
                  className="min-h-12 w-full border-2 border-gray-200 px-3 text-base focus:border-brand-navy focus:outline-none sm:text-sm"
                />
              </label>
              <label className="flex min-h-12 cursor-pointer items-start gap-3 border border-gray-200 p-3">
                <input
                  type="checkbox"
                  checked={data.privacyAccepted}
                  onChange={(e) => setData({ ...data, privacyAccepted: e.target.checked })}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-brand-crimson"
                />
                <span className="text-xs leading-relaxed text-brand-charcoal">
                  I agree to the privacy policy and consent to {BRAND.name} contacting me about my project.
                </span>
              </label>
              {errorMsg && (
                <p className="text-sm font-medium text-brand-crimson" role="alert">
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center gap-2 bg-brand-crimson text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-navy sm:text-sm"
              >
                Continue to Scheduling
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <AppointmentCalendar
                selectedDate={appointmentDate}
                selectedTime={appointmentTime}
                onSelectDate={setAppointmentDate}
                onSelectTime={setAppointmentTime}
                disabled={status === 'loading'}
              />
              {errorMsg && (
                <p className="text-sm font-medium text-brand-crimson" role="alert">
                  {errorMsg}
                </p>
              )}
              <button
                type="button"
                onClick={confirmAppointment}
                disabled={status === 'loading'}
                className="flex min-h-12 w-full items-center justify-center gap-2 bg-brand-crimson text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-navy disabled:opacity-70 sm:text-sm"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Confirming…
                  </>
                ) : (
                  'Confirm Appointment'
                )}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-brand-charcoal">
                If you don&apos;t pick a time within 10 minutes, we&apos;ll still receive your contact details.
              </p>
            </div>
          )}
        </div>

        {errorMsg && step !== 3 && step !== 4 && (
          <p className="mt-3 text-sm font-medium text-brand-crimson" role="alert">
            {errorMsg}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('')
                if (step === 4) clearFallbackTimer()
                setStep((s) => Math.max(1, s - 1))
              }}
              className="min-h-12 text-sm font-bold text-brand-charcoal hover:text-brand-crimson"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={goNext}
              className="min-h-12 bg-brand-navy px-6 text-sm font-bold uppercase text-white hover:bg-brand-crimson"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white lg:min-h-[680px]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-12 lg:py-16 lg:pl-6 lg:pr-10">
          <div className="hero-line hero-line-d0 mb-4 inline-flex w-fit items-center gap-2 border-l-4 border-brand-crimson bg-gray-50 py-2 pl-4 pr-5 text-xs font-bold uppercase tracking-widest text-brand-navy">
            Family-Owned · Neptune City, NJ
          </div>

          <h1 className="hero-line hero-line-d1 text-balance text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl lg:text-5xl">
            Residential Roofing, Siding &amp;{' '}
            <span className="text-brand-crimson">Exterior Restoration</span>
          </h1>

          <p className="hero-line hero-line-d2 mt-5 max-w-lg text-base leading-relaxed text-black lg:text-lg">
            DGM Construction LLC protects Monmouth County homes with premium roofing, siding, gutter
            services, and inspections — serving New Jersey within a 50-mile radius.
          </p>

          <ul className="hero-line hero-line-d3 mt-8 space-y-3">
            {VALUE_PROPS.map((prop) => (
              <li key={prop} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-crimson" aria-hidden />
                <span className="text-sm font-medium text-black sm:text-base">{prop}</span>
              </li>
            ))}
          </ul>

          <div className="hero-line hero-line-d3 mt-8 grid grid-cols-3 gap-3 border-t-2 border-brand-navy pt-6 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4 sm:pt-8">
            <div className="text-center sm:text-left">
              <p className="text-xl font-extrabold text-brand-navy sm:text-2xl">50+</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-black sm:text-xs">Mile Radius</p>
            </div>
            <div className="hidden h-10 w-px bg-gray-200 sm:block" aria-hidden />
            <div className="text-center sm:text-left">
              <p className="text-xl font-extrabold text-brand-crimson sm:text-2xl">24/7</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-black sm:text-xs">Emergency Line</p>
            </div>
            <div className="hidden h-10 w-px bg-gray-200 sm:block" aria-hidden />
            <div className="text-center sm:text-left">
              <p className="text-xl font-extrabold text-brand-navy sm:text-2xl">$0</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-black sm:text-xs">Inspection Fee</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[640px]">
          <Image
            src="/images/roofing-2.jpeg"
            alt="DGM Construction roofing project in New Jersey"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-brand-navy/20 lg:bg-gradient-to-r lg:from-white/90 lg:via-white/40 lg:to-transparent" />
        </div>
      </div>

      <div
        id="contact"
        className="scroll-mt-24 border-t-4 border-brand-crimson bg-gray-50 px-4 py-6 sm:py-8 lg:absolute lg:right-8 lg:top-1/2 lg:z-10 lg:-mt-0 lg:w-[min(100%,420px)] lg:-translate-y-1/2 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:scroll-mt-0"
      >
        <div className="mx-auto max-w-md lg:ml-auto lg:mr-0 lg:max-w-none">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}

function TrustRibbon() {
  return (
    <section id="why-us" className="overflow-hidden bg-brand-navy py-10 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-red-200">
          Why Homeowners Trust DGM
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex flex-col items-center border border-white/15 bg-white/5 p-5 text-center lg:items-start lg:text-left"
              >
                <Icon className="mb-3 h-8 w-8 text-brand-crimson" strokeWidth={1.75} aria-hidden />
                <p className="text-sm font-bold leading-snug">{item.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const featured = SERVICE_ROWS.find((r) => r.featured)!
  const rest = SERVICE_ROWS.filter((r) => !r.featured)

  return (
    <section id="services" className="overflow-hidden bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-crimson">Our Expertise</p>
          <h2 className="mt-2 text-3xl font-extrabold text-brand-navy sm:text-4xl">
            Complete Exterior &amp; Roofing Solutions
          </h2>
          <p className="mt-3 text-brand-charcoal">
            Engineered for New Jersey coastal storms, humidity, and seasonal extremes across Monmouth County.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          <article className="group relative overflow-hidden border-2 border-brand-navy bg-white lg:col-span-7 lg:row-span-2">
            <div className="relative h-56 sm:h-72 lg:h-full lg:min-h-[480px]">
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white sm:p-8">
                <h3 className="text-2xl font-extrabold">{featured.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">{featured.description}</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="mt-4 inline-flex min-h-12 items-center gap-2 bg-brand-crimson px-5 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-brand-navy"
                >
                  Free Estimate <ChevronRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </article>

          {rest.map((row) => (
            <article
              key={row.title}
              className="group flex flex-col overflow-hidden border-2 border-gray-200 bg-white transition-shadow hover:border-brand-crimson hover:shadow-lift lg:col-span-5"
            >
              <div className="relative h-40 shrink-0 overflow-hidden">
                <Image
                  src={row.image}
                  alt={row.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-extrabold text-brand-navy">{row.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-charcoal">{row.description}</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="mt-4 inline-flex min-h-12 w-fit items-center text-sm font-bold text-brand-crimson hover:text-brand-navy"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section id="process" className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-crimson">How It Works</p>
            <h2 className="mt-2 text-3xl font-extrabold text-brand-navy sm:text-4xl">
              Mastering Your Property Project Lifecycle
            </h2>
            <p className="mt-4 text-brand-charcoal">
              A transparent four-step workflow built for Neptune City homeowners — from first call to final cleanup.
            </p>
            <a
              href={BRAND.phoneHref}
              className="mt-8 inline-flex min-h-12 items-center gap-2 border-2 border-brand-navy px-6 text-sm font-bold text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Speak With Our Team
            </a>
          </div>

          <ol className="relative space-y-0 border-l-4 border-brand-crimson pl-8">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.num} className={`relative pb-10 ${i === PROCESS_STEPS.length - 1 ? 'pb-0' : ''}`}>
                <span
                  className="absolute -left-[calc(1rem+10px)] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson ring-4 ring-white"
                  aria-hidden
                />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-crimson">{step.num}</p>
                <h3 className="mt-1 text-lg font-extrabold text-brand-navy">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-charcoal">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function GeoChips() {
  return (
    <section id="areas" className="overflow-hidden border-t-4 border-brand-navy bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-crimson">Service Areas</p>
          <h2 className="mt-2 text-3xl font-extrabold text-brand-navy sm:text-4xl">
            Proudly Serving Monmouth County &amp; Surrounding Communities
          </h2>
          <p className="mt-3 text-brand-charcoal">
            Local crews dispatched within our 50-mile operational radius from Neptune City, NJ.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GEO_LOCATIONS.map((loc) => {
              const isPrimary = loc === 'Neptune City'
              return (
                <span
                  key={loc}
                  className={`inline-flex min-h-11 items-center px-3 py-2 text-sm font-semibold transition-colors ${
                    isPrimary
                      ? 'bg-brand-navy text-white'
                      : 'bg-gray-100 text-brand-charcoal hover:bg-brand-crimson hover:text-white'
                  }`}
                >
                  {isPrimary && <MapPin className="mr-1.5 h-4 w-4 shrink-0" aria-hidden />}
                  {loc}
                </span>
              )
            })}
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden border-2 border-brand-navy sm:min-h-[360px]">
          <Image
            src="/images/siding-2.jpeg"
            alt="DGM Construction serving Monmouth County New Jersey"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-brand-navy/90 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-red-200">Primary Hub</p>
            <p className="text-lg font-extrabold">Neptune City, NJ</p>
            <p className="mt-1 text-sm text-white/80">{BRAND.address}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="overflow-hidden bg-brand-navy text-white/80">
      <div className="h-1.5 bg-brand-crimson" aria-hidden />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src="/favicon.svg" alt="" width={36} height={36} className="h-9 w-9 shrink-0 brightness-0 invert" aria-hidden />
            <BrandWordmark className="text-base [&_span:first-child]:text-white [&_span:last-child]:text-red-300" />
          </div>
          <p className="text-sm leading-relaxed">
            Protecting Neptune City and Monmouth County with premium residential roofing, siding, gutter services,
            and exterior restoration.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-12 items-center hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <p className="font-bold text-white">Office</p>
              <address className="not-italic">{BRAND.address}</address>
            </li>
            <li>
              <p className="font-bold text-white">Phone</p>
              <a href={BRAND.phoneHref} className="hover:text-white">
                {BRAND.phone}
              </a>
            </li>
            <li>
              <p className="font-bold text-white">Email</p>
              <a href={`mailto:${BRAND.email}`} className="hover:text-white">
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Operations</h3>
          <div className="space-y-2 text-sm">
            <p className="border border-white/20 bg-white/5 px-3 py-2.5">
              <Wrench className="mr-2 inline h-4 w-4 text-brand-crimson" aria-hidden />
              24/7 Emergency Dispatches
            </p>
            <p className="border border-white/20 bg-white/5 px-3 py-2.5">
              <ShieldCheck className="mr-2 inline h-4 w-4 text-brand-crimson" aria-hidden />
              NJ Licensed &amp; Fully Insured
            </p>
            <a
              href={BRAND.phoneHref}
              className="mt-2 inline-flex min-h-12 w-full items-center justify-center bg-brand-crimson text-base font-bold hover:bg-white hover:text-brand-navy"
            >
              {BRAND.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row">
          <p>© 2026 {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="min-h-12 content-center hover:text-white">
              Privacy Policy
            </a>
            <a href="#terms" className="min-h-12 content-center hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function DGMLandingPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <TrustRibbon />
        <Services />
        <Process />
        <GeoChips />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  )
}
