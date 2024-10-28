import Image from 'next/image'

import Container from '@/app/components/container'
import { GithubIcon } from '@/app/components/icons'
import Button from '@/app/components/ui/button'

import styles from './page.module.css'

const bio = [
  { id: 1, date: '2017.04', body: '高校卒業後、行政機関に従事。' },
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

const stack = [
  {
    category: 'Frontend',
    items: [
      {
        label: 'WordPress',
        logo: '/logo-wordpress.svg',
      },
      {
        label: 'JavaScript',
        logo: '/logo-javascript.svg',
      },
      {
        label: 'TypeScript',
        logo: '/logo-typescript.svg',
      },
      {
        label: 'React',
        logo: '/logo-react.svg',
      },
      {
        label: 'Next.js',
        logo: '/logo-nextjs.svg',
      },
      {
        label: 'Astro',
        logo: '/logo-astro.svg',
      },
      {
        label: 'Sass',
        logo: '/logo-sass.svg',
      },
      {
        label: 'Tailwind CSS',
        logo: '/logo-tailwind-css.svg',
      },
      {
        label: 'microCMS',
        logo: '/logo-microcms.svg',
      },
    ],
  },
  {
    category: 'Development Tools',
    items: [
      {
        label: 'Prettier',
        logo: '/logo-prettier.svg',
      },
      {
        label: 'Stylelint',
        logo: '/logo-stylelint.svg',
      },
      {
        label: 'ESLint',
        logo: '/logo-eslint.svg',
      },
      {
        label: 'Biome',
        logo: '/logo-biome.svg',
      },
      {
        label: 'npm',
        logo: '/logo-npm.svg',
      },
      {
        label: 'pnpm',
        logo: '/logo-pnpm.svg',
      },
      {
        label: 'Bun',
        logo: '/logo-bun.svg',
      },
      {
        label: 'Vite',
        logo: '/logo-vite.svg',
      },
      {
        label: 'Gulp',
        logo: '/logo-gulp.svg',
      },
    ],
  },
  {
    category: 'Other',
    items: [
      {
        label: 'VSCode',
        logo: '/logo-vscode.svg',
      },
      {
        label: 'GitHub',
        logo: '/logo-github.svg',
      },
      {
        label: 'Figma',
        logo: '/logo-figma.svg',
      },
      {
        label: 'XD',
        logo: '/logo-xd.svg',
      },
    ],
  },
]

export default function Home() {
  return (
    <Container className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroHeading}>Yamato Handai</h1>
        <p className={styles.heroText}>
          現在、フロントエンドエンジニアとしてWebサイト制作に携わっています。
          <br />
          業務の案件ではWordPressを使用したWebサイト制作が多いですが、Next.jsやAstroなどのJSフレームワークとmicroCMSなどのヘッドレスCMSを用いたアーキテクチャが好きです。
        </p>
        <div className={styles.heroButtonContainer}>
          <Button href="/projects" visual="primary" className={styles.heroButton}>
            Projects
          </Button>
          <Button
            href="https://github.com/H-ymt/hymt"
            target="_blank"
            visual="secondary"
            className={styles.heroButton}
          >
            View Source
            <span className={styles.heroButtonIcon}>
              <GithubIcon />
            </span>
          </Button>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Biography</h2>
        <ul className={styles.bioList}>
          {bio.map(({ id, date, body }, index) => (
            <li
              key={id}
              className={styles.bioItem}
              data-current={index === bio.length - 1 ? 'true' : 'false'}
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
        <h2 className={styles.sectionTitle}>Stack</h2>
        <div className={styles.stackContainer}>
          {stack.map((stack, stackIndex) => (
            <div key={stackIndex} className={styles.stackCard}>
              <h3 className={styles.stackCategory}>{stack.category}</h3>
              <div className={styles.stackList}>
                {stack.items.map((item, index) => (
                  <div key={index} className={styles.stackItem}>
                    {item.logo && (
                      <div className={styles.stackLogo}>
                        <Image src={item.logo} alt="" width="36" height="36" />
                      </div>
                    )}
                    <p className={styles.stackLabel}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.stackButton}>
          <Button href="/stack" size="large">
            View more
          </Button>
        </div>
      </section>
    </Container>
  )
}
