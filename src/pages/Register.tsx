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

  const rightContent = (
    <Box sx={{ position: 'relative', width: '567px', height: '505px' }}>
      {/* Professional person with floating UI elements */}
      <Box
        component="img"
        src="/signup.png"
        alt="Professional person with phone"
        sx={{
          width: '90%',
          height: '90%',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />

      {/* Floating register icon */}
      {/* <Box sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        width: '64px',
        height: '64px',
        backgroundColor: 'primary.dark',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 700 }}>
          Register ✓
        </Typography>
      </Box> */}

      {/* Floating ID card icon */}
      {/* <Box sx={{
        position: 'absolute',
        bottom: 8,
        left: 4,
        width: '80px',
        height: '64px',
        backgroundColor: 'primary.dark',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography sx={{ color: 'primary.main', fontSize: '1.5rem' }}>
          📋
        </Typography>
      </Box> */}

      {/* Floating chart icon */}
      {/* <Box sx={{
        position: 'absolute',
        bottom: 16,
        right: 8,
        width: '64px',
        height: '64px',
        backgroundColor: 'primary.dark',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography sx={{ color: 'primary.main', fontSize: '1.5rem' }}>
          📊
        </Typography>
      </Box> */}
    </Box>
  );

  return (
    <AuthLayout rightContent={rightContent}>
      <Box sx={{ maxWidth: { xs: '100%', lg: '807px' , p:'0' } }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            color: 'primary.dark',
            fontFamily: 'Montserrat',
            fontSize: { xs: '1rem', md: '2.15rem', lg: '2.125rem' },
            fontWeight: 700,
            lineHeight: 'normal',
            mb: { xs: 2, md: '12px' }
          }}
        >
          Join Aikyuu, Let's Do it!
        </Typography>

        {/* Subheading */}
        <Typography sx={{
          color: 'text.primary',
          fontFamily: 'Montserrat',
          fontSize: { xs: '1.125rem', md: '1.25rem', lg: '1.5rem' },
          fontWeight: 500,
          lineHeight: 'normal',
          mb: { xs: 4, md: 8, lg: '50px' }
        }}>
          Enter below details to create an account
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <InputField
            {...register('name')}
            name="name"
            type="text"
            label="User Name *"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />

          {/* Password Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <InputField
              {...register('password')}
              name="password"
              type="password"
              label="Password *"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ flex: 1 }}
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
              sx={{ flex: 1 }}
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
                fontSize: { xs: '1rem', md: '1.15rem' },
                fontWeight: 400,
                lineHeight: 'normal'
              }}>
                I agree to the terms of service and{' '}
                <Link to='/privacy-policy' >
                  privacy policy
                </Link>
              </Typography>
            }
            sx={{ mb: { xs: 4, md: 8, lg: '15px' } }}
          />
          {errors.agreeToTerms && (
            <Typography color="error" sx={{ mt: -2, mb: 2 }}>
              {errors.agreeToTerms.message}
            </Typography>
          )}

          {/* Submit Button */}
          <AikyuuButton
            type="submit"
            loading={isLoading}
            sx={{ mb: { xs: 4, md: 8, lg: '47px' } }}
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
                fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
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
                fontSize: { xs: '1rem', md: '1.125rem', lg: '1.25rem' },
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