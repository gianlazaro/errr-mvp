import '../styles/globals.css'
import Layout from '../components/layout'
import { AuthContextProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  router.events?.on('routeChangeStart', ()=>(
    <div className="loading_icon"></div>
  ))
  return (
    <AuthContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  )
}

export default MyApp
