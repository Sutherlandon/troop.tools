import { signIn } from 'next-auth/react';
import { Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import {
  Box,
  FormControl,
  TextField,
} from '@mui/material';

import MinimalLayout from '@client/components/Layouts/MinimalLayout';

export default function SignIn() {
  const [email, setEmail] = useState('sutherlandon@gmail.com');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    await signIn('email', { email, callbackUrl: '/sessionTest' });
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
