import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import { useEffect, useState } from 'react';

import AppBar from '@client/components/AppBar';
import UserContext from '@client/components/UserContext';
import magic from '@client/config/magic-sdk';
import * as UserAPI from '@client/api/UserAPI';
import { LocalizationProvider } from '@mui/lab';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ loading: true });
  const [session, setSession] = useState();

  // If session is valid, set the UserContext with user data
  // Otherwise, redirect to /api/auth/signin and set UserContext to { user: null }
  useEffect(() => {
    async function fetchSession() {
      const { data: session, error } = await UserAPI.getSession();

      if (error) {
        return console.error(error);
      }

      // if no session exists, redirect to sign in.
      if (!session) {
        setSession({});
        return Router.push('/api/auth/signin');
      }

      setSession(session);
      setUser(session.user);
    }

    fetchSession();
  }, []);

  // useEffect(() => {
  //   async function checkUser() {
  //     const isLoggedIn = await magic.user.isLoggedIn();

  //     // if logged in with magic
  //     if (!isLoggedIn) {
  //       setUser({});
  //       return Router.push('/app/login');
  //     }

  //     if (!user.issuer) {
  //       const magicMetaData = await magic.user.getMetadata();

  //       // get the user from the DB
  //       const { data, error } = await UserAPI.get(magicMetaData.issuer);

  //       if (error) {
  //         return console.error(error);
  //       }

  //       // if the user doesn't have a name, finish the onboarding
  //       if (!data.firstName || !data.lastName) {
  //         Router.push('/app/onboarding');
  //       }

  //       setUser(data);
  //     }
  //   }

  //   checkUser();
  // }, [user.issuer]);

  if (user.loading) {
    return <h3>Logging you in...</h3>;
  }

  return (
    <SessionProvider session={session}>
      <UserContext.Provider value={[user, setUser]}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <CssBaseline />
          <AppBar />
          <main style={{
            padding: 16,
            margin: 'auto',
          }}>
            <Component {...pageProps} />
          </main>
        </LocalizationProvider>
      </UserContext.Provider>
    </SessionProvider>
  );
}
