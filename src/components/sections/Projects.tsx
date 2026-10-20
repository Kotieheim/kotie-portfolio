import { Panel } from '@/components/Panel'
import { Badge } from '@/components/ui/badge'
import { resume } from '@/data/resume'

const ACCENTS = ['red', 'green', 'blue', 'yellow'] as const

export function Projects() {
  const github = resume.basics.profiles.find((profile) => profile.network === 'GitHub')

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {resume.projects.map((project, i) => (
          <Panel key={project.name} title={`Stage ${i + 1}`} accent={ACCENTS[i % ACCENTS.length]}>
            <h3 className="font-heading mb-2 text-lg leading-tight text-n64-yellow">{project.name}</h3>
            <p className="mb-4 leading-relaxed">{project.description}</p>
            <ul className="flex flex-wrap gap-2">
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
        <p className="font-pixel text-center text-[0.65rem] leading-loose">
          More side quests on{' '}
          <a href={github.url} target="_blank" rel="noreferrer" className="text-n64-yellow underline underline-offset-4">
            GitHub
          </a>
        </p>
      )}
    </div>
  )
}
