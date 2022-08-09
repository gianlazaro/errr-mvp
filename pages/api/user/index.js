// import {getDoc, doc, getDocs} from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db, auth } from '../../../config/firebase';

// export default async function isUserInTheRightCommunity(req, res) {
//   // compare user community (user table) to current community
//   // return true or false
//   const {communityId, userId} = req.query;
//   if(req.method === 'GET') {
//     const userRef = doc(db, 'users', userId);
//     const user = await getDoc(userRef);

//     const comRef = user.data().communities;
//     const communities = await getDocs(comRef);

//     let ans = false;

//     communities.forEach(com=>console.log(com));

//     // const q = query(comRef, where("", "array-contains", communityId))

//     res.send(user.data().communities.includes(communityId));
//   }
// }