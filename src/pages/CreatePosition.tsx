import { useState } from 'react';
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
import { Navbar } from '@/components/ui/navbar';
  import { Footer } from '@/components/ui/Footer';
import { usePositionsStore } from '@/store/positionsStore';
import Stepper from '@/components/ui/Stepper';

export default function CreatePosition() {
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default'  , width:'100%'}}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ px: { xs: 1.05, md: 2.1 }}}>
        {/* Process Flow Section */}
        <Stepper step={1} />

        {/* Create Position Form */}
        <Container maxWidth="lg" sx={{ mb: 14 }} >
          <Paper sx={{ borderRadius: '9.8px', overflow: 'hidden', boxShadow: 1 , maxHeight:"350px" }}>
            {/* Header */}
            <Box sx={{ backgroundColor: 'primary.main', px: { xs:0.84, md: 2.03 }, py: 1.4 }}>
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
                        height: { xs: '30.8px', md: '35px' },
                        borderRadius: '9.8px',
                        backgroundColor: 'grey.100',
                        fontSize: { xs: '0.7rem', md: '0.7rem' },
                        fontFamily: 'Montserrat',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1.4px solid',
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
                    placeholder="lomer ipsm"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '11.9px',
                        backgroundColor: 'grey.100',
                        fontSize: { xs: '0.61rem', md: '0.7rem' },
                        fontFamily: 'Montserrat',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1.4px solid',
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
                      height:"28px",
                      width:"63px",
                      px: 1.4,
                      py: 0.7,
                      borderRadius: '9.8px',
                      borderColor: 'grey.400',
                      color: 'primary.dark',
                      fontFamily: 'Montserrat',
                      fontSize: '0.61rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'grey.50',
                        borderColor: 'grey.400',
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
                      height:"28px",
                      width:"63px",
                      px: 1.4,
                      py: 0.7,
                      borderRadius: '9.8px',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontFamily: 'Montserrat',
                      fontSize: '0.61rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 235, 189, 0.9)',
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

      {/* Footer */}
      <Footer />
    </Box>
  );
}
