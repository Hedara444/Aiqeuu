import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { usePositionsStore } from '@/store/positionsStore';
import Stepper from '@/components/ui/Stepper';

const injectCreatePositionStyles = () => {
  if (document.getElementById('create-position-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'create-position-ux-styles';
  s.textContent = `
    @keyframes cp-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes cp-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  `;
  document.head.appendChild(s);
};

export default function CreatePosition() {
  useEffect(() => { injectCreatePositionStyles(); }, []);
  const navigate = useNavigate();

  const { createPosition, isLoading } = usePositionsStore();


  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      description: formData.description
    }

    const { id: positionId } = await createPosition(data)

    navigate(`/criteria-selection/${positionId}`);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fbff 0%, #f7f9fc 100%)', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'fixed', top: '14%', right: '-80px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.09), transparent 70%)', animation: 'cp-float 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '12%', left: '-70px', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.08), transparent 70%)', animation: 'cp-float 11s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ px: { xs: 1.05, md: 2.1 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ animation: 'cp-fade-up .45s ease-out both' }}>
          <Stepper step={1} />
        </Box>

        <Container maxWidth="lg" sx={{ mb: 14, animation: 'cp-fade-up .5s .06s both' }}>
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(23,118,242,0.12)', border: '1px solid rgba(23,118,242,0.12)', maxHeight: "350px", transition: 'transform .22s ease, box-shadow .22s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 16px 38px rgba(23,118,242,0.18)' } }}>
            <Box sx={{ background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 55%, #00D4A8 100%)', px: { xs: 0.84, md: 2.03 }, py: 1.4 }}>
              <Typography variant="h1" sx={{
                color: 'white',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.7rem', md: '0.7rem' },
                fontWeight: 700
              }}>
                + Create New Position 
              </Typography>
            </Box>

            {/* Form */}
            <Box sx={{ p: { xs: 0.63, md: 2.03 } }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.05 }}>
                {/* Position Field */}
                <Stack spacing={1.4}>
                  <Typography sx={{
                    color: 'text.primary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.7rem', md: '0.7rem' },
                    fontWeight: 700,
                    py:1
                  }}>
                    Title
                  </Typography>
                  <TextField
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    placeholder="ui/ux designer"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '34px', md: '38px' },
                        borderRadius: '11px',
                        backgroundColor: '#f8fbff',
                        fontSize: { xs: '0.7rem', md: '0.74rem' },
                        fontFamily: 'Montserrat',
                        transition: 'box-shadow .2s ease, border-color .2s ease',
                        '& fieldset': {
                          border: '1px solid',
                          borderColor: 'rgba(23,118,242,0.18)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(23,118,242,0.35)',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: '1.4px',
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Description Field */}
                <Stack spacing={1.4}>
                  <Typography sx={{
                    color: 'text.primary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.7rem', md: '0.7rem' },
                    fontWeight: 700,
                    py:1
                  }}>
                    Description
                  </Typography>
                  <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="this position is abot picking up  a ui/ux designer with experince in metrial UI design concept "
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8fbff',
                        fontSize: { xs: '0.64rem', md: '0.72rem' },
                        fontFamily: 'Montserrat',
                        transition: 'box-shadow .2s ease, border-color .2s ease',
                        '& fieldset': {
                          border: '1px solid',
                          borderColor: 'rgba(23,118,242,0.18)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(23,118,242,0.35)',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: '1.4px',
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1.4} sx={{ justifyContent: 'flex-end', mt: 2.8 }}>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                      height: "30px",
                      width: "68px",
                      px: 1.4,
                      py: 0.7,
                      borderRadius: '11px',
                      borderColor: 'rgba(23,118,242,0.28)',
                      color: 'primary.dark',
                      fontFamily: 'Montserrat',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                      '&:hover': {
                        backgroundColor: 'grey.50',
                        borderColor: 'rgba(23,118,242,0.45)',
                        transform: 'translateY(-1px)'
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                    sx={{
                      height: "30px",
                      width: "68px",
                      px: 1.4,
                      py: 0.7,
                      borderRadius: '11px',
                      background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 100%)',
                      color: 'white',
                      fontFamily: 'Montserrat',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 8px 18px rgba(23,118,242,0.26)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        background: 'linear-gradient(135deg, #1266da 0%, #0b56ba 100%)',
                        boxShadow: '0 12px 24px rgba(23,118,242,0.34)'
                      },
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
