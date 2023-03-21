import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

import AppBar from '../AppBar';

export default function PageLayout({ children, noMaxWidth }) {
  const theme = useTheme();

  return (
    <>
      <AppBar />
      <Box component='main' sx={{
        backgroundColor: theme.palette.light.main,
        padding: { xs: 2, md: 4 },
        marginLeft: { xs: 0, sm: '240px' /* drawer width */ },
        marginTop: 7
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
