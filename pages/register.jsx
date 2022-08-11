import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {getDoc, doc} from 'firebase/firestore';
import styles from '../styles/Register.module.css';
import {useState} from 'react';
import DOMPurify from 'dompurify';
import {useRouter} from 'next/router';

export default function Register() {
  const { register } = useAuth();
  const [error, setError] = useState(null);
  const router = useRouter();
  if (router.isFallback) {
    return <div className='loading-icon'></div>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const firstName = DOMPurify.sanitize(e.target.firstName.value);
    const lastName = DOMPurify.sanitize(e.target.lastName.value);
    const displayName = `${firstName} ${lastName}`
    const communityId = DOMPurify.sanitize(e.target.communityId.value);
    const email = DOMPurify.sanitize(e.target.email.value);
    const password = DOMPurify.sanitize(e.target.password.value);

    // if community code doesn't exist, don't register

    const communityRef = doc(db, 'communities', communityId);
    const community = await getDoc(communityRef);

    if(community.exists()) {
      setError(null);
      register(email, password, displayName, communityId);
    } else {
      setError('Community does not exist!');
    }
  }

  return (
    <div className={styles.mainWrapper}>
      <form onSubmit={handleSubmit} className={styles.fieldGroupWrapper}>
        <h1>Register</h1>
        <div className={styles.fieldGroupFL}>
          <label htmlFor="firstName">First Name</label>
          <input type="textbox" id="firstName" required/>
          <label htmlFor="lastName">Last Name</label>
          <input type="textbox" id="lastName" required/>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="communityId">Community Code</label>
          <input type="textbox" id="communityId" style={{border: error ? '2px solid red' : '1px solid #ddd'}} required/>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required/>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required/>
        </div>
        <div className={styles.buttonWrapper}>
          <div className={styles.errorMessage}>{error && `❌ ${error}`}</div>
          <button type="submit"> Submit </button>
        </div>
      </form>
    </div>
  )
}