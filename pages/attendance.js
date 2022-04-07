import { useState } from 'react';
import {
  Box,
  Tab,
} from '@mui/material';
import {
  TabContext,
  TabList,
  TabPanel,
} from '@mui/lab'

import AttendanceForm from '../components/AttendanceForm';
import * as ScheduleAPI from '../api/ScheduleAPI';
import { getAll as fetchMembers } from '../models/members.model';
import { getAll as fetchEvents } from '../models/schedule.model';
import AttendanceView from '../components/AttendanceView';

const patrols = [
  ['Fox', 'Foxes'],
  ['Hawk', 'Hawks'],
  ['Mountain Lion', 'Mountain Lions'],
  ['Navigator', 'Navigators'],
  ['Adventurer', 'Adventurers'],
];

function Attendence({ members, schedule }) {
  const [focusedTab, setFocusedTab] = useState('2');

  async function handleSubmit(values) {
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
  }

  return (
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
  );
}

export async function getServerSideProps() {
  return {
    props: {
      members: await fetchMembers(),
      schedule: await fetchEvents(),
    }
  };
}

export default Attendence;
