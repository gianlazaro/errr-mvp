import styles from '../styles/NavBar.module.css';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import { auth } from '../config/firebase.js';
import axios from 'axios';
import {useRouter} from 'next/router';

function NavBar() {
  const {user, logout} = useAuth();
  const router = useRouter();
  const [currUser, setCurrUser] = useState('');

  useEffect(()=> {
    console.log(user);
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
        <span>Hi, {currUser}!</span>
        <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40" onClick={()=>logout()}>
          <title>Gian Lazaro</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#edd75a"></rect><rect x="0" y="0" width="36" height="36" transform="translate(8 -4) rotate(298 18 18) scale(1.1)" fill="#0c8f8f" rx="6"></rect><g transform="translate(4 -3) rotate(-8 18 18)"><path d="M15 20c2 1 4 1 6 0" fill="none" stroke="#FFFFFF" strokeLinecap="round"></path><rect x="11" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect><rect x="23" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect></g></g></svg>
      </div>
    </nav>
  )
};

export default NavBar;