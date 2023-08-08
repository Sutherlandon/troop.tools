import cloneDeep from 'lodash.clonedeep';
import {
  Box,
  CircularProgress,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';

import AccessDenied from '@client/components/AccessDenied';
import { ADVANCEMENT, ADVANCEMENT_BLANK, PATROLS } from '@shared/constants';
import { Check, Close } from '@mui/icons-material';

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

export default function AdvancementReport(props) {
  const { member, user } = props;

  if (!user.isParent) {
    return (
      <AccessDenied>
        You have not been granted access to the advancement report. Please
        contact your Troop Master and ask them to grant you the <b>Parent</b> role.
      </AccessDenied>
    );
  }

  if (!member) {
    return <CircularProgress />;
  }

  // process advancement to match the shape of the ADVANCMENT constanst
  const adv = {
    [PATROLS.foxes.id]: {
      branch: cloneDeep(ADVANCEMENT_BLANK),
      star: cloneDeep(ADVANCEMENT_BLANK),
    },
    [PATROLS.hawks.id]: {
      branch: cloneDeep(ADVANCEMENT_BLANK),
      star: cloneDeep(ADVANCEMENT_BLANK),
    },
    [PATROLS.mountainLions.id]: {
      branch: cloneDeep(ADVANCEMENT_BLANK),
      star: cloneDeep(ADVANCEMENT_BLANK),
    },
  };

  // fill the advancement with lessons
  member.adv.forEach((lesson) => {
    const { branch, patrolID, type } = lesson;

    // if the branch award has been earned, add credits to the star award
    if (adv[patrolID].branch[branch].award || adv[patrolID].branch[branch][type] === ADVANCEMENT[branch][type]) {
      // save the lesson credit
      adv[patrolID].star[branch][type] += 1;

      // has the branch award been earned
      const [missingStarCredits] = missingCredits(adv[patrolID].star[branch], branch);
      if (missingStarCredits === 0) {
        adv[patrolID].star[branch].award = true;
      }
    } else {
      // save the lesson credit
      adv[patrolID].branch[branch][type] += 1;

      // has the branch award been earned
      const [missingBranchCredits] = missingCredits(adv[patrolID].branch[branch], branch);
      if (missingBranchCredits === 0) {
        adv[patrolID].branch[branch].award = true;
      }
    }
  });

  return (
    <Box>
      <Typography variant='h5' marginBottom={2}>
        Advancement Report
      </Typography>
      <Typography variant='body1' marginBottom={2}>
        In this report the denominator is the number of credits needed to earn a pin
        and the numerator is the total number of credits earned. Badges earned are
        designated with a checkmark. Please check with the schedule to see what branches
        we have completed this year.
      </Typography>
      <AdvancementTable
        title='Fox'
        adv={Object.values(adv)[0]}
      />
      <AdvancementTable
        title='Hawk'
        adv={Object.values(adv)[1]}
      />
      <AdvancementTable
        title='Mountain Lion'
        adv={Object.values(adv)[2]}
      />
    </Box>
  );
}

function AdvancementTable({ adv, badges, title }) {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant='h5' marginBottom={1}>{title}</Typography>
      <Paper sx={{ mb: 2, width: 'fit-content' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Branch Pin</TableCell>
              <TableCell>Core</TableCell>
              <TableCell>Elective</TableCell>
              <TableCell>HTT</TableCell>
              <TableCell>Makeup</TableCell>
              <TableCell>Award</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(adv.branch).map((branch) => (
              <TableRow key={branch}>
                <TableCell>{branch}</TableCell>
                {Object.keys(adv.branch[branch])
                  .map((type) => type !== 'award' && (
                    <TableCell key={'adv' + branch + type}>
                      {adv.branch[branch][type]}/{ADVANCEMENT[branch][type]}
                    </TableCell>
                  ))
                }
                <TableCell key={'adv' + branch + 'award'}>
                  {adv.branch[branch].award
                    ? <Check />
                    : <Close style={{ color: '#DDDDDD' }} />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper sx={{ width: 'fit-content' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Sylvan Star</TableCell>
              <TableCell>Core</TableCell>
              <TableCell>Elective</TableCell>
              <TableCell>HTT</TableCell>
              <TableCell>Makeup</TableCell>
              <TableCell>Award</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(adv.star).map((branch) => (
              <TableRow key={branch}>
                <TableCell>{branch}</TableCell>
                {Object.keys(adv.star[branch])
                  .map((type) => type !== 'award' && (
                    <TableCell key={'adv' + branch + type}>
                      {adv.star[branch][type]}/{ADVANCEMENT[branch][type]}
                    </TableCell>
                  ))
                }
                <TableCell key={'adv' + branch + 'award'}>
                  {adv.star[branch].award
                    ? <Check />
                    : <Close style={{ color: '#DDDDDD' }} />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

AdvancementReport.auth = true;
