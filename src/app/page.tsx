import Image from "next/image";
import styles from "./page.module.css";
import Container from "./components/container";

type BioItem = { id: number; date?: string; body: React.ReactNode };

const bio: BioItem[] = [
  {
    id: 1,
    date: "2017.04",
    body: "First became interested in web and IT after managing websites with a CMS at a government organization, which led me to teach myself web development.",
  },
  {
    id: 2,
    date: "2022.04",
    body: "Began my career as a markup coder at a company that consults for e-commerce sites, working on storefronts for platforms like Rakuten and Yahoo! Shopping.",
  },
  {
    id: 3,
    date: "2024.06",
    body: "Joined a company that develops web systems and websites as a front-end engineer, contributing to projects that build WordPress websites and web systems using Laravel.",
  },
];

const stack = [
  {
    category: "Frontend",
    items: [
      {
        label: "WordPress",
        logo: "/logo-wordpress.svg",
      },
      {
        label: "JavaScript",
        logo: "/logo-javascript.svg",
      },
      {
        label: "TypeScript",
        logo: "/logo-typescript.svg",
      },
      {
        label: "React",
        logo: "/logo-react.svg",
      },
      {
        label: "Next.js",
        logo: "/logo-nextjs.svg",
      },
      {
        label: "Astro",
        logo: "/logo-astro.svg",
      },
      {
        label: "Sass",
        logo: "/logo-sass.svg",
      },
      {
        label: "Tailwind CSS",
        logo: "/logo-tailwind-css.svg",
      },
      {
        label: "microCMS",
        logo: "/logo-microcms.svg",
      },
    ],
  },
  {
    category: "Development Tools",
    items: [
      {
        label: "Prettier",
        logo: "/logo-prettier.svg",
      },
      {
        label: "Stylelint",
        logo: "/logo-stylelint.svg",
      },
      {
        label: "ESLint",
        logo: "/logo-eslint.svg",
      },
      {
        label: "Biome",
        logo: "/logo-biome.svg",
      },
      {
        label: "npm",
        logo: "/logo-npm.svg",
      },
      {
        label: "pnpm",
        logo: "/logo-pnpm.svg",
      },
      {
        label: "Bun",
        logo: "/logo-bun.svg",
      },
      {
        label: "Vite",
        logo: "/logo-vite.svg",
      },
      {
        label: "Gulp",
        logo: "/logo-gulp.svg",
      },
    ],
  },
  {
    category: "Other",
    items: [
      {
        label: "VSCode",
        logo: "/logo-vscode.svg",
      },
      {
        label: "GitHub",
        logo: "/logo-github.svg",
      },
      {
        label: "Figma",
        logo: "/logo-figma.svg",
      },
      {
        label: "XD",
        logo: "/logo-xd.svg",
      },
    ],
  },
];

export default function Home() {
  return (
    <Container type="page">
      <div className={styles.heading}>
        <h1 className={styles.headingPosition}>Frontend Engineer</h1>

        <p className={styles.headingText}>
          I often create webs using Word Press, but I like developing using Java Script frameworks such as Next.js and Astro.
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Biography</h2>
        <ol className={styles.bioList}>
          {bio.map(({ id, date, body }, index) => (
            <li key={id} className={styles.bioItem} data-current={index === bio.length - 1 ? "true" : "false"}>
              {date && (
                <time className={styles.bioDate} dateTime={`${date.replace(".", "-")}-01`}>
                  {date}
                </time>
              )}
              <span className={styles.bioBody}>{body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>What I can do</h2>
        <div className={styles.stackContainer}>
          {stack.map((stack) => (
            <div key={stack.category} className={styles.stackCard}>
              <h3 className={styles.stackCategory}>{stack.category}</h3>
              <div className={styles.stackItems}>
                {stack.items.map((item) => (
                  <div key={item.label} className={styles.stackItem}>
                    {item.logo && <Image className={styles.stackLogo} src={item.logo} alt="" width="30" height="30" />}
                    <p className={styles.stackLabel}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
