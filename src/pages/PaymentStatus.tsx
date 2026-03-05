import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Container, CircularProgress } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuccess = location.pathname.includes('/payment-success');

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/use-cases');
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2
        }}
      >
        {isSuccess ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Thank you for your purchase. Your credits have been added to your account.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Redirecting to Use Cases...
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/use-cases')}
              sx={{ mt: 2, borderRadius: '50px', textTransform: 'none', color: 'white' }}
            >
              Go to Use Cases Now
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Payment Cancelled
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The payment process was cancelled or failed. No charges were made.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/pricing')}
              sx={{ mt: 2, borderRadius: '50px', textTransform: 'none', color: 'white' }}
            >
              Return to Pricing
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default PaymentStatus;