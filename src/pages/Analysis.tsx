import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  LinearProgress,
  Stack
} from '@mui/material';
import { Navbar } from '@/components/ui/navbar';
import { usePositionsStore } from '@/store/positionsStore';
import Stepper from '@/components/ui/Stepper';

export default function Analysis() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(55);

  const { id } = useParams<{ id: string }>();

  const { currentPosition, getPositionById } = usePositionsStore();

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedPosition = await getPositionById(id!);

      if (updatedPosition?.status === "completed") {
        clearInterval(interval);
        setTimeout(() => {
          navigate(`/view-result/${id}`);
        }, 1000);
        return;
      }

      setProgress(prev => Math.min(prev + Math.random() * 20, 100));
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate, id, getPositionById]);

  // useEffect(() => {
  //   // Simulate processing progress
  //   const interval = setInterval(() => {
  //     setProgress(prev => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         // Navigate to results page when complete
  //         setTimeout(() => {
  //           navigate('/view-result');
  //         }, 1000);
  //         return 100;
  //       }
  //       return Math.min(prev + Math.random() * 20, 100);
  //     });
  //   }, 800);

  //   return () => clearInterval(interval);
  // }, [navigate]);



  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ px: { xs: 1.5, md: 6 } }}>
        {/* Process Flow Section */}
        <Stepper step={2} />

        {/* Processing Section */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Paper sx={{ backgroundColor: 'primary.dark', borderRadius: '16px', p: 5, boxShadow: 1 }}>
            <Stack alignItems="center" spacing={3.5}>
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  width: '100%',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'grey.300',
                  position: 'relative',
                  overflow: 'hidden',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main',
                    borderRadius: '12px',
                    transition: 'transform 0.7s ease-out',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'pulse 2s ease-in-out infinite',
                    },
                  },
                }}
              />

              {/* Processing Text */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{
                  color: 'primary.main',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 700
                }}>
                  Processing
                </Typography>
                <Typography sx={{
                  color: 'primary.main',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 700
                }}>
                  {Math.round(progress)}%
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Container>

        {/* Status Messages */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{
              color: 'text.secondary',
              fontFamily: 'Montserrat',
              fontSize: '1.125rem',
              mb: 2
            }}>
              {progress < 30 && "Analyzing uploaded CVs..."}
              {progress >= 30 && progress < 60 && "Comparing against criteria..."}
              {progress >= 60 && progress < 90 && "Generating recommendations..."}
              {progress >= 90 && progress < 100 && "Finalizing results..."}
              {progress >= 100 && "Analysis complete!"}
            </Typography>

            {progress >= 100 && (
              <Box sx={{
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                <Typography sx={{
                  color: 'primary.main',
                  fontFamily: 'Montserrat',
                  fontSize: '1.25rem',
                  fontWeight: 700
                }}>
                  Redirecting to results...
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ backgroundColor: 'grey.800', py: 10 }}>
        <Container maxWidth="xl" sx={{ px: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <svg
                width="52"
                height="86"
                viewBox="0 0 53 87"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '48px', height: '80px', fill: '#1776F2' }}
              >
                <path
                  d="M34.7183 86.5C34.2121 86.3976 34.0062 86.0288 33.7227 85.7419C26.4361 78.3638 21.2602 69.1269 18.7447 59.012C18.4475 57.5946 17.8379 56.2633 16.9614 55.1175C16.0848 53.9716 14.9639 53.0408 13.6822 52.3944C10.4153 50.571 6.96267 49.0958 3.77671 47.088C-0.610738 44.3563 -0.587117 42.4372 3.81721 39.6918C7.19217 37.5816 10.9046 36.1269 14.2796 34.0372C15.7291 33.326 16.9471 32.2098 17.7895 30.8206C18.1528 29.9007 18.4252 28.9468 18.6029 27.9727C21.2408 17.8517 26.4229 8.59367 33.6451 1.09937C34.4382 0.279853 34.8432 0.320829 35.6127 1.09937C41.0126 6.54917 46.4317 11.9705 51.8699 17.3634C52.582 18.0463 52.7238 18.4697 51.9509 19.2688C51.9509 19.2688 47.8301 25.5381 45.7005 28.6284C44.3974 30.9007 42.5555 32.8089 40.341 34.1806C36.7906 36.1269 33.014 37.6226 29.5412 39.7533C28.1 40.6343 26.2742 41.5358 26.2539 43.3592C26.2337 45.2646 28.1203 46.166 29.6019 47.0675C32.8689 49.0753 36.4025 50.5505 39.8112 52.3124C42.3643 53.8013 44.4653 55.9696 45.8861 58.5817C47.9111 61.6345 52.0555 67.675 52.0555 67.675C52.7035 68.3579 52.6023 68.6994 52.015 69.2935C46.4733 74.7843 40.9721 80.3126 35.4541 85.8239C35.228 86.0698 34.9445 86.2917 34.7183 86.5Z"
                  fill="#1776F2"
                />
              </svg>
              <Typography sx={{
                color: 'primary.main',
                fontFamily: 'Poppins',
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                fontWeight: 700
              }}>
                Aikyuu
              </Typography>
            </Box>

            {/* Copyright */}
            <Typography sx={{
              color: 'grey.300',
              fontFamily: 'Poppins',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              textAlign: 'center'
            }}>
              Copyright © Resumate. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}