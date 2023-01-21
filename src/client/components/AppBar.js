import Link from 'next/link';
import { useContext } from 'react';
import { Logout } from '@mui/icons-material';
import {
  AppBar as MuiAppBar,
  Box,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import { signOut } from 'next-auth/react';
import UserContext from './UserContext';

function AppBar() {
  const [user] = useContext(UserContext);

  return (
      <MuiAppBar position='static'>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Link href='/' passHref>
              <Box sx={{ width: 'fit-content' }}>
                <Typography variant='h6' component='div' sx={{ padding: 2, cursor: 'pointer' }}>
                  Troop Tools
                </Typography>
              </Box>
            </Link>
          </Grid>
          {user?.firstName &&
            <Grid item>
              {user.firstName}
              <IconButton
                onClick={() => signOut()}
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
