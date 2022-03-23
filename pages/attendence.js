import { useState } from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import Select from '../components/formikMui/Select';

import * as Members from '../data/membersData';
import * as Events from '../data/eventsData';


function Attendence({ members, schedule }) {
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

  function handleSubmit(values) {
    // todo
  }

  return (
    <Formik
      initialValues={{
        event: '',
        patrol: '',
        members: {},
      }}
      handleSubmit={handleSubmit}
    >
      {({ values }) => {
        console.log('Values', values);

        return (
          <Form>
            <Select
              label='Select an Event'
              name='event'
            >
              {schedule.map((event, index) => (
                <MenuItem value={index} key={index}>
                  {`${event.date} - ${event.name}`}
                </MenuItem>
              ))}
            </Select>
            <Select
              label='Select a Patrol'
              name='patrol'
            >
              <MenuItem value='fox'>Foxes</MenuItem>
              <MenuItem value='hawk'>Hawks</MenuItem>
              <MenuItem value='lion'>Mountain Lions</MenuItem>
              <MenuItem value='navigator'>Navigators</MenuItem>
              <MenuItem value='adventurer'>Adventurers</MenuItem>
            </Select>
            {values.patrol &&
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
                      .filter(member => member.patrol === values.patrol)
                      .map(member => {
                        const isItemChecked = isSelected(member.name);
                        console.log({ name: member.name, isItemChecked });

                        return (
                          <TableRow
                            hover
                            onClick={() => toggleSelection(member.name)}
                            role='checkbox'
                            key={member.name}
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
          </Form>
        );
      }}
    </Formik>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      members: await Members.getAll(),
      schedule: await Events.getAll(),
    }
  };
}

export default Attendence;
