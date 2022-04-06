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

import NewEventDialog from '../components/NewEventDialog';
import * as ScheduleAPI from '../api/ScheduleAPI';
import * as Schedule from '../models/schedule.model';

function SchedulePage({ data }) {
  const [newOpen, setNewOpen] = useState(false);
  const [schedule, setSchedule] = useState(data);

  // Handle removing a member from the list
  async function handleRemove(event) {
    if (confirm(`Are you sure you want to delete ${event.name}`)) {
      const { data, error } = await ScheduleAPI.remove(event);

      if (error) {
        return console.error(error);
      }

      setSchedule(data);
    }
  }
  
  return (
    <div>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            Troop Schedule
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
      <NewEventDialog
        open={newOpen}
        onUpdate={(updatedSchedule) => setSchedule(updatedSchedule)}
        handleClose={() => setNewOpen(false)}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map(event => (
              <TableRow key={event.name + event.date}>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.branch}</TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>
                  <IconButton
                    color='error'
                    onClick={() => handleRemove(event)}
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
  const data = await Schedule.getAll();
  return { props: { data } };
}

export default SchedulePage;
