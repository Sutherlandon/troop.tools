import { useField } from 'formik';
import { FormControl, TextField } from '@mui/material';

export default function FormikMuiTextField(props) {
  const { label, ...rest } = props;
  const [field, meta] = useField(rest);

  return (
    <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }}>
      <TextField
        label={label}
        {...field}
        {...props}
        error={meta.touched && !!meta.error}
      />
    </FormControl>
  );
}
