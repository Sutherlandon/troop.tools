import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Tab,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  TabContext,
  TabList,
  TabPanel,
} from '@mui/lab'

import AttendanceForm from '../components/AttendanceForm';
import * as ScheduleAPI from '../api/ScheduleAPI';
import * as MembersAPI from '../api/MembersAPI';
import AttendanceView from '../components/AttendanceView';
import { PATROLS } from '../models/members.model';

function Attendence(props) {
  const [focusedTab, setFocusedTab] = useState('1');
  const [members, setMembers] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [members, schedule] = await Promise.all([
        MembersAPI.get(),
        ScheduleAPI.get(),
      ]);

      if (schedule.error || members.error) {
        return console.error({
          eventsError: schedule.error,
          membersError: members.error
        });
      }

      setMembers(members.data);
      setSchedule(schedule.data);
      setLoading(false);
    }

    loadData();
  }, []);

  async function handleSubmit(values, formik) {
    const { eventIndex, ...rest } = values
    const { name, date } = schedule[eventIndex];

    const formData = {
      event: { name, date },
      ...rest
    };

    console.log('data submitted', formData);

    const { data, error } = await ScheduleAPI.attendance(formData);

    if (error) {
      return console.log(error);
    }

    setSchedule(data);
    formik.resetForm();
  }

  return (
    <div>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            Troop Attendance
          </Typography>
        </Grid>
      </Grid>
      {
        loading ? (
          <LinearProgress />
        ) : (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={focusedTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={(e, newTab) => setFocusedTab(newTab)}
                  aria-label='Attendence Tabs'
                  variant='fullWidth'
                >
                  <Tab label='Form' value='1' />
                  <Tab label='View' value='2' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                <AttendanceForm
                  handleSubmit={handleSubmit}
                  members={members}
                  schedule={schedule}
                />
              </TabPanel>
              <TabPanel value='2'>
                <AttendanceView
                  members={members}
                  schedule={schedule}
                />
              </TabPanel>
            </TabContext>
          </Box>
        )
      }
    </div>
  );
}

export default Attendence;
