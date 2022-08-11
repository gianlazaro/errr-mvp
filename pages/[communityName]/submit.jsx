import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from '../../config/firebase'
import axios from 'axios';
import styles from '../../styles/Submit.module.css'

export default function SubmitQuestion() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) {
    router.push('/');
  }
  const { communityName, id: communityId } = user.currentCommunity;

  if (router.isFallback) {
    return <div className='loading-icon'></div>
  }

  if (router.query.communityName !== communityName) {
    router.push('/401');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const questionTitle = e.target.questionTitle.value;
    const questionBody = e.target.questionBody.value;

    const { data: questionId } = await axios.post(`/api/questions/${communityId}`, {
      questionTitle,
      questionBody,
      communityId,
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
    });
    router.push(`/${communityName}/${questionId}`)
  }
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <h1>Submit a Question</h1>
          <div className={styles.fieldGroup}>
            <label htmlFor="questionTitle">Question</label>
            <input id="questionTitle" type="textbox" required/>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="questionBody">Question Details</label>
            <textarea id="questionBody" required/>
          </div>
          <button type="submit" className={styles.loginBtn}>Submit</button>
        </form>
      </div>
    </div>
  )
}

