import { 
  AppBar,
  Box,
  CssBaseline,
  Typography
} from '@mui/material';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <CssBaseline />
      <AppBar position='static'>
        <Link href='/' passHref>
          <Box sx={{ width: 'fit-content' }}>
            <Typography variant='h6' component='div' sx={{ padding: 2, cursor: 'pointer' }}>
              Troop 1412
            </Typography>
          </Box>
        </Link>
      </AppBar>
      <main style={{ padding: 16 }}>
        {children}
      </main>
    </>
  )
}