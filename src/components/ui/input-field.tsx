import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label?: string;
  error?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, sx, ...props }, ref) => {
    return (
      <TextField
        type={type}
        label={label}
        variant="outlined"
        fullWidth
        error={error}
        inputRef={ref}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: { xs: '44px', md: '60px' },
            borderRadius: '16px',
            fontSize: { xs: '1.1025rem', md: '1.125rem', lg: '1.15rem' },
            fontFamily: 'Montserrat',
            backgroundColor: 'background.paper',
            '& fieldset': {
              borderColor: '#C1C1C1',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
            ...(error && {
              '& fieldset': {
                borderColor: 'error.main',
              },
            }),
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.8rem', md: '1.125rem' },
            color: '#C1C1C1',
            fontFamily: 'Montserrat',
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

InputField.displayName = 'InputField';

export { InputField };
