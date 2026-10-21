import data from './resume.json'
import type { Resume } from './types'

export type * from './types'

export const resume: Resume = data

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })

export function formatMonth(date: string | null): string {
  if (!date) return 'Present'
  const [year, month] = date.split('-').map(Number)
  return monthFormat.format(new Date(year, month - 1))
}

/** Whole years since the earliest position start, for the "6+ years" style stat. */
export function yearsOfExperience(): number {
  const starts = resume.work.flatMap((job) => job.positions.map((p) => p.startDate)).sort()
  const [year, month] = starts[0].split('-').map(Number)
  const ms = Date.now() - new Date(year, month - 1).getTime()
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000))
}
