import {doc, getDoc} from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function question (req, res) {
  const {qid} = req.query;

  const question = await getDoc(doc(db, 'questions', qid));
  const q = question.data();

    res.send(q);
}