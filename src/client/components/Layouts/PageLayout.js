import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

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
