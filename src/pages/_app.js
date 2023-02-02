import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { ThemeProvider } from '@mui/material';

import AppBar from '@client/components/AppBar';
import { theme } from '@client/components/CustomTheme';

import '@client/styles.css';

export default function MyApp({ Component, pageProps }) {
  const { session } = pageProps;
  console.log('_app', session);

  return (
    <SessionProvider session={session}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar />
          <main style={{
            backgroundColor: theme.palette.light.main,
            padding: 16,
            margin: 'auto',
            marginTop: 56
          }}>
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}
