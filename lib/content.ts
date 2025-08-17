import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { routing } from '@/i18n/routing'

export function walkDir(dir: string, base = ''): string[] {
  const entries = fs.readdirSync(dir)
  let results: string[] = []

  for (const e of entries) {
    const full = path.join(dir, e)
    const rel = base ? `${base}/${e}` : e
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      results = results.concat(walkDir(full, rel))
    } else if (/\.mdx?$/.test(e)) {
      results.push(rel.replace(/\.mdx?$/, ''))
    }
  }

  return results
}

export function listContentSlugs(locale?: string): string[] {
  // Temporary override: allow forcing only English content via env var
  const forceOnlyEn = process.env.FORCE_ONLY_EN === '1'
  if (forceOnlyEn) locale = 'en'
  const tryBase = (loc?: string) => (loc ? path.join('app', loc, 'content') : path.join('app', 'content'))
  // candidate bases in order: app/<locale>/content, app/content/<locale>, app/[locale]/content, app/content
  const candidates: string[] = []
  if (locale) {
    // prefer app/<locale>/content, then app/content/<locale>
    candidates.push(path.join('app', locale, 'content'))
    // also check for sectioned content like app/content/<section>/<locale> (e.g. app/content/note/en)
    try {
      const contentRoot = path.join(process.cwd(), 'app', 'content')
      if (fs.existsSync(contentRoot)) {
        for (const child of fs.readdirSync(contentRoot)) {
          const p = path.join('app', 'content', child, locale)
          candidates.push(p)
        }
      }
    } catch {
      // ignore filesystem errors
    }
    candidates.push(path.join('app', 'content', locale))
  } else {
    // when locale not provided, also try app/content/<locale> for all configured locales
    try {
      for (const loc of routing.locales) {
        candidates.push(path.join('app', 'content', loc))
      }
    } catch {
      // ignore if routing not available for some reason
    }
  }
  // then check app/[locale]/content and finally app/content
  candidates.push(path.join('app', '[locale]', 'content'))
  candidates.push(path.join('app', 'content'))

  let dir = ''
  for (const c of candidates) {
    const p = path.join(process.cwd(), c)
    if (fs.existsSync(p)) {
      dir = p
      break
    }
  }

  // DEBUG: log which directory is selected for content listing
  try {
    // eslint-disable-next-line no-console
    console.log('[content] candidates:', candidates)
    // eslint-disable-next-line no-console
    console.log('[content] selected dir:', dir)
  } catch {}

  // fallback to default locale if still not found and locale was requested
  if (!dir && locale) {
    const def = path.join(process.cwd(), tryBase(routing.defaultLocale))
    if (fs.existsSync(def)) dir = def
  }

  if (!dir) return []
  return walkDir(dir)
}

export function readContentBySlug(
  slugParts: string[],
  locale?: string
): { data: Record<string, unknown>; content: string } | null {
  // Temporary override: allow forcing only English content via env var
  const forceOnlyEn = process.env.FORCE_ONLY_EN === '1'
  if (forceOnlyEn) locale = 'en'
  const slugPath = slugParts.join('/') || 'note'
  // candidate bases in order: app/<locale>/content, app/content/<locale>, app/[locale]/content, app/content
  const candidates = []
  if (locale) {
    // prefer app/<locale>/content, then app/content/<locale>
    candidates.push(path.join('app', locale, 'content'))
    // check for app/content/<section>/<locale>
    try {
      const contentRoot = path.join(process.cwd(), 'app', 'content')
      if (fs.existsSync(contentRoot)) {
        for (const child of fs.readdirSync(contentRoot)) {
          const p = path.join('app', 'content', child, locale)
          candidates.push(p)
        }
      }
    } catch {}
    candidates.push(path.join('app', 'content', locale))
  }
  // then check app/[locale]/content and finally app/content
  candidates.push(path.join('app', '[locale]', 'content'))
  candidates.push(path.join('app', 'content'))

  let filePath = ''
  for (const c of candidates) {
    const p = path.join(process.cwd(), c, `${slugPath}.mdx`)
    if (fs.existsSync(p)) {
      filePath = p
      break
    }
  }

  if (!filePath && locale) {
    const def = path.join(process.cwd(), path.join('app', routing.defaultLocale, 'content'), `${slugPath}.mdx`)
    if (fs.existsSync(def)) filePath = def
  }

  if (!filePath) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  // ensure data is an object
  const safeData = data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : {}
  return { data: safeData, content }
}

export function listContentMeta(locale?: string): Array<{ slug: string; data: Record<string, unknown> }> {
  // Temporary override: allow forcing only English content via env var
  const forceOnlyEn = process.env.FORCE_ONLY_EN === '1'
  if (forceOnlyEn) locale = 'en'
  // candidate bases in order: app/<locale>/content, app/content/<locale>, app/[locale]/content, app/content
  const candidates = []
  if (locale) {
    // prefer app/<locale>/content, then app/content/<locale>
    candidates.push(path.join('app', locale, 'content'))
    // check for app/content/<section>/<locale>
    try {
      const contentRoot = path.join(process.cwd(), 'app', 'content')
      if (fs.existsSync(contentRoot)) {
        for (const child of fs.readdirSync(contentRoot)) {
          const p = path.join('app', 'content', child, locale)
          candidates.push(p)
        }
      }
    } catch {}
    candidates.push(path.join('app', 'content', locale))
  }
  // then check app/[locale]/content and finally app/content
  candidates.push(path.join('app', '[locale]', 'content'))
  candidates.push(path.join('app', 'content'))

  let dir = ''
  for (const c of candidates) {
    const p = path.join(process.cwd(), c)
    if (fs.existsSync(p)) {
      dir = p
      break
    }
  }

  if (!dir && locale) {
    const def = path.join(process.cwd(), path.join('app', routing.defaultLocale, 'content'))
    if (fs.existsSync(def)) dir = def
  }

  if (!dir) return []
  const slugs = walkDir(dir)
  return slugs
    .map((slug) => {
      const fp = path.join(dir, `${slug}.mdx`)
      const raw = fs.readFileSync(fp, 'utf8')
      const { data } = matter(raw)
      const safeData = data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : {}
      return { slug, data: safeData }
    })
    .filter(({ data }) => {
      // Exclude drafts when frontmatter has draft: true
      const draft = data && (data.draft as unknown)
      return !(draft === true)
    })
}

export function listAllTags(): Record<string, string[]> {
  const meta = listContentMeta()
  const map: Record<string, string[]> = {}

  for (const { slug, data } of meta) {
    const tags = data && (data.tags as unknown)
    if (!tags) continue
    if (Array.isArray(tags)) {
      for (const t of tags) {
        if (typeof t !== 'string') continue
        if (!map[t]) map[t] = []
        map[t].push(slug)
      }
    } else if (typeof tags === 'string') {
      const t = tags
      if (!map[t]) map[t] = []
      map[t].push(slug)
    }
  }

  return map
}
