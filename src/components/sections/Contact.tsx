import { Panel } from '@/components/Panel'
import { resume } from '@/data/resume'
import styles from './Contact.module.css'
import { randomColor } from '@/styles/accents'

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
    <Panel title="Continue?" accent={randomColor('contact')} className={styles.panel}>
      <p className={styles.intro}>
        Based in {location} and open to talking about senior frontend and full-stack roles. The quickest way to
        reach me is email.
      </p>
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className={styles.link}
            >
              <span className={styles.label}>▸ {link.label}</span>
              <span className={styles.text}>{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
