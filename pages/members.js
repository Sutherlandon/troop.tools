import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
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
import * as Members from '../models/members.model';

function MembersPage({ data }) {
  const [newOpen, setNewOpen] = useState(false);
  const [members, setMembers] = useState(data);

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
    </div>
  );
}


export async function getServerSideProps() {
  const data = await Members.getAll();
  return { props: { data } };
}

export default MembersPage;
