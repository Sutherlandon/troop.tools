// TODO: add expading animation to opening an event.
// TODO: add notistack for form feedback
// import { getServerSession } from 'next-auth';
// import { authOptions } from 'pages/api/auth/[...nextauth]';

import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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

import * as EventsAPI from '@client/api/EventsAPI';
import * as MembersAPI from '@client/api/MembersAPI';
import AccessDenied from '@client/components/AccessDenied';
import AttendanceFormDialog from '@client/components/AttendanceFormDialog';
import EventDetails from '@client/components/EventDetails';
import EventFormDialog from '@client/components/EventFormDialog';
import PageLayout from '@client/components/Layouts/PageLayout';
import Tag from '@client/components/Tag';
import serverCheckSession from 'lib/serverCheckSession';
import useUser from '@client/hooks/useUser';
import { BRANCH_COLORS } from '@shared/constants';

export default function SchedulePage() {
  const [attInfo, setAttInfo] = useState({ open: false });
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [events, setSchedule] = useState([]);
  const [members, setMembers] = useState([]);
  const [showDetails, setShowDetails] = useState();
  const user = useUser();

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

  if (!user.isParent) {
    return (
      <AccessDenied>
        You have not been granted access to the schedule. Please
        contact your Troop Master and ask them to grant you the <b>Parent</b> role.
      </AccessDenied>
    );
  }

  return (
    <PageLayout>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            Schedule 2023
          </Typography>
        </Grid>
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
    </PageLayout>
  );
}

export async function getServerSideProps({ req, res }) {
  const props = await serverCheckSession(req, res);
  return props;
}
