import { Panel } from '@/components/Panel'
import { resume, yearsOfExperience } from '@/data/resume'
import styles from './About.module.css'

export function About() {
  const { basics, education, work } = resume
  const stats = [
    { label: 'Years', value: `${yearsOfExperience()}+` },
    { label: 'Companies', value: new Set(work.map((job) => job.company)).size },
    { label: 'Base', value: basics.location },
  ]

  return (
    <div className={styles.layout}>
      <Panel title="Player 1" accent="blue">
        <p className={styles.summary}>{basics.summary}</p>
      </Panel>

      <div className={styles.column}>
        <Panel title="Stats" accent="yellow">
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Training" accent="green">
          <ul className={styles.training}>
            {education.map((item) => (
              <li key={item.institution}>
                <p className={styles.institution}>{item.institution}</p>
                <p className={styles.degree}>
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
