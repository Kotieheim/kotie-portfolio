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
