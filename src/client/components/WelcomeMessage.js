import Image from 'next/image';
import { Box, Paper, Typography } from '@mui/material';
import PageLayout from './Layouts/PageLayout';
import logoDark from '@shared/images/brand/Logo-dark.png';

export default function WelcomeMessage({ user }) {
  return (
    <PageLayout>
      <Box
        sx={{ textAlign: 'center', mb: 2 }}
      >
        <Image
          src={logoDark}
          alt='troop.tools logo'
          width={200}
          height={200}
        />
      </Box>
      <Paper sx={(theme) => ({
        background: theme.palette.success.main,
        color: theme.palette.light.main,
        textAlign: 'center',
        p: 1,
      })}>
        <Typography variant='h4' sx={{ mb: 1 }}>
          Welcome {user.firstName}
        </Typography>
        <Typography variant='body1'>
          You have successfully created your account and signed in, but you have not
          been granted permission to view the Schedule yet.  Please contact your
          troop master and ask them to grant you the <b>Parent</b> role to get started.
        </Typography>
      </Paper>
    </PageLayout>
  );
}
