import Router from 'next/router';
import { useEffect, useState } from 'react';

import Layout from '../components/layout'
import UserContext from '../config/UserContext';
import magic from '../config/magic-sdk';
import * as UserAPI from '../api/UserAPI';

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    async function checkUser() {
      setUser({ loading: true });

      const isLoggedIn = await magic.user.isLoggedIn();

      // if logged in with magic
      if (isLoggedIn && !user?.issuer) {
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

      } else {
        Router.push('/login');
        setUser({ user: null });
      }
    }

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  )
}