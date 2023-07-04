// TODO: add expading animation to opening an event.
// TODO: add notistack for form feedback

import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSession } from 'next-auth/react';
import { Fragment, useEffect, useState } from 'react';
import {
  Alert,
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
  Select,
  MenuItem,
} from '@mui/material';

import * as EventsAPI from '@client/api/EventsAPI';
import * as MembersAPI from '@client/api/MembersAPI';
import AttendanceFormDialog from '@client/components/AttendanceFormDialog';
import EventDetails from '@client/components/EventDetails';
import EventFormDialog from '@client/components/EventFormDialog';
import PageLayout from '@client/components/Layouts/PageLayout';
import Tag from '@client/components/Tag';
import WelcomeMessage from '@client/components/WelcomeMessage';
import { BRANCH_COLORS } from '@shared/constants';

export default function SchedulePage() {
  const [attInfo, setAttInfo] = useState({ open: false });
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [events, setSchedule] = useState([]);
  const [members, setMembers] = useState([]);
  const [year, setYear] = useState(String(dayjs().year()));
  const [yearOptions, setYearOptions] = useState(['2021', '2022', '2023', '2024']);
  const [showDetails, setShowDetails] = useState();
  const { data: user } = useSession({ required: true });

  useEffect(() => {
    async function loadSchedule() {
      const { data: schedule, error: scheduleErr } = await EventsAPI.get(year);
      const { data: members, error: memberErr } = await MembersAPI.getAll();

      if (scheduleErr || memberErr) {
        return console.error(scheduleErr || memberErr);
      }

      console.log(schedule);

      setMembers(members);
      setSchedule(schedule.events);
      setYearOptions(schedule.years);
      setLoading(false);
    }

    loadSchedule();
  }, [year]);

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
    if (confirm(`Are you sure you want to delete ${event.title || event.lesson.name} from ${year}`)) {
      const { data, error } = await EventsAPI.remove(event);

      if (error) {
        return console.error(error);
      }

      setSchedule(data.events);
    }
  }

  async function handleYearChange(event) {
    setLoading(true);
    setYear(event.target.value);
  }

  if (!user.isParent) {
    return (
      <WelcomeMessage user={user} />
    );
  }

  return (
    <PageLayout>
      <Grid
        container
        spacing={2}
        alignItems='center'
        sx={{ marginBottom: 2 }}
      >
        <Grid item>
          <Typography variant='h5'>
            Schedule
          </Typography>
        </Grid>
        <Grid item>
          <Select
            value={year}
            onChange={handleYearChange}
            size='small'
          >
            {yearOptions.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}
          </Select>
        </Grid>
        <Grid item sx={{ flexGrow: 1 }} />
        {user.isAdmin &&
          <Grid item>
            <Button
              color='secondary'
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
        onUpdate={(updatedSchedule, year) => {
          setSchedule(updatedSchedule.events);
          setYearOptions(updatedSchedule.years);
          setYear(year);
        }}
      />
      <EventFormDialog
        {...editInfo}
        handleClose={() => setEditInfo({ open: false })}
        onUpdate={(updatedSchedule, year) => {
          setSchedule(updatedSchedule.events);
          setYearOptions(updatedSchedule.years);
          setYear(year);
        }}
      />
      <AttendanceFormDialog
        {...attInfo}
        handleClose={() => setAttInfo({ open: false })}
        members={members}
        onSubmit={(updatedSchedule) => {
          setSchedule(updatedSchedule.events);
          setAttInfo({ open: false });
        }}
        eventsList={events}
      />
      {loading
        ? <LinearProgress />
        : events.length === 0
          ? <Alert variant='standard' severity='info'>
            You do not have any events yet. Use the +Add button to create some.
          </Alert>
          : <Paper sx={{ mb: 2 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 4 }}>Date</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell></TableCell>
                </TableRow >
              </TableHead >
              <TableBody>
                {events.map((event, index) => {
                  const expanded = showDetails === index;
                  const highlight = event.lesson?.type === 'htt' ||
                    ['Camp', 'Day Hike', 'Award', 'Fundraiser'].includes(event.branch);

                  const branchColor = BRANCH_COLORS[event.branch]?.b;
                  const branchText = BRANCH_COLORS[event.branch]?.t;
                  const borderColor = '#464646';
                  const displayDate = dayjs(event.date).format('MM/DD');

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
                            : <Tag text={displayDate} variant={event.branch} />
                          }
                        </TableCell>
                        <TableCell>{event.title || event.lesson?.name}</TableCell>
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
    </PageLayout>
  );
}

SchedulePage.auth = true;
