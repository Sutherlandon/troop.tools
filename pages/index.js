import { Button, Grid } from '@mui/material'
import Link from 'next/link';

function HomePage() {
  return (
    <Grid container justifyContent='center'>
      <Grid item sx={{ marginBottom: 1 }}>
        <Link href='/schedule' passHref>
          <Button
            color='secondary'
            variant='contained'
          >
            Troop Schedule
          </Button>
        </Link>
      </Grid>
      <Grid item sx={{ marginBottom: 1 }}>
        <Link href='/members' passHref>
          <Button
            color='secondary'
            variant='contained'
          >
            Troop Members List
          </Button>
        </Link>
      </Grid>
      <Grid item sx={{ marginBottom: 1 }}>
        <Link href='/attendance' passHref>
          <Button
            color='secondary'
            variant='contained'
          >
            Record Attendance
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default HomePage;
