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

export default function CommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { mutate } = useSWRConfig()
  if (!user) {
    router.push(`/`);
    return;
  }

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: questions, error } = useSWR(`api/questions/${user.currentCommunity?.id}`, fetcher);

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
              <span>{q.questionAsker?.displayName} • <a href="#">3 answers</a></span>
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
        <div className={styles.notifbox}>
          <NotificationBox />
        </div>
      </main>
      <aside className={styles.sidebarWrapper}>
        <h1>HR2205</h1>
        <p>Sed auctor est ut nibh lobortis ornare. Aliquam egestas augue quis nibh lacinia luctus. Donec imperdiet mauris lobortis est auctor, at tempus leo fringilla. Sed eleifend finibus lorem. Morbi justo nisl, scelerisque a ante vel, blandit mattis sapien. Integer vitae fringilla sapien. Ut magna ligula, suscipit et mauris vel, faucibus molestie orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam rhoncus finibus sapien vel semper. Suspendisse nec tincidunt sapien, in ultricies leo. Quisque facilisis velit ante, suscipit tempus velit auctor at. Fusce sit amet nibh quis ipsum ultricies hendrerit non sed nulla. Etiam egestas neque id lacus aliquet, et auctor massa viverra. Phasellus et vestibulum nisi. Sed dignissim, neque eget ullamcorper porttitor, dolor tellus tincidunt ipsum, sed feugiat magna metus scelerisque est. Nulla consequat tellus in diam dictum malesuada.
        </p>
        <p>
          Ut bibendum luctus quam, vel dictum elit congue a. Nam rutrum quis neque maximus malesuada. Phasellus tincidunt fringilla condimentum. Nam varius volutpat nunc blandit commodo. Cras sed nunc lacus. Maecenas sagittis sapien mauris, quis condimentum tortor pharetra sit amet. Sed vitae ornare massa. Fusce eleifend est sed arcu maximus, non molestie lorem scelerisque. Ut dignissim libero in orci bibendum, a venenatis risus iaculis. Praesent faucibus enim quis nulla elementum, ut tristique tellus tincidunt.</p>
      </aside>
    </div>
  )
}