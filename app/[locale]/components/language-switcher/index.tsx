'use client'

import { useParams } from 'next/navigation'

import { LanguageIcon } from '@/app/[locale]/components/icons'
import { routing } from '@/i18n/routing'

import styles from './index.module.css'

export default function LanguageSwitcher() {
  const params = useParams()

  const locales = routing.locales
  const current = (params?.locale as string) || routing.defaultLocale

  const switchLocale = (newLocale: string) => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean)

    if (pathSegments.length > 0 && locales.includes(pathSegments[0] as any)) {
      pathSegments[0] = newLocale
    } else {
      pathSegments.unshift(newLocale)
    }

    const newPath = '/' + pathSegments.join('/')

    window.location.href = newPath
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>
        <LanguageIcon aria-hidden="true" />
      </span>
      <select
        aria-label="Language selector"
        className={styles.select}
        value={current}
        onChange={(e) => switchLocale(e.target.value)}
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
