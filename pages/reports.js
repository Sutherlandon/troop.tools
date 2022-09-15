import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';

import {
  ADVANCEMENT,
  BRANCH_COLORS,
} from '../config/constants';

function AdvRow({ label }) {
  return (
    <>
      <TableRow>
        <TableCell
          rowSpan={3}
          sx={{
            borderTop: 3,
            borderTopColor: 'gray',
            borderBottom: 3,
            borderBottomColor: 'gray',
          }}
        >
          {label}
        </TableCell>
        <TableCell
          sx={{
            borderTop: 3,
            borderTopColor: 'gray',
          }}
        >
          Date
        </TableCell>
        {Object.keys(ADVANCEMENT).map((branch) => (
          <TableCell key={branch} sx={{
            background: BRANCH_COLORS[branch].b,
            color: BRANCH_COLORS[branch].t,
            whiteSpace: 'nowrap',
            minWidth: 80,
          }}>
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell>Step</TableCell>
        {Object.keys(ADVANCEMENT).map((branch) => (
          <TableCell key={branch} sx={{
            background: BRANCH_COLORS[branch].b,
            color: BRANCH_COLORS[branch].t,
            whiteSpace: 'nowrap',
            minWidth: 80,
          }}>
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell
          sx={{
            borderBottom: 3,
            borderBottomColor: 'gray',
          }}
        >
          Trail Guide
        </TableCell>
        {Object.keys(ADVANCEMENT).map((branch) => (
          <TableCell key={branch} sx={{
            background: BRANCH_COLORS[branch].b,
            color: BRANCH_COLORS[branch].t,
            whiteSpace: 'nowrap',
            minWidth: 80,
            borderBottom: 3,
            borderBottomColor: 'gray',
          }}>
          </TableCell>
        ))}
      </TableRow>
    </>
  );
}

function BookReport(props) {
  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          {Object.keys(ADVANCEMENT).map((branch) => (
            <TableCell key={branch} sx={{
              background: BRANCH_COLORS[branch].b,
              borderBottom: 3,
              borderBottomColor: 'gray',
              color: BRANCH_COLORS[branch].t,
              whiteSpace: 'nowrap',
              minWidth: 80,
            }}>
              {branch}
            </TableCell>
          ))}
        </TableRow>
        <AdvRow label='Core'></AdvRow>
        <AdvRow label='Core'></AdvRow>
        <AdvRow label='Core'></AdvRow>
        <AdvRow label='Elective'></AdvRow>
        <AdvRow label='Elective'></AdvRow>
        <AdvRow label='HTT'></AdvRow>
      </TableHead>

      <TableBody>
      </TableBody>
    </Table>
  );
};

export default BookReport;
