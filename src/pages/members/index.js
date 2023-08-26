import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';

import * as MembersAPI from '@client/api/MembersAPI';
import AccessDenied from '@client/components/AccessDenied';
import MemberFormDialog from '@client/components/MemberFormDialog';
import PageLayout from '@client/components/Layouts/PageLayout';
import { PATROLS_ARRAY } from '@shared/constants';
import { useSession } from 'next-auth/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [members, setMembers] = useState([]);
  const [newOpen, setNewOpen] = useState(false);
  const { data: user } = useSession({ requred: true });

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await MembersAPI.getAll();

      if (error) {
        return console.error(error);
      }

      setMembers(data);
      setLoading(false);
    }

    loadMembers();
  }, []);

  // calculate the rows that each logo needs to span
  const membersByPatrol = {};
  members.forEach((member) => {
    if (membersByPatrol[member.patrol]) {
      membersByPatrol[member.patrol].push(member);
    } else {
      membersByPatrol[member.patrol] = [member];
    }
  });

  if (!user.isParent) {
    return (
      <AccessDenied>
        You have not been granted access to the troop member list. Please
        contact your Troop Master and ask them to grant you the <b>Parent</b> role.
      </AccessDenied>
    );
  }

  return (
    <PageLayout>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant='h5'>
            Members
          </Typography>
        </Grid>
        <Grid item sx={{ marginRight: 1 }}>
          <Button
            onClick={() => setShowInactive(!showInactive)}
            startIcon={showInactive ? <VisibilityOff /> : <Visibility />}
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          >
            Inactive
          </Button>
        </Grid>
        <Grid item>
          <Button
            color='secondary'
            onClick={() => setNewOpen(true)}
            startIcon={<AddIcon />}
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <MemberFormDialog
        open={newOpen}
        onUpdate={(updatedMembers) => setMembers(updatedMembers)}
        handleClose={() => setNewOpen(false)}
      />
      {loading
        ? <LinearProgress />
        : members.length === 0
          ? <Alert variant='standard' severity='info'>
            You do not have any members yet. Use the +Add button to create some.
          </Alert>
          : PATROLS_ARRAY
            .filter((patrol) => !!membersByPatrol[patrol.key])
            .map((patrol) => (
              <Paper key={patrol.key} sx={{
                mb: 2,
                border: `1px solid ${patrol.color}`,
              }}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} sx={{
                        background: patrol.color,
                      }}>
                        <Grid container spacing={2} alignItems='center'>
                          <Grid item>
                            <Image
                              src={patrol.icon}
                              alt='Patrol Logo'
                              height={35}
                              sx={{ mr: 2 }}
                            />
                          </Grid>
                          <Grid item>
                            <Typography variant='h5'>
                              {patrol.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{
                    '& tr:last-child td': {
                      borderBottom: 0,
                    },
                  }}>
                    {membersByPatrol[patrol.key]
                      .filter((member) => showInactive || member.active)
                      .map((member, index) => (
                        <TableRow key={`${member.firstName} ${member.lastName}`}>
                          <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                          <TableCell>
                            {member.active ? 'Active' : 'Inactive'}
                          </TableCell>
                          {user.isTrailGuide &&
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              <Link href={`/members/profile?id=${member._id}`}>View</Link>
                            </TableCell>
                          }
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </Paper>
            ))
      }
    </PageLayout>
  );
}

MembersPage.auth = true;
