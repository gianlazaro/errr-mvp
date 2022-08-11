import { useAuth } from '../contexts/AuthContext.jsx';
import styles from '../styles/Login.module.css';
import Link from 'next/link'
import Image from 'next/image';
import DOMPurify from 'dompurify';

export default function Login() {
  const { user, signIn } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    const email = DOMPurify.sanitize(e.target.email.value);
    const password = DOMPurify.sanitize(e.target.password.value);

    signIn(email, password);
  }
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.hypeup}>
        <h2 className={styles.hypemessage}>Let&apos;s get this ball <span>rollin&apos;!</span></h2>
      </div>
      <div className={styles.rightPane}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <input type="email" id="email" placeholder="email" />
          <input type="password" id="password" placeholder="password" />
        <span className={styles.nonaccountmsg}>Don&apos;t have an account yet? <Link href="/register"><a>Sign up!</a></Link></span>
          <button type="submit" className={styles.loginBtn}>Login</button>
        </form>

      </div>
    </div>
  )
}