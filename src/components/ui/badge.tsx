import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import styles from './badge.module.css'

interface BadgeProps extends ComponentProps<'span'> {
  variant?: 'secondary' | 'outline'
}

export function Badge({ variant = 'secondary', className, ...props }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)} {...props} />
}
