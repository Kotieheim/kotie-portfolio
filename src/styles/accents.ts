import accents from './accents.module.css'

export type Accent = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange' | 'teal' | 'plastic'

export const accentClass: Record<Accent, string> = accents as Record<Accent, string>
