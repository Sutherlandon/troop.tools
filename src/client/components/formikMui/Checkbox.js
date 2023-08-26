import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useField } from 'formik';

function FormikMuiCheckbox(props) {
  const { formGroupSx, name, label, ...rest } = props;
  const [{ value }, , helpers] = useField(name);

  return (
    <FormGroup sx={{ mb: 1, ...formGroupSx }}>
      <FormControlLabel
        label={label || name}
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
  formGroupSx: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FormikMuiCheckbox;
