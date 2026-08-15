export type BioItem = { id: number; date?: string; body: string };

export const bio: BioItem[] = [
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

export const stack = [
  {
    category: "Frontend",
    items: [
      { label: "WordPress", logo: "/logo-wordpress.svg" },
      { label: "JavaScript", logo: "/logo-javascript.svg" },
      { label: "TypeScript", logo: "/logo-typescript.svg" },
      { label: "React", logo: "/logo-react.svg" },
      { label: "Next.js", logo: "/logo-nextjs.svg" },
      { label: "Astro", logo: "/logo-astro.svg" },
      { label: "Sass", logo: "/logo-sass.svg" },
      { label: "Tailwind CSS", logo: "/logo-tailwind-css.svg" },
      { label: "microCMS", logo: "/logo-microcms.svg" },
    ],
  },
  {
    category: "Development Tools",
    items: [
      { label: "Prettier", logo: "/logo-prettier.svg" },
      { label: "Stylelint", logo: "/logo-stylelint.svg" },
      { label: "ESLint", logo: "/logo-eslint.svg" },
      { label: "Biome", logo: "/logo-biome.svg" },
      { label: "npm", logo: "/logo-npm.svg" },
      { label: "pnpm", logo: "/logo-pnpm.svg" },
      { label: "Bun", logo: "/logo-bun.svg" },
      { label: "Vite", logo: "/logo-vite.svg" },
      { label: "Gulp", logo: "/logo-gulp.svg" },
    ],
  },
  {
    category: "Other",
    items: [
      { label: "VSCode", logo: "/logo-vscode.svg" },
      { label: "GitHub", logo: "/logo-github.svg" },
      { label: "Figma", logo: "/logo-figma.svg" },
      { label: "XD", logo: "/logo-xd.svg" },
    ],
  },
];
