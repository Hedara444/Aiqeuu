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
import { usePositionsStore } from '@/store/positionsStore';
import Stepper from '@/components/ui/Stepper';
import { useTranslation } from 'react-i18next';

const injectAnalysisStyles = () => {
  if (document.getElementById('analysis-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'analysis-ux-styles';
  s.textContent = `
    @keyframes analysis-fade-up { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes analysis-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
  `;
  document.head.appendChild(s);
};

export default function Analysis() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(55);
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const { currentPosition, getPositionById } = usePositionsStore();

  useEffect(() => {
    injectAnalysisStyles();
  }, []);

  useEffect(() => {
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fbff 0%, #f5f8fc 100%)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.14) 0%, rgba(23,118,242,0) 70%)', animation: 'analysis-float 6s ease-in-out infinite' }} />
      <Box sx={{ px: { xs: 1.5, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Stepper step={2} />

        <Container maxWidth="lg" sx={{ mb: 8, animation: 'analysis-fade-up 0.5s ease-out both' }}>
          <Paper sx={{ background: 'linear-gradient(135deg, #10243f 0%, #14355f 58%, #1776F2 100%)', borderRadius: '18px', p: 3, boxShadow: '0 18px 42px rgba(16,36,63,0.2)' }}>
            <Stack alignItems="center" spacing={3.5}>
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  width: '100%',
                  height: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.28)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #00D4A8 0%, #4fc3ff 45%, #ffffff 100%)',
                    borderRadius: '12px',
                    transition: 'transform 0.2s linear',
                  },
                }}
              />

              {/* Processing Text */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ color: 'white', fontFamily: 'Montserrat', fontSize: { xs: '1rem', md: '1.125rem' }, fontWeight: 700 }}>
                  Processing
                </Typography>
                <Typography sx={{ color: '#c5f7eb', fontFamily: 'Montserrat', fontSize: { xs: '1rem', md: '1.125rem' }, fontWeight: 700 }}>
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
              {progress < 30 && t('analysis.status.analyzing')}
              {progress >= 30 && progress < 60 && t('analysis.status.comparing')}
              {progress >= 60 && progress < 90 && t('analysis.status.generating')}
              {progress >= 90 && progress < 100 && t('analysis.status.finalizing')}
              {progress >= 100 && t('analysis.status.complete')}
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
                  {t('analysis.redirecting')}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
