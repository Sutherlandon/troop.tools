import Link from 'next/link';
import Router from 'next/router';
import { useContext } from 'react';
import { Logout } from '@mui/icons-material';
import {
  AppBar as MuiAppBar,
  Box,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import magic from '../config/magic-sdk';
import UserContext from '../config/UserContext';

function AppBar() {
  const [user, setUser] = useContext(UserContext);

  /**
   * Logs the user out of the magic session
   */
  function logout() {
    magic.user.logout().then(() => {
      setUser({ user: null });
      Router.push('/login');
    });
  }

  return (
      <MuiAppBar position='static'>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Link href='/' passHref>
              <Box sx={{ width: 'fit-content' }}>
                <Typography variant='h6' component='div' sx={{ padding: 2, cursor: 'pointer' }}>
                  Troop 1412
                </Typography>
              </Box>
            </Link>
          </Grid>
          {user?.issuer &&
            <Grid item>
              {user.firstName}
              <IconButton
                onClick={logout}
                sx={{ color: 'inherit', paddingRight: 2 }}
              >
                <Logout />
              </IconButton>
            </Grid>
          }
        </Grid>
      </MuiAppBar>
  );
}

export default AppBar;
