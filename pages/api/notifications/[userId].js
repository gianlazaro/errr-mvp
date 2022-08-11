import {doc, getDoc} from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function Notifications (req, res) {
  const {userId} = req.query;
  // get the user
  const userRef = doc(db, 'users', userId);
  const user = await getDoc(userRef);
  const notifications = user.data()?.notifications;

  res.send(notifications);
}