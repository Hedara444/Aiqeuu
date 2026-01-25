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

export default function   ChangePassword() {
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
    <Box sx={{  minHeight: "100vh", backgroundColor: "background.default" }}>


      {/* Main Content */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 }, mb: 6, mt: 4 }}>
        <Grid container spacing={{ xs: 4, lg: 16 }}>
          {/* Left Side - Form */}
          <Box  >
            <Stack  spacing={3}>
              {/* Header */}
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "text.primary",
                    mb: 1
                  }}
                >
                  Change Password
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton onClick={() => navigate(-1)} sx={{ p: 0.5 }}>
                    <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
                  </IconButton>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      color: "text.secondary",
                      fontWeight: 500
                    }}
                  >
                    Give Yourself A Great New Password
                  </Typography>
                </Stack>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form  onSubmit={handleSubmit(onSubmit)}>
                <Stack width={{lg:600 , xs:400 }} spacing={2.5}>
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
                          size="small"
                        >
                          {showPasswords.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: "48px", md: "52px" },
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        '& fieldset': {
                          borderColor: errors.oldPassword ? "error.main" : "grey.300",
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        color: "text.primary",
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
                          size="small"
                        >
                          {showPasswords.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: "48px", md: "52px" },
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        '& fieldset': {
                          borderColor: errors.newPassword ? "error.main" : "grey.300",
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        color: "text.primary",
                      },
                    }}
                  />

                  {/* Password Strength Indicator */}
                  <Box>
                    <Stack direction="row" spacing={1}>
                      {[...Array(4)].map((_, index) => (
                        <LinearProgress
                          key={index}
                          variant="determinate"
                          value={index < passwordStrength.strength ? 100 : 0}
                          sx={{
                            height: 6,
                            width: 60,
                            borderRadius: "3px",
                            backgroundColor: "grey.200",
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPasswordStrengthColor(index + 1),
                            },
                          }}
                        />
                      ))}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.8 }}>
                      <Typography variant="caption" color="grey.500">
                        Password Strength:
                      </Typography>
                      <Typography
                        variant="caption"
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
                          size="small"
                        >
                          {showPasswords.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: "48px", md: "52px" },
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        '& fieldset': {
                          borderColor: errors.confirmPassword ? "error.main" : "grey.300",
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        color: "text.primary",
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
                      px: 3,
                      height: 42,
                      borderRadius: "21px",
                      borderColor: "#DAD2D2",
                      color: "text.primary",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textTransform: "none",
                      bgcolor: "white",
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
                    color="primary"
                    sx={{
                      px: 4,
                      height: 42,
                      borderRadius: "21px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "white",
                      minWidth: 120,
                      textTransform: "none",
                      boxShadow: "none",
                      bgcolor: "primary.main",
                      '&:hover': {
                        bgcolor: "primary.secondary",
                        boxShadow: "none",
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} color="inherit" /> : "Change"}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>

          {/* Right Side - Rules */}
          <Grid   sx={{ mt: { xs: 4, lg: 12 } }}>
            <Box sx={{ pl: { lg: 6 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    fontWeight: 600,
                    mb: 2,
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
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            backgroundColor: "text.primary",
                            borderRadius: "50%",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "0.85rem", md: "0.95rem" },
                              color: "text.secondary"
                            }}
                          >
                            {rule}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
            </Box>
          </Grid>
        </Grid>
      </Container>


    </Box>
  );
}