import { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Router from 'next/router';
import Link from 'next/link';
import { Logout, AccountCircle, CalendarMonth, People, BarChart } from '@mui/icons-material';

import { signOut } from 'next-auth/react';
import UserContext from './UserContext';
import useRoles from '@client/hooks/useRoles';

const drawerWidth = 240;

function MenuItem({ icon, text, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

function ResponsiveDrawer(props) {
  const [user] = useContext(UserContext);
  const { isTrailGuide } = useRoles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ cursor: 'pointer' }}>
            Menu
          </Typography>
      </Toolbar>
      <Divider />
      <List>
        <MenuItem
          icon={<CalendarMonth />}
          text='Schedule'
          onClick={() => Router.push('/app')}
        />
        {isTrailGuide &&
          <MenuItem
            icon={<People />}
            text='Members'
            onClick={() => Router.push('/app/members')}
          />
        }
        <MenuItem
          icon={<BarChart />}
          text='Missing Report'
          onClick={() => Router.push('/app/reports/missing')}
        />
        <MenuItem
          icon={<Logout />}
          text='Logout'
          onClick={() => signOut()}
        />
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Link href='/' passHref>
            <Typography variant='h6' component='div' sx={{ cursor: 'pointer' }}>
              Troop.Tools
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {user?.firstName &&
            <>
              <Box sx={{ mr: 1, pt: '6px' }}>
                <AccountCircle />
              </Box>
              <Typography variant='h6' component='div'>
                {user.firstName}
              </Typography>
            </>
          }
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box >
  );
}

export default ResponsiveDrawer;
