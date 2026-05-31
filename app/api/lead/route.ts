import { NextResponse } from 'next/server'
import { signJwtHS256 } from '@/lib/jwt'
import { isRateLimited, rateLimitKey, validateLeadBody } from '@/lib/leadSecurity'
import { isSameOriginRequest } from '@/lib/requestSecurity'

const WEBHOOK_TIMEOUT_MS = 25_000
const MAX_BODY_BYTES = 8_192

function splitFullName(fullName: string) {
  const space = fullName.indexOf(' ')
  if (space === -1) return { firstName: fullName, lastName: '' }
  return {
    firstName: fullName.slice(0, space),
    lastName: fullName.slice(space + 1).trim(),
  }
}

function getWebhookConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim()
  const jwtSecret = process.env.N8N_JWT_SECRET?.trim()
  if (!url || !jwtSecret) return null
  return { url, jwtSecret }
}

function webhookAccepted(status: number): boolean {
  return status >= 200 && status < 300
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const config = getWebhookConfig()
  if (!config) {
    console.error('Lead API: missing N8N_WEBHOOK_URL or N8N_JWT_SECRET')
    return NextResponse.json(
      { error: 'Lead service is not configured. Please call us directly.' },
      { status: 503 },
    )
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  const limiterKey = rateLimitKey(request)
  if (isRateLimited(limiterKey)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes or call us directly.' },
      { status: 429 },
    )
  }

  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const validated = validateLeadBody(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const { fullName, email, phone, address, service, timeline, privacyAccepted } = validated.data
    const { firstName, lastName } = splitFullName(fullName)

    const payload = {
      service,
      timeline,
      fullName,
      firstName,
      lastName,
      email,
      phone,
      address,
      zip: address,
      privacyAccepted,
      source: 'dgm-construction-landing',
      submittedAt: new Date().toISOString(),
    }

    const token = signJwtHS256(config.jwtSecret, { sub: 'lead-form' })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

    let res: Response
    try {
      res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: 'no-store',
      })
    } catch (e) {
      clearTimeout(timeout)
      const aborted = e instanceof Error && e.name === 'AbortError'
      console.error('Lead API: n8n fetch failed', aborted ? 'timeout' : e)
      return NextResponse.json(
        {
          error: aborted
            ? 'Request timed out. Please try again or call us at +1 (732) 231-5321.'
            : 'Unable to connect to our booking system. Please call us at +1 (732) 231-5321.',
        },
        { status: 503 },
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!webhookAccepted(res.status)) {
      const errBody = await res.text().catch(() => '')
      console.error('Lead API: n8n rejected request', res.status, errBody.slice(0, 200))
      return NextResponse.json(
        { error: 'We could not process your request right now. Please call us at +1 (732) 231-5321.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Lead API: unexpected error', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please call us at +1 (732) 231-5321.' },
      { status: 500 },
    )
  }
}
