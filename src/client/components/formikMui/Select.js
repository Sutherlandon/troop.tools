import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { useField } from 'formik';

export default function FormikMuiSelect(props) {
  const { children, helperText, label, name, ...rest } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }} error={meta.error}>
      <InputLabel id={`${name}-selector-label`}>{label}</InputLabel>
      <Select
        id={`${name}-selector`}
        label={label}
        labelId={`${name}-selector-label`}
        name={name}
        onChange={field.onChange}
        value={field.value}
        {...rest}
      >
        {children}
      </Select>
      <FormHelperText>{helperText || meta.error}</FormHelperText>
    </FormControl>
  );
}
