import {doc, collection, where, orderBy, getDocs, getDoc, query} from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function qna(req, res) {
  if (req.method === "GET") {
    const { questionId } = req.query;

    async function fetchData() {
      let resultingObj = {};
      const questionsRef = doc(db, 'questions', questionId);
      const question = await getDoc(questionsRef);
      resultingObj.question = { ...question.data(), questionId: question.id };

      // get query of all answers of the question id
      let answers = [];
      const answerQuery = query(collection(db, 'answers'), where('questionId', '==', questionId), orderBy('creationDate', 'desc'));
      const docs = await getDocs(answerQuery);
      docs.forEach((doc) => {
        answers.push({ ...doc.data(), answerId: doc.id });
      })
      resultingObj.answers = answers;
      return resultingObj;
    };

    const data = await fetchData();
    res.send(data);
  }
}