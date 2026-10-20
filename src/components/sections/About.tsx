import { Panel } from '@/components/Panel'
import { resume, yearsOfExperience } from '@/data/resume'

export function About() {
  const { basics, education, work } = resume
  const stats = [
    { label: 'Years', value: `${yearsOfExperience()}+` },
    { label: 'Companies', value: new Set(work.map((job) => job.company)).size },
    { label: 'Base', value: basics.location },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <Panel title="Player 1" accent="blue">
        <p className="text-base leading-relaxed text-pretty">{basics.summary}</p>
      </Panel>

      <div className="grid gap-6">
        <Panel title="Stats" accent="yellow">
          <dl className="grid gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between gap-4">
                <dt className="font-pixel text-[0.6rem] text-muted-foreground uppercase">{stat.label}</dt>
                <dd className="font-heading text-right text-n64-yellow">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Training" accent="green">
          <ul className="grid gap-3">
            {education.map((item) => (
              <li key={item.institution}>
                <p className="font-semibold">{item.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {item.studyType} · {item.area}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
