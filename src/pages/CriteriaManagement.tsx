import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Criterion {
  id: string;
  label: string;
  content: string;
  createdDate: string;
}

export default function CriteriaManagement() {
  const navigate = useNavigate();
  const [position] = useState('ui/ux designer');
  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: '1',
      label: 'Criteria-1:',
      content: 'Lomer ipsom...',
      createdDate: 'Created: Jul 16, 2025'
    },
    {
      id: '2',
      label: 'Criteria-2:',
      content: 'Lomer ipsom...',
      createdDate: 'Created: Jul 16, 2025'
    },
    {
      id: '3',
      label: 'Criteria-3:',
      content: 'Lomer ipsom...',
      createdDate: 'Created: Jul 16, 2025'
    },
    {
      id: '4',
      label: 'Criteria-4:',
      content: 'Lomer ipsom...',
      createdDate: 'Created: Jul 16, 2025'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCriteriaText, setNewCriteriaText] = useState('');

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleAddCriteria = () => {
    if (!newCriteriaText.trim()) return;

    const newCriterion: Criterion = {
      id: Date.now().toString(),
      label: `Criteria-${criteria.length + 1}:`,
      content: newCriteriaText.substring(0, 15) + '...',
      createdDate: `Created: ${new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`
    };

    setCriteria([...criteria, newCriterion]);
    setNewCriteriaText('');
    setShowAddModal(false);
  };

  const handleCreateNewPosition = () => {
    navigate('/create-position');
  };

  const handleSave = () => {
    console.log('Criteria saved:', criteria);
    navigate('/upload-cv');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>


      {/* Main Content */}
      <Box sx={{ px: { xs: 1.5, md: 4 } }}>
        {/* Process Flow Section */}
        <Paper sx={{ borderRadius: '24px', p: { xs: 2, md: 4 }, mb: 4 }}>
          {/* Process Steps Indicator */}

          <Container maxWidth="xl" sx={{ position: 'relative', mb: 4 }}>
            {/* Progress Line */}
            <Box sx={{
              position: 'absolute',
              top: '18px',
              left: '36px',
              right: '36px',
              height: '3px',
              backgroundColor: 'grey.300',
              borderRadius: '2px'
            }}>
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #1776F2, #D1D5DB)',
                borderRadius: '2px'
              }} />
            </Box>

            {/* Step Circles */}
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Step 1 - Active */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 0.75,
                  position: 'relative',
                  zIndex: 10
                }}>
                  <Box sx={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }} />
                </Box>
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <Typography variant="h6" sx={{
                    color: 'primary.dark',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.9rem', md: '1rem'  },
                    fontWeight: 700,
                    mb: 0.5
                  }}>
                    New Position
                  </Typography>
                  <Typography sx={{
                    color: 'text.secondary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    fontWeight: 500
                  }}>
                    Create New Position
                  </Typography>
                </Box>
              </Box>

              {/* Step 2 - Inactive */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'grey.300',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 0.75,
                  position: 'relative',
                  zIndex: 10
                }} />
                <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                  <Typography variant="h6" sx={{
                    color: 'primary.dark',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 700,
                    mb: 0.5
                  }}>
                    Upload CV
                  </Typography>
                  <Typography sx={{
                    color: 'text.secondary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    fontWeight: 500
                  }}>
                    Download one or more CVs
                  </Typography>
                </Box>
              </Box>

              {/* Step 3 - Inactive */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'grey.300',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                  position: 'relative',
                  zIndex: 10
                }} />
                <Box sx={{ textAlign: 'center', maxWidth: '240px' }}>
                  <Typography variant="h5" sx={{
                    color: 'primary.dark',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '1.5rem', md: '1.175rem' },
                    fontWeight: 700,
                    mb: 1
                  }}>
                    View Result
                  </Typography>
                  <Typography sx={{
                    color: 'text.secondary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '1.125rem', md: '1rem' },
                    fontWeight: 500
                  }}>
                    View Result
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>

        </Paper>

        {/* Position and Criteria Section */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Stack spacing={5.5}>
            {/* Position Display */}
            <Paper sx={{ borderRadius: '16px', px: { xs: 4, md: 22 }, py: 4, boxShadow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={8}>
                <Typography sx={{
                  color: 'text.secondary',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1.5rem', md: '1.875rem' },
                  fontWeight: 500
                }}>
                  Position:
                </Typography>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1.5rem', md: '1.875rem' },
                  fontWeight: 700
                }}>
                  {position}
                </Typography>
              </Stack>
            </Paper>

            {/* Criteria Management Section */}
            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: 1 }}>
              {/* Header */}
              <Box sx={{ backgroundColor: 'primary.main', px: { xs: 4, md: 8 }, py: 3 }}>
                <Typography variant="h1" sx={{
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1.5rem', md: '1.875rem' },
                  fontWeight: 700
                }}>
                  + Create Criteria
                </Typography>
              </Box>

              {/* Criteria List */}
              <Box sx={{ p: { xs: 4, md: 7 } }}>
                <Stack spacing={3} sx={{ mb: 7 }}>
                  {/* Add New Criteria Row */}
                  <Paper
                    onClick={() => setShowAddModal(true)}
                    sx={{
                      backgroundColor: 'grey.100',
                      borderRadius: '16px',
                      p: 4,
                      boxShadow: 1,
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={3}>
                      <Grid container columns={2} spacing={0.5} sx={{ width: '24px' }}>
                        {[...Array(6)].map((_, i) => (
                          <Grid key={i}>
                            <Box sx={{ width: '4px', height: '4px', backgroundColor: 'grey.400', borderRadius: '50%' }} />
                          </Grid>
                        ))}
                      </Grid>
                      <Typography sx={{
                        color: 'text.secondary',
                        fontFamily: 'Montserrat',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        mr: 'auto'
                      }}>
                        Add Criteria:
                      </Typography>
                      <Box sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: '8px',
                        px: 3,
                        py: 1.5,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        minWidth: 0,
                        flex: 1,
                        maxWidth: '512px',
                        ml: 2
                      }}>
                        <Typography sx={{ color: 'grey.400', fontFamily: 'Montserrat', fontSize: '1rem' }}>
                          Place holder
                        </Typography>
                      </Box>
                      <IconButton sx={{
                        p: 1,
                        borderRadius: '50%',
                        '&:hover': { backgroundColor: 'grey.300' },
                        transition: 'background-color 0.3s'
                      }}>
                        <AddIcon sx={{ color: 'grey.600' }} />
                      </IconButton>
                    </Stack>
                  </Paper>

                  {/* Existing Criteria */}
                  {criteria.map((criterion) => (
                    <Paper key={criterion.id} sx={{ backgroundColor: 'grey.50', borderRadius: '16px', p: 4, boxShadow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={3}>
                        <Typography sx={{
                          color: 'text.secondary',
                          fontFamily: 'Montserrat',
                          fontSize: '1.125rem',
                          fontWeight: 500,
                          width: '80px'
                        }}>
                          {criterion.label}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flex: 1 }}>
                          <Typography sx={{
                            color: 'primary.dark',
                            fontFamily: 'Montserrat',
                            fontSize: '1rem',
                            fontWeight: 700
                          }}>
                            {criterion.content}
                          </Typography>
                          <Typography sx={{
                            color: 'primary.dark',
                            fontFamily: 'Montserrat',
                            fontSize: '1rem',
                            mx: 4
                          }}>
                            {criterion.createdDate}
                          </Typography>
                          <IconButton
                            onClick={() => handleDeleteCriterion(criterion.id)}
                            sx={{
                              p: 1,
                              borderRadius: '16px',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                              },
                              transition: 'background-color 0.3s',
                            }}
                            aria-label="Delete criterion"
                          >
                            <DeleteIcon sx={{
                              width: '36px',
                              height: '36px',
                              color: 'primary.dark',
                              '&:hover': { color: 'error.main' },
                              transition: 'color 0.3s'
                            }} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleCreateNewPosition}
                    variant="outlined"
                    sx={{
                      px: 4,
                      py: 2,
                      borderRadius: '26px',
                      borderColor: 'grey.400',
                      color: 'primary.dark',
                      fontFamily: 'Montserrat',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'grey.50',
                        borderColor: 'grey.400',
                      },
                    }}
                  >
                    Create New Position
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 2,
                      borderRadius: '26px',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontFamily: 'Montserrat',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 235, 189, 0.9)',
                      },
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Add Criteria Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        aria-labelledby="add-criteria-modal"
        aria-describedby="add-criteria-modal-description"
      >
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: '30px',
          p: 6,
          maxWidth: '1280px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: 24,
        }}>
          {/* Modal Header */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4.5 }}>
            <Box
              component="svg"
              width="24"
              height="24"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              sx={{ width: '24px', height: '24px', fill: 'primary.dark' }}
            >
              <path d="M0.550781 34.2859C0.750926 33.402 0.928469 32.51 1.34584 31.7055C2.66913 29.1548 4.66915 27.8081 7.36124 27.7014C7.79098 27.6844 8.19424 27.5645 8.56272 27.3425C10.3323 26.2769 11.6748 24.7628 12.5315 22.7595C12.6583 22.4629 12.7448 22.1342 12.7897 21.8104C12.8691 21.2383 12.7725 20.7211 12.3377 20.3042C11.5608 19.5596 10.9283 18.6932 10.6695 17.5733C10.2374 15.7035 10.6292 14.046 11.8744 12.6819C15.5966 8.60381 19.3375 4.54583 23.0748 0.484161C23.6752 -0.168326 24.3106 -0.158075 24.9104 0.495304C29.6909 5.70216 34.4703 10.9099 39.249 16.1187C39.9246 16.8551 39.9262 17.5062 39.2529 18.2403C35.5745 22.2507 31.8977 26.2629 28.2135 30.2671C26.2358 32.4168 23.4585 32.4093 21.4745 30.2665C21.4654 30.2567 21.4566 30.2466 21.4475 30.2368C20.5064 29.219 19.9645 29.0915 18.764 29.7071C16.9142 30.6559 15.5313 32.1445 14.6026 34.1282C14.4222 34.5134 14.3299 34.9266 14.3272 35.368C14.3066 38.7728 11.9634 41.8619 8.90574 42.5449C8.67287 42.597 8.42118 42.5666 8.2062 42.7097H6.6751C6.61793 42.6838 6.5627 42.6447 6.50318 42.634C3.65216 42.1233 1.78714 40.348 0.856573 37.3897C0.718915 36.9522 0.650905 36.4888 0.550781 36.0375V34.2859Z" />
            </Box>
            <Typography variant="h2" sx={{
              color: 'primary.dark',
              fontFamily: 'Montserrat',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Add New Criteria
            </Typography>
          </Stack>

          {/* Divider */}
          <Divider sx={{ mb: 4.5 }} />

          {/* Description Section */}
          <Box sx={{ mb: 4.5 }}>
            <Typography sx={{
              color: 'primary.dark',
              fontFamily: 'Montserrat',
              fontSize: '1.25rem',
              fontWeight: 700,
              mb: 3.5
            }}>
              Description
            </Typography>
            <Paper sx={{ backgroundColor: 'grey.50', borderRadius: '19px', p: 5 }}>
              <TextField
                value={newCriteriaText}
                onChange={(e) => setNewCriteriaText(e.target.value)}
                placeholder="Type Your text"
                multiline
                rows={3}
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    backgroundColor: 'transparent',
                    color: 'text.secondary',
                    fontFamily: 'Montserrat',
                    fontSize: '1.25rem',
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    '&::before': { display: 'none' },
                    '&::after': { display: 'none' },
                  },
                }}
              />
            </Paper>
          </Box>

          {/* Modal Action Buttons */}
          <Stack direction="row" spacing={2.5} sx={{ justifyContent: 'center' }}>
            <Button
              onClick={() => setShowAddModal(false)}
              variant="outlined"
              sx={{
                px: 10,
                py: 3,
                borderRadius: '125px',
                borderColor: 'primary.dark',
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                fontSize: '1.5rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'grey.50',
                  borderColor: 'primary.dark',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCriteria}
              variant="contained"
              sx={{
                px: 10,
                py: 3,
                borderRadius: '125px',
                backgroundColor: 'primary.main',
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                fontSize: '1.5rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 235, 189, 0.9)',
                },
              }}
            >
              Add Criteria
            </Button>
          </Stack>
        </Box>
      </Modal>

    </Box>
  );
}