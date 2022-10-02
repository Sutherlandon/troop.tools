import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useField } from 'formik';

function FormikMuiCheckbox(props) {
  const { groupName, name, ...rest } = props;
  const formikName = groupName ? `${groupName}.${name}` : name;
  const [{ value }, , helpers] = useField(formikName);

  return (
    <FormGroup sx={{ mb: 1 }}>
      <FormControlLabel
        label={name}
        onChange={() => helpers.setValue(!value)}
        control={
          <Checkbox
            color='primary'
            checked={value}
          />
        }
        {...rest}
      />
    </FormGroup>
  );
}

FormikMuiCheckbox.propTypes = {
  groupName: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FormikMuiCheckbox;
