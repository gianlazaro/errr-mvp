// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getDocs, query, collection, where, addDoc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function questions(req, res) {
  if (req.method === 'GET') {
    let data = [];
    let page = 1;
    let startCount = 0;
    const { communityId } = req.query;
    // order by number of watchers
    // where date is today
    const docs = await getDocs(query(collection(db, 'questions'), where('communityId', '==', communityId), orderBy('creationDate', 'asc')));
    docs.forEach((doc) => {
      data.push({ ...doc.data(), q_id: doc.id });
    })
    res.send(data);
  }
  else if (req.method === 'POST') {
    const { questionTitle, questionBody, communityId, displayName, email, uid } = req.body;
    let creationDate = Timestamp.now();

    const question = await addDoc(collection(db, 'questions'), {
      communityId,
      questionTitle,
      questionBody,
      questionAsker: {
        displayName,
        email,
        uid,
      },
      watchers: [],
      creationDate: String(Timestamp.now())
    });

    res.send(question.id);
  }
}
