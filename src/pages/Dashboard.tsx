import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Container } from '@mui/material';
import Stepper from '@/components/ui/Stepper';

export default function Dashboard() {
  return (
    <>
      {/* Main Content */}
      <Box sx={{ px: { xs: 1.5, md: 3 }, flex: 1 }}>
        {/* Process Flow Section */}
        <Stepper step={1} />

        {/* Create New Position Button background */}
        <Box sx={{ mb: 30  }}>
          <Box
            component={Link}
            to="/create-position"
            sx={{ display: 'block', width: '100%', maxWidth: '666.4px', mx: 'auto', textDecoration: 'none' }}
          >
            <Paper sx={{
              backgroundColor: 'primary.main',
              borderRadius: '11.2px',
              py: 1.4,
              px: { xs: 2.1, md: '11.2px'  },
              '&:hover': { opacity: 0.9 },
              transition: 'background-color 0.3s'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.7rem', md: '0.7rem' },
                  fontWeight: 700
                }}>
                  + Create New Position
                </Typography>
                
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}
