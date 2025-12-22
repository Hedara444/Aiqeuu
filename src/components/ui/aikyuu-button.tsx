import React from 'react';
import { Button, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary';
}

export function AikyuuButton({
  variant = 'primary',
  children,
  sx,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant={variant === 'primary' ? 'contained' : 'outlined'}
      fullWidth
      sx={{
        height: { xs: '39px', md: '48px' },
        borderRadius: '100px',
        fontFamily: 'Montserrat',
        fontSize: { xs: '22px', md: '21px', lg: '22' },
        fontWeight: 400,
        textTransform: 'none',
        ...(variant === 'primary' && {
          backgroundColor: 'primary.main',
          color: 'white',
          // '&:hover': {
          //   backgroundColor: '#00D4A8',
          // },
        }),
        ...(variant === 'secondary' && {
          backgroundColor: 'transparent',
          color: 'primary.main',
          borderColor: 'primary.main',
          // '&:hover': {
          //   backgroundColor: 'rgba(0, 235, 189, 0.1)',
          // },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
