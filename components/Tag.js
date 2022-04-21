import { Box } from '@mui/material';
import { BRANCH_COLORS } from '../config/constants';

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

export default Tag;
