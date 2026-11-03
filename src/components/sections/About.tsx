import { Panel } from '@/components/Panel'
import { resume, yearsOfExperience } from '@/data/resume'
import styles from './About.module.css'
import fitz from '@/assets/party/fitz.png'
import keena from '@/assets/party/keena.png'
import koAndJules from '@/assets/party/koandjules.png'
import kota from '@/assets/party/kota.png'
import moon from '@/assets/party/moon.png'
import nyx from '@/assets/party/nyx.png'

// Edit names/alt text here; order is display order.
const party = [
  { id: 'koAndJules', name: 'Ko & Jules', src: koAndJules, alt: 'Pixel-art couple hugging' },
  { id: 'kota', name: 'Kota', src: kota, alt: 'Pixel-art black and tan dog' },
  { id: 'keena', name: 'Keena', src: keena, alt: 'Pixel-art black dog wearing a halo' },
  { id: 'moon', name: 'Moon', src: moon, alt: 'Pixel-art black cat sitting' },
  { id: 'nyx', name: 'Nyx', src: nyx, alt: 'Pixel-art black cat standing' },
  { id: 'fitz', name: 'Fitz', src: fitz, alt: 'Pixel-art black and white cat' },
]

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

        <ul className={styles.party} aria-label="Party members">
          {party.map((member) => (
            <li key={member.name} className={styles.member}>
              <img
                src={member.src}
                alt={member.alt}
                className={[styles.sprite, styles[member.id]].filter(Boolean).join(' ')}
                loading="lazy"
              />
              <span className={styles.memberName}>{member.name}</span>
            </li>
          ))}
        </ul>
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
