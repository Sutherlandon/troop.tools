import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './AppBar';

export default function Layout({ children }) {
  return (
    <>
      <CssBaseline />
      <AppBar />
      <main style={{ padding: 16 }}>
        {children}
      </main>
    </>
  );
}
