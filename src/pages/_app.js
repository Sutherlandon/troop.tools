import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CircularProgress, ThemeProvider } from '@mui/material';

import MinimalLayout from '@client/components/Layouts/MinimalLayout';
import { theme } from '@client/components/CustomTheme';

import '@client/styles.css';

export default function MyApp({ Component, pageProps }) {
  const {
    // session only available if passed in from getServerSideProps, otherwise
    // SessionProvider seems to be getting it all by itself clientside
    // session,
    ...rest
  } = pageProps;

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

  return (
    <>
      <Head>
        <link rel='icon' type='image/png' size='32x32' href='/img/app-icon-32.png' />
        <link rel='icon' type='image/png' size='16x16' href='/img/app-icon-16.png' />
        <link rel='shortcut icon' type='image/png' href='/img/app-icon-32.png' />
        <link rel='apple-touch-icon' sizes='192x192' href='/img/app-icon-192.png' />
        <meta
          name='description'
          content='An attendance and reporting tool for Trail Life USA'
        />
        <title>{session?.user?.troop || 'Troop.Tools'}</title>
      </Head>
      <SessionProvider session={session}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {Component.auth
              ? <Auth><Component {...rest} /></Auth>
              : <Component {...rest} />
            }
          </ThemeProvider>
        </LocalizationProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  // a session returning "unauthenticated" will client side navigate to /api/auth/signin
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return (
      <MinimalLayout>
        <CircularProgress />
      </MinimalLayout>
    );
  }

  return children;
}
