import Router from 'next/router';
import { Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
} from '@mui/material';

import magic from '../config/magic-sdk';
import UserContext from '../config/UserContext';
import * as UserAPI from '../client_api/UserAPI';

function LoginForm(props) {
  const [email, setEmail] = useState('sutherlandon@gmail.com');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useContext(UserContext);

  // Redirect to / if the user is logged in
  useEffect(() => {
    user?.issuer && Router.push('/');
  }, [user]);

  async function handleLoginWithEmail(email) {
    setLoading(true);

    // Trigger Magic link to be sent to user
    const didToken = await magic.auth.loginWithMagicLink({
      email,
      // redirectURI: new URL('/callback', window.location.origin).href // optional redirect back to your app after magic link is clicked
    });

    // -- Below here runs AFTER the magic link is clicked --

    // Validate didToken with server
    const res = await UserAPI.login(didToken);

    // Set the UserContext to the now logged in user
    if (res.status === 200) {
      const magicMetadata = await magic.user.getMetadata();
      const { data, error } = await UserAPI.get(magicMetadata.issuer);

      if (error === 'USER_NOT_FOUND') {
        return Router.push('/onboarding');
      } else if (error) {
        setLoading(false);
        return console.error(error);
      }

      await setUser(data);
      Router.push('/');
    }

    setLoading(false);
  }

  return (
    <Dialog open={true} fullWidth sx={{ maxWidth: 800 }}>
      <DialogTitle sx={{
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        Welcome
      </DialogTitle>
      <DialogContent>
        <form
          style={{ marginTop: 8 }}
          onSubmit={(event) => {
            event.preventDefault();
            handleLoginWithEmail(email);
          }}
        >
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              label='Email Address'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              placeholder='email@example.com'
              type='email'
              value={email}
            />
          </FormControl>
          <LoadingButton
            endIcon={<Send />}
            loadingPosition='end'
            loading={loading}
            fullWidth
            variant='contained'
            type='submit'
            sx={{ textTransform: 'none' }}
          >
            Login / Sign up
          </LoadingButton>
        </form>

      </DialogContent>
    </Dialog>
  );
}

export default LoginForm;
