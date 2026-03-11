import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormLabel,
  Stack
} from '@mui/material';

import { AuthLayout } from '@/components/layout/auth-layout';
import { AikyuuButton } from '@/components/ui/aikyuu-button';
import { useAuthStore } from '@/store/authStore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from 'react-i18next';

type ResetPasswordFormData = {
  email: string;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const { forgetPassword, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const resetPasswordSchema = z.object({
    email: z
      .string()
      .min(1, t('resetPassword.validation.emailRequired'))
      .email(t('resetPassword.validation.emailInvalid')),
  });

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
      if (error.response?.status === 404) {
        setError('email', { message: t('resetPassword.errors.emailNotFound') });
      } else {
        setError('root', {
          message: error.response?.data?.message || t('resetPassword.errors.generic')
        });
      }
    }
  };



  return (
    <AuthLayout >
      <Box sx={{ maxWidth: { xs: '100%', lg: '807px' }, mx: 'auto' }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '1.75rem', lg: '2rem' },
            fontWeight: 700,
            lineHeight: "normal",
            mb: { xs: 2, md: 3 },
            mt: { xs: 4, md: 8, lg: 10 },
            color: "text.primary"
          }}
        >
          {t('resetPassword.heading')}
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 500,
            lineHeight: 1.5,
            mb: { xs: 4, md: 8 },
            color: "text.secondary"
          }}
        >
          {t('resetPassword.subheading.line1')}<br />
          {t('resetPassword.subheading.line2')}
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
            <Box>
              <TextField
                fullWidth
                type="email"
                placeholder={t('resetPassword.fields.emailPlaceholder')}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 14,
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '48px', md: '52px' },
                    borderRadius: "10px",
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }
                }}
                disabled={isLoading}
              />
            </Box>

            {/* Submit Button */}
            <AikyuuButton
              type="submit"
              sx={{
                mb: 5,
                height: { xs: '44px', md: '48px' },
              }}
              disabled={isLoading}
              loading={isLoading}
            >
              {t('resetPassword.actions.reset')}
            </AikyuuButton>

            {/* Back to Sign In Link */}
            <Box textAlign="center">
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: '0.875rem', md: '0.95rem' },
                  fontWeight: 500,
                  color: "text.primary"
                }}
              >
                {t('resetPassword.backTo')}{' '}
              </Typography>
              <Typography
                component={Link}
                to="/signin"
                sx={{
                  fontSize: { xs: '0.875rem', md: '0.95rem' },
                  fontWeight: 500,
                  color: "primary.main",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "none"
                  }
                }}
              >
                {t('resetPassword.actions.signIn')}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </AuthLayout>
  );
}
