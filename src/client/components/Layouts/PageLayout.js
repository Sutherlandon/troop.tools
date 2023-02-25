import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

import AppBar from '../AppBar';

export default function PageLayout({ children }) {
  const theme = useTheme();

  return (
    <>
      <AppBar />
      <Box component='main' sx={{
        backgroundColor: theme.palette.light.main,
        padding: 4,
        marginLeft: { xs: 0, sm: '240px' /* drawer width */ },
        marginTop: 7
      }}>
        {children}
      </Box>
    </>
  );
}
