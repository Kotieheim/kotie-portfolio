import { Panel } from '@/components/Panel'
import { formatMonth, resume } from '@/data/resume'

const ACCENTS = ['red', 'green', 'blue', 'yellow'] as const

export function Experience() {
  return (
    <div className="grid gap-6">
      {resume.work.map((job, i) => {
        const first = job.positions[0]
        const last = job.positions[job.positions.length - 1]
        return (
          <Panel
            key={`${job.company}-${last.startDate}`}
            title={`World ${resume.work.length - i} · ${job.company}`}
            accent={ACCENTS[i % ACCENTS.length]}
          >
            <p className="font-pixel mb-5 text-[0.6rem] text-muted-foreground">
              {formatMonth(last.startDate)} – {formatMonth(first.endDate)}
            </p>
            <ol className="grid gap-6 border-l-4 border-dashed border-border pl-5">
              {job.positions.map((position) => (
                <li key={position.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[1.95rem] size-3.5 rotate-45 border-2 border-black bg-n64-yellow"
                  />
                  <h3 className="font-heading text-lg leading-tight text-n64-yellow">{position.title}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {formatMonth(position.startDate)} – {formatMonth(position.endDate)}
                  </p>
                  <ul className="grid list-['▸_'] gap-1.5 pl-4 leading-relaxed marker:text-n64-yellow">
                    {position.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Panel>
        )
      })}
    </div>
  )
}
