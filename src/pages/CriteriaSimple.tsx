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
import { Navbar } from '@/components/ui/navbar';
import { usePositionsStore } from '@/store/positionsStore';
import { toast } from 'react-toastify';
import { Footer } from '@/components/ui/Footer';
import Stepper from '@/components/ui/Stepper';

export default function CriteriaSimple() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [newCriteriaText, setNewCriteriaText] = useState('');

  const { currentPosition, getPositionById, addCriteria, deleteCriteria, isLoading } = usePositionsStore();

  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const fetchData = async () => {
    setIsLoadingPage(true)
    await getPositionById(id!)
    setIsLoadingPage(false)
  }

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
      toast.warning("Please Create At least one critiria");
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ px: { xs: 1, md: 4 } }}>
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
                  Position:
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
            <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 1 }}>
              {/* Header */}
              <Box sx={{ backgroundColor: 'primary.main', px: { xs: 2, md: 3 }, py: 1.5 }}>
                <Typography variant="h1" sx={{
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.71rem', md: '0.8rem'},
                  fontWeight: 700
                }}>
                  + Create Criteria
                </Typography>
              </Box>

              {/* Add Criteria Form */}
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={3}>
                  {/* Add New Criteria Row */}
                  <Paper
                    sx={{
                      backgroundColor: 'grey.100',
                      borderRadius: '12px',
                      p: 0.75,
                      boxShadow: 1,
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: 'grey.200',
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
                        Add Criteria:
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
                          placeholder="ui/ux designer"
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
                              },
                              transition: 'background-color 0.3s',
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
                      Back
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
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontFamily: 'Montserrat',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: 1,
                        // '&:hover': {
                        //   backgroundColor: 'rgba(0, 235, 189, 0.9)',
                        // },
                      }}
                    >
                      Next
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>


      {/* Footer */}
      <Footer />
    </Box>
  );
}