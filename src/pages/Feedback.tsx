import React from 'react';
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 7 }, mt: 2 }}>
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 0.7,
              color: "text.primary",
              fontSize: { xs: "1.35rem", md: "1.7rem" },
            }}
          >
            feedback
          </Typography>
          <Typography
             variant="h6"
             sx={{
               fontWeight: 500,
               color: "text.primary",
               mb: 0.3,
               fontSize: { xs: "0.75rem", md: "0.85rem" }
             }}
          >
            Choose Your Plan
          </Typography>
          <Typography
             variant="body1"
             sx={{
               color: "text.secondary",
               fontSize: { xs: "0.65rem", md: "0.75rem" }
             }}
          >
            Select the perfect package for your recruitment needs
          </Typography>
        </Box>

        {/* Feedback Form */}
        <Container maxWidth="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card
              sx={{
                borderRadius: "14px",
                p: { xs: 1.2, md: 1.8 },
                boxShadow: "0px 3px 14px rgba(0, 0, 0, 0.05)",
                border: "none",
                mb: 2.5
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
                  fontWeight: 600,
                  color: "white",
                  boxShadow: "none",
                  textTransform: "none",
                  bgcolor: "primary.main",
                  '&:hover': {
                    bgcolor: "primary.secondary",
                    boxShadow: "none",
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