import { Panel } from '@/components/Panel'
import { randomColor } from '@/styles/accents'
import { Badge } from '@/components/ui/badge'
import { resume } from '@/data/resume'
import styles from './Projects.module.css'


export function Projects() {
  const github = resume.basics.profiles.find((profile) => profile.network === 'GitHub')

  return (
    <div className={styles.layout}>
      <div className={styles.grid}>
        {resume.projects.map((project, i) => (
          <Panel key={project.name} title={`Stage ${i + 1}`} accent={randomColor('projects', i)}>
            <h3 className={styles.name}>{project.name}</h3>
            <p className={styles.description}>{project.description}</p>
            <ul className={styles.keywords}>
              {project.keywords.map((keyword) => (
                <li key={keyword}>
                  <Badge variant="outline">{keyword}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      {github && (
        <p className={styles.more}>
          More side quests on{' '}
          <a href={github.url} target="_blank" rel="noreferrer" className={styles.moreLink}>
            GitHub
          </a>
        </p>
      )}
    </div>
  )
}
