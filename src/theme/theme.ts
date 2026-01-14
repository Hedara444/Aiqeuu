import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1776F2',
      dark: '#121212',
      contrastText: '#1E1E1E',
    },
    secondary: {
      main: '#B5B5B5',
      light: '#C1C1C1',
      dark: '#707070',
    },
    error: {
      main: '#FF0000',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#707070',
    },
    background: {
      default: '#F8F7F7',
      paper: '#FFFFFF',
    },
    grey: {
      100: '#F6F6F6',
      200: '#F2F2F2',
      300: '#DAD2D2',
      400: '#C1C1C1',
      500: '#B5B5B5',
      600: '#707070',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Poppins", "Quicksand", sans-serif',
    h1: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:768px)': {
        fontSize: '2rem',
      },
      '@media (max-width:480px)': {
        fontSize: '1.75rem',
      },
    },
    h2: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '2rem',
      '@media (max-width:768px)': {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.5rem',
      '@media (max-width:768px)': {
        fontSize: '1.25rem',
      },
    },
    h4: {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontFamily: 'Montserrat',
      fontSize: '1rem',
      '@media (max-width:768px)': {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontFamily: 'Montserrat',
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '100px',
          height: '44px',
          fontSize: '0.9375rem',
          fontWeight: 700,
          textTransform: 'none',
          '@media (max-width:768px)': {
            height: '40px',
            fontSize: '0.875rem',
          },
        },
        contained: {
          backgroundColor: '#1776F2',
          color: '#1E1E1E',
          '&:hover': {
            backgroundColor: '#00D4A8',
          },
        },
        outlined: {
          borderColor: '#C1C1C1',
          color: '#1E1E1E',
          '&:hover': {
            backgroundColor: '#F8F7F7',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            height: '56px',
            fontSize: '1rem',
            '@media (max-width:768px)': {
              height: '48px',
              fontSize: '0.875rem',
            },
            '& fieldset': {
              borderColor: '#C1C1C1',
            },
            '&:hover fieldset': {
              borderColor: '#1776F2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1776F2',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
            color: '#C1C1C1',
            '@media (max-width:768px)': {
              fontSize: '0.875rem',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
  },
});