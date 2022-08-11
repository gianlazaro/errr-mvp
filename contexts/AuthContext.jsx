import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInAnonymously, updateProfile } from 'firebase/auth';
import { collection, query, where, doc, getDoc, updateDoc, arrayUnion, setDoc, get } from 'firebase/firestore';
import { db, auth } from '../config/firebase.js';
import { useRouter } from 'next/router';
import getCommunityInfo from '../utils/getCommunityInfo';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [disp, setDisp] = useState('stranger');
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const community = await getCommunityInfo(user);
        setCurrentCommunity(community);
        setUser({
          uid: user.uid,
          displayName: auth.currentUser?.displayName || disp,
          email: user.email,
          currentCommunity: {
            id: community.id,
            communityName: community.communityName
          },
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    })
    return () => unsubscribe();
  }, [auth.currentUser?.displayName]);

  function signIn(username, password) {
    // query users collection for community id
    return signInWithEmailAndPassword(auth, username, password)
      .then(() => router.push('/'))
  }

  async function register(username, password, displayName, communityId, isAdmin) {
    setDisp(displayName);
    const communityRef = doc(db, 'communities', communityId);
    const community = await getDoc(communityRef);

    if (!community.exists()) {
      return new Error("Community does not exist");
    }


    return createUserWithEmailAndPassword(auth, username, password)
      .then(async ({ user: newUser }) => {
        updateProfile(auth.currentUser, {
          displayName
        });

        const userRef = doc(db, 'users', newUser.uid);
        await setDoc(userRef, {
          displayName,
          email: newUser.email,
          communities: arrayUnion(doc(db, 'communities', communityId)),
          notifications: [],
          admin: isAdmin ? communityId : null
        });

        router.push('/');
      });
  }

  async function logout() {
    setUser(null);
    await signOut(auth);
  }


  return (
    <AuthContext.Provider value={{ user, signIn, register, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}
