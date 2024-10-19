import Container from '@/app/components/container'
import Button from '@/app/components/ui/button'

import styles from './page.module.css'

const Bio = [
  { id: 1, date: '2017.04', body: '高校卒業後、公務員として従事。' },
  {
    id: 2,
    body: 'CMSを利用したホームページ管理業務を機にWebサイト制作に興味を持ち始め、独学で学習を始める。',
  },
  {
    id: 3,
    date: '2022.04',
    body: 'ECコンサル会社のコーダーとして転職し、Web制作業務に携わる。',
  },
  {
    id: 4,
    date: '2024.06',
    body: 'システム開発・Web制作会社のフロントエンドエンジニアとして、Web制作業務に携わる。',
  },
]

export default function Home() {
  return (
    <Container className={styles.container}>
      <h1 className={styles.pageHeading}>Yamato Handai</h1>
      <p className={styles.heroText}>
        現在、フロントエンドエンジニアとしてWebサイト制作に携わっています。
        <br />
        業務の案件ではWordPressを使用したWebサイト制作が多いですが、Next.jsやAstroなどのJSフレームワークとmicroCMSなどのヘッドレスCMSを用いたアーキテクチャが好きです。
      </p>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Biography</h2>
        <ul className={styles.bioList}>
          {Bio.map(({ id, date, body }, index) => (
            <li
              key={id}
              className={styles.bioItem}
              data-current={index === Bio.length - 1 ? 'true' : 'false'}
            >
              {date && (
                <time className={styles.bioDate} dateTime={`${date.replace('.', '-')}-01`}>
                  {date}
                </time>
              )}
              <span className={styles.bioBody}>{body}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <div className={styles.buttonArea}>
          <Button
            className={styles.buttonGithub}
            href="https://github.com/H-ymt"
            target="_blank"
            visual="primary"
          >
            <span>GitHub</span>
          </Button>
          <Button visual="secondary">Mail</Button>
        </div>
      </section>
    </Container>
  )
}
