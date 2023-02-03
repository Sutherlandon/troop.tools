import * as yup from 'yup';
import Router from 'next/router';
import { Save } from '@mui/icons-material';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { getServerSession } from 'next-auth';
import { Formik, Form } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import TextField from '@client/components/formikMui/TextField';
import * as UserAPI from '@client/api/UserAPI';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import useUser from '@client/hooks/useUser';

const UserSchema = yup.object({
  email: yup.string().required('Required'),
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
});

export default function OnboardingForm(props) {
  const [loading] = useState(false);
  const user = useUser();
  const initialValues = {
    email: user.email || '',
    troop: 'NM1412',
    firstName: '',
    lastName: '',
    roles: [],
  };

  async function handleSubmit(values) {
    const { error } = await UserAPI.update(values);

    if (error) {
      return console.error(error);
    }

    Router.push('/?onboard=true');
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
              disabled
              label='Trail Life Troop'
              name='troop'
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

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  // no reason to be here if we have the information we need
  if (session.user?.firstName && session.user?.lastName) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
  }

  return { props: {} };
}
