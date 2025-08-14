import Image from 'next/image'

import Container from '@/app/components/container'
import { GithubIcon } from '@/app/components/icons'
import Button from '@/app/components/ui/button'

import styles from './page.module.css'

const bio = [
  {
    id: 1,
    date: '2017.04',
    body: 'I started my career at a government agency, where I was in charge of managing websites through a CMS. This experience sparked my interest in web development and motivated me to begin learning independently.',
  },

  {
    id: 2,
    date: '2022.04',
    body: 'I transitioned to a role as a web developer at an e-commerce consulting company, where I became involved in website production.',
  },
  {
    id: 3,
    date: '2024.06',
    body: 'I joined a system development and web production company as a front-end engineer, continuing to work on website development projects.',
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
        <div className={styles.heroContent}>
          <div className={styles.heroHeading}>
            <span>👋</span>
            <p className="sr-only">My Homepage</p>
          </div>
          <p className={styles.heroText}>
            I’m a front-end engineer currently working on website development. I enjoy working with modern architectures
            using JavaScript frameworks like Next.js and Astro. I also have experience in WordPress development.
          </p>
        </div>
        <div className={styles.heroButtonContainer}>
          <Button href="/projects" visual="primary" className={styles.heroButton}>
            Projects
          </Button>
          <Button href="https://github.com/H-ymt/hymt" target="_blank" visual="secondary" className={styles.heroButton}>
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
            <li key={id} className={styles.bioItem} data-current={index === bio.length - 1 ? 'true' : 'false'}>
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
          {stack.map((stack) => (
            <div key={stack.category} className={styles.stackCard}>
              <h3 className={styles.stackCategory}>{stack.category}</h3>
              <div className={styles.stackList}>
                {stack.items.map((item) => (
                  <div key={item.label} className={styles.stackItem}>
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
      </section>
    </Container>
  )
}
