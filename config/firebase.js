import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrDDpVrgvq62ZuJj5-519SL6IlJCsunpw",
  authDomain: "errr-4d783.firebaseapp.com",
  projectId: "errr-4d783",
  storageBucket: "errr-4d783.appspot.com",
  messagingSenderId: "38979838952",
  appId: "1:38979838952:web:fcf348598e058fd9ae7a5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
// connectFirestoreEmulator(db, 'localhost', 8080);
// connectAuthEmulator(auth, "http://localhost:9099");