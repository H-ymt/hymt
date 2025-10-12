import Menu from "../menu";
import styles from "./index.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Menu />
    </header>
  );
}
