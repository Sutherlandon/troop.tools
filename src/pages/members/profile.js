// import SaveIcon from '@mui/icons-material/Save';
// import LoadingButton from '@mui/lab/LoadingButton';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
// import { Formik, Form } from 'formik';
import {
  Grid,
  LinearProgress,
  Typography
} from '@mui/material';

// import * as yup from 'yup';
import * as MembersAPI from '@client/api/MembersAPI';
import {
  PATROLS,
//  PATROLS_ARRAY
} from '@shared/constants';
// import { Checkbox, Select, TextField } from '@client/components/formikMui';
import { useRouter } from 'next/router';
import PageLayout from '@client/components/Layouts/PageLayout';
import AdvancementReport from '@client/components/AdvancementReport';
import configureMemberSubmenu from '@client/components/MemberSubmenu';

// const memberSchema = yup.object({
//   active: yup.boolean(),
//   firstName: yup.string().required('This field cannot be left blank'),
//   lastName: yup.string().required('This field cannot be left blank'),
//   patrol: yup.string()
//     .oneOf(PATROLS_ARRAY.map(patrol => patrol.key))
//     .required('This field cannot be left blank'),
// });

// const blankForm = {
//   active: true,
//   firstName: '',
//   lastName: '',
//   patrol: 'foxes',
// };

export default function MemberProfile() {
  const [member, setMember] = useState('loading');
  const { data: user } = useSession({ required: true });
  const router = useRouter();
  const { id } = router.query;
  const memberName = `${member.firstName} ${member.lastName}`;

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

  // async function handleSubmit(values) {
  //   console.log('submitting', { values });

  //   // if the member already exists updated it, otherwise create it
  //   const { data, error } = await MembersAPI.update(values);

  //   if (error) {
  //     return console.log(error);
  //   }

  //   setMember(data);
  // }

  // const initialValues = {
  //   ...blankForm,
  //   ...member,
  // };

  if (member === 'loading') {
    return (
      <PageLayout>
        <LinearProgress />
      </PageLayout>
    );
  }

  const MemberSubmenu = configureMemberSubmenu(id, memberName);

  return (
    <PageLayout Submenu={MemberSubmenu}>
      <Grid container alignItems={'center'} justifyContent={'space-between'} sx={{ pb: 2 }}>
        <Grid item sx={{ pr: 2 }}>
          <Typography variant='h4'>
            {memberName}
          </Typography>
        </Grid>
        <Grid item>
          <Image src={PATROLS[member.patrol].icon} alt='Patrol Logo' height={30} />
        </Grid>
        <Grid item sx={{ flexGrow: 1 }} />
        <Grid item>
          {member.active
            ? <Typography variant='h5' sx={{ color: 'green' }}>Active</Typography>
            : <Typography variant='h5' sx={{ color: 'red' }}>Inactive</Typography>
          }
        </Grid>
      </Grid>
      {/* <Box sx={{ mb: 4 }}>
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
      </Box> */}
      <AdvancementReport
        member={member}
        user={user}
      />
    </PageLayout>
  );
}

MemberProfile.auth = true;
