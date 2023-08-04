import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MenuList } from '@mui/material';
import { useSession } from 'next-auth/react';
import {
  BarChart,
  Check,
  DeleteForever,
  Edit as EditIcon,
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

export default function configureMemberSubmenu(id, memberName) {
  function MemberSubmenu(props) {
    const { onClick } = props;
    const { data: user } = useSession();

    // only trailguide and up can see this menu
    if (!user.isTrailGuide) {
      return null;
    }

    return (
      <Box>
        <Divider />
        <Box sx={{
          fontWeight: 'bold',
          pl: 2,
          pt: 2,
        }}>
          {memberName}
        </Box>
        <MenuList>
          <MenuItemLink
            href={`/members/profile?id=${id}`}
            icon={<BarChart />}
            text='Adv. Report'
            onClick={onClick}
          />
          <MenuItem
            icon={<Check />}
            text='Track Adv.'
            onClick={onClick}
          />
          <MenuItem
            icon={<EditIcon />}
            text='Edit Profile'
            onClick={onClick}
          />
          {user.isAdmin &&
            <MenuItem
              icon={<DeleteForever sx={{ color: 'red' }} />}
              text='Delete Member'
              onClick={onClick}
            />
          }
        </MenuList>
      </Box>
    );
  };

  return MemberSubmenu;
}
