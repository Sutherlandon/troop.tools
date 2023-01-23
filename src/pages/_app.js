import CssBaseline from '@mui/material/CssBaseline';
import Router from 'next/router';
import isEmpty from 'lodash.isempty';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

import AppBar from '@client/components/AppBar';
import UserContext from '@client/components/UserContext';
import * as UserAPI from '@client/api/UserAPI';
import { LocalizationProvider } from '@mui/lab';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { ThemeProvider } from '@mui/material';
import { theme } from '@client/components/CustomTheme';

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ loading: true });
  const [session, setSession] = useState();

  // If session is valid, set the UserContext with user data
  // Otherwise, redirect to /api/auth/signin and set UserContext to { user: null }
  useEffect(() => {
    async function fetchSession() {
      const { data: session, error } = await UserAPI.getSession();
      console.log({ session });

      if (error) {
        return console.error(error);
      }

      // if no session exists, redirect to sign in.
      if (isEmpty(session)) {
        setSession({});
        return Router.push('/api/auth/signin');
      }

      // set user so we can use it's context
      setUser(session.user);

      // if the user doesn't have a name, finish the onboarding
      if (!session.user.firstName || !session.user.lastName) {
        return Router.push('/app/onboarding');
      }

      // this may be unneccessary as we only use the user
      setSession(session);
      Router.push('/app');
    }

    fetchSession();
  }, []);

  if (user.loading) {
    return <h3>Checking your session, hang tight...</h3>;
  }

  return (
    <SessionProvider session={session}>
      <UserContext.Provider value={[user, setUser]}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar />
            <main style={{
              padding: 16,
              margin: 'auto',
              marginTop: 56
            }}>
              <Component {...pageProps} />
            </main>
          </ThemeProvider>
        </LocalizationProvider>
      </UserContext.Provider>
    </SessionProvider>
  );
}
