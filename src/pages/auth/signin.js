import { signIn, getSession } from 'next-auth/react';
import { Router, Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import {
  TextField,
  FormControl,
  Box,
} from '@mui/material';

import MinimalLayout from '@client/components/Layouts/MinimalLayout';

export default function SignIn() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  // Redirect to Schedule if a valid session exists
  // this prevents use being in a sign in loop if the redirect
  // from the email sends us back here
  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session) {
        return Router.push('/schedule');
      }
    }

    checkSession();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const res = await signIn('email', { email });

    if (res.ok) {
      Router.push(res.url);
    }

    Router.push('/');
  }

  return (
    <MinimalLayout>
      <form
        style={{ marginTop: 8 }}
        onSubmit={(event) => handleSubmit(event)}
      >
        <FormControl sx={{
          display: 'block',
          m: 'auto',
          mb: 2,
          maxWidth: 400,
        }}>
          <TextField
            fullWidth
            label='Email Address'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='email@example.com'
            type='email'
            value={email}
          />
        </FormControl>
        <Box sx={{ textAlign: 'center' }}>
          <LoadingButton
            color='secondary'
            endIcon={<Send />}
            loadingPosition='end'
            loading={loading}
            variant='contained'
            type='submit'
            sx={{ textTransform: 'none' }}
          >
            Login / Sign up
          </LoadingButton>

        </Box>
      </form>
    </MinimalLayout>
  );
}
