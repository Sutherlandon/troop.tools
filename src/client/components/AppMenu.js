import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Link from 'next/link';

import useUser from '@client/hooks/useUser';
import { signOut } from 'next-auth/react';
import {
  BarChart,
  CalendarMonth,
  Logout,
  Menu,
  People,
  SupervisedUserCircle
} from '@mui/icons-material';

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

function MenuItemLink({ icon, text, href }) {
  return (
    <Link href={href} passHref style={{ textDecoration: 'none', color: '#000' }}>
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
  const user = useUser();

  return (
    <div>
      <Toolbar sx={(theme) => ({
        background: theme.palette.primary.main,
        color: 'white',
      })}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <Menu />
        </IconButton>
        <Typography variant='h6' component='div' sx={{ cursor: 'pointer' }}>
          Troop.Tools
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {user.isParent &&
          <MenuItemLink
            icon={<CalendarMonth />}
            text='Schedule'
            href='/schedule'
          />
        }
        {user.isTrailGuide &&
          <MenuItemLink
            icon={<People />}
            component={Link}
            text='Members'
            href='/members'
          />
        }
        {user.isTrailGuide &&
          <MenuItemLink
            icon={<BarChart />}
            text='Missing Report'
            href='/reports/missing'
          />
        }
        {user.isAdmin &&
          <MenuItemLink
            icon={<SupervisedUserCircle />}
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
      <Typography variant='body1' component='div' sx={{ pt: 1, pl: 1, pr: 1, textAlign: 'center' }}>
        © Sutherlandon, llc. 2023
      </Typography>
    </div>
  );
}
