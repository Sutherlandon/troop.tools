import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Box,
  MenuItem,
  Typography
} from '@mui/material';

import * as yup from 'yup';
import * as MembersAPI from '@client/api/MembersAPI';
import { PATROLS_ARRAY } from '@shared/constants';
import { Checkbox, Select, TextField } from '@client/components/formikMui';
import { useRouter } from 'next/router';
import PageLayout from '@client/components/Layouts/PageLayout';

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

export default function MemberProfile() {
  const [member, setMember] = useState('loading');
  const router = useRouter();
  const { id } = router.query;

  console.log({ id });

  useEffect(() => {
    async function getMember() {
      if (id) {
        const { data, error } = await MembersAPI.get(id);

        if (error) {
          return console.error(error);
        }

        setMember(data);
      }
    }

    getMember();
  }, [id]);

  async function handleSubmit(values) {
    console.log('submitting', { values });

    // if the member already exists updated it, otherwise create it
    const { data, error } = await MembersAPI.update(values);

    if (error) {
      return console.log(error);
    }

    setMember(data);
  }

  const initialValues = {
    ...blankForm,
    ...member,
  };

  return (
    <PageLayout>
      <Typography variant='h5'>
        {member.firstName} {member.lastName}
      </Typography>
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
    </PageLayout>
  );
}
