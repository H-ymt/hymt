'use client'

import { usePathname, useRouter } from 'next/navigation'

import { LanguageIcon } from '@/app/[locale]/components/icons'
import { routing } from '@/i18n/routing'

import styles from './index.module.css'

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/'
  const router = useRouter()

  const locales = routing.locales
  const maybeSeg = pathname.split('/')[1]
  const segTyped = maybeSeg as unknown as (typeof routing.locales)[number]
  const current = maybeSeg && locales.includes(segTyped) ? segTyped : routing.defaultLocale

  const switchLocale = (loc: (typeof routing.locales)[number]) => {
    let segments = pathname.split('/')
    const seg = segments[1] as unknown as (typeof routing.locales)[number]
    if (locales.includes(seg)) {
      segments[1] = loc as string
    } else {
      segments = ['', loc as string, ...segments.slice(1)]
    }
    const to = segments.join('/') || '/'
    router.push(to)
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
