'use client'

import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { MonitorIcon, MoonIcon, SunIcon } from '@/app/[locale]/components/icons'

import styles from './index.module.css'

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <fieldset className={styles.themeToggle}>
        <legend className="sr-only">Toggle Theme</legend>
      </fieldset>
    )
  }

  return (
    <fieldset className={styles.themeToggle}>
      <legend className="sr-only">Toggle Theme</legend>

      <span className={styles.themeOption}>
        <label htmlFor="themeSystem" className={styles.themeLabel}>
          <MonitorIcon className={clsx(styles.icon, theme === 'system' && styles.active)} />
          <input
            id="themeSystem"
            type="radio"
            name="theme"
            value="system"
            checked={theme === 'system'}
            onChange={() => setTheme('system')}
            aria-label="System theme"
          />
        </label>
      </span>

      <span className={styles.themeOption}>
        <label htmlFor="themeLight" className={styles.themeLabel}>
          <SunIcon className={clsx(styles.icon, theme === 'light' && styles.active)} />
          <input
            id="themeLight"
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
            aria-label="Light theme"
          />
        </label>
      </span>

      <span className={styles.themeOption}>
        <label htmlFor="themeDark" className={styles.themeLabel}>
          <MoonIcon className={clsx(styles.icon, theme === 'dark' && styles.active)} />
          <input
            id="themeDark"
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
            aria-label="Dark theme"
          />
        </label>
      </span>
    </fieldset>
  )
}
