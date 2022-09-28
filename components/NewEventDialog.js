// TODO: add close icon to dialogs
import * as yup from 'yup';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form } from 'formik';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';

import * as ScheduleAPI from '../client_api/ScheduleAPI';
import { DateTime } from 'luxon';
import { BRANCHES, LESSONS, LESSON_TYPES } from '../config/constants';
import {
  DatePicker,
  Select,
  TextField,
} from './formikMui';
import isEmpty from 'lodash.isempty';

const blankError = 'This field cannot be left blank';
const EventSchema = yup.object({
  attendance: yup.array(),
  date: yup.string().required(blankError),
  desc: yup.string(),
  lessonID: yup.number(),
  title: yup.string()
    .when('lesson', {
      is: '',
      then: yup.string().required('A title is required when no lesson is selected.')
    }),
});

export default function NewMemberDialog(props) {
  const {
    event,
    open,
    onUpdate,
    handleClose,
  } = props;

  async function handleSubmit(values) {
    const formData = {
      ...values,
      date: values.date.toString(),
    };

    // map lesson to lessonID and delete lesson for transmission
    if (!isEmpty(values.lesson)) {
      formData.lessonID = values.lesson.id;
      delete formData.lesson;
    }

    console.log('submitting', formData);

    // If the event already exists, update it, otherwise add it
    let data, error;
    if (event) {
      ({ data, error } = await ScheduleAPI.update(formData));
    } else {
      ({ data, error } = await ScheduleAPI.add(formData));
    }

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  const initialValues = event || {
    branch: 'Heritage',
    date: DateTime.now(),
    desc: '',
    lessonID: '',
    title: '',
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Event</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={EventSchema}
        >
          {({ values, isSubmitting }) => {
            const lessonOptions = Object.keys(LESSONS)
              .filter((key) => LESSONS[key].branch === values.branch && LESSONS[key].type !== 'makeup')
              .map((key) => LESSONS[key]);

            return (
              <Form style={{ paddingTop: 16 }}>
                <DatePicker
                  label='Date'
                  name='date'
                />
                <Select
                  label='Branch'
                  name='branch'
                >
                  {BRANCHES.map((branch) => (
                    <MenuItem value={branch} key={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
                {lessonOptions.length > 0 &&
                  <Select
                    label='Lesson'
                    name='lesson'
                  >
                    {lessonOptions.map((lesson) => (
                      <MenuItem value={lesson} key={lesson.id}>
                        {LESSON_TYPES[lesson.type]}: {lesson.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                <TextField
                  label='Title'
                  name='title'
                />
                <TextField
                  label='Description'
                  name='desc'
                  multiline
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
