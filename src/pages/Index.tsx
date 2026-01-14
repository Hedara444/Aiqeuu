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
      <Container maxWidth="md" sx={{ textAlign: 'center', px: 3 }}>
        <Typography variant="h1" sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 700,
          color: '#1E293B',
          mb: 3
        }}>
          Welcome to Aikyuu
        </Typography>
        <Typography variant="h5" sx={{
          fontSize: '1.125rem',
          color: '#475569',
          mb: 4
        }}>
          Your AI-powered recruitment platform for smarter hiring decisions
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button
            component={Link}
            to="/signin"
            variant="contained"
            sx={{
              backgroundColor: '#2563EB',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: '8px',
              fontWeight: 600,
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
              px: 3,
              py: 1,
              borderRadius: '8px',
              fontWeight: 600,
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