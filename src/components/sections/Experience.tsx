import { Panel } from '@/components/Panel'
import { formatMonth, resume } from '@/data/resume'
import styles from './Experience.module.css'

const ACCENTS = ['red', 'green', 'blue', 'yellow'] as const

export function Experience() {
  return (
    <div className={styles.list}>
      {resume.work.map((job, i) => {
        const first = job.positions[0]
        const last = job.positions[job.positions.length - 1]
        return (
          <Panel
            key={`${job.company}-${last.startDate}`}
            title={`World ${resume.work.length - i} · ${job.company}`}
            accent={ACCENTS[i % ACCENTS.length]}
          >
            <p className={styles.dates}>
              {formatMonth(last.startDate)} – {formatMonth(first.endDate)}
            </p>
            <ol className={styles.positions}>
              {job.positions.map((position) => (
                <li key={position.title} className={styles.position}>
                  <span aria-hidden className={styles.marker} />
                  <h3 className={styles.title}>{position.title}</h3>
                  <p className={styles.range}>
                    {formatMonth(position.startDate)} – {formatMonth(position.endDate)}
                  </p>
                  <ul className={styles.highlights}>
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
