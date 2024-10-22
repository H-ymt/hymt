import GlobalMenu from '@/app/components/global-menu'

import styles from './index.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.menuWrapper}>
          <GlobalMenu />
        </div>
      </div>
    </header>
  )
}
