// import AddIcon from '@mui/icons-material/Add';
import { DeleteForever, Edit, Explore, Lock, Person } from '@mui/icons-material';
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

import * as UsersAPI from '@client/api/UserAPI';
import AccessDenied from '@client/components/AccessDenied';
import PageLayout from '@client/components/Layouts/PageLayout';
import UserFormDialog from '@client/components/UserFormDialog';
import { useSession } from 'next-auth/react';

function RoleIcon({ role }) {
  return {
    admin: <Lock sx={(theme) => ({ color: theme.palette.error.main })} />,
    trailguide: <Explore sx={(theme) => ({ color: theme.palette.secondary.main })} />,
    parent: <Person sx={(theme) => ({ color: theme.palette.dark.main })} />,
  }[role];
};

export default function UsersPage() {
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { data: user } = useSession({ required: true });

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
    setEditInfo({ user, open: true });
  }

  // calls the user api to delete a user
  async function deleteUser(user) {
    const confirmMsg = `Are you sure you want to permanently delete ${user.firstName} (${user.email})?`;
    if (confirm(confirmMsg)) {
      const { error } = await UsersAPI.deleteOne(user._id);
      if (error) {
        return console.error(error);
      }

      // remove the user from the list
      setUsers(users.filter((u) => u._id !== user._id));
    }
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
    <PageLayout>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            {user.troop} Users
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
        : <Paper sx={{ mb: 2 }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={`${user.firstName} ${user.lastName}`}>
                  <TableCell>
                    {user.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : 'New User'
                    }
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
                  <TableCell>
                    {user.roles &&
                      Object.keys(user.roles)
                        .filter((r) => user.roles[r])
                        .map((r) => <RoleIcon key={r} role={r} />)
                    }
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <IconButton
                      onClick={() => openEdit(user)}
                      sx={{ color: 'inherit' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteUser(user)}
                      sx={(theme) => ({ color: theme.palette.error.main })}
                    >
                      <DeleteForever />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      }
      <Grid container spacing={1}>
        <Grid item><RoleIcon role='admin'/></Grid>
        <Grid item>Admin</Grid>
        <Grid item><RoleIcon role='trailguide'/></Grid>
        <Grid item>Trail Guide</Grid>
        <Grid item><RoleIcon role='parent'/></Grid>
        <Grid item>Parent</Grid>
      </Grid>
    </PageLayout>
  );
}

UsersPage.auth = true;
