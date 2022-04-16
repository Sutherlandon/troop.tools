import isEmpty from 'lodash.isempty';
import capitalize from 'lodash.capitalize';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  IconButton,
  Grid,
  Typography,
} from '@mui/material';
import { BRANCH_COLORS } from '../models/schedule.model';
import { PATROL_COLORS } from '../models/members.model';
import { isEmptyArray } from 'formik';

function Tag({ variant, text = variant }) {
  return (
    <Box sx={{
      marginLeft: 1,
      px: 1,
      py: '2px',
      border: '1px solid black',
      borderRadius: '4px',
      backgroundColor: BRANCH_COLORS[variant]?.b,
      color: BRANCH_COLORS[variant]?.t,
      display: 'inline',
      width: 'contain-content',
    }}>
      {text}
    </Box>
  );
}

function EventDetails(props) {
  const {
    event,
    onEdit,
    onDelete,
  } = props;

  //TODO: if no event, fetch one based on ID

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
          <IconButton
            onClick={onDelete}
            sx={{ 'color': 'inherit' }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      {!isEmpty(event.attendance) &&
        <>
          <Typography variant='h6'>
            Attendance
          </Typography>
          {Object.keys(event.attendance).map((patrol) => (
            <Box
              sx={{
                backgroundColor: PATROL_COLORS[patrol],
                padding: 1,
              }}
              key={patrol}
            >
              <Box sx={{ fontWeight: 'bold' }}>{capitalize(patrol)}</Box>
              <ul style={{ margin: 0 }}>
                {Object
                  .keys(event.attendance[patrol])
                  .map(name => name.split(' ').reverse().join(', '))
                  .sort()
                  .map((name) => (
                  <li className='member-name' key={name}>{name}</li>
                ))}
              </ul>
            </Box>
          ))}
        </>
      }
    </Box>
  );
}

export default EventDetails;