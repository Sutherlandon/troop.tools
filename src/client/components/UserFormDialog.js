// import { format } from 'date-fns';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form } from 'formik';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import * as yup from 'yup';
import * as UserAPI from '@client/api/UserAPI';
import { CheckboxGroup, TextField } from './formikMui';
import { USER_ROLES } from '@shared/constants';

const userSchema = yup.object({
  email: yup.string().required('This field cannot be left blank'),
  firstName: yup.string().required('This field cannot be left blank'),
  lastName: yup.string().required('This field cannot be left blank'),
  roles: yup.object()
});

const blankRoles = {};
USER_ROLES.forEach((r) => (blankRoles[r] = false));

const blankForm = {
  firstName: '',
  lastName: '',
  email: '',
  roles: blankRoles,
};

export default function UserFormDialog(props) {
  const {
    user,
    open,
    onUpdate,
    handleClose,
  } = props;

  async function handleSubmit(values) {
    // if the member already exists updated it, otherwise create it
    let data, error;
    if (values._id) {
      ({ data, error } = await UserAPI.update(values));
    } else {
      ({ data, error } = await UserAPI.add(values));
    }

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  const initialValues = {
    ...blankForm,
    ...user,
    roles: {
      ...blankForm.roles,
      ...user?.roles,
    },
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={userSchema}
        >
          {({ values, isSubmitting }) => {
            console.log('VALUES', values);

            return (
              <Form style={{ paddingTop: 16 }}>
                <TextField
                  disabled
                  label='Email'
                  name='email'
                />
                <TextField
                  label='First Name'
                  name='firstName'
                />
                <TextField
                  label='Last Name'
                  name='lastName'
                />
                <CheckboxGroup
                  label='Roles'
                  name='roles'
                  options={USER_ROLES}
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
