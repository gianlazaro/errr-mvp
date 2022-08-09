import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import {useEffect} from 'react';
export default function Home() {
  const router = useRouter();
  const {user} = useAuth();
  console.log(user);
  if(user) {
    router.push(user.currentCommunity.communityName)
    return;
  }

  return (
    <>
    {!user &&
      <div>
        <Head>
          <title>Err - A Question and Answer Platform for Teams</title>
          <meta name="description" content="Get concise answers on projects you are working on!" />
        </Head>

        <main>
          Hello world from err!
        </main>
      </div>
    }
    </>
  )
}
