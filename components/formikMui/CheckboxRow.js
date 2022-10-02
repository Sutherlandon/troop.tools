import PropTypes from 'prop-types';
import { Checkbox, TableRow, TableCell } from '@mui/material';
import { useField } from 'formik';

function FormikMuiCheckboxRow(props) {
  const { groupName, label, name, ...rest } = props;
  const formikName = groupName ? `${groupName}.${name}` : name;
  const [{ value }, , helpers] = useField(formikName);

  return (
    <TableRow
      hover
      onClick={() => helpers.setValue(!value)}
      role='checkbox'
      {...rest}
    >
      <TableCell padding='checkbox'>
        <Checkbox
          color='primary'
          checked={value}
        />
      </TableCell>
      <TableCell>{label || name}</TableCell>
    </TableRow>
  );
}

FormikMuiCheckboxRow.propTypes = {
  groupName: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FormikMuiCheckboxRow;
