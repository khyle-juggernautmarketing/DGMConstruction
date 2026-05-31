export const SERVICES = [
  'roof-replacement',
  'roof-installation',
  'siding',
  'gutters',
  'roof-inspection',
] as const

export const TIMELINES = ['asap-emergency', '1-2-weeks', 'planning-ahead'] as const

export type Service = (typeof SERVICES)[number]
export type Timeline = (typeof TIMELINES)[number]

export interface LeadFormData {
  service: Service | ''
  timeline: Timeline | ''
  fullName: string
  email: string
  phone: string
  address: string
  privacyAccepted: boolean
}

const MAX = {
  fullName: 120,
  email: 254,
  phone: 32,
  address: 200,
} as const

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g
const HTML_TAG = /<[^>]*>/g

export function sanitizeText(value: unknown, maxLen: number): string {
  return String(value ?? '')
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAG, '')
    .trim()
    .slice(0, maxLen)
}

export function isAllowedEnum<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value)
}

function isValidAddress(address: string): boolean {
  if (address.length < 8) return false
  if (!/[a-zA-Z]/.test(address)) return false
  if (!/\d/.test(address)) return false
  return true
}

export function validateLeadBody(body: unknown):
  | { ok: true; data: LeadFormData & { website?: string } }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' }
  }

  const raw = body as Record<string, unknown>

  const website = sanitizeText(raw.website, 200)
  if (website) {
    return { ok: false, error: 'Invalid submission' }
  }

  const service = sanitizeText(raw.service, 64)
  const timeline = sanitizeText(raw.timeline, 64)
  const fullName = sanitizeText(raw.fullName, MAX.fullName)
  const email = sanitizeText(raw.email, MAX.email).toLowerCase()
  const phone = sanitizeText(raw.phone, MAX.phone)
  const address = sanitizeText(raw.address ?? raw.zip, MAX.address)
  const privacyAccepted = raw.privacyAccepted === true

  if (!service || !timeline || !fullName || !email || !phone || !address) {
    return { ok: false, error: 'Missing required fields' }
  }

  if (!privacyAccepted) {
    return { ok: false, error: 'Privacy agreement is required' }
  }

  if (!isAllowedEnum(service, SERVICES)) {
    return { ok: false, error: 'Invalid service selection' }
  }

  if (!isAllowedEnum(timeline, TIMELINES)) {
    return { ok: false, error: 'Invalid timeline selection' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Invalid email' }
  }

  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return { ok: false, error: 'Invalid phone number' }
  }

  if (!isValidAddress(address)) {
    return { ok: false, error: 'Invalid address' }
  }

  return {
    ok: true,
    data: { service, timeline, fullName, email, phone, address, privacyAccepted },
  }
}

const hits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 8
const RATE_WINDOW_MS = 15 * 60 * 1000

export function rateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT
}
