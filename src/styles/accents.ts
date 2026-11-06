import accents from './accents.module.css'

export type Accent = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange' | 'teal' | 'plastic'

export const accentClass: Record<Accent, string> = accents as Record<Accent, string>

export const PANEL_ACCENTS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'teal'] as const
export type PanelAccent = (typeof PANEL_ACCENTS)[number]

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const palettes = new Map<string, PanelAccent[]>()

export function randomColor(page: string, index = 0): PanelAccent {
  let palette = palettes.get(page)

  if (!palette) {
    palette = shuffle(PANEL_ACCENTS)
    palettes.set(page, palette)
  }
  return palette[index % palette.length]
}
