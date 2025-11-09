import Container from "../components/container";
import { getEntries } from "../../lib/data/entries";
import { getKnowledgeKV } from "../../lib/utils/cloudflare";
import styles from "./page.module.css";
import NoteList from "./components/note-list";

// ISR: 1時間ごとに再生成（Cronトリガーが6時間ごとにKVを更新するため、1時間間隔で十分）
export const revalidate = 3600;

export default async function NotePage() {
  const kv = getKnowledgeKV();
  const env = kv ? { KNOWLEDGE_KV: kv } : undefined;
  const entries = await getEntries(env);

  return (
    <Container type="page">
      <div className={styles.heading}>
        <h1 className={styles.headingTitle}>Note</h1>
      </div>

      <NoteList initialEntries={entries} />
    </Container>
  );
}
