import data from './resume.json'

export interface Profile {
  network: string
  username: string
  url: string
}

export interface Position {
  title: string
  /** YYYY-MM */
  startDate: string
  /** YYYY-MM, or null for a current role */
  endDate: string | null
  highlights: string[]
}

export interface Job {
  company: string
  positions: Position[]
}

export interface SkillGroup {
  name: string
  keywords: string[]
}

export interface Education {
  institution: string
  studyType: string
  area: string
}

export interface Project {
  name: string
  description: string
  keywords: string[]
}

export interface Resume {
  basics: {
    name: string
    label: string
    email: string
    phone: string
    location: string
    summary: string
    profiles: Profile[]
  }
  skills: SkillGroup[]
  work: Job[]
  education: Education[]
  projects: Project[]
}

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
