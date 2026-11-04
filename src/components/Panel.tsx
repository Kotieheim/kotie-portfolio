import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { accentClass } from '@/styles/accents'
import styles from './Panel.module.css'

interface PanelProps {
  title: string
  /** Color of the header bar, one of the controller-button colors. */
  accent?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange' | 'teal'
  className?: string
  children: ReactNode
}

export function Panel({ title, accent = 'blue', className, children }: PanelProps) {
  return (
    <section className={cn('retro-panel', styles.panel, className)}>
      <h2 className={cn(styles.title, accentClass[accent])}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
