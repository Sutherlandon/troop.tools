import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Divider,
  Link,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuList,
} from '@mui/material';
import {
  BarChart,
  Check,
  DeleteForever,
  Edit as EditIcon,
} from '@mui/icons-material';

import MemberAdvFormDialog from './MemberAdvFormDialog';
import MemberFormDialog from './MemberFormDialog';
import MemberDeleteDialog from './MemberDeleteDialog';
import { useMember } from './MemberContext';

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
      <MenuItem icon={icon} text={text} />
    </Link>
  );
}

export default function MemberSubmenu(props) {
  const { onClick } = props;
  const { data: user } = useSession();
  const { member, setMember } = useMember();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);

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
        {`${member.firstName} ${member.lastName}`}
      </Box>
      <MenuList>
        <MenuItemLink
          href={`/members/profile?id=${member._id}`}
          icon={<BarChart />}
          text='Adv. Report'
          onClick={onClick}
        />
        <MenuItem
          icon={<Check />}
          text='Track Adv.'
          onClick={() => {
            setAdvOpen(true);
            onClick();
          }}
        />
        <MenuItem
          icon={<EditIcon />}
          text='Edit Profile'
          onClick={() => {
            setEditOpen(true);
            onClick();
          }}
        />
        {user.isAdmin &&
          <MenuItem
            icon={<DeleteForever sx={{ color: 'red' }} />}
            text='Delete Member'
          onClick={() => {
            setDeleteOpen(true);
            onClick();
          }}
          />
        }
      </MenuList>
      <MemberFormDialog
        open={editOpen}
        onUpdate={(updatedMember) => setMember(updatedMember)}
        handleClose={() => setEditOpen(false)}
        member={member}
      />
      <MemberDeleteDialog
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        member={member}
      />
      <MemberAdvFormDialog
        open={advOpen}
        onUpdate={(updatedMember) => setMember(updatedMember)}
        handleClose={() => setAdvOpen(false)}
        member={member}
      />
    </Box>
  );
}
