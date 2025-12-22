import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormLabel,
  Stack
} from '@mui/material';
import {
  Lock as LockIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { AuthLayout } from '@/components/layout/auth-layout';
import { AikyuuButton } from '@/components/ui/aikyuu-button';
import { useAuthStore } from '@/store/authStore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const resetPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const { forgetPassword, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const { verificationId } = await forgetPassword({ email: data.email });
      navigate(`/reset-password?verificationId=${verificationId}`);
    } catch (error: any) {
      // Handle errors
      if (error.response?.status === 404) {
        setError('email', { message: 'Email not found' });
      } else {
        setError('root', {
          message: error.response?.data?.message || 'An error occurred while resetting password'
        });
      }
    }
  };

  const rightContent = (
    <Box sx={{
      position: "relative",
    }}>
      <Box
        component="img"
        src="/signup.png"
        alt="Person working on laptop"
        sx={{
          width: "90%",
          height: "90%",
          objectFit: "cover",
          borderRadius: 1
        }}
      />
    </Box>
  );

  return (
    <AuthLayout rightContent={rightContent}>
      <Box sx={{ maxWidth: 807 }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: "2.125rem",
            fontWeight: 700,
            lineHeight: "normal",
            mb: "23px",
            color: "text.primary"
          }}
        >
          Reset your password
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.5rem",
            fontWeight: 500,
            lineHeight: 1.375,
            mb: 7,
            maxWidth: 807,
            color: "text.secondary"
          }}
        >
          We're sorry to hear that's happen, don't worry we're here for you<br />
          Just enter your e-mail to help you
        </Typography>

        {/* Error message */}
        {errors.root && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              fontSize: "1rem",
              fontWeight: 500
            }}
          >
            {errors.root.message}
          </Typography>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box>
              <FormLabel
                sx={{
                  display: "block",
                  color: "grey.500",
                  fontSize: "1.125rem",
                  fontWeight: 500,
                }}
              >
                Email *
              </FormLabel>
              <TextField
                fullWidth
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 5,
                  '& .MuiOutlinedInput-root': {
                    height: "60px",
                    borderRadius: "16px"
                  }
                }}
                disabled={isLoading}
              />
            </Box>

            {/* Submit Button */}
            <AikyuuButton
              type="submit"
              sx={{ mb: 10 }}
              disabled={isLoading}
              loading={isLoading}
            >
              Reset Password
            </AikyuuButton>

            {/* Back to Sign In Link */}
            <Box textAlign="center">
              <Typography
                component="span"
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  color: "text.primary"
                }}
              >
                Back to{' '}
              </Typography>
              <Typography
                component={Link}
                to="/signin"
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  color: "primary.main",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "none"
                  }
                }}
              >
                Sign In
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </AuthLayout>
  );
}