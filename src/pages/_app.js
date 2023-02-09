import CssBaseline from '@mui/material/CssBaseline';
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
  );
}
