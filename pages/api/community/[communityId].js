import {addDoc, collection, getDoc, doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default async function community(req, res) {
  if(req.method === 'GET') {
    const {communityId} = req.query;

    const community = await getDoc(doc(db, 'communities', communityId));
    res.send({...community.data(), id: community.id});
  }
}