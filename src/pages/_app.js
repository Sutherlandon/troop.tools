import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, ThemeProvider } from '@mui/material';

import AppBar from '@client/components/AppBar';
import { theme } from '@client/components/CustomTheme';

import '@client/styles.css';

export default function MyApp({ Component, pageProps }) {
  const { session } = pageProps;

  return (
    <>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' type='image/png' size='32x32' href='/img/app-icon-32.png' />
        <link rel='icon' type='image/png' size='16x16' href='/img/app-icon-16.png' />
        <link rel='shortcut icon' type='image/png' href='/img/app-icon-32.png' />
        <link rel='apple-touch-icon' sizes='192x192' href='/img/app-icon-192.png' />
        <meta
          name='description'
          content='An attendance and reporting tool for Trail Life USA'
        />
        <title>{session.data?.user?.troop || 'Troop.Tools'}</title>
      </Head>
      <SessionProvider session={session}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar />
            <Box component='main' sx={{
              backgroundColor: theme.palette.light.main,
              padding: 4,
              marginLeft: { xs: 0, sm: '240px' /* drawer width */ },
              marginTop: 7
            }}>
              <Component {...pageProps} />
            </Box>
          </ThemeProvider>
        </LocalizationProvider>
      </SessionProvider>
    </>
  );
}
