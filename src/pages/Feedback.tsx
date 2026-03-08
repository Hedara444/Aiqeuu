import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  TextField,
  Stack,
  FormLabel,
  Divider,
  CircularProgress
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProfileStore } from '@/store/profileStore';

const injectFeedbackStyles = () => {
  if (document.getElementById('feedback-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'feedback-ux-styles';
  s.textContent = `
    @keyframes fb-fade-up { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes fb-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
  `;
  document.head.appendChild(s);
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Define validation schema with Zod
const feedbackSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  attachedFile: z.instanceof(File).optional().or(z.null())
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function Feedback() {
  useEffect(() => { injectFeedbackStyles(); }, []);
  const { submitFeedback, uploadPhoto, isLoading } = useProfileStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: '',
      description: '',
      attachedFile: null
    }
  });

  const watchedFile = watch("attachedFile");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setValue("attachedFile", file, { shouldValidate: true });
  };

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      let imageUrl = '';

      // Upload image first if attached
      if (data.attachedFile) {
        const uploadResponse = await uploadPhoto(data.attachedFile);
        imageUrl = uploadResponse.url;
      }

      // Submit feedback with image URL
      await submitFeedback(data.title, data.description, imageUrl);

      // Reset form on success
      reset();
    } catch (error) {
      // Error handling is done in the store
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <Box sx={{ minHeight: "100vh", background: 'linear-gradient(180deg, #f8fbff 0%, #f7f9fc 100%)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'fixed', top: '12%', right: '-80px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.09), transparent 70%)', animation: 'fb-float 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '14%', left: '-70px', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.08), transparent 70%)', animation: 'fb-float 11s ease-in-out infinite', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 7 }, mt: 2, position: 'relative', zIndex: 1 }}>
        <Box textAlign="center" sx={{ mb: 3, animation: 'fb-fade-up .45s ease-out both' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 0.8,
              fontSize: { xs: "1.35rem", md: "1.8rem" },
              background: 'linear-gradient(135deg, #1776F2 0%, #00D4A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Feedback
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.75rem", md: "0.9rem" },
              fontWeight: 500
            }}
          >
            Share your experience so we can improve Aikyuu for you.
          </Typography>
        </Box>

        {/* Feedback Form */}
        <Container maxWidth="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card
              sx={{
                borderRadius: "18px",
                p: { xs: 1.2, md: 1.8 },
                boxShadow: "0 8px 24px rgba(23,118,242,0.08)",
                border: "1px solid rgba(23,118,242,0.12)",
                mb: 2.5,
                transition: 'transform .22s ease, box-shadow .22s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 30px rgba(23,118,242,0.14)'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 0.6, md: 1.2 } }}>
                {/* Form Header */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                      color: "text.primary",
                      fontSize: { xs: "0.85rem", md: "0.95rem" },
                    }}
                  >
                    Submit Feedback
                  </Typography>
                  <Divider sx={{ bgcolor: "grey.200" }} />
                </Box>

                {/* Form Fields */}
                <Stack spacing={2}>
                  {/* Title Field */}
              <Box>
                <FormLabel
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontSize: "0.795rem",
                    fontWeight: 500,
                    mb: 0.6,
                  }}
                >
                  Title
                </FormLabel>
                <TextField
                  fullWidth
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      fontSize: "0.795rem",
                      '& fieldset': {
                        borderColor: "grey.200",
                      },
                      '&:hover fieldset': {
                        borderColor: "grey.300",
                      },
                      '& input': {
                        py: 1,
                        px: 1.2
                      }
                    },
                  }}
                />
              </Box>

              {/* Description Field */}
              <Box>
                <FormLabel
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontSize: "0.795rem",
                    fontWeight: 500,
                    mb: 0.6,
                  }}
                >
                  Description
                </FormLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      fontSize: "0.795rem",
                          '& fieldset': {
                            borderColor: "grey.200",
                          },
                          '&:hover fieldset': {
                            borderColor: "grey.300",
                          },
                            '& textarea': {
                             py: 0.5,
                             px: 0.5
                          }
                        },
                      }}
                    />
                  </Box>

                  {/* File Upload Field */}
              <Box>
                <FormLabel
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontSize: "0.795rem",
                    fontWeight: 500,
                    mb: 0.6,
                  }}
                >
                  Attach Image (Optional)
                </FormLabel>
                <Button
                  component="label"
                  sx={{
                    bgcolor: "grey.100",
                    color: "text.secondary",
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.6,
                    fontSize: "0.795rem",
                        fontWeight: 500,
                        boxShadow: "none",
                        '&:hover': {
                          bgcolor: "grey.200",
                        }
                      }}
                    >
                      {watchedFile ? watchedFile.name : 'Choose File'}
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Button>
                    {errors.attachedFile && (
                      <Typography color="error" variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {errors.attachedFile.message}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                onClick={handleCancel}
                disabled={isLoading}
                sx={{
                  minWidth: 90,
                  height: 36,
                  borderRadius: "35px",
                  fontSize: "0.795rem",
                  fontWeight: 600,
                  bgcolor: "white",
                  color: "text.primary",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
                  textTransform: "none",
                  '&:hover': {
                    bgcolor: "grey.50",
                    boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
                    transform: 'translateY(-1px)'
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                color="primary"
                sx={{
                  minWidth: 100,
                  height: 36,
                  borderRadius: "35px",
                  fontSize: "0.795rem",
                  fontWeight: 700,
                  color: "white",
                  textTransform: "none",
                  background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 100%)',
                  boxShadow: "0 8px 18px rgba(23,118,242,0.24)",
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1266da 0%, #0b56ba 100%)',
                    boxShadow: "0 12px 24px rgba(23,118,242,0.34)",
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {isLoading ? <CircularProgress size={18} color="inherit" /> : 'Submit Feedback'}
              </Button>
            </Stack>
          </form>
        </Container>
      </Container>

    </Box>
  );
}