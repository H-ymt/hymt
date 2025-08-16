import GlobalMenu from '@/app/[locale]/components/global-menu'
import ThemeToggle from '@/app/[locale]/components/theme-toggle'

import styles from './index.module.css'

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.menuWrapper}>
            <GlobalMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}
