import styles from '../styles/NavBar.module.css';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import { auth } from '../config/firebase.js';
import axios from 'axios';
import {useRouter} from 'next/router';
import Avatar from 'boring-avatars';

function NavBar() {
  const {user, logout} = useAuth();
  const router = useRouter();
  const [currUser, setCurrUser] = useState('');

  useEffect(()=> {
    if(user) {
      setCurrUser(user.displayName);
    } else {
      setCurrUser('stranger');
    }
  }, [user]);
  return (
    <nav className={styles.nav}>
      <span><Link href="/">err.</Link></span>
      <div className={styles.rightMenuCluster}>
        <span>
          {currUser !== 'stranger' ?
          `Hi, ${currUser}!` :
            router.pathname !== '/login' ? <Link href="/login"><a>Login</a></Link> : ''
}</span>
        <div onClick={()=>logout()}>
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