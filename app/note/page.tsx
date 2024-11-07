import Container from '@/app/components/container'

import styles from './index.module.css'

export default function NotePage() {
  return (
    <Container type="subpage">
      <h1>Note</h1>
      <p className={styles.text}>
        Web制作のヒントや考え、スニペットのコレクション (Comming soon...)
      </p>
    </Container>
  )
}
