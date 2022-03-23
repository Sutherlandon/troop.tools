import { FormControl, InputLabel, Select } from '@mui/material';
import { Field } from 'formik';

export default function FormikMuiSelect(props) {
  const { children, label, name, ...rest } = props;

  return (
    <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }}>
      <InputLabel id={`${name}-selector-label`}>{label}</InputLabel>
      <Field
        as={Select}
        name={name}
        id={`${name}-selector`}
        label={label}
        labelId={`${name}-selector-label`}
        {...rest}
      >
        {children}
      </Field>
    </FormControl>
  );
} 
