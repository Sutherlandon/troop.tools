import { useEffect, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import { LinearProgress } from '@mui/material';
import magic from '../config/magic-sdk';
import UserContext from '../config/UserContext';

const Callback = () => {
  const router = useRouter();
  const [, setUser] = useContext(UserContext);

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    async function authenticateWithServer() {
      // get the did token
      const didToken = await magic.auth.loginWithCredential();

      // Send token to server to validate
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
      });

      // Set the UserContext to the now logged in user
      if (res.status === 200) {
        const userMetadata = await magic.user.getMetadata();
        await setUser(userMetadata);
        Router.push('/');
      }
    }

    // authenticate if a credential is present
    if (router.query.magic_credential) {
      authenticateWithServer();
    }
  }, [router.query.magic_credential, setUser]);

  return <LinearProgress />;
};

export default Callback;
