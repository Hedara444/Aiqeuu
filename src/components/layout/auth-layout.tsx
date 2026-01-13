import React from 'react';
import { Box, Container } from '@mui/material';
import { AikyuuLogo } from '@/components/ui/aikyuu-logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function AuthLayout({ children, rightContent }: AuthLayoutProps) {
  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' }
    }}>
      {/* Left Side - Form */}
      <Box sx={{ flex: 1.2, maxWidth: { lg: '960px' }, position: 'relative' }}>
        {/* Logo */}
        <Box sx={{
          position: 'absolute',
          left: { xs: 2, md: '60px' },
          top: { xs: 2, md: '13px' },
          zIndex: 10
        }}>
          <AikyuuLogo />
        </Box>

        {/* Form Content */}
        <Container sx={{
          px: { xs: 2, md: '60px' },
          pt: { xs: 12, md: '75px' },
          pb: { xs: 2, md: '37px' },
          minHeight: { xs: '100vh', lg: 0 }
        }}>
          {children}
        </Container>
      </Box>

      {/* Right Side - Background/Illustration */}
      <Box sx={{
        display: { xs: 'none', lg: 'flex' },
        flex: 1,
        minWidth: '360px',
        position: 'relative',
        // backgroundColor: 'background.paper',
        boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)'
      }}>
        {/* Background gradient/pattern overlay */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          // background: 'linear-gradient(to bottom right, #F9FAFB, #E5E7EB)'
        }} />

        {/* Content */}
        {rightContent && (
          <Box sx={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 5
          }}>
            {rightContent}
          </Box>
        )}

        {/* Default illustration elements if no content provided */}
        {!rightContent && (
          <Box sx={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
            {/* Decorative circles and shapes */}
            {/* <Box sx={{
              position: 'absolute',
              top: '320px',
              right: '231px',
              width: '190px',
              height: '196px',
              opacity: 0.2
            }}>
              <Box sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'primary.main',
                borderRadius: '50%'
              }} />
            </Box> */}

            {/* Person illustration placeholder */}
            <Box sx={{
              position: 'absolute',
              top: '43px',
              right: '116px',
              // width: '353px',
              // height: '364px'
            }}>
              <img
                src="/signup.png"
                alt="Professional person"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Box>

            {/* Floating UI elements */}
            {/* <Box sx={{
              position: 'absolute',
              top: '650px',
              left: '180px',
              width: '114px',
              height: '123px',
              backgroundColor: 'primary.dark',
              borderRadius: '12px',
              boxShadow: '0 0 4px 0 rgba(0,0,0,0.25)'
            }} /> */}
            {/* <Box sx={{
              position: 'absolute',
              top: '390px',
              left: '237px',
              width: '80px',
              height: '86px',
              backgroundColor: 'primary.dark',
              borderRadius: '12px',
              boxShadow: '0 0 4px 0 rgba(0,0,0,0.25)'
            }} /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
}
