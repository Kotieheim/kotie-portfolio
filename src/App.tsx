import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { resume } from '@/data/resume'
import { cn } from '@/lib/utils'

const Scene = lazy(() => import('@/components/Scene').then((m) => ({ default: m.Scene })))

const TABS = [
  { value: 'about', label: 'About', glyph: 'A', color: 'bg-n64-blue text-white', Section: About },
  { value: 'experience', label: 'Experience', glyph: 'B', color: 'bg-n64-green text-white', Section: Experience },
  { value: 'skills', label: 'Skills', glyph: 'C', color: 'bg-n64-yellow text-black', Section: Skills },
  { value: 'projects', label: 'Projects', glyph: 'Z', color: 'bg-n64-plastic text-white', Section: Projects },
  { value: 'contact', label: 'Contact', glyph: 'S', color: 'bg-n64-red text-white', Section: Contact },
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

      <header className="flex min-h-[80svh] flex-col items-start justify-center gap-6 px-4 py-16 sm:px-10">
        <p className="font-pixel text-xs text-muted-foreground">© {YEAR} Portfolio Ent.</p>
        <h1 className="retro-title text-[clamp(2.5rem,10vw,6.5rem)] leading-[0.95] uppercase">
          {name.split(' ').map((part) => (
            <span key={part} className="block">
              {part}
            </span>
          ))}
        </h1>
        <p className="font-pixel text-sm text-white sm:text-base">{label}</p>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            type="button"
            onClick={pressStart}
            className="font-pixel rounded-full border-4 border-black bg-n64-red px-6 py-3 text-sm text-white shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#000]"
          >
            <span aria-hidden className="blink">▶</span> Press Start
          </button>
          <a
            href="/Dakota_Heim_Resume.docx"
            download
            className="font-pixel rounded-full border-4 border-black bg-n64-yellow px-6 py-3 text-sm text-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#000]"
          >
            Resume download
          </a>
        </div>
      </header>

      <main ref={menuRef} className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-24 sm:px-10">
        <Tabs value={tab} onValueChange={(value) => setTab(value as string)} className="gap-8">
          <TabsList className="retro-panel h-auto! w-full flex-wrap justify-center gap-2 p-3 sm:justify-between">
            {TABS.map((t, i) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-auto flex-none gap-2 rounded-full border-2 border-transparent px-3 py-2 text-foreground/70 data-active:border-n64-yellow data-active:bg-secondary data-active:text-n64-yellow"
              >
                <span
                  aria-hidden
                  className={cn(
                    'font-pixel grid size-7 place-items-center rounded-full border-2 border-black text-[0.6rem] shadow-[2px_2px_0_#000]',
                    t.color,
                  )}
                >
                  {t.glyph}
                </span>
                <span className="font-pixel text-[0.65rem] uppercase">{t.label}</span>
                <span className="sr-only">(press {i + 1})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value, Section }) => (
            <TabsContent key={value} value={value} className="animate-in fade-in-0 zoom-in-95 duration-300">
              <Section />
            </TabsContent>
          ))}
        </Tabs>

        <p className="font-pixel mt-16 text-center text-[0.55rem] leading-loose text-muted-foreground">
          Tip: press 1–5 to switch screens
        </p>
      </main>
    </>
  )
}
