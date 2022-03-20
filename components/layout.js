import { 
  AppBar,
  CssBaseline,
  Typography
} from '@mui/material';

export default function Layout({ children }) {
  return (
    <>
      <CssBaseline />
      <AppBar position='static'>
        <Typography variant='h6' component='div' sx={{ padding: 2 }}>
          TLUSA Troop 1412
        </Typography>
      </AppBar>
      <main style={{ padding: 16 }}>
        {children}
      </main>
    </>
  )
}