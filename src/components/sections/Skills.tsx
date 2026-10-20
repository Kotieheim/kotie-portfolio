import { Panel } from '@/components/Panel'
import { Badge } from '@/components/ui/badge'
import { resume } from '@/data/resume'

const ACCENTS = ['blue', 'green', 'red', 'yellow'] as const

export function Skills() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resume.skills.map((group, i) => (
        <Panel key={group.name} title={group.name} accent={ACCENTS[i % ACCENTS.length]}>
          <ul className="flex flex-wrap gap-2">
            {group.keywords.map((keyword) => (
              <li key={keyword}>
                <Badge variant="secondary" className="h-auto rounded-sm border-2 border-black px-2 py-1 text-sm">
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
