import LoadingButton from '@mui/lab/LoadingButton';
import { Close, DeleteForever } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { TextField } from './formikMui';
import * as MembersAPI from '@client/api/MembersAPI';
import { useRouter } from 'next/router';

export default function MemberDeleteDialog(props) {
  const { handleClose, member, open } = props;
  const router = useRouter();

  async function handleSubmit() {
    const { error } = await MembersAPI.realDelete(member._id);

    if (error) {
      return console.log(error);
    }

    router.push('/members');
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: (theme) => ({
          border: '2px solid',
          borderColor: theme.palette.error.main,
        })
      }}
    >
      <DialogTitle>Delete &quot;{member.firstName} {member.lastName}&quot; Forever?</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ name: '' }}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => {
            // console.log('VALUES', values);

            return (
              <Form>
                <Typography variant='body1' sx={{ mb: 2 }}>
                  This action <b>cannot</b> be undone. Are you sure you want to delete this member
                  and all thier advancement data? Consider inactivating from the &quot;Edit Profile&quot;
                  button. Type &quot;{member.firstName}&quot; in the text box to continue.
                </Typography>
                <TextField name='name' />
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    color='secondary'
                    onClick={handleClose}
                    startIcon={<Close />}
                    variant='contained'
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    disabled={values.name !== member.firstName}
                    loading={isSubmitting}
                    loadingPosition='start'
                    type='submit'
                    startIcon={<DeleteForever />}
                    variant='contained'
                    sx={(theme) => ({ backgroundColor: theme.palette.error.main })}
                  >
                    Delete Forever
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
