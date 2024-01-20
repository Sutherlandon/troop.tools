import Box from '@mui/material/Box';
import { Alert, useTheme } from '@mui/material';

import AppBar from '../AppBar';

export default function PageLayout({ children, noMaxWidth, Submenu }) {
  const theme = useTheme();

  return (
    <>
      <AppBar Submenu={Submenu} />
      <Box component='main' sx={{
        backgroundColor: theme.palette.light.main,
        padding: { xs: 2, md: 4 },
        marginLeft: { xs: 0, md: '240px' /* drawer width */ },
        marginTop: { xs: 7, sm: 8, md: 7 }
      }}>
        <Box sx={{ marginBottom: 2 }}>
          <Alert variant='standard' severity='error'>
              This application was used by my Trail Life troop but is no longer maintained, Therefore the data has been anonamized and
              this app remains active for demonstration and porfolio reasons.  Feel free to look around!
          </Alert>
        </Box>
        <Box sx={{
          ...(!noMaxWidth && {
            maxWidth: 800,
            margin: 'auto',
          })
        }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
