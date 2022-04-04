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
import * as MembersAPI from '../api/MembersAPI';

export default function NewMemberDialog(props) {
  const { open, onUpdate, handleClose } = props;

  async function handleSubmit(values) {
    console.log('submitting', { values });

    const { data, error } = await MembersAPI.add(values);

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
            name: '',
            patrol: 'Foxes',
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => {
            return (
              <Form style={{ paddingTop: 16 }}>
                <TextField
                  label='Name'
                  name='name'
                />
                <Select
                  label='Patrol'
                  name='patrol'
                >
                  <MenuItem value='Fox'>Foxes</MenuItem>
                  <MenuItem value='Hawk'>Hawks</MenuItem>
                  <MenuItem value='Mountian Lion'>Mountain Lions</MenuItem>
                  <MenuItem value='Navigator'>Navigators</MenuItem>
                  <MenuItem value='Adventurer'>Adventurers</MenuItem>
                </Select>
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
