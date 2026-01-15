import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  IconButton,
  LinearProgress,
  Stack,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { AikyuuLogo } from '@/components/ui/aikyuu-logo';

import { useProfileStore } from '@/store/profileStore';

// Define validation schema with Zod
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword, isLoading, error } = useProfileStore();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watch("newPassword");

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: 'Empty' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[a-zA-Z]/.test(password)) score++;

    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return {
      strength: score,
      label: score === 0 ? 'Empty' : labels[Math.min(score - 1, 3)]
    };
  };

  const passwordStrength = calculatePasswordStrength(newPasswordValue);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    clearErrors();
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      // If successful, navigate back or show success message
      navigate(-1);
    } catch (err) {
      // Handle error from the store
      setError("oldPassword", {
        type: "manual",
        message: error || "Failed to change password"
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'success';
      default: return 'grey';
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>


      {/* Main Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, mb: 10 }}>
        <Grid container spacing={{ xs: 4, lg: 8 }}>
          {/* Left Side - Form */}
          <Grid>
            <Stack spacing={4}>
              {/* Header */}
              <Stack direction="row" alignItems="center" spacing={5}>
                <IconButton onClick={() => navigate(-1)} sx={{ flexShrink: 0 }}>
                  <ArrowBackIcon sx={{ fontSize: "1.75rem" }} />
                </IconButton>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3rem", lg: "4.5rem" },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "text.primary"
                  }}
                >
                  Change Password
                </Typography>
              </Stack>

              {/* Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  fontWeight: 400,
                  color: "text.primary"
                }}
              >
                Give Yourself A Great New Password
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {/* Current Password */}
                  <TextField
                    fullWidth
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Please enter your current password"
                    {...register("oldPassword")}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: "64px", md: "80px" },
                        borderRadius: "16px",
                        '& fieldset': {
                          borderColor: errors.oldPassword ? "error.main" : "grey.400",
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: { xs: "1.125rem", md: "1.5rem" },
                        color: "grey.500",
                      },
                    }}
                  />

                  {/* New Password */}
                  <TextField
                    fullWidth
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Please enter your new password"
                    {...register("newPassword")}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: "64px", md: "80px" },
                        borderRadius: "16px",
                        '& fieldset': {
                          borderColor: errors.newPassword ? "error.main" : "grey.400",
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: { xs: "1.125rem", md: "1.5rem" },
                        color: "grey.500",
                      },
                    }}
                  />

                  {/* Password Strength Indicator */}
                  <Box>
                    <Stack direction="row" spacing={1.5}>
                      {[...Array(4)].map((_, index) => (
                        <LinearProgress
                          key={index}
                          variant="determinate"
                          value={index < passwordStrength.strength ? 100 : 0}
                          sx={{
                            height: 12,
                            width: 80,
                            borderRadius: "6px",
                            backgroundColor: "grey.300",
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPasswordStrengthColor(index + 1),
                            },
                          }}
                        />
                      ))}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="grey.500">
                        Password Strength:
                      </Typography>
                      <Typography
                        variant="body2"
                        color={getPasswordStrengthColor(passwordStrength.strength)}
                        sx={{ fontWeight: 600 }}
                      >
                        {passwordStrength.label}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Confirm Password */}
                  <TextField
                    fullWidth
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Please re-enter your new password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: "64px", md: "80px" },
                        borderRadius: "16px",
                        '& fieldset': {
                          borderColor: errors.confirmPassword ? "error.main" : "grey.400",
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: { xs: "1.125rem", md: "1.5rem" },
                        color: "grey.500",
                      },
                    }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={{
                      px: 4,
                      py: 2,
                      height: 56,
                      borderRadius: "25px",
                      borderColor: "#DAD2D2",
                      color: "text.primary",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      '&:hover': {
                        backgroundColor: "grey.50",
                        borderColor: "#DAD2D2",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      px: 4,
                      py: 2,
                      height: 56,
                      borderRadius: "25px",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "white",
                      minWidth: 120
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Change"}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Grid>

          {/* Right Side - Rules */}
          <Grid sx={{ mt: { xs: 0, lg: 12 } }}>
            <Card
              sx={{
                maxWidth: 512,
                backgroundColor: "#F6F6F6",
                borderRadius: "24px",
                p: { xs: 4, md: 5 },
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", md: "1.875rem" },
                    fontWeight: 700,
                    mb: 4,
                    color: "text.primary"
                  }}
                >
                  Rules For Passwords
                </Typography>
                <List sx={{ p: 0 }}>
                  {[
                    "Minimum 8 characters",
                    "At least One special characters",
                    "At least One number",
                    "Can't be the same as a previous"
                  ].map((rule, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            backgroundColor: "text.primary",
                            borderRadius: "50%",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: { xs: "1.125rem", md: "1.5rem" },
                              color: "text.primary"
                            }}
                          >
                            {rule}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>


    </Box>
  );
}