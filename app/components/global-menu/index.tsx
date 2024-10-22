'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './index.module.css'

const navLink = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Stack',
    path: '/stack',
  },
  {
    label: 'Note',
    path: '/note',
  },
  {
    label: 'Zenn',
    path: '/zenn',
  },
]

export default function GlobalMenu() {
  const pathname = usePathname()

  return (
    <nav aria-label="グローバルメニュー" className={styles.menu}>
      <div className={styles.menuList}>
        {navLink.map(({ label, path }) => (
          <Link
            key={path}
            href={path}
            className={`${styles.menuItem} ${pathname === path ? styles.active : ''}`}
            aria-current={pathname === path ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
