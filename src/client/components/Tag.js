import { Box } from '@mui/material';
import { BRANCH_COLORS } from '@shared/constants';

function Tag({ variant, text = variant }) {
  return (
    <Box sx={{
      marginLeft: 1,
      px: 1,
      py: '2px',
      borderRadius: '4px',
      backgroundColor: BRANCH_COLORS[variant]?.b,
      color: BRANCH_COLORS[variant]?.t,
      display: 'inline-block',
      boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    }}>
      {text}
    </Box>
  );
}

export default Tag;
