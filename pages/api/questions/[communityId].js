// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getDocs, query, collection, where, addDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function questions(req, res) {
  if (req.method === 'GET') {
    let data = [];
    const { communityId } = req.query;
    const docs = await getDocs(query(collection(db, 'questions'), where('communityId', '==', communityId)));
    docs.forEach((doc) => {
      data.push({ ...doc.data(), q_id: doc.id });
    })
    res.send(data);
  }
  else if (req.method === 'POST') {
    const { questionTitle, questionBody, communityId, displayName, email, uid } = req.body;

    const question = await addDoc(collection(db, 'questions'), {
      communityId,
      questionTitle,
      questionBody,
      questionAsker: {
        displayName,
        email,
        uid,
      },
      watchers: []
    });

    res.send(question.id);
  }
}
