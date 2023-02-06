import PropTypes from 'prop-types';
import { FormGroup } from '@mui/material';
import Checkbox from './Checkbox';

function FormikMuiCheckboxGroup(props) {
  const { checkboxProps, label, name, options } = props;

  return (
    <FormGroup sx={{ mb: 1 }}>
      <label>{label}</label>
      {options.map((option) => {
        return (
          <Checkbox
            key={option}
            label={option}
            name={`${name}.${option}`}
            formGroupSx={{ mb: 0 }}
            {...checkboxProps}
          />
        );
      })}
    </FormGroup>
  );
}

FormikMuiCheckboxGroup.propTypes = {
  checkboxProps: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default FormikMuiCheckboxGroup;
