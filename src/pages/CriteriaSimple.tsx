import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Modal,
  Divider,
  TextField,
  Stack,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete } from '@mui/icons-material';
import { usePositionsStore } from '@/store/positionsStore';
import { toast } from 'react-toastify';
import Stepper from '@/components/ui/Stepper';
import { useTranslation } from 'react-i18next';

const injectCriteriaSimpleStyles = () => {
  if (document.getElementById('criteria-simple-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'criteria-simple-ux-styles';
  s.textContent = `
    @keyframes csm-fade-up { from { opacity: 0; transform: translateY(18px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes csm-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
  `;
  document.head.appendChild(s);
};

export default function CriteriaSimple() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [newCriteriaText, setNewCriteriaText] = useState('');

  const { currentPosition, getPositionById, addCriteria, deleteCriteria, isLoading } = usePositionsStore();

  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const fetchData = async () => {
    setIsLoadingPage(true)
    await getPositionById(id!)
    setIsLoadingPage(false)
  }

  useEffect(() => { injectCriteriaSimpleStyles(); }, []);

  useEffect(() => {
    if (!currentPosition) {
      fetchData()
    }
  }, [id])



  const handleAddCriteria = async () => {
    if (!newCriteriaText.trim()) return;
    await addCriteria(id, newCriteriaText)
   // await fetchData()
    setNewCriteriaText('');
  };

  const handleDeleteCriteria = async (critiriaId: string) => {
    await deleteCriteria(critiriaId)
    //await fetchData()
  };

  const handleSave = () => {

    if (currentPosition.criterias.length > 0) {
      navigate(`/upload-cv/${id}`);
    }
    else {
      toast.warning(t('criteriaSimple.toast.atLeastOne'));
    }

  };

  const handleCancel = () => {
    navigate('/create-position');
  };

  if (isLoadingPage) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fbff 0%, #f7f9fc 100%)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'fixed', top: '14%', right: '-80px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.09), transparent 70%)', animation: 'csm-float 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '12%', left: '-70px', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.08), transparent 70%)', animation: 'csm-float 11s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ px: { xs: 1, md: 4 }, position: 'relative', zIndex: 1 }}>
        {/* Process Flow Section */}
        <Stepper step={1} />

        {/* Position and Criteria Section */}
        <Container maxWidth="xl" sx={{ mb: 10 }}>
          <Stack spacing={2.5}>
            {/* Position Display */}
            <Paper sx={{ borderRadius: '12px', px: { xs: 2, md: 3 }, py: 1.5, boxShadow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Typography sx={{
                  color: 'text.secondary',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.875rem', md: '0.9rem' },
                  fontWeight: 500
                }}>
                  {t('criteriaSimple.positionLabel')}
                </Typography>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.875rem', md: '0.9rem' },
                  fontWeight: 700
                }}>
                  {currentPosition.title}
                </Typography>
              </Stack>
            </Paper>

            {/* Criteria Management Section */}
            <Paper sx={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 10px 24px rgba(23,118,242,0.12)', border: '1px solid rgba(23,118,242,0.12)', animation: 'csm-fade-up .45s .08s both' }}>
              {/* Header */}
              <Box sx={{ background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 55%, #00D4A8 100%)', px: { xs: 2, md: 3 }, py: 1.5 }}>
                <Typography variant="h1" sx={{
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.71rem', md: '0.8rem'},
                  fontWeight: 700
                }}>
                  {t('criteriaSimple.header')}
                </Typography>
              </Box>

              {/* Add Criteria Form */}
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={3}>
                  {/* Add New Criteria Row */}
                  <Paper
                    sx={{
                      backgroundColor: '#f8fbff',
                      borderRadius: '12px',
                      p: 0.75,
                      boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(23,118,242,0.14)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: '#f3f8ff',
                        transform: 'translateY(-1px)'
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Grid container columns={2} spacing={0.5} sx={{ width: '16px' }}>
                        {[...Array(6)].map((_, i) => (
                          <Grid key={i}>
                            <Box sx={{ width: '3px', height: '3px', backgroundColor: 'grey.400', borderRadius: '50%' }} />
                          </Grid>
                        ))}
                      </Grid>
                      <Typography sx={{
                        color: 'text.secondary',
                        fontFamily: 'Montserrat',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        mr: 'auto'
                      }}>
                        {t('criteriaSimple.addCriteriaLabel')}
                      </Typography>
                      <Box sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: '8px',
                        p: 0.25,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        minWidth: 0,
                        flex: 1,
                        maxWidth: '1012px',
                        ml: 1.5
                      }}>

                        <TextField
                          name="newCriteriaText"
                          value={newCriteriaText}
                          onChange={(e) => { setNewCriteriaText(e.target.value) }}
                          fullWidth
                          required
                          placeholder={t('criteriaSimple.newCriteriaPlaceholder')}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '32px',
                              fontSize: '0.875rem',
                              border: "none",
                              outline: "none",
                              '& fieldset': {
                                border: "none",
                                outline: "none",
                              },
                              '&:hover fieldset': {
                                border: "none",
                                outline: "none",
                              },
                              '&.Mui-focused fieldset': {
                                border: "none",
                                outline: "none",
                              },
                            },
                          }}
                        />
                      </Box>
                      <IconButton
                        onClick={handleAddCriteria}
                        loading={isLoading}
                        disabled={isLoading}
                        size="small"
                        sx={{
                          p: 0.5,
                          borderRadius: '50%',
                          '&:hover': { backgroundColor: 'grey.300' },
                          transition: 'background-color 0.3s'
                        }}>
                        <AddIcon sx={{ color: 'grey.600', fontSize: '1.25rem' }} />
                      </IconButton>
                    </Stack>
                  </Paper>


                  {/* Existing Criteria */}
                  {currentPosition.criterias?.map((criterion, index) => (
                    <Paper key={criterion.id} sx={{ backgroundColor: 'grey.50', borderRadius: '12px', p: 1, boxShadow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography sx={{
                          color: 'text.secondary',
                          fontFamily: 'Montserrat',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          width: '70px'
                        }}>
                          {`Criteria-${index + 1}`}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flex: 1 }}>
                          <Typography sx={{
                            color: 'primary.dark',
                            fontFamily: 'Montserrat',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            flex: 1
                          }}>
                            {criterion.description}
                          </Typography>
                          <Typography sx={{
                            color: 'primary.dark',
                            fontFamily: 'Montserrat',
                            fontSize: '0.75rem',
                            mx: 1.5
                          }}>
                            {new Date(criterion.createdAt).toLocaleString()}
                          </Typography>
                          <IconButton
                            loading={isLoading}
                            disabled={isLoading}
                            onClick={() => handleDeleteCriteria(criterion.id)}
                            size="small"
                            sx={{
                              p: 0.25,
                              borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                transform: 'scale(1.06)'
                              },
                              transition: 'all 0.3s',
                            }}
                            aria-label="Delete criterion"
                          >
                            <Delete
                              sx={{
                                width: '18px',
                                height: '18px',
                                color: 'primary.dark',
                                '&:hover': { color: 'error.main' },
                                transition: 'color 0.3s'
                              }} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      onClick={handleCancel}
                      variant="outlined"
                      sx={{
                        px: 3,
                        py: 1,
                        height:"28px",
                        width:"63px",
                        borderRadius: '26px',
                        borderColor: 'grey.400',
                        color: 'primary.dark',
                        fontFamily: 'Montserrat',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: 1,
                        '&:hover': {
                          backgroundColor: 'grey.50',
                          borderColor: 'grey.400',
                        },
                      }}
                    >
                      {t('common.actions.back')}
                    </Button>
                    <Button
                      onClick={handleSave}
                      loading={isLoading}
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        px: 3,
                        py: 1,
                        height:"28px",
                        width:"63px",
                        borderRadius: '26px',
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
                        },
                      }}
                    >
                      {t('common.actions.next')}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
