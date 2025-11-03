import Container from "../components/container";
import { getEntries } from "../../lib/data/entries";
import styles from "./page.module.css";
import NoteList from "./components/note-list";

export default async function NotePage() {
  const entries = await getEntries();

  return (
    <Container type="page">
      <div className={styles.heading}>
        <h1 className={styles.headingTitle}>Note</h1>
      </div>

      <NoteList initialEntries={entries} />
    </Container>
  );
}
