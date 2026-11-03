import accents from './accents.module.css'

export type Accent = 'red' | 'green' | 'blue' | 'yellow' | 'plastic'

export const accentClass: Record<Accent, string> = accents as Record<Accent, string>
