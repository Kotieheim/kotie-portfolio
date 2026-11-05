import { Panel } from '@/components/Panel'
import { randomColor } from '@/styles/accents'
import { Badge } from '@/components/ui/badge'
import { resume } from '@/data/resume'
import styles from './Skills.module.css'


export function Skills() {
  return (
    <div className={styles.grid}>
      {resume.skills.map((group, i) => (
        <Panel key={group.name} title={group.name} accent={randomColor('skills', i)}>
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
