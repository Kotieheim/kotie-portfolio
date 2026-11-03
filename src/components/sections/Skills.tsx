import { Panel } from '@/components/Panel'
import { Badge } from '@/components/ui/badge'
import { resume } from '@/data/resume'
import styles from './Skills.module.css'

const ACCENTS = ['blue', 'green', 'red', 'yellow'] as const

export function Skills() {
  return (
    <div className={styles.grid}>
      {resume.skills.map((group, i) => (
        <Panel key={group.name} title={group.name} accent={ACCENTS[i % ACCENTS.length]}>
          <ul className={styles.keywords}>
            {group.keywords.map((keyword) => (
              <li key={keyword}>
                <Badge variant="secondary" className={styles.keyword}>
                  {keyword}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  )
}
