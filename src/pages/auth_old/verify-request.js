import { Typography } from '@mui/material';
import MinimalLayout from '@client/components/Layouts/MinimalLayout';

export default function VerifyRequest() {
  return (
    <MinimalLayout title='Check Your Email'>
      <Typography variant='h6'>
        A sign in link has been sent to your email address.
      </Typography>
    </MinimalLayout>
  );
}
