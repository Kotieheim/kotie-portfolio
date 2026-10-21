/**
 * Compiles public/Dakota_Heim_Resume.docx into src/data/resume.json.
 *
 * Runs automatically before `dev` and `build`; run it by hand with `npm run resume`.
 * `projects` isn't on the resume, so it's carried over from the existing JSON untouched.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { inflateRawSync } from 'node:zlib'
import type { Education, Job, Profile, Resume, SkillGroup } from '../src/data/types.ts'

const DOCX_PATH = new URL('../public/Dakota_Heim_Resume.docx', import.meta.url)
const JSON_PATH = new URL('../src/data/resume.json', import.meta.url)

interface Paragraph {
  lead: string
  rest: string
  text: string
  isListItem: boolean
}

function readZipEntry(zip: Buffer, name: string): string {
  const eocd = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  if (eocd < 0) throw new Error('Not a zip file')
  const entryCount = zip.readUInt16LE(eocd + 10)
  let offset = zip.readUInt32LE(eocd + 16)

  for (let i = 0; i < entryCount; i++) {
    const method = zip.readUInt16LE(offset + 10)
    const compressedSize = zip.readUInt32LE(offset + 20)
    const nameLength = zip.readUInt16LE(offset + 28)
    const extraLength = zip.readUInt16LE(offset + 30)
    const commentLength = zip.readUInt16LE(offset + 32)
    const localHeader = zip.readUInt32LE(offset + 42)
    const entryName = zip.toString('utf8', offset + 46, offset + 46 + nameLength)

    if (entryName === name) {
      const dataStart =
        localHeader + 30 + zip.readUInt16LE(localHeader + 26) + zip.readUInt16LE(localHeader + 28)
      const data = zip.subarray(dataStart, dataStart + compressedSize)
      return (method === 0 ? data : inflateRawSync(data)).toString('utf8')
    }
    offset += 46 + nameLength + extraLength + commentLength
  }
  throw new Error(`${name} not found in docx`)
}

function decodeXml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function parseParagraphs(xml: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  for (const [p] of xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
    let lead = ''
    let rest = ''
    for (const [, run] of p.matchAll(/<w:r[ >]([\s\S]*?)<\/w:r>/g)) {
      const bold = /<w:b\/>|<w:b w:val="(?:1|true)"\/>/.test(run)
      const text = [...run.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>|<w:tab\/>/g)]
        .map((m) => m[1] ?? '\t')
        .join('')
      if (bold && !rest) lead += text
      else rest += text
    }
    lead = decodeXml(lead)
    rest = decodeXml(rest)
    const text = (lead + rest).trim()
    if (text) paragraphs.push({ lead, rest, text, isListItem: p.includes('<w:numPr>') })
  }
  return paragraphs
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

function parseMonth(value: string): string | null {
  if (/present/i.test(value)) return null
  const [month, year] = value.trim().split(/\s+/)
  const index = MONTHS.indexOf(month.toLowerCase())
  if (index < 0 || !/^\d{4}$/.test(year)) throw new Error(`Unrecognized date "${value}"`)
  return `${year}-${String(index + 1).padStart(2, '0')}`
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const isHeading = (p: Paragraph) => !p.rest.trim() && p.text === p.text.toUpperCase() && /[A-Z]/.test(p.text)

function parseContact(line: string) {
  const parts = line.split('•').map((s) => s.trim())
  const profiles: Profile[] = []
  let email = ''
  let phone = ''
  let location = ''
  for (const part of parts) {
    if (part.includes('@')) email = part
    else if (/^[\d\s()+-]{7,}$/.test(part)) phone = part
    else if (/\.(com|io|dev|org|net)\//.test(part)) {
      const url = part.startsWith('http') ? part : `https://${part}`
      const host = new URL(url).hostname.replace(/^www\./, '')
      const network = host === 'linkedin.com' ? 'LinkedIn' : host === 'github.com' ? 'GitHub' : capitalize(host.split('.')[0])
      profiles.push({ network, username: url.split('/').filter(Boolean).pop()!, url })
    } else if (!location) location = part
  }
  return { email, phone, location, profiles }
}

function parseResume(paragraphs: Paragraph[]): Omit<Resume, 'projects'> {
  const [nameP, labelP, contactP, ...body] = paragraphs
  const sections = new Map<string, Paragraph[]>()
  let current: Paragraph[] | undefined
  for (const p of body) {
    if (isHeading(p)) sections.set(p.text, (current = []))
    else current?.push(p)
  }
  const section = (prefix: string) => {
    const match = [...sections.keys()].find((key) => key.startsWith(prefix))
    if (!match) throw new Error(`Missing "${prefix}" section`)
    return sections.get(match)!
  }

  const skills: SkillGroup[] = section('TECHNICAL SKILLS').map((p) => ({
    name: p.lead.replace(/:\s*$/, '').trim(),
    keywords: p.rest.split(/,(?![^(]*\))/).map((s) => capitalize(s.trim())).filter(Boolean),
  }))

  const work: Job[] = []
  for (const p of section('PROFESSIONAL EXPERIENCE')) {
    const job = work.at(-1)
    if (p.isListItem) {
      const position = job?.positions.at(-1)
      if (!position) throw new Error(`Bullet without a position: "${p.text}"`)
      position.highlights.push(p.text)
    } else if (p.rest.includes('·')) {
      if (!job) throw new Error(`Position without a company: "${p.text}"`)
      const [start, end] = p.rest.replace('·', '').split(/[–—-]/)
      job.positions.push({ title: p.lead.trim(), startDate: parseMonth(start)!, endDate: parseMonth(end), highlights: [] })
    } else {
      work.push({ company: p.text, positions: [] })
    }
  }

  const education: Education[] = section('EDUCATION').map((p) => {
    const detail = p.rest.replace(/^\s*[—–-]\s*/, '').trim()
    const inMatch = detail.match(/^(.*?)\s+in\s+(.*)$/)
    const [studyType, area] = inMatch
      ? [inMatch[1], inMatch[2]]
      : [detail.split(',').slice(1).join(',').trim(), detail.split(',')[0].trim()]
    return { institution: p.lead.trim(), studyType, area }
  })

  const { email, phone, location, profiles } = parseContact(contactP.text)
  return {
    basics: {
      name: nameP.text,
      label: labelP.text,
      email,
      phone,
      location,
      summary: section('SUMMARY').map((p) => p.text).join('\n\n'),
      profiles,
    },
    skills,
    work,
    education,
  }
}

const xml = readZipEntry(readFileSync(DOCX_PATH), 'word/document.xml')
const existing: Partial<Resume> = existsSync(JSON_PATH) ? JSON.parse(readFileSync(JSON_PATH, 'utf8')) : {}
const resume: Resume = { ...parseResume(parseParagraphs(xml)), projects: existing.projects ?? [] }

const output = `${JSON.stringify(resume, null, 2)}\n`
if (existsSync(JSON_PATH) && readFileSync(JSON_PATH, 'utf8') === output) {
  console.log('resume.json is up to date')
} else {
  writeFileSync(JSON_PATH, output)
  console.log('resume.json regenerated from Dakota_Heim_Resume.docx')
}
