import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { resume } from '@/data/resume'
import { cn } from '@/lib/utils'
import { accentClass, type Accent } from '@/styles/accents'
import styles from './App.module.css'

const Scene = lazy(() => import('@/components/Scene').then((m) => ({ default: m.Scene })))

const TABS: { value: string; label: string; glyph: string; accent: Accent; Section: ComponentType }[] = [
  { value: 'about', label: 'About', glyph: 'A', accent: 'blue', Section: About },
  { value: 'experience', label: 'Experience', glyph: 'B', accent: 'green', Section: Experience },
  { value: 'skills', label: 'Skills', glyph: 'C', accent: 'yellow', Section: Skills },
  { value: 'projects', label: 'Projects', glyph: 'Z', accent: 'plastic', Section: Projects },
  { value: 'contact', label: 'Contact', glyph: 'S', accent: 'red', Section: Contact },
]

const YEAR = new Date().getFullYear()

export default function App() {
  const [tab, setTab] = useState(TABS[0].value)
  const menuRef = useRef<HTMLDivElement>(null)
  const { name, label } = resume.basics
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const index = Number(event.key) - 1
      if (index >= 0 && index < TABS.length) setTab(TABS[index].value)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function pressStart() {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
    menuRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus({ preventScroll: true })
  }

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <header className={styles.hero}>
        <p className={styles.copyright}>© {YEAR} Portfolio Ent.</p>
        <h1 className={cn('retro-title', styles.title)}>
          {name.split(' ').map((part) => (
            <span key={part}>
              {part}
            </span>
          ))}
        </h1>
        <p className={styles.label}>{label}</p>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={pressStart}
            className={cn(styles.cta, accentClass.red)}
          >
            <span aria-hidden className="blink">▶</span> Press Start
          </button>
          <a
            href="/Dakota_Heim_Resume.docx"
            download
            className={cn(styles.cta, accentClass.yellow)}
          >
            Resume Download
          </a>
        </div>
      </header>

      <main ref={menuRef} className={styles.main}>
        <Tabs value={tab} onValueChange={(value) => setTab(value as string)} className={styles.tabs}>
          <TabsList className={cn('retro-panel', styles.tabList)}>
            {TABS.map((t, i) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={styles.tab}
              >
                <span
                  aria-hidden
                  className={cn(styles.glyph, accentClass[t.accent])}
                >
                  {t.glyph}
                </span>
                <span className={styles.tabLabel}>{t.label}</span>
                <span className="sr-only">(press {i + 1})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value, Section }) => (
            <TabsContent key={value} value={value} className={styles.screen}>
              <Section />
            </TabsContent>
          ))}
        </Tabs>

        <p className={styles.tip}>
          Tip: press 1–5 to switch screens
        </p>
      </main>
    </>
  )
}
