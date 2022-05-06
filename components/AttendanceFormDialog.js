import React from 'react';
import Image from 'next/image';
import isEmpty from 'lodash.isempty';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
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
import * as ScheduleAPI from '../api/ScheduleAPI';
import {
  BRANCH_COLORS,
  PATROLS,
  PATROL_COLORS,
  PATROL_LOGOS,
} from '../config/constants';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const blankAttendance = {
  Foxes: {},
  Hawks: {},
  'Mountain Lions': {},
  // Navigators: {},
  // Adventurers: {},
};

function AttendenceFormDialog(props) {
  const {
    event,
    handleClose,
    members,
    open,
    onSubmit,
  } = props;

  // form not initialized
  if (!event) {
    return null;
  }

  const initialValues = !isEmpty(event.attendance)
    ? event.attendance
    : blankAttendance;

  /**
   * Submits attendance to the API
   * @param {*} values Values from the Formik form
   * @param {*} formik The Formik Bag
   */
  async function handleSubmit(values, formik) {
    const formData = {
      _id: event._id,
      attendance: values,
    };

    console.log('data submitted', formData);

    const { data, error } = await ScheduleAPI.attendance(formData);

    if (error) {
      return console.log(error);
    }

    onSubmit(data);
    formik.resetForm();
  }

  console.log({ event });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      scroll='paper'
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ backgroundColor: BRANCH_COLORS[event.branch]?.b }}>
        <Grid
          container
          spacing={2}
          justifyContent='space-between'
          wrap='nowrap'
        >
          <Grid item>
            {event.date} - {event.name}
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleClose}
              sx={{ 'color': 'inherit' }}
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
                {PATROLS.map((patrol) => {
                  const patrolMembers = members
                    .filter(member => member.patrol === patrol)
                    .map((member) => {
                      return (
                        <CheckboxRow
                          groupName={patrol}
                          name={member.name}
                          key={member.name}
                        />
                      );
                    })

                  if (patrolMembers.length > 0) {
                    return (
                      <div key={patrol}>
                        <Grid
                          container
                          alignItems='center'
                          sx={{
                            backgroundColor: PATROL_COLORS[patrol],
                          }}
                        >
                          <Grid item sx={{ width: 60, padding: 2 }}>
                            <Image src={PATROL_LOGOS[patrol]} alt='Patrol Logo' />
                          </Grid>
                          <Grid item>
                            {patrol}
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
