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
import { Footer } from '@/components/ui/Footer';
import { usePositionsStore } from '@/store/positionsStore';
import Stepper from '@/components/ui/Stepper';

export default function Analysis() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(55);

  const { id } = useParams<{ id: string }>();

  const { currentPosition, getPositionById } = usePositionsStore();

  useEffect(() => {
    // Polling for status
    const statusInterval = setInterval(async () => {
      if (!id) return;
      const updatedPosition = await getPositionById(id);

      if (updatedPosition?.status === "completed") {
        setProgress(100);
        clearInterval(statusInterval);
        setTimeout(() => {
          navigate(`/view-result/${id}`);
        }, 1000);
      }
    }, 3000);

    // Smooth dummy progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Hold at 90% until completion
        return Math.min(prev + Math.random() * 1.5, 90);
      });
    }, 200);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
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
          <Paper sx={{ backgroundColor: 'primary.dark', borderRadius: '16px', p: 3, boxShadow: 1 }}>
            <Stack alignItems="center" spacing={3.5}>
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  width: '100%',
                  height: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main',
                    borderRadius: '12px',
                    transition: 'transform 0.2s linear',
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
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 700
                }}>
                  Processing
                </Typography>
                <Typography sx={{
                  color: 'primary.main',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1rem', md: '1.125rem' },
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
      <Footer/>
    </Box>
  );
}