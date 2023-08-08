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

import * as yup from 'yup';
import * as MembersAPI from '@client/api/MembersAPI';
import { PATROLS_ARRAY } from '@shared/constants';
import { Checkbox, Select, TextField } from './formikMui';

const memberSchema = yup.object({
  active: yup.boolean(),
  firstName: yup.string().required('This field cannot be left blank'),
  lastName: yup.string().required('This field cannot be left blank'),
  patrol: yup.string()
    .oneOf(PATROLS_ARRAY.map(patrol => patrol.key))
    .required('This field cannot be left blank'),
});

const blankForm = {
  active: true,
  firstName: '',
  lastName: '',
  patrol: 'foxes',
};

export default function MemberFormDialog(props) {
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

  const initialValues = {
    ...blankForm,
    ...member,
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
            // console.log('VALUES', values);

            return (
              <Form style={{ paddingTop: 16 }}>
                <TextField
                  label='First Name'
                  name='firstName'
                />
                <TextField
                  label='Last Name'
                  name='lastName'
                />
                <Select
                  label='Patrol'
                  name='patrol'
                >
                  {PATROLS_ARRAY.map((patrol) => (
                    <MenuItem value={patrol.key} key={patrol.key}>
                      {patrol.name}
                    </MenuItem>
                  ))}
                </Select>
                <Checkbox
                  label='Active'
                  name='active'
                  formGroupSx={{ width: 'fit-content' }}
                />
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
