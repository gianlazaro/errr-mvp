import useSWR, {useSWRConfig} from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';


export default function NotificationBox() {
  const { user } = useAuth();
  const { mutate } = useSWRConfig()
  // ping the server every 30 seconds for changes in any of the questions watched
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: notifications, error } = useSWR(`api/notifications/${user.uid}`, fetcher
    , {
    refreshInterval: 2000
    }
  );

  async function handleClearNotifs() {
    await updateDoc(doc(db, 'users', user.uid), {
      notifications: []
    })
    mutate(`api/notifications/${user.uid}`);
  }

  return (
    <div>
      <ul>
        {notifications?.map((notification) => (
          <li key={notification}>{notification}</li>
        ))}
      </ul>
      <button onClick={handleClearNotifs}>Clear notifications</button>
    </div>
  )
}