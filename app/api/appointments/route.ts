import { NextResponse } from 'next/server'
import {
  BOOKING_TIMEZONE,
  BOOKING_TIMEZONE_LABEL,
  getBookableDays,
  getSlotsForDate,
} from '@/lib/booking'
import { listBlockedStartMs } from '@/lib/appointmentStore'
import { isSameOriginRequest } from '@/lib/requestSecurity'

export async function GET(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')?.trim()

  const days = getBookableDays()
  const blockedStartsMs = listBlockedStartMs()

  if (!date) {
    return NextResponse.json(
      {
        timezone: BOOKING_TIMEZONE,
        timezoneLabel: BOOKING_TIMEZONE_LABEL,
        days,
        blockedCount: blockedStartsMs.length,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  if (!days.some((d) => d.date === date)) {
    return NextResponse.json({ error: 'Date is not available for booking' }, { status: 400 })
  }

  const slots = getSlotsForDate(date, blockedStartsMs)

  return NextResponse.json(
    {
      date,
      timezone: BOOKING_TIMEZONE,
      timezoneLabel: BOOKING_TIMEZONE_LABEL,
      slots,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
