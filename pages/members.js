import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
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
import { PATROL_COLORS, PATROL_LOGOS } from '../config/constants';

function MembersPage() {
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await MembersAPI.get();

      if (error) {
        return console.error(error);
      }

      setMembers(data);
      setLoading(false);
    }

    loadMembers();
  }, [])

  // open the edit form loaded with the event at the index
  function openEdit(member) {
    setEditInfo({
      member,
      open: true
    });
  }

  // Handle removing a member from the list
  async function handleRemove(member) {
    if (confirm(`Are you sure you want to delete ${member.name}`)) {
      const { data, error } = await MembersAPI.remove(member._id);

      if (error) {
        return console.error(error);
      }

      setMembers(data);
    }
  }

  // calculate the rows that each logo needs to span
  const membersByPatrol = {};
  members.forEach((member) => {
    if (membersByPatrol[member.patrol]) {
      membersByPatrol[member.patrol].push(member);
    } else {
      membersByPatrol[member.patrol] = [member];
    }
  });


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
      <NewMemberDialog
        {...editInfo}
        handleClose={() => setEditInfo({ open: false })}
        onUpdate={(memberList) => setMembers(memberList)}
      />
      {loading ? (
        <LinearProgress />
      ) : (
        <Paper>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Patrol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(membersByPatrol)
                .map((patrol) => membersByPatrol[patrol]
                  .map((member, index) => (
                    <TableRow
                      key={member.name}
                      sx={{
                        '& td': {
                          backgroundColor: PATROL_COLORS[member.patrol],
                        },
                      }}
                    >
                      {index === 0 &&
                        <TableCell
                          rowSpan={membersByPatrol[patrol].length}
                          sx={{
                            width: 85,
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                          }}
                        >
                          <Image src={PATROL_LOGOS[member.patrol]} alt='Patrol Logo' />
                        </TableCell>
                      }
                      <TableCell>{member.name}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton
                          onClick={() => openEdit(member)}
                          sx={{ 'color': 'inherit' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color='error'
                          onClick={() => handleRemove(member)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  );
}

export default MembersPage;
