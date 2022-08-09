import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationBox() {
  const { user } = useAuth();
  // ping the server every 30 seconds for changes in any of the questions watched
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: notifications, error } = useSWR(`api/notifications/${user.uid}`, fetcher
  // , {
    // refreshInterval: 2000
  // }
  );

  console.log(notifications);
  return (
    <div>
      <ul>
        {notifications?.map((notification)=> (
          <li>{notification}</li>
        ))}
      </ul>
    </div>
  )
}