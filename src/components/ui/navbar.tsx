import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import {
  Language as LanguageIcon,
  Logout as LogoutIcon,
  Feedback as FeedbackIcon,
  History as HistoryIcon,
  Lock as LockIcon,
  Money
} from '@mui/icons-material';
import { AikyuuLogo } from './aikyuu-logo';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';

export function Navbar() {
  const {
    currentLanguage,
    setLanguage,
    showProfileDropdown,
    showLanguageDropdown,
    setShowProfileDropdown,
    setShowLanguageDropdown,
  } = useUIStore();

  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { profile, balance } = useProfileStore()


  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
    navigate('/signin')

  }

  return (
    <Box sx={{ width: '100%', backgroundColor: 'background.default', px: { xs: 1.05, md: 2 }, py: 2.6 }}>
      <Paper sx={{
        // maxWidth: '1280px',
        mx: 'auto',
        borderRadius: '50px',
        px: { xs: 1, md: 2 },
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 1
      }}>
        {/* Logo */}
        <Box component={Link} to="/dashboard" sx={{ flexShrink: 0, textDecoration: 'none' }}>
          <AikyuuLogo />
        </Box>

        {/* Navigation Links & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 3, md: 2 } }}>
          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: "center", gap: 3 }}>
            <Button
              component={Link}
              to="/use-cases"
              sx={{
                color: 'text.primary',
                fontFamily: 'Montserrat',
                fontSize: { md: '0.725rem', lg: '1.00rem' },
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Use Cases
            </Button>
            <Button
              component={Link}
              to="/pricing"
              sx={{
                color: 'text.primary',
                fontFamily: 'Montserrat',
                fontSize: {  md: '0.725rem', lg: '1.0rem'  },
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Pricing
            </Button>
            <Typography sx={{
              color: 'text.primary',
              fontFamily: 'Montserrat',
              fontSize: {  md: '0.725rem', lg: '1.0rem'  },
              fontWeight: 700
            }}>
              Your Credits :{balance}
            </Typography>
          </Box>

          {/* Profile Dropdown */}
          <Box sx={{ position: 'relative' }} ref={dropdownRef}>
            <Button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              sx={{
                p: 0,
                minWidth: 0,
                width: { xs: '40px', md: '50px' },
                height: { xs: '40px', md: '50px' },
                borderRadius: '50%',
                overflow: 'hidden',
                outline: '2px solid',
                outlineColor: 'primary.main',
                '&:hover': {
                  outline: '2px solid',
                  outlineColor: 'primary.main'
                }
              }}
            >
              <Avatar
                src={profile.imageUrl || "/avatar.jpg"}
                alt={profile.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: profile.imageUrl ? 'transparent' : 'primary.dark'
                }}
              >
                {/* {!profile.imageUrl  && (
                  <Box sx={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'background.paper',
                    borderRadius: '50%'
                  }} />
                )} */}
              </Avatar>
            </Button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <Paper sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                mt: 1,
                width: '320px',
                borderRadius: '38px',
                boxShadow: 3,
                zIndex: 50,
                p: 2
              }}>
                {/* User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 , ml:1 }}>
                  <Avatar
                    src={profile.imageUrl || "/avatar.jpg"}
                    alt={profile.name}
                    sx={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'primary.dark'
                    }}
                  >
                    {/* {!profile.imageUrl && (
                      <Box sx={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'background.paper',
                        borderRadius: '50%'
                      }} />
                    )} */}
                  </Avatar>
                  <Typography sx={{
                    color: 'text.primary',
                    fontFamily: 'Quicksand',
                    fontSize: '1.025rem',
                    fontWeight: 500
                  }}>
                    {profile.name}
                  </Typography>
                </Box>

                {/* Menu Items */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/change-password"
                    onClick={() => setShowProfileDropdown(false)}
                    startIcon={<LockIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      fontFamily: 'Quicksand',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Change password
                  </Button>

                  <Divider />

                  <Button
                    component={Link}
                    to="/feedback"
                    onClick={() => setShowProfileDropdown(false)}
                    startIcon={<FeedbackIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      fontFamily: 'Quicksand',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Feedback
                  </Button>

                  <Divider />

                  <Button
                    component={Link}
                    to="/history"
                    onClick={() => setShowProfileDropdown(false)}
                    startIcon={<HistoryIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      fontFamily: 'Quicksand',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    History
                  </Button>

                  <Divider />

                  <Button
                    component={Link}
                    to="/billing"
                    onClick={() => setShowProfileDropdown(false)}
                    startIcon={<Money />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      fontFamily: 'Quicksand',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Billing
                  </Button>

                  <Divider />

                  {/* Language Selector */}
                  <Box sx={{ position: 'relative' }} ref={languageDropdownRef}>
                    <Button
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      startIcon={<LanguageIcon />}
                      sx={{
                        justifyContent: 'flex-start',
                        color: 'text.primary',
                        fontFamily: 'Quicksand',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        width: '100%',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      Language
                    </Button>

                    {/* Language Dropdown */}
                    {showLanguageDropdown && (
                      <Paper sx={{
                        position: 'absolute',
                        bottom: '100%',
                        right: 0,
                        mb: 1,
                        width: '192px',
                        borderRadius: '20px',
                        boxShadow: 3,
                        zIndex: 50,
                        p: 2
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            onClick={() => {
                              setLanguage('en');
                              setShowLanguageDropdown(false);
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              width: '100%',
                              p: 1.5,
                              borderRadius: '15px',
                              justifyContent: 'flex-start',
                              textTransform: 'none',
                              ...(currentLanguage === 'en' ? {
                                backgroundColor: 'primary.main',
                                color: 'text.primary',
                              } : {
                                color: 'text.primary',
                                '&:hover': { backgroundColor: 'grey.100' },
                              }),
                            }}
                          >
                            <Typography sx={{ fontSize: '1.5rem' }}>🇺🇸</Typography>
                            <Box sx={{ textAlign: 'left', flex: 1 }}>
                              <Typography sx={{ fontFamily: 'Quicksand', fontSize: '0.95rem', fontWeight: 500 }}>
                                English
                              </Typography>
                              <Typography sx={{ fontFamily: 'Quicksand', fontSize: '0.875rem', color: 'text.secondary' }}>
                                EN
                              </Typography>
                            </Box>
                          </Button>

                          <Button
                            onClick={() => {
                              setLanguage('ja');
                              setShowLanguageDropdown(false);
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              width: '100%',
                              p: 1.5,
                              borderRadius: '15px',
                              justifyContent: 'flex-start',
                              textTransform: 'none',
                              ...(currentLanguage === 'ja' ? {
                                backgroundColor: 'primary.main',
                                color: 'text.primary',
                              } : {
                                color: 'text.primary',
                                '&:hover': { backgroundColor: 'grey.100' },
                              }),
                            }}
                          >
                            <Typography sx={{ fontSize: '1.5rem' }}>🇯🇵</Typography>
                            <Box sx={{ textAlign: 'left', flex: 1 }}>
                              <Typography sx={{ fontFamily: 'Quicksand', fontSize: '0.95rem', fontWeight: 500 }}>
                                日本語
                              </Typography>
                              <Typography sx={{ fontFamily: 'Quicksand', fontSize: '0.875rem', color: 'text.secondary' }}>
                                JA
                              </Typography>
                            </Box>
                          </Button>
                        </Box>
                      </Paper>
                    )}
                  </Box>

                  <Divider />

                  <Button
                    component={Link}
                    to="/signin"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.primary',
                      fontFamily: 'Quicksand',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Sign out
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
