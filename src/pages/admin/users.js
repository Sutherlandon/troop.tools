// import AddIcon from '@mui/icons-material/Add';
import { Edit, Explore, Lock, Person } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import {
  // Button,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';

import UserFormDialog from '@client/components/UserFormDialog';
import * as UsersAPI from '@client/api/UserAPI';
import serverCheckSession from 'lib/serverCheckSession';
import AccessDenied from '@client/components/AccessDenied';
import useUser from '@client/hooks/useUser';

function RoleIcon({ role }) {
  return {
    admin: <Lock sx={(theme) => ({ color: theme.palette.error.main })} />,
    parent: <Person sx={(theme) => ({ color: theme.palette.dark.main })} />,
    trailguide: <Explore sx={(theme) => ({ color: theme.palette.secondary.main })} />,
  }[role];
};

export default function UsersPage() {
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const user = useUser();

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await UsersAPI.get();

      if (error) {
        return console.error(error);
      }

      setUsers(data);
      setLoading(false);
    }

    loadUsers();
  }, []);

  // open the edit form loaded with the event at the index
  function openEdit(user) {
    setEditInfo({
      user,
      open: true,
    });
  }

  if (!user.isAdmin) {
    return (
      <AccessDenied>
        You have not been granted access to the users list. Please
        contact your Troop Master and ask them to grant you the <b>Admin</b> role.
      </AccessDenied>
    );
  }

  return (
    <div>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            {user.troop} App Users
          </Typography>
        </Grid>
        {/* <Grid item>
          <Button
            color='primary'
            onClick={() => setNewOpen(true)}
            startIcon={<AddIcon />}
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          >
            Add
          </Button>
        </Grid> */}
      </Grid>
      <UserFormDialog
        {...editInfo}
        handleClose={() => setEditInfo({ open: false })}
        onUpdate={(userList) => setUsers(userList)}
      />
      {loading
        ? <LinearProgress />
        : <Paper>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={`${user.firstName} ${user.lastName}`}>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{user.email}</TableCell>
                  <TableCell>
                    {user.roles &&
                      Object.keys(user.roles)
                        .filter((r) => user.roles[r])
                        .map((r) => <RoleIcon key={r} role={r} />)
                    }
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      onClick={() => openEdit(user)}
                      sx={{ color: 'inherit' }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      }
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const props = await serverCheckSession(req, res);
  return props;
}
