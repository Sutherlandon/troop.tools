import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AccessDenied(props) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant='h3'>Access Denied</Typography>
      <Typography variant='body'>
        {props.message || props.children}
      </Typography>
    </Box>
  );
}
