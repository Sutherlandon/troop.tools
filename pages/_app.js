import CssBaseline from '@mui/material/CssBaseline';
import Router from 'next/router';
import { useEffect, useState } from 'react';

import AppBar from '../components/AppBar';
import UserContext from '../config/UserContext';
import magic from '../config/magic-sdk';
import * as UserAPI from '../client_api/UserAPI';
import { LocalizationProvider } from '@mui/lab';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ loading: true });

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    async function checkUser() {
      const isLoggedIn = await magic.user.isLoggedIn();

      // if logged in with magic
      if (!isLoggedIn) {
        setUser({});
        return Router.push('/login');
      }

      if (!user.issuer) {
        const magicMetaData = await magic.user.getMetadata();

        // get the user from the DB
        const { data, error } = await UserAPI.get(magicMetaData.issuer);

        if (error) {
          return console.error(error);
        }

        // if the user doesn't have a name, finish the onboarding
        if (!data.firstName || !data.lastName) {
          Router.push('/onboarding');
        }

        setUser(data);
      }
    }

    checkUser();
  }, [user.issuer]);

  if (user.loading) {
    return <h3>Logging you in...</h3>;
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <AppBar />
        <main style={{
          padding: 16,
          margin: 'auto',
        }}>
          <Component {...pageProps} />
        </main>
      </LocalizationProvider>
    </UserContext.Provider>
  );
}
