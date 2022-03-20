import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';

import { getEvents } from '../data/eventsData';

function SchedulePage({ data }) {
  return (
    <div>
      <Typography variant='h4'>
        Troop Schedule
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(event => (
              <TableRow key={event.id}>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.branch}</TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>
                  <Button color='error' startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}


export async function getServerSideProps() {
  const data = await getEvents();
  return { props: { data } };
}

export default SchedulePage;
