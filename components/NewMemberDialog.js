// import { format } from 'date-fns';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form } from 'formik';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';

import Select from './formikMui/Select';
import TextField from './formikMui/TextField';
import * as yup from 'yup';
import * as MembersAPI from '../api/MembersAPI';
import { PATROLS } from '../config/constants';

const memberSchema = yup.object({
  id: yup.string(),
  name: yup.string().required('This field cannot be left blank'),
  patrol: yup.string().oneOf(PATROLS).required('This field cannot be left blank'),
});

export default function NewMemberDialog(props) {
  const {
    member,
    open,
    onUpdate,
    handleClose,
  } = props;

  async function handleSubmit(values) {
    console.log('submitting', { values });

    // if the member already exists updated it, otherwise create it
    let data, error;
    if (values._id) {
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
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Member</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={memberSchema}
        >
          {({ values, isSubmitting }) => {
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
                <Box sx={{ textAlign: 'center' }}>
                  <LoadingButton
                    loading={isSubmitting}
                    loadingPosition='start'
                    type='submit'
                    startIcon={<SaveIcon />}
                    variant='contained'
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
