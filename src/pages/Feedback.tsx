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
  Input,
  FormLabel,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Cancel as CancelIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/Footer';
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
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 16 } }}>
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              fontWeight: 700,
              mb: 0.1,
              color: "text.primary",
            }}
          >
            feedback
          </Typography>
        </Box>

        {/* Feedback Form */}
        <Container maxWidth="lg">
          <Card
            sx={{
              borderRadius: "30px",
              p: { xs: 2 , md:1 },
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 4   } }}>
              {/* Form Header */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 500,
                    mb: 4,
                    color: "text.primary",
                    fontSize: { xs: "1.25rem", md: "1.775rem" },
                  }}
                >
                  Submit Feedback
                </Typography>
                <Divider sx={{ height: 1.5, bgcolor: "grey.200" }} />
              </Box>

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={{ xs: 4, md: 6 }}>
                  {/* Title Field */}
                  <Box>
                    <FormLabel
                      sx={{
                        display: "block",
                        color: "grey.500",
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                        fontWeight: 400,
                        mb: 1.05,
                        textTransform: "capitalize",
                        letterSpacing: "0.025em",
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
                          height: { xs: "60px", md: "65px" },
                          borderRadius: "16px",
                          '& fieldset': {
                            borderColor: errors.title ? "error.main" : "grey.400",
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                          color: "text.primary",
                        },
                      }}
                    />
                  </Box>

                  {/* Description Field */}
                  <Box>
                    <FormLabel
                      sx={{
                        display: "block",
                        color: "grey.500",
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                        fontWeight: 400,
                        mb: 1.25,
                        textTransform: "capitalize",
                        letterSpacing: "0.025em",
                      }}
                    >
                      Description
                    </FormLabel>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      {...register("description")}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          minHeight: { xs: "128px", md: "140px" },
                          borderRadius: "16px",
                          '& fieldset': {
                            borderColor: errors.description ? "error.main" : "grey.400",
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                          color: "text.primary",
                        },
                      }}
                    />
                  </Box>

                  {/* File Upload Field */}
                  <Box sx={{ maxWidth: "400px" }}>
                    <FormLabel
                      sx={{
                        display: "block",
                        color: "grey.500",
                        fontSize: { xs: "1.125rem", md: "1.125rem" },
                        fontWeight: 400,
                        mb: 1.5,
                        textTransform: "capitalize",
                        letterSpacing: "0.025em",
                      }}
                    >
                      Attach Image (optional)
                    </FormLabel>
                    <Box sx={{ position: "relative" }}>
                      <Button
                        variant="outlined"
                        component="label"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          height: { xs: "60px", md: "65px" },
                          px: { xs: 2, md: 3 },
                          backgroundColor: "background.default",
                          border: "1px solid white",
                          borderRadius: "14px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          color: "grey.500",
                          fontSize: { xs: "1.025rem", md: "1.25rem" },
                          fontWeight: 400,
                          textTransform: "capitalize",
                          letterSpacing: "0.025em",
                          width: "100%",
                          justifyContent: "flex-start",
                          '&:hover': {
                            backgroundColor: "grey.100",
                            borderColor: "white",
                          },
                        }}
                      >
                        {/* <Input
                          type="file"
                          inputProps={{ accept: "image/*" }}
                          onChange={handleFileChange}
                          hidden
                          sx={{
                            bgcolor: "red",
                            // inset: 0,
                            width: "100%",
                            height: "100%",
                            // opacity: 0,
                            cursor: "pointer",
                          }}
                        /> */}
                        {watchedFile ? watchedFile.name : 'choose file'}

                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </Box>
                    {errors.attachedFile && (
                      <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                        {errors.attachedFile.message}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {/* Action Buttons */}
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: { xs: 4, md: 6 } }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    disabled={isLoading}
                    sx={{
                      minWidth: { xs: 180, md: 200 },
                      height: { xs: 48, md: 56 },
                      borderRadius: "25px",
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      fontWeight: 700,
                      borderColor: "grey.200",
                      color: "text.primary",
                      '&:hover': {
                        backgroundColor: "grey.50",
                        borderColor: "grey.200",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{
                      minWidth: { xs: 180, md: 200 },
                      height: { xs: 48, md: 56 },
                      borderRadius: "25px",
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      fontWeight: 700,
                      color: "white"
                    }}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}