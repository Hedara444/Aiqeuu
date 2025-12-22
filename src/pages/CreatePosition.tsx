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

    navigate(`/create-criteria/${positionId}`);
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
      <Box sx={{ px: { xs: 1.5, md: 3 }}}>
        {/* Process Flow Section */}
        <Stepper step={1} />

        {/* Create Position Form */}
        <Container maxWidth="lg" sx={{ mb: 20 }} >
          <Paper sx={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 1 , maxHeight:"500px" }}>
            {/* Header */}
            <Box sx={{ backgroundColor: 'primary.main', px: { xs:1.2, md: 2.9 }, py: 3 }}>
              <Typography variant="h1" sx={{
                color: 'white',
                fontFamily: 'Montserrat',
                fontSize: { xs: '1.005rem', md: '1.075rem' },
                fontWeight: 700
              }}>
                + Create New Position
              </Typography>
            </Box>

            {/* Form */}
            <Box sx={{ p: { xs: 0.9, md: 2.9 } }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Position Field */}
                <Stack spacing={2}>
                  <Typography sx={{
                    color: 'text.primary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '1.15rem', md: '1.25rem' },
                    fontWeight: 700
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
                        height: { xs: '50px', md: '62px' },
                        borderRadius: '14px',
                        backgroundColor: 'grey.100',
                        fontSize: { xs: '1.125rem', md: '1.25rem' },
                        fontFamily: 'Montserrat',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid',
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Description Field */}
                <Stack spacing={2}>
                  <Typography sx={{
                    color: 'text.primary',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '1.025rem', md: '1.125rem' },
                    fontWeight: 700
                  }}>
                    Description
                  </Typography>
                  <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="lomer ipsm"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '17px',
                        backgroundColor: 'grey.100',
                        fontSize: { xs: '1.025rem', md: '1.025rem' },
                        fontFamily: 'Montserrat',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid',
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                      height:"50px",
                      width:"90px",
                      px: 2,
                      py: 1,
                      borderRadius: '14px',
                      borderColor: 'grey.400',
                      color: 'primary.dark',
                      fontFamily: 'Montserrat',
                      fontSize: '0.9rem',
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
                      height:"50px",
                      width:"90px",
                      px: 2,
                      py: 1,
                      borderRadius: '14px',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontFamily: 'Montserrat',
                      fontSize: '0.9rem',
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