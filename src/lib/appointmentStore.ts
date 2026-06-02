import fs from 'fs'
import path from 'path'
import { BLOCK_DURATION_MIN, easternDateTimeToMs, slotOverlapsBlock } from '@/lib/booking'

export interface StoredAppointment {
  id: string
  startMs: number
  date: string
  time: string
  email: string
  createdAt: number
}

const globalStore = globalThis as unknown as {
  dgmAppointments?: StoredAppointment[]
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'appointments.json')

function readFileStore(): StoredAppointment[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as StoredAppointment[]
      return Array.isArray(raw) ? raw : []
    }
  } catch {
    /* ignore corrupt file */
  }
  return []
}

function writeFileStore(items: StoredAppointment[]) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8')
  } catch {
    /* read-only or serverless — memory store still works */
  }
}

function getStore(): StoredAppointment[] {
  if (!globalStore.dgmAppointments) {
    globalStore.dgmAppointments = readFileStore()
  }
  return globalStore.dgmAppointments
}

function persist(items: StoredAppointment[]) {
  globalStore.dgmAppointments = items
  writeFileStore(items)
}

export function listBlockedStartMs(): number[] {
  return getStore().map((a) => a.startMs)
}

export function listAppointmentsForDate(date: string): StoredAppointment[] {
  return getStore().filter((a) => a.date === date)
}

export function isSlotAvailable(date: string, time: string, excludeEmail?: string): boolean {
  const startMs = easternDateTimeToMs(date, time)
  const store = getStore()
  for (const appt of store) {
    if (excludeEmail && appt.email === excludeEmail) continue
    if (slotOverlapsBlock(startMs, appt.startMs, BLOCK_DURATION_MIN)) return false
  }
  return true
}

export function bookAppointment(input: {
  date: string
  time: string
  email: string
}): StoredAppointment | null {
  if (!isSlotAvailable(input.date, input.time)) return null

  const startMs = easternDateTimeToMs(input.date, input.time)
  const appt: StoredAppointment = {
    id: `${startMs}-${Math.random().toString(36).slice(2, 9)}`,
    startMs,
    date: input.date,
    time: input.time,
    email: input.email.toLowerCase(),
    createdAt: Date.now(),
  }

  const next = [...getStore(), appt]
  persist(next)
  return appt
}
