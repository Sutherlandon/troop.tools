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

export default function NewMemberDialog(props) {
  const { open, onUpdate, handleClose } = props;

  async function handleSubmit(values) {
    console.log('submitting', { values });

    const { data, error } = await ScheduleAPI.add(values);

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Member</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={{
            branch: 'Heritage',
            type: 'Core',
            date: '',
            name: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => {
            return (
              <Form style={{ paddingTop: 16 }}>
                <Select
                  label='Branch'
                  name='branch'
                >
                  <MenuItem value='Heritage'>Heritage</MenuItem>
                  <MenuItem value='Hobbies'>Hobbies</MenuItem>
                  <MenuItem value='Life Skills'>Life Skills</MenuItem>
                  <MenuItem value='Outdoor Skills'>Outdoor Activities</MenuItem>
                  <MenuItem value='Science/Tech'>Science/Tech</MenuItem>
                  <MenuItem value='Sports/Fitness'>Sports/Fitness</MenuItem>
                  <MenuItem value='Values'>Values</MenuItem>
                </Select>
                <Select
                  label='Type'
                  name='type'
                >
                  <MenuItem value='Core'>Core</MenuItem>
                  <MenuItem value='Elective'>Elective</MenuItem>
                  <MenuItem value='HTT'>HTT</MenuItem>
                </Select>
                <TextField
                  label='Date'
                  name='date'
                />
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
