import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Radio,
  CircularProgress
} from '@mui/material';
import { AutoFixHigh, DriveFileRenameOutline } from '@mui/icons-material';
import Stepper from '@/components/ui/Stepper';
import { usePositionsStore } from '@/store/positionsStore';
import { useTranslation } from 'react-i18next';

const injectCriteriaSelectionStyles = () => {
  if (document.getElementById('criteria-selection-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'criteria-selection-ux-styles';
  s.textContent = `
    @keyframes cs-fade-up { from { opacity: 0; transform: translateY(18px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes cs-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
  `;
  document.head.appendChild(s);
};

export default function CriteriaSelection() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPosition, getPositionById, addCriteriaFullText, isLoading } = usePositionsStore();
  const { t } = useTranslation();
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [selection, setSelection] = useState<'full-text' | 'manual' | null>(null);
  const [fullText, setFullText] = useState('');

  const fetchData = async () => {
    setIsLoadingPage(true);
    await getPositionById(id!);
    setIsLoadingPage(false);
  };

  useEffect(() => { injectCriteriaSelectionStyles(); }, []);

  useEffect(() => {
    if (!currentPosition) {
      fetchData();
    }
  }, [id]);

  const handleNext = async () => {
    if (selection === 'manual') {
      navigate(`/create-criteria/${id}`);
    } else if (selection === 'full-text') {
      if (!fullText.trim()) return;

      try {
        await addCriteriaFullText(id!, fullText);
        navigate(`/create-criteria/${id}`);
      } catch (error) {
        // Error is handled in service layer ; AKA 'PoistionStore.tsx'
      }
    }
  };

  if (isLoadingPage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #f8fbff 0%, #f7f9fc 100%)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'fixed', top: '14%', right: '-80px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.09), transparent 70%)', animation: 'cs-float 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '12%', left: '-70px', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.08), transparent 70%)', animation: 'cs-float 11s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ px: { xs: 0.7, md: 2.8, flex: 1 }, position: 'relative', zIndex: 1 }}>
        <Stepper step={1} />
        <Container maxWidth="xl" sx={{ mb: 2.8 }}>
          <Stack spacing={1.75}>
            {/* Position Display */}
            {currentPosition && (
              <Paper sx={{ borderRadius: '8.4px', px: { xs: 1.4, md: 2.1 }, py: 1.05, boxShadow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2.1}>
                  <Typography sx={{ color: 'text.secondary', fontFamily: 'Montserrat', fontSize: { xs: '0.61rem', md: '0.7rem' }, fontWeight: 500 }}>
                    {t('criteriaSelection.positionLabel')}
                  </Typography>
                  <Typography sx={{ color: 'primary.dark', fontFamily: 'Montserrat', fontSize: { xs: '0.61rem', md: '0.7rem' }, fontWeight: 700 }}>
                    {currentPosition.title}
                  </Typography>
                </Stack>
              </Paper>
            )}

            {/* Selection Section */}
            <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 24px rgba(23,118,242,0.12)', border: '1px solid rgba(23,118,242,0.12)', animation: 'cs-fade-up .45s .08s both' }}>
              <Box sx={{ background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 55%, #00D4A8 100%)', px: { xs: 1.4, md: 2.1 }, py: 1.05 }}>
                <Typography variant="h1" sx={{ color: 'white', fontFamily: 'Montserrat', fontSize: { xs: '0.61rem', md: '0.7rem' }, fontWeight: 700 }}>
                  {t('criteriaSelection.header')}
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 1.4, md: 2.1 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.1} justifyContent="center" sx={{ mb: 2.1 }}>
                  {/* Full Text Option */}
                  <Paper
                    onClick={() => setSelection('full-text')}
                    sx={{
                      p: 2.1,
                      borderRadius: '8.4px',
                      border: selection === 'full-text' ? '1.4px solid' : '0.7px solid',
                      borderColor: selection === 'full-text' ? 'primary.main' : 'grey.300',
                      cursor: 'pointer',
                      flex: 1,
                      maxWidth: '245px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1.05,
                      backgroundColor: selection === 'full-text' ? 'rgba(23, 118, 242, 0.04)' : 'white',
                      transition: 'all 0.3s ease',
                      boxShadow: selection === 'full-text' ? '0 10px 22px rgba(23,118,242,0.14)' : '0 4px 10px rgba(0,0,0,0.05)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(23, 118, 242, 0.02)'
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.7} alignSelf="flex-start">
                      <Radio checked={selection === 'full-text'} size="small" />
                      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.56rem', color: 'text.secondary' }}>
                        {t('criteriaSelection.options.fullText')}
                      </Typography>
                    </Stack>
                    <AutoFixHigh sx={{ fontSize: 28, color: 'text.secondary', my: 1.05 }} />
                  </Paper>

                  {/* Manual Option */}
                  <Paper
                    onClick={() => setSelection('manual')}
                    sx={{
                      p: 2.1,
                      borderRadius: '8.4px',
                      border: selection === 'manual' ? '1.4px solid' : '0.7px solid',
                      borderColor: selection === 'manual' ? 'primary.main' : 'grey.300',
                      cursor: 'pointer',
                      flex: 1,
                      maxWidth: '245px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1.05,
                      backgroundColor: selection === 'manual' ? 'rgba(23, 118, 242, 0.04)' : 'white',
                      transition: 'all 0.3s ease',
                      boxShadow: selection === 'manual' ? '0 10px 22px rgba(23,118,242,0.14)' : '0 4px 10px rgba(0,0,0,0.05)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(23, 118, 242, 0.02)'
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.7} alignSelf="flex-start">
                      <Radio checked={selection === 'manual'} size="small" />
                      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.56rem', color: 'text.secondary' }}>
                        {t('criteriaSelection.options.manual')}
                      </Typography>
                    </Stack>
                    <DriveFileRenameOutline sx={{ fontSize: 28, color: 'text.secondary', my: 1.05 }} />
                  </Paper>
                </Stack>

                {/* Conditional Text Area for Full Text */}
                {selection === 'full-text' && (
                  <Box sx={{ maxWidth: '582.4px', mx: 'auto', mb: 2.8 }}>
                     <Typography sx={{ mb: 0.7, fontFamily: 'Montserrat', fontWeight: 600, fontSize: '0.7rem' }}>{t('criteriaSelection.fullTextLabel')}</Typography>
                      <textarea
                        style={{
                            width: '100%',
                            minHeight: '105px',
                            padding: '11.2px',
                            borderRadius: '8.4px',
                            border: '0.7px solid #C1C1C1',
                            fontFamily: 'Montserrat',
                            fontSize: '0.7rem',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                        value={fullText}
                        onChange={(e) => setFullText(e.target.value)}
                        placeholder={t('criteriaSelection.fullTextPlaceholder')}
                      />
                  </Box>
                )}

                {/* Action Buttons */}
                <Stack direction="row" spacing={1.4} justifyContent="flex-end">
                  <Button
                    onClick={() => navigate('/create-position')}
                    variant="outlined"
                    sx={{
                        px: 2.1,
                        py: 0.7,
                      height:"28px",
                      width:"63px",
                        borderRadius: '14.2px',
                        borderColor: 'grey.400',
                        color: 'primary.dark',
                        fontFamily: 'Montserrat',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: 'grey.50', borderColor: 'grey.400' },
                    }}
                  >
                    {t('common.actions.back')}
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    disabled={!selection || !fullText  || isLoading}
                    sx={{
                        px: 2.1,
                        py: 0.7,
                        height:"28px",
                        width:"63px",
                        borderRadius: '14.2px',
                        background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 100%)',
                        color: 'white',
                        fontFamily: 'Montserrat',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 8px 16px rgba(23,118,242,0.24)',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          background: 'linear-gradient(135deg, #1266da 0%, #0b56ba 100%)',
                          boxShadow: '0 12px 22px rgba(23,118,242,0.33)'
                        }
                    }}
                  >
                    {isLoading ? <CircularProgress size={16} color="inherit" /> : t('common.actions.next')}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
