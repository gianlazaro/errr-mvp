import { useAuth } from '../contexts/AuthContext.jsx';
import styles from '../styles/Login.module.css';
import Link from 'next/link'
import Image from 'next/image';

export default function login() {
  const { user, signIn } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password);
  }
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.hypeup}>
        <h2 className={styles.hypemessage}>Let's get this ball <span>on the road!</span></h2>
      </div>
      <div className={styles.rightPane}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <input type="email" id="email" placeholder="email" />
          <input type="password" id="password" placeholder="password" />
        <span className={styles.nonaccountmsg}>Don't have an account? <Link href="/register"><a>Sign up!</a></Link></span>
          <button type="submit" className={styles.loginBtn}>Login</button>
        </form>

      </div>
    </div>
  )
}