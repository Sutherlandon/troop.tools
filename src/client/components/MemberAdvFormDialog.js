
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

import * as MembersAPI from '@client/api/MembersAPI';
import {
  BRANCH_NAMES,
  EVENT_BRANCHES,
  LESSONS,
  LESSON_TYPES,
  PATROLS,
} from '@shared/constants';
import {
  DatePicker,
  Select,
  TextField,
} from './formikMui';

const blankError = 'This field cannot be left blank';
const EventSchema = yup.object({
  date: yup.string().required(blankError),
  lessonID: yup.string()
    .when('branch', {
      is: (value) => BRANCH_NAMES.includes(value),
      then: yup.string().required(blankError),
    }),
});

const blankForm = {
  date: dayjs(),
  branch: '',
  lessonID: '',
  notes: '',
};

export default function MemberAdvFormDialog(props) {
  const {
    member,
    open,
    onUpdate,
    handleClose,
  } = props;

  async function handleSubmit(values) {
    const formData = {
      patrolID: PATROLS[member.patrol].id,
      lessonID: values.lessonID,
      date: dayjs(values.date).format(),
    };

    // delete lesson for transmission
    delete formData.lesson;
    console.log('submitting', formData);

    // If the event already exists, update it, otherwise add it
    const { data, error } = await MembersAPI.addIndividualAdv(member._id, formData);

    if (error) {
      return console.log(error);
    }

    onUpdate(data);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Additional Advancement</DialogTitle>
      <DialogContent sx={{ paddingTop: 16 }}>
        <Formik
          initialValues={blankForm}
          onSubmit={handleSubmit}
          validationSchema={EventSchema}
        >
          {({ errors, values, isSubmitting }) => {
            const lessonOptions = LESSONS.filter((l) => l.branch === values.branch);

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
                  label='Notes'
                  name='notes'
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
