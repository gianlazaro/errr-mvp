import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/CommunityPage.module.css';
import { useAuth } from '../../contexts/AuthContext.jsx'
import useSWR, { useSWRConfig } from 'swr';
import { getDoc, getDocs, doc, query, collection, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import NotificationBox from '../../components/NotificationBox'

export default function CommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { mutate } = useSWRConfig()
  if (!user) {
    router.push(`/`);
    return;
  }

  const fetcher = (...args) => fetch(...args).then(res => {
    return res.json()
  });
  const { data: questions, error } = useSWR(`api/questions/${user?.currentCommunity?.id}`, fetcher);

  // if(error) <p>Loading failed</p>;
  // if(!questions) <h1>Loading...</h1>;

  async function handleWatch(e) {

    const q_id = e.currentTarget.dataset.qid;
    // when clicked, add user id to watchers array in the question, use arrayunion

    // get question ref
    const questionRef = doc(db, 'questions', q_id);
    // const quest = questionRef.data();
    // console.log(quest);
    // update with arrayunion/arraydelete
    await updateDoc(questionRef, {
      watchers: arrayUnion(user.uid)
    })

    mutate(`api/questions/${user?.currentCommunity?.id}`);
    // if the question gets a new answer, notify all users in the watchers array
  }

  return (
    <main className={styles.mainWrapper}>
      {questions?.map((q) => (
        <article className={styles.questionListItem} key={q.q_id}>
          <span className={styles.questionTitle}>
            <Link href={`/${user.currentCommunity.communityName}/${q.q_id}`}>{q.questionTitle}</Link>
          </span>
          <div className={styles.bottomBar}>
            <span>Asked by {q.questionAsker.displayName} • <a href="#">3 answers</a></span>
            <button onClick={handleWatch} data-qid={q.q_id}>Watch</button>
            <ul className={styles.watchList}>
              {q.watchers?.map((watcher) => (
                <li className={styles.watchListItem}>
                  {watcher.slice(0, 2)}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
      <div className={styles.notifbox}>
        <NotificationBox />
      </div>
    </main>
  )
}