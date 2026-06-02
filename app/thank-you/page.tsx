import Image from 'next/image'
import Link from 'next/link'
import { CalendarCheck, CheckCircle2, Phone } from 'lucide-react'
import { BRAND } from '@/lib/brand'

function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-brand-navy">DGM</span>{' '}
      <span className="text-brand-crimson">Construction LLC</span>
    </span>
  )
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ scheduled?: string; when?: string }>
}) {
  const params = await searchParams
  const scheduled = params.scheduled !== '0'
  const when = params.when ? decodeURIComponent(params.when) : null

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b-4 border-brand-navy bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Image src="/favicon.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
          <BrandWordmark className="text-lg" />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="animate-form-success w-full max-w-lg border-2 border-brand-navy bg-white p-8 text-center shadow-card-lg sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            {scheduled ? (
              <CalendarCheck className="h-10 w-10 text-brand-crimson" strokeWidth={2} aria-hidden />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-brand-crimson" strokeWidth={2} aria-hidden />
            )}
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-brand-navy sm:text-3xl">
            {scheduled ? 'Your Inspection Is Booked!' : 'Thank You — We Got Your Request!'}
          </h1>

          {scheduled && when ? (
            <p className="mt-4 text-base leading-relaxed text-brand-charcoal">
              Your complimentary inspection is scheduled for{' '}
              <span className="font-bold text-brand-navy">{when}</span>.
            </p>
          ) : scheduled ? (
            <p className="mt-4 text-base leading-relaxed text-brand-charcoal">
              Your complimentary inspection is confirmed. Our team will send a reminder before your visit.
            </p>
          ) : (
            <p className="mt-4 text-base leading-relaxed text-brand-charcoal">
              We received your project details and will contact you shortly to schedule your inspection.
            </p>
          )}

          <ul className="mt-6 space-y-2 text-left text-sm text-brand-charcoal">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-crimson" aria-hidden />
              A DGM specialist will review your request within one business day.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-crimson" aria-hidden />
              For urgent storm damage, call our 24/7 line anytime.
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={BRAND.phoneHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand-crimson px-6 text-sm font-bold text-white hover:bg-brand-navy"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {BRAND.phone}
            </a>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center border-2 border-brand-navy px-6 text-sm font-bold text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-brand-charcoal">
        © {new Date().getFullYear()} {BRAND.name}. Neptune City, NJ
      </footer>
    </div>
  )
}
