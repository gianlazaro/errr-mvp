import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react'
import DOMPurify from 'dompurify';
import { useRouter } from 'next/router';
import styles from '../styles/createCommunity.module.css';

export default function CreateCommunity() {
  const { register } = useAuth();
  const [communityId, setCommunityId] = useState(null);
  const router = useRouter();
  const [isStepOneDone, setIsStepOneDone] = useState(false);

  if (router.isFallback) {
    return <div className='loading-icon'></div>
  }

  function handleCreateCommunity(e) {
    e.preventDefault();
    let communityName = DOMPurify.sanitize(e.target.communityName.value);
    const communityLogo = DOMPurify.sanitize(e.target.communityLogo.value);
    const communitySidebar = DOMPurify.sanitize(e.target.communitySidebar.value);

    communityName = communityName.split(' ').join('');
    axios.post('../api/community', {
      communityName,
      communityLogo,
      communitySidebar
    }).then(({ data }) => {
      console.log(data);
      setCommunityId(data);
      setIsStepOneDone(true);
    });
  }

  function handleCreateAdmin(e) {
    e.preventDefault();
    const isAdmin = true;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const displayName = `${firstName} ${lastName}`;
    register(email, password, displayName, communityId, isAdmin);
  }
  return (
    <div className={styles.mainWrapper}>
      {!isStepOneDone ?
        <form onSubmit={handleCreateCommunity} className={styles.formWrapper}>
          <h1>Step One: Community Info</h1>
          <div className={styles.fieldGroup}>
            <label htmlFor="communityName">Community Name</label>
            <input type="textbox" id="communityName" required />

          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="communityLogo">Community Logo URL</label>
            <input type="textbox" id="communityLogo" required />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="communitySidebar">Community Sidebar Info</label>
            <textarea id="communitySidebar" required />
          </div>

          <button type="submit">Next &nbsp;👉</button>
        </form>
        :
        <form onSubmit={handleCreateAdmin} className={styles.formWrapper}>
          <h1>Step Two: Admin Info</h1>
          <div className={styles.fieldGroup}>
            <label htmlFor="firstName">First Name</label>
            <input type="textbox" id="firstName" />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input type="textbox" id="lastName" />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />

          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />

          </div>
          <button type="submit">Create the Community! &nbsp;✨</button>
        </form>
      }
    </div>
  )
}