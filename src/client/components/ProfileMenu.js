import { useState } from 'react';
import {
  ArrowDropDown,
  ArrowDropUp,
  Check,
  DeleteForever,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from '@mui/material';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Button
        id="profile-menu-button"
        aria-controls={open ? 'profile-menu-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={() => setOpen(!open)}
        variant='contained'
        sx={{ width: 200 }}
      >
        Actions
        {open
          ? <ArrowDropUp />
          : <ArrowDropDown />
        }
      </Button>
      <Paper
        sx={{
          width: 200,
          display: open ? 'block' : 'none',
          margin: 'auto',
          position: 'fixed',
          left: {
            xs: '16px',
            md: '256px'
          }
        }}>
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: 'left' }}>
              Edit
            </ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Check />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: 'left' }}>
              Track Adv.
            </ListItemText>
          </MenuItem>
          <MenuItem sx={{ color: 'red' }}>
            <ListItemIcon>
              <DeleteForever sx={{ color: 'red' }} />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: 'left' }}>
              Delete
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </Box>
  );
}
