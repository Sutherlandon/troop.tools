import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  IconButton,
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
import serverCheckSession from 'lib/serverCheckSession';
import { PATROLS_ARRAY } from '@shared/constants';
import { useSession } from 'next-auth/react';

export default function MembersPage() {
  const [editInfo, setEditInfo] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [newOpen, setNewOpen] = useState(false);
  const { data: user } = useSession();

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await MembersAPI.get();

      if (error) {
        return console.error(error);
      }

      setMembers(data);
      setLoading(false);
    }

    loadMembers();
  }, []);

  // open the edit form loaded with the event at the index
  function openEdit(member) {
    setEditInfo({
      member,
      open: true,
    });
  }

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
            Troop Members
          </Typography>
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
      <MemberFormDialog
        {...editInfo}
        handleClose={() => setEditInfo({ open: false })}
        onUpdate={(memberList) => setMembers(memberList)}
      />
      {loading
        ? <LinearProgress />
        : <Paper>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Patrol</TableCell>
                <TableCell>Name</TableCell>
                {user.isTrailGuide &&
                  <TableCell>Actions</TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {PATROLS_ARRAY
                .filter((patrol) => !!membersByPatrol[patrol.key])
                .map((patrol) => membersByPatrol[patrol.key]
                  .map((member, index) => (
                    <TableRow
                      key={`${member.firstName} ${member.lastName}`}
                      sx={{
                        '& td': {
                          backgroundColor: patrol.color,
                        },
                      }}
                    >
                      {index === 0 &&
                        <TableCell
                          rowSpan={membersByPatrol[patrol.key].length}
                          sx={{
                            width: 85,
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                          }}
                        >
                          <Image src={patrol.icon} alt='Patrol Logo' width={50} />
                        </TableCell>
                      }
                      <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                      <TableCell>
                        <Link href={`/reports/advancement?id=${member._id}`}>Adv Report</Link>
                      </TableCell>
                      {user.isTrailGuide &&
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <IconButton
                            onClick={() => openEdit(member)}
                            sx={{ color: 'inherit' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      }
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </Paper>
      }
    </PageLayout>
  );
}

export async function getServerSideProps({ req, res }) {
  const props = await serverCheckSession(req, res);
  return props;
}
