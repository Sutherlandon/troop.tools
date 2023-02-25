import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material';

import { theme } from '@client/components/CustomTheme';

import '@client/styles.css';

export default function MyApp({ Component, pageProps }) {
  const { session, ...rest } = pageProps;

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
            <Component {...rest} />
          </ThemeProvider>
        </LocalizationProvider>
      </SessionProvider>
    </>
  );
}
