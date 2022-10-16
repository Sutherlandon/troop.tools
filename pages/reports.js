import {
  Box,
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

function Cell(props) {
  const {
    top,
    bottom,
    branch
  } = props;

  return (
    <TableCell key={branch} sx={{
      background: BRANCH_COLORS[branch]?.b,
      borderBottom: '3px solid gray',
      color: BRANCH_COLORS[branch]?.t,
      whiteSpace: 'nowrap',
      width: 130,
      padding: 0,
    }}>
      <Box sx={{
        borderBottom: '1px solid gray',
        padding: '6px 16px 0 16px'
      }}>
        {top}
      </Box>
      <Box sx={{ padding: '0 16px 6px 16px' }}>
        {bottom}
      </Box>
    </TableCell>
  );
}

function AdvRow({ label }) {
  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            borderTop: 3,
            borderTopColor: 'gray',
            borderBottom: 3,
            borderBottomColor: 'gray',
            width: 130,
          }}
        >
          {label}
        </TableCell>
        <Cell top='Date' bottom='Step #' />
        {Object.keys(ADVANCEMENT).map((branch) => (
          <Cell key={branch} branch={branch} />
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
          <TableCell sx={{ width: 130, borderBottom: '3px solid gray' }}></TableCell>
          <TableCell sx={{ width: 130, borderBottom: '3px solid gray' }}></TableCell>
          {Object.keys(ADVANCEMENT).map((branch) => (
            <TableCell key={branch} sx={{
              background: BRANCH_COLORS[branch].b,
              borderBottom: 3,
              borderBottomColor: 'gray',
              color: BRANCH_COLORS[branch].t,
              width: 130,
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
