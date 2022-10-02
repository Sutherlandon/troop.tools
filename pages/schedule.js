// TODO: add expading animation to opening an event.
// TODO: add notistack for form feedback

import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DateTime } from 'luxon';
import { Fragment, useEffect, useState } from 'react';
import {
  Box,
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

import AttendanceFormDialog from '../components/AttendanceFormDialog';
import EventDetails from '../components/EventDetails';
import EventFormDialog from '../components/EventFormDialog';
import Tag from '../components/Tag';
import * as EventsAPI from '../client_api/EventsAPI';
import * as MembersAPI from '../client_api/MembersAPI';
import { BRANCH_COLORS } from '../config/constants';
import useRoles from '../hooks/useRoles';

function SchedulePage() {
  const [attInfo, setAttInfo] = useState({ open: false });
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [events, setSchedule] = useState([]);
  const [members, setMembers] = useState([]);
  const [showDetails, setShowDetails] = useState();
  const { isAdmin, isTrailGuide } = useRoles();

  useEffect(() => {
    async function loadSchedule() {
      const { data: events, error: eventsErr } = await EventsAPI.get();
      const { data: members, error: memberErr } = await MembersAPI.get();

      if (eventsErr || memberErr) {
        return console.error(eventsErr || memberErr);
      }

      setMembers(members);
      setSchedule(events);
      setLoading(false);
    }

    loadSchedule();
  }, []);

  // open the edit form loaded with the event
  function openEdit(event) {
    setEditInfo({ event, open: true });
  }

  // open the attendance form loaded with the event
  function openAttendance(event) {
    setAttInfo({ event, open: true });
  }

  // Handle removing an event from the list
  async function handleRemove(event) {
    if (confirm(`Are you sure you want to delete ${event.title || event.lesson.name}`)) {
      const { data, error } = await EventsAPI.remove(event);

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
            Schedule 2022
          </Typography>
        </Grid>
        {isAdmin &&
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
        }
      </Grid>
      <EventFormDialog
        handleClose={() => setNewOpen(false)}
        open={newOpen}
        onUpdate={(updatedSchedule) => setSchedule(updatedSchedule)}
      />
      <EventFormDialog
        {...editInfo}
        handleClose={() => setEditInfo({ open: false })}
        onUpdate={(updatedSchedule) => setSchedule(updatedSchedule)}
      />
      <AttendanceFormDialog
        {...attInfo}
        handleClose={() => setAttInfo({ open: false })}
        members={members}
        onSubmit={(data) => {
          setSchedule(data);
          setAttInfo({ open: false });
        }}
        eventsList={events}
      />
      {loading
        ? <LinearProgress />
        : <Paper sx={{ mb: 2 }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'left' }}>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell></TableCell>
              </TableRow >
            </TableHead >
            <TableBody>
              {events.map((event, index) => {
                const expanded = showDetails === index;
                const highlight = event.type === 'HTT' ||
                  ['Camp', 'Day Hike', 'Award', 'Fundraiser'].includes(event.branch);

                const branchColor = BRANCH_COLORS[event.lesson.branch]?.b;
                const branchText = BRANCH_COLORS[event.lesson.branch]?.t;
                const borderColor = '#464646';

                const displayDate = DateTime.fromISO(event.date).toFormat('LL/dd');

                return (
                  <Fragment key={event.title + event.date}>
                    <TableRow
                      onClick={() => setShowDetails(index === showDetails ? 'close' : index)}
                      sx={{
                        '& td': {
                          backgroundColor: (expanded || highlight) && branchColor,
                          borderTop: expanded && `2px solid ${borderColor}`,
                          color: (expanded || highlight) && branchText,
                        },
                        '& td:first-of-type': {
                          borderLeft: expanded && `2px solid ${borderColor}`,
                          borderTop: expanded && `2px solid ${borderColor}`,
                        },
                        '& td:last-of-type': {
                          borderRight: expanded && `2px solid ${borderColor}`,
                          borderTopWidth: expanded && `2px solid ${borderColor}`,
                        },
                      }}
                    >
                      <TableCell sx={{ textAlign: 'left' }}>
                        {highlight || expanded
                          ? <Box sx={{ pl: 2 }}>{displayDate}</Box>
                          : <Tag text={displayDate} variant={event.lesson.branch} />
                        }
                      </TableCell>
                      <TableCell>{event.title || event.lesson.name}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        {showDetails === index
                          ? <CloseIcon />
                          : <MoreHorizIcon />
                        }
                      </TableCell>
                    </TableRow>
                    {expanded &&
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{
                            borderWidth: '0 2px 2px',
                            borderStyle: 'solid',
                            borderColor,
                          }}
                        >
                          <EventDetails
                            event={event}
                            onAttendance={() => openAttendance(event)}
                            onEdit={() => openEdit(event)}
                            onDelete={() => handleRemove(event)}
                          />
                        </TableCell>
                      </TableRow>
                    }
                  </Fragment>
                );
              })}
            </TableBody>
          </Table >
        </Paper >
      }
      {isTrailGuide &&
        <Grid container justifyContent='space-around' sx={{ marginBottom: 2 }}>
          <Grid item sx={{ marginBottom: 1 }}>
            <Link href='/members' passHref>
              <Button
                color='secondary'
                variant='contained'
              >
                Members List
              </Button>
            </Link>
          </Grid>
        </Grid>
      }
    </div >
  );
}

export default SchedulePage;
