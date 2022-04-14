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
import { memberSchema, PATROLS } from '../models/members.model';

export default function NewMemberDialog(props) {
  const {
    member,
    open,
    onUpdate,
    handleClose
  } = props;

  async function handleSubmit(values) {
    console.log('submitting', { values });

    // if the member already exists updated it, otherwise create it
    let data, error;
    if (values.id) {
      ({ data, error } = await MembersAPI.update(values));
    } else {
      ({ data, error } = await MembersAPI.add(values));
    }

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  const initialValues = member || {
    name: '',
    patrol: 'Foxes',
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Member</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={memberSchema}
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
                  {PATROLS.map((patrol) => (
                    <MenuItem value={patrol} key={patrol}>{patrol}</MenuItem>
                  ))}
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
