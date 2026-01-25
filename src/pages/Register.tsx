import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { AuthLayout } from '@/components/layout/auth-layout';
import { InputField } from '@/components/ui/input-field';
import { AikyuuButton } from '@/components/ui/aikyuu-button';
import { useAuthStore } from '@/store/authStore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the validation schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  const formData = watch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof RegisterFormData;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValue(fieldName, fieldValue);

    // Clear error for this specific field when user starts typing
    if (errors[fieldName]) {
      clearErrors(fieldName);
    }

    // Special handling for confirmPassword - clear error when either password changes
    if (name === 'password' && errors.confirmPassword) {
      clearErrors('confirmPassword');
    }
    if (name === 'confirmPassword' && errors.confirmPassword) {
      clearErrors('confirmPassword');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    const signupData = {
      email: data.email,
      password: data.password,
      name: data.name
    };

    const { verificationId } = await signup(signupData);
    navigate(`/verification?verificationId=${verificationId}`);
  };



  return (
    <AuthLayout   >
      <Box sx={{ maxWidth: { xs: '100%', lg: '807px' }, p:'0', mx: 'auto' }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            color: 'text.primary',
            fontFamily: 'Montserrat',
            fontSize: { xs: '1rem', md: '1.25rem', lg: '1.6rem' },
            fontWeight: 700,
            lineHeight: 'normal',
            mb: { xs: 1.5, md: 1.5 },
            mt: { xs: 3, md: 6, lg: 5 }
          }}
        >
          Join Aikyuu, Let's Do it!
        </Typography>

        {/* Subheading */}
        <Typography sx={{
          color: 'text.secondary',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          fontWeight: 500,
          lineHeight: 'normal',
          mb: { xs: 3, md: 7 }
        }}>
          Enter below details to create an account
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <InputField
            {...register('name')}
            name="name"
            type="text"
            label="User Name *"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: { xs: '40px', md: '48px' },
                borderRadius: '10px',
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }
            }}
          />

          <InputField
            {...register('email')}
            name="email"
            type="email"
            label="E-mail *"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: { xs: '40px', md: '48px' },
                borderRadius: '10px',
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }
            }}
          />

          {/* Password Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 1 }}>
            <InputField
              {...register('password')}
              name="password"
              type="password"
              label="Password *"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  height: { xs: '40px', md: '48px' },
                  borderRadius: '10px',
                  fontSize: { xs: '0.75rem', md: '0.875rem' }
                }
              }}
            />

            <InputField
              {...register('confirmPassword')}
              name="confirmPassword"
              type="password"
              label="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  height: { xs: '40px', md: '48px' },
                  borderRadius: '10px',
                  fontSize: { xs: '0.75rem', md: '0.875rem' }
                }
              }}
            />
          </Stack>

          {/* Terms Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                {...register('agreeToTerms')}
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                size="small"
                sx={{
                  color: 'primary.dark',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography sx={{
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.8rem', md: '0.95rem' },
                fontWeight: 400,
                lineHeight: 'normal'
              }}>
                I agree to the terms of service and{' '}
                <Typography component="span" sx={{ fontWeight: 600, fontSize: 'inherit' }}>
                  privacy policy
                </Typography>
              </Typography>
            }
            sx={{ mb: { xs: 2, md: 4 } }}
          />
          {errors.agreeToTerms && (
            <Typography color="error" sx={{ mt: 0.5, mb: 1.5, fontSize: '0.75rem' }}>
              {errors.agreeToTerms.message}
            </Typography>
          )}

          {/* Submit Button */}
          <AikyuuButton
            type="submit"
            loading={isLoading}
            sx={{
              mb: 0,
              height: { xs: '38px', md: '49px' },
             
            }}
          >
            Sign Up
          </AikyuuButton>

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="span"
              sx={{
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                fontWeight: 500
              }}
            >
              Already have an account ?{' '}
            </Typography>
            <Typography
              component={Link}
              to="/signin"
              sx={{
                color: 'primary.main',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                fontWeight: 500,
                textDecoration: 'underline',
                '&:hover': { textDecoration: 'none' }
              }}
            >
              Login
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}