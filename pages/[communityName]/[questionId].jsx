import { useRouter } from 'next/router';
import styles from '../../styles/QuestionPage.module.css'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { getDoc, getDocs, doc, query, collection, where, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Image from 'next/image';
import Avatar from 'boring-avatars';
import DOMPurify from 'dompurify';

export async function getServerSideProps(ctx) {
  const { questionId } = ctx.params;
  async function fetchData() {
    let resultingObj = {};
    const questionsRef = doc(db, 'questions', questionId);
    const question = await getDoc(questionsRef);
    resultingObj.question = { ...question.data(), questionId: question.id };

    // means that person does not have access to question, leave
    if (!resultingObj.question) {
      return {
        redirect: {
          destination: '/'
        }
      }
    }

    // get query of all answers of the question id
    let answers = [];
    const answerQuery = query(collection(db, 'answers'), where('questionId', '==', questionId), orderBy('creationDate', 'desc'));
    const docs = await getDocs(answerQuery);
    docs.forEach((doc) => {
      answers.push({ ...doc.data(),answerId: doc.id });
    })
    resultingObj.answers = answers;
    return resultingObj;
  };

  const data = await fetchData();
  return {
    props: {
      data
    }
  }
}

export default function QuestionPage({ data: qna }) {
  const router = useRouter();
  const { questionId } = router.query;
  const { user } = useAuth();
  const [moreUserData, setMoreUserData] = useState({});
  const [isEditableQ, setIsEditableQ] = useState(false);
  const [isEditableA, setIsEditableA] = useState(false);
  const [isVisibleQ, setIsVisibleQ] = useState(false);
  const [isVisibleA, setIsVisibleA] = useState(false);
  const refreshData = () => {
    router.replace(router.asPath);
  }

  async function getUserMeta() {
    const userRef = await getDoc(doc(db, 'users', user.uid))
    setMoreUserData(userRef.data());
  }

  useEffect(()=> {
    getUserMeta();
  }, []);

  if (router.isFallback) {
    return <div className='loading-icon'></div>
  }

  if (!user) {
    router.push('/');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const answerBody = DOMPurify.sanitize(e.target.answerField.value);

    const { data: answer } = await axios.post(`/api/answer/${questionId}`, {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      answerBody
    });

    refreshData();
  }

  function handleDeleteAnswer(ans) {
    if (user.uid === ans.answerAuthor.uid || !!moreUserData.admin) {
      deleteDoc(doc(db, 'answers', ans.answerId)).then(() => {
        refreshData();
      })
    } else {
      console.log('you didnt ask this question?');
    }
  }

  function handleUpdateAnswer(ans) {
    if (user.uid === ans.answerAuthor.uid || !!moreUserData.admin) {
      setIsEditableA(!isEditableA);
      const answerBody = DOMPurify.sanitize(document.querySelector('#answerBody').textContent);

      updateDoc(doc(db, 'answers', ans.answerId), {
        answerBody
      });
    }
  }

  function handleDeleteQuestion(ques) {
    if (user.uid === ques.questionAsker.uid || !!moreUserData.admin) {
      deleteDoc(doc(db, 'questions', ques.questionId)).then(() => {
        router.push('/');
        return;
      })
    }
  }


  function handleUpdateQuestion(ques) {
    if (user.uid === ques.questionAsker.uid || !!moreUserData.admin) {
      setIsEditableQ(!isEditableQ);
      const questionTitle = document.querySelector('#questionTitle').textContent;
      const questionBody = document.querySelector('#questionBody').textContent;
      console.log(questionTitle);

      updateDoc(doc(db, 'questions', ques.questionId), {
        questionTitle,
        questionBody
      });
    }
  }

  function visiblity(answerId) {

  }

  return (
    <main className={styles.main}>
      <article className={styles.questionWrapper}>
        <h3 className={styles.sectionTitle} contentEditable={isEditableQ} id="questionTitle">{qna.question?.questionTitle}</h3>
        <p id="questionBody" className={styles.questionBody} contentEditable={isEditableQ}>
          {qna.question?.questionBody}
        </p>
        <div className={styles.bottomBar}>
          <span>Asked by {qna.question?.questionAsker.displayName}</span>
          {
            (user?.uid === qna.question.questionAsker.uid || !!moreUserData.admin) &&
            <div className={styles.actionsWrapperQ}>
              <Image src="/moreBtn.png" width="30px" height="30px" className={styles.moreIcon} onClick={() => setIsVisibleQ(!isVisibleQ)} />
              {isVisibleQ &&
                <div className={styles.buttonsWrapperQ}>
                  <button onClick={() => handleUpdateQuestion(qna.question)}>
                    {isEditableQ ? 'Save' : 'Update'}
                  </button>
                  <button onClick={() => handleDeleteQuestion(qna.question)}>
                    Delete
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </article>
      <div className={styles.answerbox}>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <textarea placeholder="Make sure to answer concisely without taking the opportunity away from the other person." id="answerField"></textarea>
          <input type="submit" />
        </form>
      </div>
      <div className={styles.answers}>
        <h3 className={styles.sectionTitle}>Answers ({qna.answers?.length})</h3>
        {qna.answers?.map((answer) => (
          <article key={answer.answerId} className={styles.answerWrapper}>
            <div className={styles.answerer}>
            <Avatar
          size={75}
          name={user?.uid}
          variant="beam"
          onClick={()=>logout()}
          className={styles.avatar}
          />
              <span className={styles.answererName}>{answer.answerAuthor.displayName}</span>
            </div>
            <div className={styles.answererResponse}>
              <p id="answerBody" contentEditable={isEditableA}>{answer?.answerBody}</p>
            </div>
            {(user?.uid === answer.answerAuthor.uid || !!moreUserData.admin) &&
              <div className={styles.actionsWrapperA}>
                <Image src="/moreBtn.png" width="30px" height="30px" className={styles.moreIcon} onClick={() => setIsVisibleA(!isVisibleA)} />
                {
                  isVisibleA &&
                  <div className={styles.buttonsWrapperA}>
                    <button onClick={(e) => handleUpdateAnswer(answer)}>
                      {isEditableA ? 'Save' : 'Update'}
                    </button>
                    <button onClick={(e) => handleDeleteAnswer(answer)}>Delete</button>
                  </div>

                }
              </div>
            }
          </article>
        ))}
      </div>
    </main>
  )
}