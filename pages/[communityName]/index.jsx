import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/CommunityPage.module.css';
import { useAuth } from '../../contexts/AuthContext.jsx'
import useSWR, { useSWRConfig } from 'swr';
import { getDoc, getDocs, doc, query, collection, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import NotificationBox from '../../components/NotificationBox'
import { useState, useEffect } from 'react';
import Avatar from 'boring-avatars';
import { fromUnixTime, format } from 'date-fns';

export default function CommunityPage() {
  const { user } = useAuth();
  const [moreUserData, setMoreUserData] = useState({});
  const router = useRouter();
  const { mutate } = useSWRConfig()
  if (!user) {
    router.push(`/`);
    // return;
  }

  async function getUserMeta() {
    const userRef = await getDoc(doc(db, 'users', user.uid))
    setMoreUserData(userRef.data());
  }

  useEffect(()=> {
    getUserMeta();
  },[]);

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: questions } = useSWR(`api/questions/${user?.currentCommunity?.id}`, fetcher);
  const { data: community } = useSWR(`api/community/${user?.currentCommunity?.id}`, fetcher);

  function generateAvatar(name) {
    return (
      <Avatar
        size={25}
        name={name}
        variant="beam"
      />
    )
  }

  async function handleWatch(e) {

    const q_id = e.currentTarget.dataset.qid;
    const questionRef = doc(db, 'questions', q_id);

    await updateDoc(questionRef, {
      watchers: arrayUnion(user.uid)
    })

    //if q_id exists in the server array, remove button
    const btn = document.querySelector(`[data-qid="${q_id}"]`);
    btn.style.display = "none";

    mutate(`api/questions/${user?.currentCommunity?.id}`);
  }

  return (
    <div className={styles.communityPageWrapper}>
      <main className={styles.mainWrapper}>
        <div className={styles.topOfFeed}>{String(new Date())}</div>
        {questions?.map((q) => (
          <article className={styles.questionListItem} key={q.q_id}>
            <span className={styles.questionTitle}>
              <Link href={`/${user.currentCommunity.communityName}/${q.q_id}`}><a>{q.questionTitle}</a></Link>
            </span>
            <div className={styles.bottomBar}>
              <span>{q.questionAsker?.displayName} • {format(fromUnixTime(q.creationDate), 'MM/dd/yyyy')} • <a href="#">3 answers</a></span>
              {
                !q.watchers.includes(user.uid) &&
                <button onClick={handleWatch} data-qid={q.q_id} className={styles.watchBtn}>
                  <Image src="/eyeBtn.png" width="25px" height="25px" />
                </button>

              }
              <ul className={styles.watchList}>
                {q.watchers?.map((watcher) => (
                  <li className={styles.watchListItem} key={watcher}>
                    {generateAvatar(watcher)}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </main>
      <aside className={styles.sidebarWrapper}>
        <img src={community?.communityLogo} />
        <button className={styles.sidebarBtn}>Submit a Question</button>
        <div className={styles.sidebarInfo}>
          <h1>{community?.communityName}</h1>
          <p>{community?.communitySidebar}</p>
        </div>
        {
          moreUserData.admin === user?.currentCommunity?.id &&
        <div>
          <p>this is where you put the invite code</p>
          {user.currentCommunity?.id}
        </div>

        }
      </aside>
    </div>
  )
}