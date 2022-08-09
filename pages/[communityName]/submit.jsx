import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import {db} from '../../config/firebase'
import axios from 'axios';

export default function SubmitQuestion() {
  const {user} = useAuth();
  const router = useRouter();
  const {communityName, id:communityId} = user.currentCommunity;

  if(router.query.communityName !== communityName) {
    router.push('/401');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const questionTitle = e.target.questionTitle.value;
    const questionBody = e.target.questionBody.value;

    const { data : questionId } = await axios.post(`/api/questions/${communityId}`, {
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
    <>
      <h1>Submit a Question</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="questionTitle">Question</label>
        <input id="questionTitle" type="textbox"/>
        <label htmlFor="questionBody">Question Details</label>
        <textarea id="questionBody"/>
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

