// TODO: add close icon to dialogs
import * as yup from 'yup';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
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
  ADVANCEMENT,
  BRANCH_NAMES,
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
  lessonID: yup.number(),
  title: yup.string()
    .when('lesson', {
      is: '',
      then: yup.string().required('A title is required when no lesson is selected.')
    }),
});

const blankForm = {
  branch: 'Heritage',
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

    // map lesson to lessonID and delete lesson for transmission
    if (!isEmpty(values.lesson)) {
      formData.lessonID = values.lesson.id;
      delete formData.lesson;
    }

    // console.log('submitting', formData);

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
    lessonID: event?.lesson?.id,
    branch: event?.lesson?.branch || '',
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

            const titleOptional = values.branch === '' || Object.keys(ADVANCEMENT).includes(values.branch);

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
                  {BRANCH_NAMES.map((branch) => (
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
                      <MenuItem value={lesson.id} key={lesson.id}>
                        {LESSON_TYPES[lesson.type]}: {lesson.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                <TextField
                  label={`Title${titleOptional ? ' (optional)' : ''}`}
                  name='title'
                  helperText={titleOptional && 'Defaults to lesson name' }
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
