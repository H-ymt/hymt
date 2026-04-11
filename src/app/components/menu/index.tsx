"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import styles from "./index.module.css";

export default function Menu() {
  const pathname = usePathname();

  const item = [
    { name: "Home", link: "/" },
    { name: "Note", link: "/note" },
    { name: "Projects", link: "https://project-showcase.h-ymt.dev/" },
    { name: "Resume", link: "https://resume-showcase.h-ymt.dev/" },
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.externalIcon}
                    aria-hidden="true"
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
