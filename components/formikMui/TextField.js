import { Field } from 'formik';
import {
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';

export default function FormikMuiTextField(props) {
  const { children, label, name, ...rest } = props;

  return (
    <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }}>
      <Field
        as={TextField}
        name={name}
        id={`${name}-TextField`}
        label={label}
        {...rest}
      />
    </FormControl>
  );
} 
