import { signIn } from 'next-auth/react';

import { Router, Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
} from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

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
          onSubmit={(event) => handleSubmit(event)}
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
