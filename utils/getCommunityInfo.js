import {doc, getDoc} from 'firebase/firestore';
import {db} from '../config/firebase';

export default async function getCommunityInfo(user) {
  const userRef = doc(db, 'users', user.uid);
  const com = await getDoc(userRef);
  const commu = await getDoc(com.data().communities[0]);
  const community = commu.data();

  return {...community, id: commu.id};
}