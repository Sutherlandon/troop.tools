import React from 'react';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { DateTime } from 'luxon';
import { Form, Formik } from 'formik';
import {
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Table,
  TableBody,
  IconButton,
} from '@mui/material';

import CheckboxRow from '../components/formikMui/CheckboxRow';
import * as EventsAPI from '../client_api/EventsAPI';
import { BRANCH_COLORS, PATROLS_ARRAY } from '../config/constants';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AttendenceFormDialog(props) {
  const {
    event,
    // eventsList,
    handleClose,
    members,
    open,
    onSubmit,
  } = props;

  // form not initialized
  if (!event) {
    return null;
  }

  // list of member._id's mapped to an obect { [_id]: true } or {} if undefined
  const membersList = members.reduce((acc, member) => ({ ...acc, [member._id]: false }), {});
  const attendanceList = event.attendance?.reduce((acc, member) => ({ ...acc, [member._id]: true }), {}) || {};
  const initialValues = {
    ...membersList,
    ...attendanceList,
  };

  console.log(membersList, attendanceList, initialValues);

  /**
   * Submits attendance to the API
   * @param {*} values Values from the Formik form
   * @param {*} formik The Formik Bag
   */
  async function handleSubmit(values, formik) {
    // assemble the data
    const formData = {
      _id: event._id,
      attendance: values,
      date: event.date,
      lessonID: event.lesson.id,
    };

    console.log('data submitted', formData);

    const { data, error } = await EventsAPI.attendance(formData);

    if (error) {
      return console.log(error);
    }

    // TODO: For network data efficiency
    // replace the event in the list with the return value
    // const updatedEventsList = eventsList.map((event) => event._id === data._id ? data : event);

    onSubmit(data);
    formik.resetForm();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      scroll='paper'
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ backgroundColor: BRANCH_COLORS[event.lesson.branch]?.b }}>
        <Grid
          container
          spacing={2}
          justifyContent='space-between'
          wrap='nowrap'
        >
          <Grid item>
            {DateTime.fromISO(event.date).toLocaleString()} - {event.title || event.lesson.name}
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleClose}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ fontWeight: 'bold', py: 2 }}>
          Attendance
        </Box>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => {
            console.log('Values', values);

            return (
              <Form>
                {PATROLS_ARRAY.map((patrol) => {
                  const patrolMembers = members
                    .filter(member => member.patrol === patrol.key)
                    .map((member) => {
                      const label = `${member.firstName} ${member.lastName}`;
                      return (
                        <CheckboxRow
                          label={label}
                          name={member._id}
                          key={member._id}
                        />
                      );
                    });

                  if (patrolMembers.length > 0) {
                    return (
                      <div key={patrol.key}>
                        <Grid
                          container
                          alignItems='center'
                          sx={{
                            backgroundColor: patrol.color,
                          }}
                        >
                          <Grid item sx={{ width: 60, padding: 2 }}>
                            <Image src={patrol.logo} alt='Patrol Logo' />
                          </Grid>
                          <Grid item>
                            {patrol.name}
                          </Grid>
                        </Grid>
                        <Table sx={{ marginBottom: 2 }}>
                          <TableBody>
                            {patrolMembers}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  }

                  return null;
                })}
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
    </Dialog >
  );
}

export default AttendenceFormDialog;
