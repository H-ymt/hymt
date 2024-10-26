'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { HomeIcon, NoteIcon, ProjectIcon, StacksIcon, ZennIcon } from '@/app/components/icons'

import styles from './index.module.css'

const navLink = [
  {
    label: 'Home',
    path: '/',
    icon: HomeIcon,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: ProjectIcon,
  },
  {
    label: 'Stack',
    path: '/stack',
    icon: StacksIcon,
  },
  {
    label: 'Note',
    path: '/note',
    icon: NoteIcon,
  },
  {
    label: 'Zenn',
    path: '/zenn',
    icon: ZennIcon,
  },
]

export default function GlobalMenu() {
  const pathname = usePathname()

  return (
    <nav aria-label="グローバルメニュー" className={styles.menu}>
      <div className={styles.menuList}>
        <div className={styles.menuDefault}>
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
        <div className={styles.menuMobile}>
          {navLink.map(({ icon: Icon, path, label }) => (
            <Link
              key={path}
              href={path}
              className={`${styles.icon} ${pathname === path ? styles.active : ''} ${label === 'Zenn' ? styles.zenn : ''}`}
            >
              <Icon aria-label={label} />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
