import * as yup from 'yup';
import Router from 'next/router';
import { Save } from '@mui/icons-material';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Formik, Form } from 'formik';
import { useSession } from 'next-auth/react';

import * as UserAPI from '@client/api/UserAPI';
import MinimalLayout from '@client/components/Layouts/MinimalLayout';
import { Select, TextField } from '@client/components/formikMui';
import { MenuItem } from '@mui/material';

const UserSchema = yup.object({
  email: yup.string().required('Required'),
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  troop: yup.string().required('Required'),
});

export default function NewUserPage(props) {
  const [loading] = useState(false);
  const { data: user } = useSession();
  const initialValues = {
    email: user.email || '',
    troop: '',
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
    <MinimalLayout title='Looks like you are new here!'>
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
          <Select
            label='Trail Life Troop'
            name='troop'
          >
            <MenuItem value=''>- Select -</MenuItem>
            <MenuItem value='NM-1412'>NM-1412</MenuItem>
            <MenuItem value='TX-0110'>TX-0110</MenuItem>
            <MenuItem value='TX-3221'>TX-3221</MenuItem>
          </Select>
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
    </MinimalLayout>
  );
}

NewUserPage.auth = true;
