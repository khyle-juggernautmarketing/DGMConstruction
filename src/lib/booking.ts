/** Eastern Time — America/New_York (EST/EDT per NJ local time). */
export const BOOKING_TIMEZONE = 'America/New_York'
export const BOOKING_TIMEZONE_LABEL = 'Eastern Time (ET)'

export const BOOKING_HOUR_START = 8
export const BOOKING_HOUR_END = 18
export const SLOT_INTERVAL_MIN = 15
export const BLOCK_DURATION_MIN = 90
export const MAX_DAYS_OUT = 3
export const FORM_FALLBACK_MS = 10 * 60 * 1000

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: BOOKING_TIMEZONE,
  weekday: 'short',
})

const DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: BOOKING_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const TIME_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: BOOKING_TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export interface TimeSlot {
  time: string
  label: string
  startMs: number
  available: boolean
}

export interface BookableDay {
  date: string
  label: string
  weekday: string
}

function easternYmd(date: Date): string {
  return DATE_FORMAT.format(date)
}

function easternWeekday(date: Date): string {
  return WEEKDAY_FORMAT.format(date)
}

function easternHm(date: Date): { hour: number; minute: number } {
  const parts = TIME_FORMAT.formatToParts(date)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return { hour, minute }
}

/** Convert YYYY-MM-DD + HH:mm in Eastern to UTC epoch ms. */
export function easternDateTimeToMs(date: string, time: string): number {
  for (const offset of ['-04:00', '-05:00']) {
    const candidate = new Date(`${date}T${time}:00${offset}`)
    if (Number.isNaN(candidate.getTime())) continue
    if (easternYmd(candidate) === date) {
      const hm = easternHm(candidate)
      const [h, m] = time.split(':').map(Number)
      if (hm.hour === h && hm.minute === m) return candidate.getTime()
    }
  }
  throw new Error('Invalid Eastern date/time')
}

export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function formatAppointmentDisplay(date: string, time: string): string {
  const d = new Date(easternDateTimeToMs(date, time))
  const weekday = easternWeekday(d)
  const [y, mo, da] = date.split('-')
  return `${weekday}, ${mo}/${da}/${y} at ${formatTimeLabel(time)} ${BOOKING_TIMEZONE_LABEL}`
}

export function getBookableDays(now: Date = new Date()): BookableDay[] {
  const days: BookableDay[] = []
  const startYmd = easternYmd(now)
  const noonMs = easternDateTimeToMs(startYmd, '12:00')

  for (let offset = 0; offset <= MAX_DAYS_OUT; offset++) {
    const d = new Date(noonMs + offset * 86_400_000)
    const weekday = easternWeekday(d)
    if (weekday === 'Sun') continue

    const date = easternYmd(d)
    const [, mo, da] = date.split('-')
    days.push({
      date,
      weekday,
      label: `${weekday} ${mo}/${da}`,
    })
  }

  return days
}

function generateSlotTimes(): string[] {
  const slots: string[] = []
  for (let h = BOOKING_HOUR_START; h < BOOKING_HOUR_END; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL_MIN) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}

export function isSlotStartAllowed(date: string, time: string, now: Date = new Date()): boolean {
  const startMs = easternDateTimeToMs(date, time)
  const day = new Date(startMs)
  if (easternWeekday(day) === 'Sun') return false
  if (easternYmd(day) !== date) return false

  const [h, m] = time.split(':').map(Number)
  if (h < BOOKING_HOUR_START || h >= BOOKING_HOUR_END) return false
  if (h === BOOKING_HOUR_END - 1 && m > 60 - SLOT_INTERVAL_MIN) return false

  const bookable = getBookableDays(now).map((d) => d.date)
  if (!bookable.includes(date)) return false

  if (startMs <= now.getTime()) return false

  return true
}

export function slotOverlapsBlock(
  slotStartMs: number,
  blockStartMs: number,
  blockDurationMin = BLOCK_DURATION_MIN,
): boolean {
  const blockEndMs = blockStartMs + blockDurationMin * 60_000
  return slotStartMs >= blockStartMs && slotStartMs < blockEndMs
}

export function getSlotsForDate(
  date: string,
  blockedStartsMs: number[],
  now: Date = new Date(),
): TimeSlot[] {
  return generateSlotTimes().map((time) => {
    let available = true
    let startMs = 0
    try {
      startMs = easternDateTimeToMs(date, time)
      if (!isSlotStartAllowed(date, time, now)) available = false
      for (const blockStart of blockedStartsMs) {
        if (slotOverlapsBlock(startMs, blockStart)) {
          available = false
          break
        }
      }
    } catch {
      available = false
    }
    return {
      time,
      label: formatTimeLabel(time),
      startMs,
      available,
    }
  })
}
