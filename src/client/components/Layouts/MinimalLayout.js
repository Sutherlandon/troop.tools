import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';

import logoDark from '@shared/images/brand/Logo-dark.png';

export default function MinimalLayout({ children, title }) {
  return (
    <Dialog
      open={true}
      fullWidth
      sx={(theme) => ({
        background: theme.palette.primary.main,
        m: 'auto'
      })}
    >
      <DialogTitle sx={{
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        <Image
          src={logoDark}
          alt='troop.tools logo'
          width={200}
          height={200}
        />
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant='h4' sx={{ mb: 4 }}>
          { title || 'Troop.Tools' }
        </Typography>
        {children}
      </DialogContent>
    </Dialog>
  );
}
