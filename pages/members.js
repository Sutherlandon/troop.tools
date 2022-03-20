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

import { getMembers } from '../data/membersData';

function MembersPage({ data }) {
  return (
    <div>
      <Typography variant='h4'>
        Troop Members
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Patrol</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(member => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.patrol}</TableCell>
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
  const data = await getMembers();
  return { props: { data } };
}

export default MembersPage;
