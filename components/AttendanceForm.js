import { useState } from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import Select from '../components/formikMui/Select';
import CheckboxRow from '../components/formikMui/CheckboxRow';
import { PATROLS } from '../config/constants';

function Attendence(props) {
  const { members, schedule, handleSubmit } = props;
  let previousPatrol = '';

  return (
    <Box sx={{
      maxWidth: 500,
      mx: 'auto',
    }}>
      <Formik
        initialValues={{
          eventIndex: '',
          patrol: '',
          members: {},
        }}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          // console.log('Values', values);

          // if the patrol changes, clear the members selected
          if (values.patrol !== previousPatrol) {
            previousPatrol = values.patrol;
            values.members = {};
          }

          return (
            <Form>
              <Select
                label='Select an Event'
                name='eventIndex'
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
                {PATROLS.map((name) => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                ))}
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
                        .map((member) => {
                          return (
                            <CheckboxRow
                              groupName='members'
                              name={member.name}
                              key={member.name}
                            />
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      color='primary'
                      type='submit'
                      variant='contained'
                    >
                      Submit
                    </Button>
                  </Box>
                </>
              }
            </Form>
          );
        }}
      </Formik>
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
