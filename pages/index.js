import Head from 'next/head'
import styles from '../styles/Home.module.css';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  if (user) {
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
          <main className={styles.mainWrapper}>
            <div className={styles.aboveTheFold}>
              <h1 className={styles.catchline}>Ask. Discover.&nbsp;<span>Learn.</span></h1>
              <div className={styles.buttonsWrapper}>
                <Link href="/createCommunity"><span className={styles.shadow}><a className={styles.commBtn}>Start a Community</a></span></Link>
                <Link href="/register"><span className={styles.shadow}><a className={styles.regisBtn}>Have a Code?</a></span></Link>
              </div>
            </div>

            <div className={styles.overview}>
              <div className={styles.alert}>Here is a demo community code to get you started:
                <input type="textbox" value="oD27ZJLhcBRqvGITJMcF" />
              </div>
            </div>
          </main>
        </div>
      }
    </>
  )
}
