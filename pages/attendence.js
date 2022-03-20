import { useState } from 'react';
import { 
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { getMembers } from '../data/membersData';
import { getEvents } from '../data/eventsData';


function Attendence({ members, schedule }) {
  const [event, setEvent] = useState('');
  const [patrol, setPatrol] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  function isSelected(memberId) {
    return selectedMembers.includes(memberId);
  }

  function toggleSelection(memberId) {
    const index = selectedMembers.indexOf(memberId);
    const newMembers = [...selectedMembers];

    if (index === -1) {
      newMembers.push(memberId);
    } else {
      newMembers.splice(index, 1)
    }

    setSelectedMembers(newMembers);
  }

  function handleSubmit() {
    // todo
  }

  return (
    <form>
      <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }}>
        <InputLabel id='events-selector-label'>Select an Event</InputLabel>
        <Select
          labelId='events-selector-label'
          id='events-selector'
          value={event}
          label='Select an Event'
          onChange={(e) => {
            setEvent(e.target.value);
            setSelectedMembers([]);
          }}
        >
          {schedule.map(event => (
            <MenuItem value={event.id} key={event.id}>
              {`${event.date} - ${event.name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }}>
        <InputLabel id='patrol-selector-label'>Select a Patrol</InputLabel>
        <Select
          labelId='patrol-selector-label'
          id='patrol-selector'
          value={patrol}
          label='Select a Patrol'
          onChange={(e) => {
            setPatrol(e.target.value)
            setSelectedMembers([]);
          }}
        >
          <MenuItem value='fox'>Foxes</MenuItem>
          <MenuItem value='hawk'>Hawks</MenuItem>
          <MenuItem value='lion'>Mountain Lions</MenuItem>
          <MenuItem value='navigator'>Navigators</MenuItem>
          <MenuItem value='adventurer'>Adventurers</MenuItem>
        </Select>
      </FormControl>
      {patrol &&
        <>
          <Table sx={{ marginBottom: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members
                .filter(member => member.patrol === patrol)
                .map(member => {
                  const isItemChecked = isSelected(member.id);
                  console.log({ id: member.id, isItemChecked });

                  return (
                    <TableRow
                      hover
                      onClick={() => toggleSelection(member.id)}
                      role='checkbox'
                      key={member.id}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemChecked}
                        />
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                    </TableRow>
                  );
                })
              }

            </TableBody>
          </Table>
          {event && 
            <Box sx={{ textAlign: 'center' }}>
              <Button
                color='primary'
                type='submit'
                variant='contained'
              >
                Submit
              </Button>
            </Box>
          }
        </>
      }
    </form>
  )

}

export async function getServerSideProps() {
  return {
    props: {
      members: await getMembers(),
      schedule: await getEvents(),
    }
  };
}

export default Attendence;
