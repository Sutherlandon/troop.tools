import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import {
  Button,
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

import NewMemberDialog from '../components/NewMemberDialog';
import * as MembersAPI from '../api/MembersAPI';

function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await MembersAPI.getAll();

      if (error) {
        return console.error(error);
      }

      setMembers(data);
      setLoading(false);
    }

    loadMembers();
  })

  // Handle removing a member from the list
  async function handleRemove(member) {
    if (confirm(`Are you sure you want to delete ${member.name}`)) {
      const { data, error } = await MembersAPI.remove(member.id);

      if (error) {
        return console.error(error);
      }

      setMembers(data);
    }
  }

  return (
    <div>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            Troop Members
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color='primary'
            onClick={() => setNewOpen(true)}
            startIcon={<AddIcon />}
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <NewMemberDialog
        open={newOpen}
        onUpdate={(updatedMembers) => setMembers(updatedMembers)}
        handleClose={() => setNewOpen(false)}
      />
      {loading ? (
        <LinearProgress />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Patrol</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map(member => (
                <TableRow key={member.name}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.patrol}</TableCell>
                  <TableCell>
                    <IconButton
                      color='error'
                      onClick={() => handleRemove(member)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  );
}

export default MembersPage;
