import useSWR, {useSWRConfig} from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import styles from '../styles/NotifBox.module.css'
import Image from 'next/image';
import Link from 'next/link';

export default function NotificationBox({notifications}) {
  const { user } = useAuth();
  const {mutate} = useSWRConfig();

  async function handleClearNotifs() {
    await updateDoc(doc(db, 'users', user.uid), {
      notifications: []
    })
    mutate(`/api/notifications/${user.uid}`);
  }


  return (
    <div className={styles.notifBoxWrapper}>
      <ul>
        {notifications?.length > 0? notifications.map((notification) => (
          <li key={notification}><Link href={`/${user.currentCommunity.communityName}/${notification}`}>There&apos;s a new update</Link></li>

          )):
          <div className={styles.emptyNotif}>
          <Image src="/zeroNotif.png" width="150px" height="150px" objectFit="contain"/>
          No new notifications!
        </div>
        }
      </ul>
      {notifications?.length > 0 &&
        <button onClick={handleClearNotifs}>Clear notifications</button>
      }
    </div>
  )
}