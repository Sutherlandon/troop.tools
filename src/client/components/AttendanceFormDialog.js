import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Formik } from 'formik';
import {
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Slide,
  Table,
  TableBody,
  IconButton,
  Typography,
  DialogActions,
} from '@mui/material';

import CheckboxRow from './formikMui/CheckboxRow';
import * as EventsAPI from '@client/api/EventsAPI';
import { BRANCH_COLORS, PATROLS_ARRAY } from '@shared/constants';
import { Refresh } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AttendenceFormDialog(props) {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();
  const [conflict, setConflict] = useState(false);

  const {
    handleClose,
    members,
    open,
    onSubmit,
  } = props;

  // Get's the latest version of the document
  const getLatestVersion = useCallback(async () => {
    if (open && props.event) {
      setLoading(true);

      const { data, error } = await EventsAPI.getById(props.event._id);

      if (error) {
        return console.error(error);
      }

      setLoading(false);
      setConflict(false);
      setEvent(data);
    }
  }, [props.event, open]);

  // load the latest version of the document whenever the event changes
  useEffect(() => { getLatestVersion(); }, [props.event, open, getLatestVersion]);

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

  function ConflictDialog() {
    return (
      <Dialog
        open={conflict}
        onClose={() => setConflict(false)}
      >
        <DialogTitle>Conflict</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>
            A document conflict has occurred. This is probably due to someone else submitting attendance before you.
            Click &quot;Refresh&quot; to get the latest version, then record your changes again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            loadingPosition='start'
            startIcon={<Refresh />}
            variant='contained'
            onClick={getLatestVersion}
          >
            Refresh
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }

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
      hash: event.hash,
      lessonID: event.lesson?.lessonID,
    };

    console.log(formData);

    const { data, error } = await EventsAPI.attendance(formData);

    if (error) {
      if (error.status === 409) {
        setConflict(true);
      }

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
      <DialogTitle sx={{ backgroundColor: BRANCH_COLORS[event.branch]?.b }}>
        <Grid
          container
          spacing={2}
          justifyContent='space-between'
          wrap='nowrap'
        >
          <Grid item>
            {dayjs(event.date).format('M/D/YY')} - {event.title || event.lesson.name}
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
      {loading
        ? (
          <DialogContent>
            <LinearProgress />
          </DialogContent>
          )
        : (
          <DialogContent>
            <Box sx={{ fontWeight: 'bold', py: 2 }}>
              Attendance
            </Box>
            {conflict && <ConflictDialog />}
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, isSubmitting }) => {
                // console.log('Values', values);

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
                                <Image
                                  src={patrol.logo}
                                  alt='Patrol Logo'
                                  width={28}
                                />
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
          )
      }
    </Dialog >
  );
}

export default AttendenceFormDialog;
