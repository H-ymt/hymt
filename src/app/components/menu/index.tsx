"use client";

import clsx from "clsx";
import styles from "./index.module.css";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();

  const item = [
    { name: "Home", link: "/" },
    { name: "Note", link: "/note" },
    { name: "Projects", link: "/projects" },
    { name: "Resume", link: "/resume" },
  ];

  return (
    <nav>
      <ul className={styles.list}>
        {item.map((menus) => {
          const isActive = menus.link === "/" ? pathname === "/" : pathname?.startsWith(menus.link);

          return (
            <li key={menus.name} className={styles.item}>
              <a className={clsx(styles.link, isActive && styles.active)} href={menus.link} aria-current={isActive ? "page" : undefined}>
                {menus.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
