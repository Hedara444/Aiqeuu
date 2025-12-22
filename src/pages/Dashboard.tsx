import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Container } from '@mui/material';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/Footer';
import Stepper from '@/components/ui/Stepper';

export default function Dashboard() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ px: { xs: 1.5, md: 3 } }}>
        {/* Process Flow Section */}
        <Stepper step={1} />

        {/* Create New Position Button background */}
        <Box sx={{ mb: 30  }}>
          <Box
            component={Link}
            to="/create-position"
            sx={{ display: 'block', width: '100%', maxWidth: '1952px', mx: 'auto', textDecoration: 'none' }}
          >
            <Paper sx={{
              backgroundColor: 'primary.main',
              borderRadius: '16px',
              py: 3,
              px: { xs: 4, md: '176px'  },
              '&:hover': { opacity: 0.9 },
              transition: 'background-color 0.3s'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1.05rem', md: '1.175rem' },
                  fontWeight: 700
                }}>
                  + Create New Position
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
