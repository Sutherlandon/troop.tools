import { useField } from 'formik';
import { FormControl, TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';

export default function FormikMuiDatePicker(props) {
  const { name, label } = props;
  const [field, , helpers] = useField(name);

  return (
    <FormControl fullWidth sx={{ maxWidth: 500, marginBottom: 2 }}>
      <DatePicker
        label={label || 'Date'}
        inputFormat='LL/dd/y'
        value={field.value}
        onChange={(value) => helpers.setValue(value)}
        renderInput={(params) => <TextField {...params} />}
      />
    </FormControl>
  );
}
