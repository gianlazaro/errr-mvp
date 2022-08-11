import {addDoc, collection, getDoc, doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function community(req, res) {
  if(req.method === 'POST') {
    const date = new Date();
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    const {communityName, communityLogo, communitySidebar} = req.body;
    const communityRef = await addDoc(collection(db, 'communities'), {
      communityName,
      communityLogo,
      communitySidebar,
      creationDate: unixTimestamp
    })

    res.send(communityRef.id);
  }
}