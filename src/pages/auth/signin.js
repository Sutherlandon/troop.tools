import { Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  TextField,
} from '@mui/material';

import MinimalLayout from '@client/components/Layouts/MinimalLayout';
import { useRouter } from 'next/router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/schedule');
    }
  }, [router, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    await signIn('email', { email, callbackUrl: '/schedule' });
  }

  // we do this when status is authenticated because there is about
  // a 1 second delay between having moved from loading to authenticated
  // before the redirect takes effect.
  if (status === 'loading' || status === 'authenticated') {
    return (
      <MinimalLayout title='Checking Session'>
        <CircularProgress />
      </MinimalLayout>
    );
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
            loading={isSubmitting}
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
