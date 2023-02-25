import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ADVANCEMENT, BRANCHES, BRANCH_COLORS, PATROLS } from '@shared/constants';
import {
  Box,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import * as MembersAPI from '@client/api/MembersAPI';
import AccessDenied from '@client/components/AccessDenied';
import PageLayout from '@client/components/Layouts/PageLayout';
import serverCheckSession from 'lib/serverCheckSession';

/**
 * Calculates how many credits remain to earn a branch pin
 */
function missingCredits(row, branch) {
  const a = ADVANCEMENT[branch];
  const creditsReq = a.core + a.elective + a.htt;

  const branchPin = Math.max(
    0,
    creditsReq - (
      Math.min(row.core, a.core) +
      Math.min(row.elective, a.elective) +
      Math.min(row.htt, a.htt) +
      (Math.min(row.makeup, a.makeup) / 2))
  );

  const starPin = Math.max(
    0,
    2 * creditsReq - (
      Math.min(row.core, 2 * a.core) +
      Math.min(row.elective, 2 * a.elective) +
      Math.min(row.htt, 2 * a.htt) +
      (Math.min(row.makeup, 2 * a.makeup) / 2))
  );

  return [branchPin, starPin];
}

export default function MissingReportPage(props) {
  const [members, setMembers] = useState();
  const [summary, setSummary] = useState({});
  const { data: user } = useSession();

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await MembersAPI.get();

      if (error) {
        return console.error(error);
      }

      setMembers(data);
    }

    loadMembers();
  }, []);

  if (!user.isTrailGuide) {
    return (
      <AccessDenied>
        You have not been granted access to the missing report. Please
        contact your Troop Master and ask them to grant you the <b>Trail Guide</b> role.
      </AccessDenied>
    );
  }

  if (!members) {
    return <CircularProgress />;
  }

  return (
    <PageLayout>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Missing Lessons Report
      </Typography>
      <Box sx={{ mb: 3, maxWidth: 200 }}>
        <Table
          size='small'
          sx={{
            '& th': {
              backgroundColor: 'black',
              color: 'white',
              px: 1,
            },
            '& td': {
              backgroundColor: 'lightgray',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Legend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>C</TableCell>
              <TableCell>Core</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>E</TableCell>
              <TableCell>Elective</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>H</TableCell>
              <TableCell>Hit The Trail</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>M</TableCell>
              <TableCell>Makeup</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Grid container spacing={2}>
        {Object.keys(BRANCHES).map((branchName) => (
          <Grid item key={branchName}>
            <BranchGrid
              branch={branchName}
              members={members}
              setSummary={setSummary}
              summary={summary}
            />
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

function BranchGrid(props) {
  const { branch, members } = props;

  const oneLessonAway = { branch: 0, star: 0 };

  // build the grid

  const theGrid = members.map((member) => {
    const name = `${member.firstName} ${member.lastName}`;
    const row = {
      name,
      patrol: member.patrol,
      core: 0,
      elective: 0,
      htt: 0,
      makeup: 0,
    };

    // count up each type of lesson taken for this branch
    member.adv.forEach((lesson) => {
      if (lesson.branch === branch) {
        row[lesson.type] += 1;
      }
    });

    // calculate missing credits
    [row.branch, row.star] = missingCredits(row, branch);

    // keep a running total of members that are 1 lesson away
    // from a branch or star pin
    if (row.branch === 1) oneLessonAway.branch++;
    if (row.star === 1) oneLessonAway.star++;

    return row;
  });

  // save the one Lesson away up state

  return (
    <Table
      size='small'
      padding='none'
      sx={{
        '& td, & th': {
          px: 1,
        }
      }}
    >
      <TableHead>
        <TableRow sx={{
          '& th': {
            backgroundColor: BRANCHES[branch].b,
            color: BRANCHES[branch].t,
            borderTop: '1px solid black',
            borderBottom: '1px solid black',
          },
          '& th:first-of-type': {
            borderLeft: '1px solid black',
          },
          '& th:last-child': {
            borderRight: '1px solid black',
          },
        }}>
          <TableCell>{branch}</TableCell>
          <TableCell>C</TableCell>
          <TableCell>E</TableCell>
          <TableCell>H</TableCell>
          <TableCell>M</TableCell>
          <TableCell>Branch</TableCell>
          <TableCell>Star</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {theGrid.map((member) => (
          <TableRow
            key={member.name}
            sx={{
              '& td': {
                backgroundColor: PATROLS[member.patrol].color,
                borderBottom: 0,
              }
            }}
          >
            <TableCell sx={{
              borderLeft: '1px solid black',
            }}>
              {member.name}
            </TableCell>
            <TableCell>{member.core}</TableCell>
            <TableCell>{member.elective}</TableCell>
            <TableCell>{member.htt}</TableCell>
            <TableCell>{member.makeup}</TableCell>
            <TableCell sx={{
              backgroundColor: 'gray',
              borderLeft: '1px solid black',
              textAlign: 'center'
            }}>
              {member.branch}
            </TableCell>
            <TableCell sx={{
              backgroundColor: 'gray',
              borderRight: '1px solid black',
              textAlign: 'center'
            }}>
              {member.star}
            </TableCell>
          </TableRow>
        ))}
        <TableRow
          sx={{
            '& td': {
              borderTop: '1px solid black',
              borderBottom: '1px solid black',
              textAlign: 'center',
              paddingTop: 0,
              paddingBottom: 0,
            }
          }}
        >
          <TableCell
            sx={{
              borderLeft: 0,
              borderBottom: '0 !important',
            }}
          />
          <TableCell
            colSpan={4}
            sx={{
              borderLeft: '1px solid black',
              backgroundColor: BRANCH_COLORS.Award.b,
              color: BRANCH_COLORS.Award.t,
            }}
          >
            One Lesson Away
          </TableCell>
          <TableCell sx={{
            backgroundColor: BRANCH_COLORS.Award.b,
            color: BRANCH_COLORS.Award.t,
          }}>
            {oneLessonAway.branch}
          </TableCell>
          <TableCell sx={{
            borderRight: '1px solid black',
            backgroundColor: BRANCH_COLORS.Award.b,
            color: BRANCH_COLORS.Award.t,
          }}>
            {oneLessonAway.star}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export async function getServerSideProps({ req, res }) {
  const props = await serverCheckSession(req, res);
  return props;
}
