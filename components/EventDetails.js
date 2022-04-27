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
import { PATROL_COLORS, PATROL_LOGOS } from '../config/constants';

function EventDetails(props) {
  const {
    event,
    onAttendance,
    onEdit,
    onDelete,
  } = props;

  return (
    <Box>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <Tag variant={event.branch} />
          <Tag variant={event.type} />
        </Grid>
        <Grid item>
          <IconButton
            onClick={onEdit}
            sx={{ 'color': 'inherit' }}
          >
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
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
                        backgroundColor: PATROL_COLORS[patrol],
                        padding: 1,
                        border: 0,
                      }
                    }}
                  >
                    <TableCell sx={{ width: 85 }}>
                      <Image src={PATROL_LOGOS[patrol]} alt='Patrol Logo' />
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
                )
              }
              )}
            </TableBody>
          </Table>
        </>
      }
      <Box sx={{ my: 2, textAlign: 'center' }}>
        <Button
          color='primary'
          onClick={onAttendance}
          size='small'
          variant='outlined'
          sx={{ marginRight: 1 }}
        >
          <CheckIcon /> Attendance
        </Button>
        <Button
          color='error'
          onClick={onDelete}
          size='small'
          variant='outlined'
        >
          <DeleteIcon /> Delete
        </Button>
      </Box>
    </Box>
  );
}

export default EventDetails;