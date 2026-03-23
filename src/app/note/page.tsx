import { getEntries } from "../../lib/data/entries";
import { getKnowledgeKV } from "../../lib/utils/cloudflare";
import Container from "../components/container";
import NoteList from "./components/note-list";
import styles from "./page.module.css";

export const revalidate = 3600;

export default async function NotePage() {
  const kv = getKnowledgeKV();
  const env = kv ? { KNOWLEDGE_KV: kv } : undefined;
  const entries = await getEntries(env);

  return (
    <Container type="page">
      <div className={styles.heading}>
        <h1 className={styles.pageTitle}>Note</h1>
      </div>

      <NoteList initialEntries={entries} />
    </Container>
  );
}
