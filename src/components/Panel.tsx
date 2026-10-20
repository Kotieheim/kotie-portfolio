import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PanelProps {
  title: string
  /** Color of the header bar, one of the controller-button colors. */
  accent?: 'red' | 'green' | 'blue' | 'yellow'
  className?: string
  children: ReactNode
}

const accentClass = {
  red: 'bg-n64-red text-white',
  green: 'bg-n64-green text-white',
  blue: 'bg-n64-blue text-white',
  yellow: 'bg-n64-yellow text-black',
}

export function Panel({ title, accent = 'blue', className, children }: PanelProps) {
  return (
    <section className={cn('retro-panel overflow-hidden', className)}>
      <h2 className={cn('font-pixel px-4 py-2 text-[0.7rem] tracking-wider uppercase', accentClass[accent])}>
        {title}
      </h2>
      <div className="p-5">{children}</div>
    </section>
  )
}
