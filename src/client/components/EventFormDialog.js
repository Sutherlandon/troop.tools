// TODO: add close icon to dialogs
import * as yup from 'yup';
import dayjs from 'dayjs';
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

import * as EventsAPI from '@client/api/EventsAPI';
import {
  BRANCH_NAMES,
  EVENT_BRANCHES,
  LESSONS,
  LESSON_TYPES,
} from '@shared/constants';
import {
  DatePicker,
  Select,
  TextField,
} from './formikMui';

const blankError = 'This field cannot be left blank';
const EventSchema = yup.object({
  attendance: yup.array(),
  branch: yup.string().required(blankError),
  date: yup.string().required(blankError),
  desc: yup.string(),
  lessonID: yup.string()
    .when('branch', {
      is: (value) => BRANCH_NAMES.includes(value),
      then: yup.string().required(blankError),
    }),
  title: yup.string()
    .when('lesson', {
      is: '',
      then: yup.string().required('A title is required when no lesson is selected.')
    }),
});

const blankForm = {
  branch: '',
  date: dayjs(),
  desc: '',
  lessonID: '',
  title: '',
};

export default function EventFormDialog(props) {
  const {
    event,
    open,
    onUpdate,
    handleClose,
  } = props;

  async function handleSubmit(values) {
    const formData = {
      ...values,
      date: dayjs(values.date).format(),
    };

    // delete lesson for transmission
    delete formData.lesson;
    console.log('submitting', formData);

    // If the event already exists, update it, otherwise add it
    let data, error;
    if (event) {
      ({ data, error } = await EventsAPI.update(formData));
    } else {
      ({ data, error } = await EventsAPI.add(formData));
    }

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  const initialValues = {
    ...blankForm,
    ...event,
    lessonID: event?.lesson?.lessonID || blankForm.lessonID,
  };
  let prevBranch = initialValues.branch;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Event</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={EventSchema}
        >
          {({ errors, values, isSubmitting }) => {
            const titleOptional = values.branch === '' || BRANCH_NAMES.includes(values.branch);
            const lessonOptions = LESSONS.filter((l) => l.branch === values.branch && l.type !== 'makeup');
            if (values.branch !== prevBranch) {
              prevBranch = values.branch;
              values.lessonID = lessonOptions[0]?.lessonID;
            }

            console.log('VALUES', values);

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
                  {EVENT_BRANCHES.map((branch) => (
                    <MenuItem value={branch} key={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
                {lessonOptions.length > 0 &&
                  <Select
                    label='Lesson'
                    name='lessonID'
                  >
                    {lessonOptions.map((lesson) => (
                      <MenuItem value={lesson.lessonID} key={lesson.lessonID}>
                        {LESSON_TYPES[lesson.type]}: {lesson.name}
                      </MenuItem>
                    ))
                    }
                  </Select>
                }
                <TextField
                  label={`Title${titleOptional ? ' (optional)' : ''}`}
                  name='title'
                  helperText={titleOptional && 'Defaults to lesson name'}
                />
                <TextField
                  label='Description (optional)'
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
