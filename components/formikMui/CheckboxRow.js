import PropTypes from 'prop-types';
import { Checkbox, TableRow, TableCell } from '@mui/material';
import { Field } from 'formik';

function FormikMuiCheckboxRow(props) {
  const { groupName, name, ...rest } = props;

  const formikName = `${groupName}.${name}`;

  return (
    <Field name={formikName}>
      {({ 
        field: { value: checked = false },
        form: { setFieldValue }
      }) => (
        <TableRow
          hover
          onClick={() => setFieldValue(formikName, !checked)}
          role='checkbox'
          {...rest}
        >
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              checked={checked}
            />
          </TableCell>
          <TableCell>{name}</TableCell>
        </TableRow>
      )}
    </Field>
  );
} 

FormikMuiCheckboxRow.propTypes = {
  groupName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default FormikMuiCheckboxRow;
