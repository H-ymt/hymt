'use client'

import { usePathname } from 'next/navigation'

import { HomeIcon, NoteIcon, ProjectIcon, ZennIcon } from '@/app/components/icons'
import TransitionLink from '@/app/components/transition-link'

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
            <TransitionLink
              key={path}
              href={path}
              className={`${styles.menuItem} ${
                pathname === path || (path === '/projects' && pathname.startsWith('/projects/'))
                  ? styles.active
                  : ''
              }`}
              aria-current={
                pathname === path || (path === '/projects' && pathname.startsWith('/projects/'))
                  ? 'page'
                  : undefined
              }
            >
              {label}
            </TransitionLink>
          ))}
        </div>
        <div className={styles.menuMobile}>
          {navLink.map(({ icon: Icon, path, label }) => (
            <TransitionLink
              key={path}
              href={path}
              className={`${styles.icon} ${pathname === path ? styles.active : ''} ${label === 'Zenn' ? styles.zenn : ''}`}
            >
              <Icon aria-label={label} />
            </TransitionLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
