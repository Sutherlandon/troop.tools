import Router from 'next/router';
import { useEffect } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { getSession } from 'next-auth/react';
import MinimalLayout from '@client/components/Layouts/MinimalLayout';

export default function LoadingPage() {
  useEffect(() => {
    async function checkSession() {
      // const session = await getSession();

      const session = {
        email: 'demo@troop.tools',
        firstName: 'Landon',
        lastName: 'Sutherland',
        roles: {
          admin: true
        },
        troop: 'DM-1234',
        isAdmin: true,
        isParent: true,
        isTrailGuide: true,
      };

      if (session) {
        console.log('session found, redirecting to schedule');
        return Router.push('/schedule');
      }

      console.log('session NOT found, redirecting to signin');
      return Router.push('/api/auth/signin');
    }

    checkSession();
  }, []);

  return (
    <MinimalLayout>
      <Typography variant='body1'>
        <CircularProgress />
      </Typography>
    </MinimalLayout>
  );
}
