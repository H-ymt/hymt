'use client'

import { LanguageIcon } from '@/app/[locale]/components/icons'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

import styles from './index.module.css'

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/'
  const router = useRouter()

  const locales = routing.locales
  const maybeSeg = pathname.split('/')[1]
  const segTyped = maybeSeg as unknown as (typeof routing.locales)[number]
  const current = maybeSeg && locales.includes(segTyped) ? segTyped : routing.defaultLocale

  const switchLocale = async (loc: (typeof routing.locales)[number]) => {
    // Normalize and split pathname into segments without empty entries
    const parts = (pathname || '/').split('/').filter(Boolean) // e.g. ['en', 'projects'] or ['projects']

    if (parts.length === 0) {
      router.push(`/${loc}`)
      return
    }

    // If the first segment is a locale, replace it. Otherwise, insert locale at the front.
    if (locales.includes(parts[0] as (typeof routing.locales)[number])) {
      parts[0] = loc as string
    } else {
      parts.unshift(loc as string)
    }

    const to = `/${parts.join('/')}`

    // Use absolute URL to avoid relative-navigation issues, and fallback to full reload
    if (typeof window === 'undefined') {
      router.push(to)
      return
    }

    const absolute = new URL(to, window.location.origin).toString()
    // router.push may accept absolute URLs; if it rejects, fall back to full navigation
    try {
      // Some router implementations return a Promise
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line: router.push overloads
      const res = router.push(absolute)
      // router.push might return void or a Promise
      if (typeof res === 'object' && res !== null) {
        const maybePromise = res as PromiseLike<unknown>
        if (typeof (maybePromise as PromiseLike<unknown>).then === 'function') {
          await maybePromise
        }
      }
    } catch {
      window.location.assign(absolute)
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>
        <LanguageIcon aria-hidden="true" />
      </span>
      <select
        aria-label="Language selector"
        className={styles.select}
        defaultValue={current}
        onChange={(e) => switchLocale(e.target.value as (typeof routing.locales)[number])}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}
