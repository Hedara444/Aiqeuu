import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack } from '@mui/material';
import { AuthLayout } from '@/components/layout/auth-layout';
import { InputField } from '@/components/ui/input-field';
import { AikyuuButton } from '@/components/ui/aikyuu-button';
import { useAuthStore } from '@/store/authStore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const signInSchema = z.object({
  email: z.string()
    .min(1, "Email or username is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        setError('email', { message: 'Invalid email or password' });
        setError('password', { message: 'Invalid email or password' });
      } else {
        setError('root', {
          message: error.response?.data?.message || 'An error occurred during login'
        });
      }
    }
  };

  return (
    <AuthLayout>
      <Box sx={{ maxWidth: { xs: '100%', lg: '807px' }, mx: 'auto' }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            color: 'text.primary',
            fontFamily: 'Montserrat',
            fontSize: { xs: '1.5rem', md: '1.75rem', lg: '2rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 1,
            mt: { xs: 6, md: 8, lg: 8 }
          }}
        >
          Always Welcome, Aikyuu!
        </Typography>

        {/* Subheading */}
        <Typography sx={{
          color: 'text.secondary',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.875rem', md: '1rem' },
          fontWeight: 400,
          mb: { xs: 6, md: 8 }
        }}>
          Sign in to Aikyuu
        </Typography>

        {/* Error message */}
        {errors.root && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              fontFamily: 'Montserrat',
              fontSize: '1rem'
            }}
          >
            {errors.root.message}
          </Typography>
        )}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <InputField
            {...register('email')}
            type="text"
            label="E-mail or username"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: { xs: '48px', md: '52px' },
                borderRadius: '10px',
              }
            }}
          />

          <InputField
            {...register('password')}
            type="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: { xs: '48px', md: '52px' },
                borderRadius: '10 px',
              }
            }}
          />

          {/* Forgot Password Links */}
          <Box sx={{ mt: 1 }}>
            <Typography
              component={Link}
              to="/forgot-password"
              sx={{
                color: 'primary.main',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.875rem', md: '0.9rem' },
                fontWeight: 500,
                textDecoration: 'underline',
                '&:hover': { textDecoration: 'none' }
              }}
            >
              Forgot password
            </Typography>
          </Box>

          {/* Submit Button */}
          <AikyuuButton
            type="submit"
            sx={{
              mt: 4,
              mb: 2,
              height: { xs: '44px', md: '48px' },
            }}
            disabled={isLoading}
            loading={isLoading}
          >
            Log in
          </AikyuuButton>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="span"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                fontWeight: 500
              }}
            >
              Don't have an account?{' '}
            </Typography>
            <Typography
              component={Link}
              to="/register"
              sx={{
                color: 'primary.main',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                fontWeight: 500,
                textDecoration: 'underline',
                '&:hover': { textDecoration: 'none' }
              }}
            >
              Sign up
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}