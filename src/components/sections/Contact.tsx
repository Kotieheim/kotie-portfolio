import { Panel } from '@/components/Panel'
import { resume } from '@/data/resume'

export function Contact() {
  const { email, location, profiles } = resume.basics
  const links = [
    { label: 'Email', text: email, href: `mailto:${email}` },
    ...profiles.map((profile) => ({
      label: profile.network,
      text: profile.url.replace(/^https?:\/\//, ''),
      href: profile.url,
    })),
  ]

  return (
    <Panel title="Continue?" accent="red" className="mx-auto max-w-2xl">
      <p className="mb-6 text-base leading-relaxed">
        Based in {location} and open to talking about senior frontend and full-stack roles. The quickest way to
        reach me is email.
      </p>
      <ul className="grid gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className="group flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-border bg-secondary px-4 py-3 transition-colors hover:border-n64-yellow focus-visible:border-n64-yellow"
            >
              <span className="font-pixel text-[0.65rem] text-muted-foreground uppercase group-hover:text-n64-yellow">
                ▸ {link.label}
              </span>
              <span className="break-all">{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
