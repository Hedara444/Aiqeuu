import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

export default function Index() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #F1F5F9, #E2E8F0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center', px: 2.1 }}>
        <Typography variant="h1" sx={{
          fontSize: { xs: '1.4rem', md: '2.1rem' },
          fontWeight: 700,
          color: '#1E293B',
          mb: 2.1
        }}>
          Welcome to Aikyuu
        </Typography>
        <Typography variant="h5" sx={{
          fontSize: '0.79rem',
          color: '#475569',
          mb: 2.8
        }}>
          Your AI-powered recruitment platform for smarter hiring decisions
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.4,
          justifyContent: 'center'
        }}>
          <Button
            component={Link}
            to="/signin"
            variant="contained"
            sx={{
              backgroundColor: '#2563EB',
              color: 'white',
              px: 2.1,
              py: 0.7,
              borderRadius: '5.6px',
              fontWeight: 600,
              fontSize: '0.7rem',
              '&:hover': { backgroundColor: '#1D4ED8' }
            }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/use-cases"
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              color: '#1E293B',
              px: 2.1,
              py: 0.7,
              borderRadius: '5.6px',
              fontWeight: 600,
              fontSize: '0.7rem',
              borderColor: '#CBD5E1',
              '&:hover': { backgroundColor: '#F8FAFC' }
            }}
          >
            View Use Cases
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
