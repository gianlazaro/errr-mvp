import { useRouter } from 'next/router';
import styles from '../../styles/QuestionPage.module.css'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { getDoc, getDocs, doc, query, collection, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export async function getServerSideProps(ctx) {
  const { questionId } = ctx.params;
  async function fetchData() {
    let resultingObj = {};
    const questionsRef = doc(db, 'questions', questionId);
    const question = await getDoc(questionsRef);
    resultingObj.question = {...question.data(), questionId: question.id};

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
    const answerQuery = query(collection(db, 'answers'), where('questionId', '==', questionId));
    const docs = await getDocs(answerQuery);
    docs.forEach((doc) => {
      answers.push({ ...doc.data(), answerId: doc.id });
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
  const refreshData = () => {
    router.replace(router.asPath);
  }

  if (!user) {
    router.push('/');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const answerBody = e.target.answerField.value;
    const { data: answer } = await axios.post(`/api/answer/${questionId}`, {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      answerBody
    });

    refreshData();
  }

  function handleDeleteAnswer(ans) {
    if (user.uid === ans.answerAuthor.uid) {
      deleteDoc(doc(db, 'answers', ans.answerId)).then(() => {
        refreshData();
      })
    } else {
      console.log('you didnt ask this question?');
    }
  }

  function handleDeleteQuestion(ques) {
    console.log(ques)
    if (user.uid === ques.questionAsker.uid) {
      deleteDoc(doc(db, 'questions', ques.questionId)).then(() => {
        router.push('/');
        return;
      })
    }
  }

  return (
    <main className={styles.main}>
      <article className={styles.questionWrapper}>
        <h3 className={styles.sectionTitle}>{qna.question?.questionTitle}</h3>
        <p>
          {qna.question?.questionBody}
        </p>
        <div className={styles.bottomBar}>
          <span>Asked by {qna.question?.questionAsker.displayName}</span>
          <ul className={styles.watcherList}>
            <li><svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><title>Gian Lazaro</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#edd75a"></rect><rect x="0" y="0" width="36" height="36" transform="translate(8 -4) rotate(298 18 18) scale(1.1)" fill="#0c8f8f" rx="6"></rect><g transform="translate(4 -3) rotate(-8 18 18)"><path d="M15 20c2 1 4 1 6 0" fill="none" stroke="#FFFFFF" stroke-linecap="round"></path><rect x="11" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect><rect x="23" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect></g></g></svg></li>
            <li>
              <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><title>Coretta Scott</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#0c8f8f"></rect><rect x="0" y="0" width="36" height="36" transform="translate(5 -1) rotate(55 18 18) scale(1.1)" fill="#ffad08" rx="6"></rect><g transform="translate(7 -6) rotate(-5 18 18)"><path d="M15 20c2 1 4 1 6 0" stroke="#000000" fill="none" stroke-linecap="round"></path><rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
            </li>
          </ul>
          {
            user.uid === qna.question.questionAsker.uid &&
            <button onClick={() => handleDeleteQuestion(qna.question)}>
              Delete
            </button>
          }
        </div>
      </article>
      <div className={styles.answerbox}>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Make sure to answer concisely without taking that opportunity way from the other person" id="answerField"></textarea>
          <input type="submit" />
        </form>
      </div>
      <div className={styles.answers}>
        <h3 className={styles.sectionTitle}>Answers ({qna.answers?.length})</h3>
        {qna.answers?.map((answer) => (
          <article>
            <div className={styles.answerer}>
              <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80"><title>Maud Nathan</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#ffad08"></rect><rect x="0" y="0" width="36" height="36" transform="translate(-3 7) rotate(87 18 18) scale(1)" fill="#73b06f" rx="36"></rect><g transform="translate(-7 3.5) rotate(-7 18 18)"><path d="M13,19 a1,0.75 0 0,0 10,0" fill="#000000"></path><rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
              <span className={styles.answererName}>{answer.answerAuthor.displayName}</span>
              <span className={styles.answererTitle}>Assistant to the Regional Manager</span>
            </div>
            <div className={styles.answererResponse}>
              <p>{answer?.answerBody}</p>
            </div>
            {user.uid === answer.answerAuthor.uid &&
              <button onClick={(e) => handleDeleteAnswer(answer)}>delete</button>
            }
          </article>
        ))}
      </div>
    </main>
  )
}