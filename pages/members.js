import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';

import * as Members from '../data/membersData';

function MembersPage({ data }) {
  return (
    <div>
      <Grid container>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            Troop Members
          </Typography>
        </Grid>
        {/* <Grid item>
          <Button 
            color='primary'
            startIcon={<AddIcon />}
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          >
            Add
          </Button>
        </Grid> */}
      </Grid>
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
              <TableRow key={member.name}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.patrol}</TableCell>
                <TableCell>
                  <IconButton color='error'>
                    <DeleteIcon />
                  </IconButton>
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
  const data = await Members.getAll();
  return { props: { data } };
}

export default MembersPage;
