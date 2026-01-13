import { createTheme } from '@mui/material/styles';

// Define the color palette based on the existing design system
const palette = {
  aikyuu: {
    primary: '#1776F2', // aikyuu-primary (teal/green)
    dark: '#1F1F1F',    // aikyuu-dark (almost black)
    text: '#1E1E1E',    // Main text color
    gray: '#707070',    // Gray text
    grayLine: '#C1C1C1', // Gray line/border
    background: '#F8F7F7', // Main background
  }
};

// Create custom MUI theme
export const theme = createTheme({
  palette: {
    primary: {
      main: palette.aikyuu.primary,
      dark: palette.aikyuu.dark,
      contrastText: palette.aikyuu.dark,
    },
    secondary: {
      main: palette.aikyuu.dark,
      contrastText: '#ffffff',
    },
    text: {
      primary: palette.aikyuu.text,
      secondary: palette.aikyuu.gray,
    },
    background: {
      default: palette.aikyuu.background,
      paper: '#ffffff',
    },
    grey: {
      100: '#F6F6F6',
      200: '#F2F2F2',
      300: '#E5E5E5',
      400: palette.aikyuu.grayLine,
      500: palette.aikyuu.gray,
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Poppins", "Quicksand", sans-serif',
    h1: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '3.5rem', // 72px
      color: palette.aikyuu.text,
    },
    h2: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '2.25rem', // 40px
      color: palette.aikyuu.text,
    },
    h3: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.475rem',
      color: palette.aikyuu.text,
    },
    h4: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.25rem',
      color: palette.aikyuu.text,
    },
    h5: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.125rem',
      color: palette.aikyuu.text,
    },
    h6: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.0025rem',
      color: palette.aikyuu.text,
    },
    body1: {
      fontFamily: 'Montserrat',
      fontSize: '1.0125rem',
      color: palette.aikyuu.text,
    },
    body2: {
      fontFamily: 'Montserrat',
      fontSize: '1.0125rem',
      color: palette.aikyuu.text,
    },
    button: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    // Customize MUI components to match the existing design
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontFamily: 'Montserrat',
          fontWeight: 700,
          fontSize: '1.125rem',
          padding: '16px 32px',
          '&:hover': {
            opacity: 0.9,
          },
        },
        contained: {
          backgroundColor: palette.aikyuu.primary,
          color: palette.aikyuu.dark,
          '&:hover': {
            backgroundColor: palette.aikyuu.primary,
            opacity: 0.9,
          },
        },
        outlined: {
          borderColor: palette.aikyuu.dark,
          color: palette.aikyuu.dark,
          '&:hover': {
            borderColor: palette.aikyuu.dark,
            backgroundColor: 'rgba(31, 31, 31, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: palette.aikyuu.grayLine,
            },
            '&:hover fieldset': {
              borderColor: palette.aikyuu.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.aikyuu.primary,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: palette.aikyuu.gray,
            fontFamily: 'Montserrat',
          },
          '& .MuiOutlinedInput-input': {
            fontFamily: 'Montserrat',
            fontSize: '1.125rem',
            color: palette.aikyuu.text,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '22px',
          paddingRight: '22px',
          '@media (min-width: 768px)': {
            paddingLeft: '38px',
            paddingRight: '38px',
          },
        },
      },
    },
  },
});

// Extend theme type for custom colors
declare module '@mui/material/styles' {
  interface Palette {
    aikyuu: {
      primary: string;
      dark: string;
      text: string;
      gray: string;
      grayLine: string;
      background: string;
    };
  }

  interface PaletteOptions {
    aikyuu?: {
      primary?: string;
      dark?: string;
      text?: string;
      gray?: string;
      grayLine?: string;
      background?: string;
    };
  }
}

export default theme;