import styles from '../styles/NavBar.module.css';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase.js';
import axios from 'axios';
import { useRouter } from 'next/router';
import Avatar from 'boring-avatars';
import NotificationBox from './NotificationBox';
import Image from 'next/image';
import useSWR, { useSWRConfig } from 'swr';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currUser, setCurrUser] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrUser(user.displayName);
    } else {
      setCurrUser('stranger');
    }
  }, [user]);

  function handleNotifs() {
    setIsNotifOpen(!isNotifOpen);
  }

  // ping the server every 60 seconds for changes in any of the questions watched
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: notifications, error } = useSWR(`/api/notifications/${user?.uid}`, fetcher
  , { refreshInterval: 1000 }
  );

  return (
    <nav className={styles.nav}>
      <span className={styles.logo}><Link href="/">err.</Link></span>
      <div className={styles.rightMenuCluster}>
        <span>
          {currUser !== 'stranger' ?
          <div className={styles.topishWrapper}>
          <span>Hi, {currUser}!</span>
          <div className={styles.notifWrapper}>
          <button onClick={handleNotifs} className={styles.notifBtn}>
            <Image src="/bellBtn.png" width="25px" height="25px" />
            {
              notifications?.length > 0 &&
              <div className={styles.notifMarker}></div>
            }
          </button>
          {
            isNotifOpen &&
            <div className={styles.notifbox} tabIndex={0} onFocus={() => setIsNotifOpen(true)} onBlur={() => setIsNotifOpen(false)}>
              <NotificationBox notifications={notifications} />
            </div>
          }
        </div>
          </div>
           :
            router.pathname !== '/login' ? <Link href="/login"><a className={styles.loginBtn}>Login</a></Link> : ''
          }</span>

        <div className={styles.avatarWrapper} onClick={() => {
          if(user) {
            logout()
          }
          }}>
          <Avatar
            size={40}
            name={user?.uid}
            variant="beam"
          />
        </div>
      </div>
    </nav>
  )
};

export default NavBar;