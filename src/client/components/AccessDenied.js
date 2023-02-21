import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import PageLayout from './Layouts/PageLayout';

export default function AccessDenied(props) {
  return (
    <PageLayout>
      <Box sx={{ textAlign: 'center' }}>
        <Alert severity='warning' variant='filled'>
          {props.message || props.children}
        </Alert>
      </Box>
    </PageLayout>
  );
}
