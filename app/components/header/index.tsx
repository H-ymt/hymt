import Image from 'next/image'
import Link from 'next/link'

import GlobalMenu from '@/app/components/global-menu'

import styles from './index.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={100} height={100} className={styles.logo} />
        </Link>
        <GlobalMenu />
      </div>
    </header>
  )
}
