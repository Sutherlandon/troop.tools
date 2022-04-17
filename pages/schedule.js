// TODO: Create separate dev dbs using tags?

import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Typography,
  LinearProgress,
} from '@mui/material';

import EventDetails from '../components/EventDetails';
import NewEventDialog from '../components/NewEventDialog';
import Tag from '../components/Tag';
import * as ScheduleAPI from '../api/ScheduleAPI';
import { BRANCH_COLORS } from '../models/schedule.model';

function SchedulePage({ data }) {
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [schedule, setSchedule] = useState(data);
  const [showDetails, setShowDetails] = useState();

  useEffect(() => {
    async function loadSchedule() {
      const { data, error } = await ScheduleAPI.get();

      if (error) {
        return console.error(error);
      }

      setSchedule(data);
      setLoading(false);
    }

    loadSchedule();
  }, []);

  // open the edit form loaded with the event at the index
  function openEdit(event, index) {
    setEditInfo({
      event: {
        ...event,
        eventIndex: index
      },
      open: true
    });
  }

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
            Troop Schedule 2022
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
        handleClose={() => setNewOpen(false)}
        open={newOpen}
        onUpdate={(updatedSchedule) => setSchedule(updatedSchedule)}
      />
      <NewEventDialog
        {...editInfo}
        handleClose={() => setEditInfo({ open: false })}
        onUpdate={(updatedSchedule) => setSchedule(updatedSchedule)}
      />
      {loading ? (
        <LinearProgress />
      ) : (
        <Paper>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell></TableCell>
              </TableRow >
            </TableHead >
            <TableBody>
              {schedule.map((event, index) => {
                const highlight = event.type === 'HTT' || ['Camp', 'Award', 'Fundraiser'].includes(event.branch);
                return (
                  <>
                    <TableRow
                      onClick={() => setShowDetails(index === showDetails ? 'close' : index)}
                      key={event.name + event.date}
                      sx={highlight ? {
                        '& td': {
                          backgroundColor: BRANCH_COLORS[event.branch]?.b,
                          color: BRANCH_COLORS[event.branch]?.t,
                        },
                      } : null}
                    >
                      <TableCell sx={{ textAlign: 'center' }}>
                        {highlight
                          ? event.date
                          : <Tag text={event.date} variant={event.branch} />
                        }
                      </TableCell>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>
                        {showDetails === index
                          ? <CloseIcon />
                          : <MoreHorizIcon />
                        }
                      </TableCell>
                    </TableRow>
                    {showDetails === index &&
                      <TableRow>
                        <TableCell colSpan={3}>
                          <EventDetails
                            event={event}
                            onEdit={() => openEdit(event, index)}
                            onDelete={() => handleRemove(event)}
                          />
                        </TableCell>
                      </TableRow>
                    }
                  </>
                );
              })}
            </TableBody>
          </Table >
        </Paper >

      )
      }
    </div >
  );
}



export default SchedulePage;
