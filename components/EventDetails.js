import isEmpty from 'lodash.isempty';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

import Tag from '../components/Tag';
import { LESSON_TYPES, PATROLS } from '../config/constants';
import useRoles from '../hooks/useRoles';

function EventDetails(props) {
  const {
    event,
    onAttendance,
    onEdit,
    onDelete,
  } = props;

  const { isAdmin, isTrailGuide } = useRoles();

  return (
    <Box>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          {event.lesson?.branch && <Tag variant={event.lesson.branch} />}
          {event.lesson?.type && <Tag variant={LESSON_TYPES[event.lesson?.type]} />}
        </Grid>
        <Grid item>
          <IconButton
            onClick={onEdit}
            sx={{ color: 'inherit' }}
          >
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
      {event.desc &&
        <div sx={{ py: 2 }}>{event.desc}</div>
      }
      {!isEmpty(event.attendance) &&
        Object.keys(event.attendance)
          .filter(key => !isEmpty(event.attendance[key]))
          .length > 0 &&
        <>
          <Typography variant='h6'>
            Attendance
          </Typography>
          <Table>
            <TableBody>
              {Object.keys(event.attendance).map((patrol) => {
                // don't show empty patrols
                if (isEmpty(event.attendance[patrol])) {
                  return null;
                }

                return (
                  <TableRow
                    key={patrol}
                    sx={{
                      '& td': {
                        backgroundColor: PATROLS[patrol].color,
                        padding: 1,
                        border: 0,
                      },
                    }}
                  >
                    <TableCell sx={{ width: 85 }}>
                      <Image src={PATROLS[patrol].logo} alt='Patrol Logo' />
                    </TableCell>
                    <TableCell>
                      <ul style={{ margin: 0 }}>
                        {Object
                          .keys(event.attendance[patrol])
                          .map(name => name.split(' ').reverse().join(', '))
                          .sort()
                          .map((name) => (
                            <li className='member-name' key={name}>{name}</li>
                          ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      }
      <Box sx={{ my: 2, textAlign: 'center' }}>
        {isTrailGuide &&
          <Button
            color='primary'
            onClick={onAttendance}
            size='small'
            variant='outlined'
            sx={{ marginRight: 1 }}
          >
            <CheckIcon /> Attendance
          </Button>
        }
        {isAdmin &&
          <Button
            color='error'
            onClick={onDelete}
            size='small'
            variant='outlined'
          >
            <DeleteIcon /> Delete
          </Button>
        }
      </Box>
    </Box>
  );
}

export default EventDetails;
