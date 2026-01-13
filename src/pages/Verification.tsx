import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormLabel,
  Stack
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Phone as PhoneIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { AuthLayout } from '@/components/layout/auth-layout';
import { AikyuuButton } from '@/components/ui/aikyuu-button';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Verification() {
  const navigate = useNavigate();
  const { verify, resendVerificationCode, isLoading } = useAuthStore();
  const [searchParams] = useSearchParams();
  const verificationId = searchParams.get('verificationId');

  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verifyData = { verificationId, verificationCode }
    await verify(verifyData)
    navigate("/dashboard")
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0 || !verificationId) return;

    setIsResending(true);
    try {
      const { verificationId: newVerificationId } = await resendVerificationCode({ verificationId });
      navigate(`/verification?verificationId=${newVerificationId}`);

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
    } catch (error) {
      console.error('Failed to resend verification code:', error);
    } finally {
      setIsResending(false);
    }
  };

  const rightContent = (
    <Box sx={{ position: "relative", width: 516, height: 509 }}>
      {/* Main person image */}
      <Box
        sx={{
          position: "absolute",
          top: 4,
          left: 8,
          // width: 372,
          // height: 470,
          borderRadius: 2,
          overflow: "hidden"
        }}
      >
        <Box
          component="img"
          src="/verify.png"
          alt="Young person with phone"
          sx={{
            width: "90%",
            height: "90%",
            objectFit: "cover"
          }}
        />
      </Box>

      {/* Phone/verification icon top left */}
      {/* <Box
        sx={{
          position: "absolute",
          top: 5,
          left: 0,
          width: 119,
          height: 122,
          backgroundColor: "secondary.main",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PhoneIcon sx={{ color: "primary.main", fontSize: "2.5rem", mb: 1 }} />
        <Box sx={{ width: 64, height: 4, bgcolor: "primary.main", mb: 1 }} />
        <Box sx={{ width: 48, height: 4, bgcolor: "primary.main" }} />
      </Box> */}

      {/* Check/verification icon */}
      {/* <Box
        sx={{
          position: "absolute",
          top: "285px",
          left: "183px",
          width: 139,
          height: 139,
          backgroundColor: "background.paper",
          borderRadius: "50%",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 68,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <VerifiedIcon sx={{ color: "white", fontSize: "2rem" }} />
        </Box>
      </Box> */}

      {/* Heart/love icon bottom right */}
      {/* <Box
        sx={{
          position: "absolute",
          bottom: 4,
          right: 4,
          width: 64,
          height: 64,
          backgroundColor: "secondary.main",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FavoriteIcon sx={{ color: "error.main", fontSize: "1.5rem" }} />
      </Box> */}
    </Box>
  );

  return (
    <AuthLayout rightContent={rightContent}>
      <Box sx={{ maxWidth: 807 }}>
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: "2.025rem", // 45px
            fontWeight: 700,
            lineHeight: "normal",
            mb: "23px",
            color: "text.primary"
          }}
        >
          Verification
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "21px", // 24px
            fontWeight: 500,
            lineHeight: "normal",
            mb: "30px",
            color: "text.primary"
          }}
        >
          Please, enter your verification code
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box>
              <FormLabel
                sx={{
                  display: "block",
                  color: "grey.500",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  mb: 2
                }}
              >
                Code *
              </FormLabel>
              <TextField
                fullWidth
                name="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                sx={{
                  mb: 2, // Reduced margin to make space for resend button
                  '& .MuiOutlinedInput-root': {
                    height: "50px",
                    borderRadius: "16px"
                  }
                }}
              />

              {/* Resend Code Button */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Button
                  onClick={handleResendCode}
                  disabled={isResending || resendCountdown > 0 || !verificationId}
                  sx={{
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
            </Box>

            {/* Submit Button */}
            <AikyuuButton
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Confirm
            </AikyuuButton>
          </Stack>
        </Box>
      </Box>
    </AuthLayout>
  );
}

