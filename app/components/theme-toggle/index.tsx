'use client'

import { useTheme } from 'next-themes'

import { MonitorIcon, MoonIcon, SunIcon } from '@/app/components/icons'

import styles from './index.module.css'

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <fieldset className={styles.themeToggle}>
      <legend className="sr-only">Toggle Theme</legend>

      <label className={styles.themeOption}>
        <input
          type="radio"
          name="theme"
          value="system"
          checked={theme === 'system'}
          onChange={() => setTheme('system')}
          aria-label="System theme"
          className="sr-only"
        />
        <MonitorIcon className={styles.icon} />
      </label>

      <label className={styles.themeOption}>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === 'light'}
          onChange={() => setTheme('light')}
          aria-label="Light theme"
          className="sr-only"
        />
        <SunIcon className={styles.icon} />
      </label>

      <label className={styles.themeOption}>
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === 'dark'}
          onChange={() => setTheme('dark')}
          aria-label="Dark theme"
          className="sr-only"
        />
        <MoonIcon className={styles.icon} />
      </label>
    </fieldset>
  )
}
