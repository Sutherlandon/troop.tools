// import { format } from 'date-fns';
import { Formik, Form } from 'formik';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';

import Select from './formikMui/Select';
import TextField from './formikMui/TextField';
import * as ScheduleAPI from '../api/ScheduleAPI';
import { BRANCHES, EVENT_TYPES, EventSchema } from '../models/schedule.model';

export default function NewMemberDialog(props) {
  const {
    event,
    open,
    onUpdate,
    handleClose
  } = props;

  async function handleSubmit(values) {
    console.log('submitting', { values });

    // If the event already exists, update it, otherwise add it
    let data, error;
    if (event) {
      ({ data, error } = await ScheduleAPI.update(values));
    } else {
      ({ data, error } = await ScheduleAPI.add(values));
    }

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  const initialValues = event || {
    date: '',
    branch: 'Heritage',
    type: 'Core',
    name: '',
    year: '2022',
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Event</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={EventSchema}
        >
          {({ values }) => {
            return (
              <Form style={{ paddingTop: 16 }}>
                <TextField
                  label='Date'
                  name='date'
                />
                <Select
                  label='Branch'
                  name='branch'
                >
                  {BRANCHES.map((branch) => (
                    <MenuItem value={branch} key={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  label='Type'
                  name='type'
                >
                  {EVENT_TYPES.map((type) => (
                    <MenuItem value={type} key={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label='Name'
                  name='name'
                />
                <div>
                  <Button
                    type='submit'
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
