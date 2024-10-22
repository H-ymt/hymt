import Container from '@/app/components/container'

import styles from './index.module.css'

export default function NotePage() {
  return (
    <Container type="subpage">
      <h1>Note</h1>
      <p className={styles.text}>
        マークダウンで記載できる、Web制作のTipsを書き溜めるNote（準備中です）
      </p>
    </Container>
  )
}
