'use client'

import { useTheme } from 'next-themes'

import { MonitorIcon, MoonIcon, SunIcon } from '@/app/components/icons'

import styles from './index.module.css'

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <fieldset className={styles.themeToggle}>
      <legend className="sr-only">Toggle Theme</legend>

      <span className={styles.themeOption}>
        <label htmlFor="themeSystem" className={styles.themeLabel}>
          <MonitorIcon className={styles.icon} />
        </label>
        <input
          id="themeSystem"
          type="radio"
          name="theme"
          value="system"
          checked={theme === 'system'}
          onChange={() => setTheme('system')}
          aria-label="System theme"
        />
      </span>

      <span className={styles.themeOption}>
        <label htmlFor="themeLight" className={styles.themeLabel}>
          <SunIcon className={styles.icon} />
        </label>
        <input
          id="themeLight"
          type="radio"
          name="theme"
          value="light"
          checked={theme === 'light'}
          onChange={() => setTheme('light')}
          aria-label="Light theme"
        />
      </span>

      <span className={styles.themeOption}>
        <label htmlFor="themeDark" className={styles.themeLabel}>
          <MoonIcon className={styles.icon} />
        </label>
        <input
          id="themeDark"
          type="radio"
          name="theme"
          value="dark"
          checked={theme === 'dark'}
          onChange={() => setTheme('dark')}
          aria-label="Dark theme"
        />
      </span>
    </fieldset>
  )
}
