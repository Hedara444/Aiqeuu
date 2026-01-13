import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormLabel,
  Stack,
  Button
} from '@mui/material';
import { AuthLayout } from '@/components/layout/auth-layout';
import { AikyuuButton } from '@/components/ui/aikyuu-button';
import { useAuthStore } from '@/store/authStore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const resetPasswordNewSchema = z.object({
  verificationCode: z.string()
    .min(1, "Verification code is required")
    .min(4, "Verification code must be at least 4 characters")
    .max(4, "Verification code must be 4 characters"),
  newPassword: z.string()
    .min(1, "New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordNewFormData = z.infer<typeof resetPasswordNewSchema>;

export default function ResetPasswordNew() {
  const [searchParams] = useSearchParams();
  const verificationId = searchParams.get('verificationId');
  const navigate = useNavigate();
  const { resetPassword, resendVerificationCode, isLoading } = useAuthStore();
  const [isResending, setIsResending] = React.useState(false);
  const [resendCountdown, setResendCountdown] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<ResetPasswordNewFormData>({
    resolver: zodResolver(resetPasswordNewSchema),
    defaultValues: {
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordNewFormData) => {
    if (!verificationId) {
      setError('root', { message: 'Verification ID is missing' });
      return;
    }

    try {
      await resetPassword({
        newPassword: data.newPassword,
        verificationCode: data.verificationCode,
        verificationId
      });
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('verificationCode', { message: 'Invalid verification code' });
      } else if (error.response?.status === 404) {
        setError('root', { message: 'Verification session expired or invalid' });
      } else {
        setError('root', {
          message: error.response?.data?.message || 'An error occurred while resetting password'
        });
      }
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0 || !verificationId) return;

    setIsResending(true);
    try {
      const { verificationId: newVerificationId } = await resendVerificationCode({ verificationId });
      navigate(`/reset-password?verificationId=${newVerificationId}`, { replace: true });

      // Start countdown timer (60 seconds)
      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Failed to resend verification code'
      });
    } finally {
      setIsResending(false);
    }
  };

  const rightContent = (
    <Box sx={{ position: "relative" }}>
      <Box
        component="img"
        src="/signup.png"
        alt="Person working on laptop"
        sx={{
          width: "80%",
          height: "80%",
          objectFit: "cover",
          borderRadius: 1
        }}
      />
    </Box>
  );

  return (
    <AuthLayout rightContent={rightContent}>
      <Box sx={{ maxWidth: 907 }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: "2.025rem",
            fontWeight: 700,
            lineHeight: "normal",
            mb: 2,
            color: "text.primary"
          }}
        >
          Reset your password
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.05rem",
            fontWeight: 500,
            lineHeight: 1.375,
            mb: 3,
            maxWidth: 907,
            color: "text.secondary"
          }}
        >
          Enter your new password and verification code to reset your password
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
          <Stack spacing={2}>
            {/* Verification Code */}
            <Box>
              <FormLabel
                sx={{
                  display: "block",
                  color: "grey.500",
                  fontSize: "1.025rem",
                  fontWeight: 500,
                  mb: 1
                }}
              >
                Code *
              </FormLabel>
              <TextField
                fullWidth
                type="text"
                {...register('verificationCode')}
                error={!!errors.verificationCode}
                helperText={errors.verificationCode?.message}
                disabled={isLoading}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    height: "50px",
                    borderRadius: "16px"
                  }
                }}
              />
            </Box>

            {/* New Password */}
            <Box>
              <FormLabel
                sx={{
                  display: "block",
                  color: "grey.500",
                  fontSize: "1.025rem",
                  fontWeight: 500,
                  mb: 1
                }}
              >
                New Password *
              </FormLabel>
              <TextField
                fullWidth
                type="password"
                {...register('newPassword')}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                disabled={isLoading}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    height: "50px",
                    borderRadius: "16px"
                  }
                }}
              />
            </Box>

            {/* Confirm Password */}
            <Box>
              <FormLabel
                sx={{
                  display: "block",
                  color: "grey.500",
                  fontSize: "1.025rem",
                  fontWeight: 500,
                  mb: 1
                }}
              >
                Confirm the new password *
              </FormLabel>
              <TextField
                fullWidth
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isLoading}
                sx={{
                  mb: 0,
                  '& .MuiOutlinedInput-root': {
                    height: "50px",
                    borderRadius: "16px"
                  }
                }}
              />
            </Box>

            {/* Resend Code Button */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Button
                onClick={handleResendCode}
                disabled={isResending || resendCountdown > 0 || !verificationId || isLoading}
                sx={{
                  mb:0,
                  color: 'primary.main',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  },
                  '&:disabled': {
                    color: 'text.disabled'
                  }
                }}
              >
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : isResending
                    ? 'Sending...'
                    : "Didn't receive the code? Resend"
                }
              </Button>
            </Box>

            {/* Submit Button */}
            <AikyuuButton
              type="submit"
              sx={{ mb: 5 }}
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
                  fontSize: "1.125rem",
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
                  fontSize: "1.125rem",
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