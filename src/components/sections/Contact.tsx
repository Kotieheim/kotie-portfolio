import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Panel } from '@/components/Panel'
import { resume } from '@/data/resume'
import { cn } from '@/lib/utils'
import { randomColor } from '@/styles/accents'
import styles from './Contact.module.css'

const START = 9

type Phase = 'idle' | 'counting' | 'continued'

export function Contact() {
  const { email, location, profiles } = resume.basics
  const links = [
    { label: 'Email', text: email, href: `mailto:${email}` },
    ...profiles.map((profile) => ({
      label: profile.network,
      text: profile.url.replace(/^https?:\/\//, ''),
      href: profile.url,
    })),
  ]

  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(START)
  const [credits, setCredits] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [active, setActive] = useState(0)

  const hudRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  const over = phase === 'counting' && count === 0
  const joined = phase === 'continued'

  useEffect(() => {
    const el = hudRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase((p) => (p === 'idle' ? 'counting' : p))
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (phase !== 'counting' || count === 0) return
    const id = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, count])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(id)
  }, [toast])

  function continueGame() {
    if (phase === 'counting' && !over) setPhase('continued')
  }

  function retry() {
    setCount(START)
    setPhase('counting')
  }

  async function insertCoin() {
    setCredits((c) => Math.min(c + 1, 99))
    setPhase('continued')
    try {
      await navigator.clipboard.writeText(email)
      setToast('+1 CREDIT — EMAIL COPIED!')
    } catch {
      setToast('+1 CREDIT — COPY FAILED, USE EMAIL BELOW')
    }
  }

  function select(index: number) {
    setActive(index)
    continueGame()
  }

  const itemCount = links.length + 1
  function onMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const moves: Record<string, number> = {
      ArrowDown: (active + 1) % itemCount,
      ArrowUp: (active - 1 + itemCount) % itemCount,
      Home: 0,
      End: itemCount - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    itemRefs.current[moves[event.key]]?.focus()
  }

  return (
    <Panel title="Continue?" accent={randomColor('contact')} className={styles.panel}>
      <div ref={hudRef} className={styles.screen}>
        {over ? (
          <>
            <p className={cn(styles.callout, styles.calloutOver)}>Game Over</p>
            <p className={styles.sub}>Just kidding, my inbox never closes.</p>
            <button type="button" onClick={retry} className={styles.retry}>
              <span aria-hidden className="blink">▶</span> Retry
            </button>
          </>
        ) : joined ? (
          <>
            <p className={styles.callout}>Thanks!</p>
            <p className={styles.sub}>Player 2 has joined.</p>
          </>
        ) : (
          <>
            <p key={count} className={styles.digit} aria-hidden>
              {count}
            </p>
            <p className={cn(styles.prompt, 'blink')}>Insert Coin</p>
          </>
        )}

        <span className={styles.credit}>Credits: {String(credits).padStart(2, '0')}</span>
      </div>

      <p className={styles.intro}>
        Based in {location} and also open to relocation. Looking to talk about Front End and Full-Stack roles! The quickest way to
        reach me is email.
      </p>

      <ul className={styles.menu} onKeyDown={onMenuKeyDown}>
        <li>
          <button
            ref={(el) => {
              itemRefs.current[0] = el
            }}
            type="button"
            onClick={insertCoin}
            onPointerEnter={() => select(0)}
            onFocus={() => select(0)}
            className={cn(styles.item, styles.coin, active === 0 && styles.itemActive)}
          >
            <span className={styles.label}>
              <span className={cn(styles.cursor, 'blink')} aria-hidden>
                ▸
              </span>
              Insert Coin
            </span>
            <span className={styles.text}>Copy my email</span>
          </button>
        </li>
        {links.map((link, i) => (
          <li key={link.label}>
            <a
              ref={(el) => {
                itemRefs.current[i + 1] = el
              }}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              onPointerEnter={() => select(i + 1)}
              onFocus={() => select(i + 1)}
              className={cn(styles.item, active === i + 1 && styles.itemActive)}
            >
              <span className={styles.label}>
                <span className={cn(styles.cursor, 'blink')} aria-hidden>
                  ▸
                </span>
                {link.label}
              </span>
              <span className={styles.text}>{link.text}</span>
            </a>
          </li>
        ))}
      </ul>

      <div role="status" aria-live="polite" className={cn(styles.toast, toast && styles.toastShow)}>
        {toast}
      </div>
    </Panel>
  )
}
