import clsx from "clsx";

import styles from "./index.module.css";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  type?: "page";
};

export default function Container({ children, className, type }: ContainerProps) {
  const classNames = clsx(styles.container, type === "page" && styles.page, className);

  return <div className={classNames}>{children}</div>;
}
