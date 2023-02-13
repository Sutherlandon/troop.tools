import isEmpty from 'lodash.isempty';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import CheckBoxIcon from '@mui/icons-material/Check';
import Image from 'next/image';
import { Fragment } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';

import Tag from './Tag';
import useUser from '@client/hooks/useUser';
import { LESSON_TYPES, PATROLS } from '@shared/constants';

function EventDetails(props) {
  const {
    event,
    onAttendance,
    onEdit,
    onDelete,
  } = props;

  const { isAdmin, isTrailGuide } = useUser();

  // group event.attendance by patrol into an object
  const attendance = {};
  event.attendance?.forEach(({ name, patrol }) => {
    if (!attendance[patrol]) {
      attendance[patrol] = [name];
    } else {
      attendance[patrol].push(name);
    }
  });

  return (
    <Box>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        sx={{ ml: -1, pt: 1, pb: 1 }}
      >
        <Grid item>
          {event.branch && <Tag variant={event.branch} />}
          {event.lesson?.type && <Tag variant={LESSON_TYPES[event.lesson?.type]} />}
        </Grid>
      </Grid>
      {event.title && event.lesson &&
        <Box sx={{ p: 1, fontWeight: 'bold' }}>
          {event.lesson.name}
        </Box>
      }
      {event.desc &&
        <Box sx={{ p: 1 }}>{event.desc}</Box>
      }
      {!isEmpty(attendance) &&
        <>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Attendance
          </Typography>
          {Object.keys(PATROLS).map((patrol) => {
            // because we iterate over the PATROLS, attendence may be empty
            // and if it is, we don't want to include it
            if (isEmpty(attendance[patrol])) {
              return null;
            }

            return (
              <Fragment key={patrol}>
                <Box
                  sx={{
                    backgroundColor: PATROLS[patrol].color,
                    p: 1,
                    mb: 1,
                    borderRadius: '4px',
                    height: 45
                  }}
                >
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item sx={{ height: 45 }}>
                      <Image src={PATROLS[patrol].icon} alt='Patrol Logo' style={{ height: '100%', width: 'auto' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant='body1'>{PATROLS[patrol].name}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1 }}>
                  {attendance[patrol]
                    .map((name) => name.split(' ').reverse().join(', '))
                    .sort()
                    .map((name) => (
                      <Grid container spacing={1} sx={{ alignItems: 'center' }} className='member-name' key={name}>
                        <Grid item><CheckIcon fontSize='small' /></Grid>
                        <Grid item>{name}</Grid>
                      </Grid>
                    ))}
                </Box>
              </Fragment>
            );
          })}
        </>
      }
      <Box sx={{ my: 2, textAlign: 'center' }}>
        {isTrailGuide &&
          <Button
            color='secondary'
            onClick={onAttendance}
            size='small'
            variant='outlined'
            sx={{ marginRight: 1 }}
          >
            <CheckIcon /> Attendance
          </Button>
        }
        {isAdmin &&
          <>
            <Button
              color='dark'
              onClick={onEdit}
              size='small'
              variant='outlined'
              sx={{ marginRight: 1 }}
            >
              <EditIcon />
            </Button>
            <Button
              color='error'
              onClick={onDelete}
              size='small'
              variant='outlined'
            >
              <DeleteIcon />
            </Button>
          </>
        }
      </Box>
    </Box>
  );
}

export default EventDetails;
