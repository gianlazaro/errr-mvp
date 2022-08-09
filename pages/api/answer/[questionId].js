// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {addDoc, collection, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function questions(req, res) {
  const { questionId } = req.query;
  if (req.method === 'POST') {
    const { displayName, email, uid, answerBody } = req.body;
    const answer = {
      questionId,
      answerAuthor: {
        displayName,
        email,
        uid
      },
      answerBody
    };
    addDoc(collection(db, 'answers'), answer)

    // ping all people that are watching this questionId
    // send the questionId to the user's notification's array

    // get the list of watchers
    const questionRef = doc(db, 'questions', questionId);
    let watchers = await getDoc(questionRef);
    watchers = watchers.data().watchers;
    watchers.forEach((watcher)=> {
      const userRef = doc(db, 'users', watcher);
      updateDoc(userRef, {
        notifications: arrayUnion(questionId)
      })
    });

    res.send(answer);
  }
}
