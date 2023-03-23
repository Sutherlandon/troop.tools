import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

export default function MenuFooter() {
  const [open, setOpen] = useState(false);
  const borderRight = '1px solid rgba(0, 0, 0, 0.12)';

  return (
    <>
      <Box sx={{ flexGrow: 1, borderRight }}></Box>
      <Box sx={{
        borderRight,
        p: 1,
        textAlign: 'center'
      }}>
        <Button
          variant='contained'
          onClick={() => setOpen(true)}
        >
          Submit Feedback
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Feedback</DialogTitle>
          <DialogContent>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Hey Thanks! We really appreciate you taking the time
              to let us know what you think. Click this button to
              send us an email using your email client.
            </Typography>
            <Button
              variant='contained'
              href='mailto:feedback@troop.tools?subject=Troop.Tools Feedback'
            >
              Email Feedback
            </Button>
            <Typography variant='body1' sx={{ pt: 4, mb: 1 }}>
              If that does not work, Please send an email to:
            </Typography>
            <Typography variant='body1' sx={{ mb: 1, fontWeight: 'bold' }}>
              feedback@troop.tools
            </Typography>
            <Typography variant='body1' sx={{ pt: 2 }}>
              We look forward to hearing from you!
            </Typography>
          </DialogContent>
        </Dialog>
      </Box>
      <Divider />
      <Box sx={{
        px: 1,
        py: 2,
        borderRight,
        textAlign: 'center',
      }}>
        <Typography variant='body1'>
          © Sutherlandon, llc. 2023
        </Typography>
      </Box>
    </>
  );
}
