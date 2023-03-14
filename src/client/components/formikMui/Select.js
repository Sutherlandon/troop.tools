import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { useField } from 'formik';

export default function FormikMuiSelect(props) {
  const { children, helperText, label, name, ...rest } = props;
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.error) && Boolean(meta.touched);

  return (
    <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }} error={hasError}>
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
      <FormHelperText>{helperText || (hasError && meta.error)}</FormHelperText>
    </FormControl>
  );
}
