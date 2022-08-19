import Router from 'next/router';
import * as yup from 'yup';
import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Formik, Form } from 'formik';
import { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import TextField from '../components/formikMui/TextField';
import UserContext from '../config/UserContext';
import magic from '../config/magic-sdk';
import * as UserAPI from '../client_api/UserAPI';

const UserSchema = yup.object({
  email: yup.string().required('Required'),
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
});

const blankForm = {
  email: '',
  firstName: '',
  lastName: '',
};

function LoginForm(props) {
  const [loading] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [initialValues, setInitialValues] = useState(blankForm);

  // Redirect to / if the user is logged in
  useEffect(() => {
    user?.issuer && Router.push('/');
  }, [user]);

  // Since they are not logged in, prep the form
  useEffect(() => {
    async function loadMetadata() {
      const { email, issuer } = await magic.user.getMetadata();
      const initialValues = {
        email,
        issuer,
        firstName: '',
        lastName: '',
      };

      setInitialValues(initialValues);
    }

    loadMetadata();
  });

  async function handleSubmit(values) {
    const { data, error } = await UserAPI.add(values);

    if (error) {
      return console.error(error);
    }

    setUser(data);
  }

  return (
    <Dialog open={true} fullWidth sx={{ maxWidth: 800 }}>
      <DialogTitle sx={{
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Looks like you&apos;re new here!
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
          validationSchema={UserSchema}
        >
          <Form style={{ marginTop: 8 }}>
            <TextField
              disabled
              label='Email Address'
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
            <div style={{ textAlign: 'center' }}>
              <LoadingButton
                startIcon={<Save />}
                loadingPosition='start'
                loading={loading}
                variant='contained'
                type='submit'
                sx={{ textTransform: 'none' }}
              >
                Save
              </LoadingButton>
            </div>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default LoginForm;
