import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';
import {
  BarChart,
  CalendarMonth,
  Logout,
  Menu,
  People,
  SupervisedUserCircle
} from '@mui/icons-material';

import logoLight from '@shared/images/brand/Logo-light.png';

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

function MenuItemLink({ href, icon, onClick, text }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      passHref
      style={{ textDecoration: 'none', color: '#000' }}
    >
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export default function AppMenu(props) {
  const { handleDrawerToggle } = props;
  const { data: user } = useSession();

  return (
    <Box>
      <Toolbar
        sx={(theme) => ({
          background: theme.palette.primary.main,
          color: 'white',
        })}
      >
        <Box sx={{ mr: 2 }}>
          <Image
            src={logoLight}
            alt='troop.tools logo'
            height={30}
            width={30}
          />
        </Box>
        <Typography variant='h6' component='div' sx={{ cursor: 'pointer' }}>
          Troop.Tools
        </Typography>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ ml: 2, display: { sm: 'none' } }}
        >
          <Menu />
        </IconButton>
      </Toolbar>
      <Box sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <List>
          {user.isParent &&
            <MenuItemLink
              icon={<CalendarMonth />}
              onClick={handleDrawerToggle}
              text='Schedule'
              href='/schedule'
            />
          }
          {user.isTrailGuide &&
            <MenuItemLink
              icon={<People />}
              onClick={handleDrawerToggle}
              text='Members'
              href='/members'
            />
          }
          {user.isTrailGuide && user.troop === 'NM-1412' &&
            <MenuItemLink
              icon={<BarChart />}
              onClick={handleDrawerToggle}
              text='Missing Report'
              href='/reports/missing'
            />
          }
          {user.isAdmin &&
            <MenuItemLink
              icon={<SupervisedUserCircle />}
              onClick={handleDrawerToggle}
              text='Users'
              href='/admin/users'
            />
          }
          <MenuItem
            icon={<Logout />}
            text='Logout'
            onClick={() => signOut()}
          />
        </List>
        <Divider />
        {user?.firstName &&
          <Typography variant='body1' component='div' sx={{ p: 1, textAlign: 'center' }}>
            {user.firstName} signed in
          </Typography>
        }
        <Divider />
      </Box>
    </Box>
  );
}
