'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { BOOKING_TIMEZONE_LABEL, type BookableDay, type TimeSlot } from '@/lib/booking'

interface AppointmentsMeta {
  days: BookableDay[]
  timezoneLabel: string
}

interface DaySlotsResponse {
  slots: TimeSlot[]
  timezoneLabel: string
}

interface AppointmentCalendarProps {
  selectedDate: string
  selectedTime: string
  onSelectDate: (date: string) => void
  onSelectTime: (time: string) => void
  disabled?: boolean
}

export function AppointmentCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  disabled = false,
}: AppointmentCalendarProps) {
  const [days, setDays] = useState<BookableDay[]>([])
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingDays, setLoadingDays] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const autoSelectedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingDays(true)
      setError('')
      try {
        const res = await fetch('/api/appointments', { cache: 'no-store' })
        if (!res.ok) throw new Error('Could not load dates')
        const data = (await res.json()) as AppointmentsMeta
        if (cancelled) return
        setDays(data.days)
        if (!autoSelectedRef.current && data.days[0] && !selectedDate) {
          autoSelectedRef.current = true
          onSelectDate(data.days[0].date)
        }
      } catch {
        if (!cancelled) setError('Unable to load available dates. Please refresh or call us.')
      } finally {
        if (!cancelled) setLoadingDays(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load days once on mount
  }, [])

  const loadSlots = useCallback(async (date: string) => {
    if (!date) return
    setLoadingSlots(true)
    setError('')
    try {
      const res = await fetch(`/api/appointments?date=${encodeURIComponent(date)}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Could not load times')
      const data = (await res.json()) as DaySlotsResponse
      setSlots(data.slots)
    } catch {
      setError('Unable to load time slots. Please try again.')
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  const availableSlots = slots.filter((s) => s.available)

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal">
        All times shown in {BOOKING_TIMEZONE_LABEL}
      </p>

      {error && (
        <p className="text-sm font-medium text-brand-crimson" role="alert">
          {error}
        </p>
      )}

      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-navy">
          <Calendar className="h-4 w-4" aria-hidden />
          Select a date
        </p>
        {loadingDays ? (
          <div className="flex min-h-12 items-center gap-2 text-sm text-brand-charcoal">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Loading dates…
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {days.map((day) => {
              const active = selectedDate === day.date
              return (
                <button
                  key={day.date}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onSelectDate(day.date)
                    onSelectTime('')
                  }}
                  className={`min-h-12 border-2 px-2 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-brand-crimson bg-red-50 text-brand-navy'
                      : 'border-gray-200 hover:border-brand-navy'
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedDate && (
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-navy">
            <Clock className="h-4 w-4" aria-hidden />
            Select a time
          </p>
          {loadingSlots ? (
            <div className="flex min-h-12 items-center gap-2 text-sm text-brand-charcoal">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading times…
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-brand-charcoal">No open times on this date. Please pick another day.</p>
          ) : (
            <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {availableSlots.map((slot) => {
                const active = selectedTime === slot.time
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectTime(slot.time)}
                    className={`min-h-11 border-2 px-1 py-2 text-xs font-semibold sm:text-sm ${
                      active
                        ? 'border-brand-crimson bg-red-50 text-brand-navy'
                        : 'border-gray-200 hover:border-brand-navy'
                    }`}
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-brand-charcoal">
            Each booking reserves a 90-minute window. Overlapping times are blocked automatically.
          </p>
        </div>
      )}
    </div>
  )
}
