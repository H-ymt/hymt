import Container from '@/app/[locale]/components/container'
import { routing } from '@/i18n/routing'

import styles from './page.module.css'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }))
}

export default function Page() {
  return (
    <>
      <Container type="subpage">
        <h1>Contact</h1>
        <p>🚧 Under Construction...</p>
        <form action="" className={styles.form}></form>
      </Container>
    </>
  )
}
