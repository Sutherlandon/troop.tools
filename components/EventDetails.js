import isEmpty from 'lodash.isempty';
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
  TableRow,
  TableCell,
} from '@mui/material';

import Tag from '../components/Tag';
import { PATROL_COLORS } from '../models/members.model';
import FoxesLogo from '../images/foxesLogo.png';
import HawksLogo from '../images/hawksLogo.png';
import MountainLionsLogo from '../images/mountainLionsLogo.png';

const patrolLogos = {
  'foxes': FoxesLogo,
  'hawks': HawksLogo,
  'mountain lions': MountainLionsLogo,
};

function EventDetails(props) {
  const {
    event,
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
        <>
          <Typography variant='h6'>
            Attendance
          </Typography>
          <Table>
            {Object.keys(event.attendance).map((patrol) => (
              <TableRow
                sx={{
                  '& td': {
                    backgroundColor: PATROL_COLORS[patrol],
                    padding: 1,
                    border: 0,
                  }
                }}
                key={patrol}
              >
                <TableCell sx={{ width: 85 }}>
                  <Image src={patrolLogos[patrol]} alt='Patrol Logo' />
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
            ))}
          </Table>
        </>
      }
      <Box sx={{ my: 2, textAlign: 'center' }}>
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