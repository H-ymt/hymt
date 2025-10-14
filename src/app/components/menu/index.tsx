"use client";

import clsx from "clsx";
import styles from "./index.module.css";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();

  const item = [
    { name: "Home", link: "/" },
    { name: "Note", link: "https://knowledge-base-1pg.pages.dev/" },
    { name: "Projects", link: "/projects" },
    { name: "Resume", link: "/resume" },
  ];

  return (
    <nav>
      <ul className={styles.list}>
        {item.map((menus) => {
          const isActive = menus.link === "/" ? pathname === "/" : pathname?.startsWith(menus.link);

          const isExternal = /^https?:\/\//.test(menus.link);

          return (
            <li key={menus.name} className={styles.item}>
              <a
                className={clsx(styles.link, isActive && styles.active)}
                href={menus.link}
                aria-current={isActive ? "page" : undefined}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {menus.name}
                {isExternal && (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className={styles.externalIcon}
                  >
                    <path d="M13 5H19V11" />
                    <path d="M19 5L5 19" />
                  </svg>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
