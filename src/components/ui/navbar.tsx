import { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Avatar, Divider, Paper } from '@mui/material';
import {
  Language as LanguageIcon,
  Logout as LogoutIcon,
  Feedback as FeedbackIcon,
  Lock as LockIcon,
  AccountBalanceWallet as WalletIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Stars as StarsIcon,
} from '@mui/icons-material';
import { AikyuuLogo } from './aikyuu-logo';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';

/* ── Styles ──────────────────────────────────────────────────────────── */
const injectNavStyles = () => {
  if (document.getElementById('nav-anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'nav-anim-styles';
  s.textContent = `
    @keyframes nav-pop {
      0%   { opacity: 0; transform: scale(0.95) translateY(-8px); transform-origin: top center; }
      50%  { transform: scale(1.02) translateY(2px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes nav-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .nv-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-family: Montserrat;
      font-weight: 700;
      font-size: 0.75rem;
      text-decoration: none;
      color: #1E1E1E;
      padding: 7px 18px;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }
    .nv-link:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(23,118,242,0.08);
    }
    .nv-link.active {
      background: linear-gradient(135deg, #1776F2, #0d5fcc);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 14px rgba(23,118,242,0.3);
    }
    .dd-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px; border-radius: 10px;
      cursor: pointer; text-decoration: none;
      border: none; background: transparent; width: 100%; text-align: left;
      font-family: Montserrat; font-size: 0.72rem; font-weight: 600;
      color: #374151; transition: background 0.14s, color 0.14s;
    }
    .dd-row:hover { background: #f0f4ff; color: #1776F2; }
    .dd-row-danger { color: #ef4444 !important; }
    .dd-row-danger:hover { background: rgba(239,68,68,0.06) !important; }
  `;
  document.head.appendChild(s);
};

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Use Cases', to: '/use-cases' },
  { label: 'Pricing', to: '/pricing' },
];

const DdIcon = ({ children, color = '#1776F2', bg = 'rgba(23,118,242,0.08)' }: {
  children: React.ReactNode; color?: string; bg?: string;
}) => (
  <Box sx={{
    width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg, '& svg': { fontSize: '0.9rem', color },
  }}>{children}</Box>
);

/* ── Component ───────────────────────────────────────────────────────── */
export function Navbar() {
  useEffect(() => { injectNavStyles(); }, []);

  const {
    currentLanguage, setLanguage,
    showProfileDropdown, showLanguageDropdown,
    setShowProfileDropdown, setShowLanguageDropdown,
  } = useUIStore();

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { profile, balance } = useProfileStore();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowProfileDropdown(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setShowLanguageDropdown(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => { logout(); setShowProfileDropdown(false); navigate('/signin'); };
  const isActive = (p: string) => location.pathname.startsWith(p);

  return (
    /* Outer wrapper — padding so rounded bar floats above page */
    <Box sx={{ width: '100%', px: { xs: 1, md: 1.5 }, pt: { xs: 0.75, md: 1 }, position: 'sticky', top: 0, zIndex: 100, background: 'transparent' }}>
      <Box sx={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e8edf5',
        boxShadow: '0 4px 20px rgba(23,50,120,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        animation: 'nav-in 0.35s ease both',
        position: 'relative',
      }}>
        {/* Gradient accent line at top */}
        <Box sx={{
          height: 3,
          background: 'linear-gradient(90deg, #1776F2 0%, #00C6FF 50%, #00D4A8 100%)',
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px',
        }} />

        <Box sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 0.75, md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>

          {/* ── Logo (Left) ── */}
          <Box component={Link} to="/dashboard" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }}>
            <AikyuuLogo />
          </Box>

          {/* ── Centre nav links (Absolute center) ── */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            alignItems: 'center',
            gap: 1,
            pointerEvents: 'none', // Prevents this absolute box from blocking clicks to the right side
          }}>
            {NAV_LINKS.map(({ label, to }) => (
              <Box key={to} sx={{ pointerEvents: 'auto' }}>
                <Link to={to} className={`nv-link${isActive(to) ? ' active' : ''}`}>
                  {label}
                </Link>
              </Box>
            ))}
          </Box>

          {/* ── Right: credits + avatar (Right) ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, justifyContent: 'flex-end' }}>

            {/* Credits chip */}
            <Box sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center', gap: 0.6,
              border: '1.5px solid #e0eaff',
              background: '#f5f8ff',
              borderRadius: '10px',
              px: 1.2, py: 0.55,
              cursor: 'default',
            }}>
              <StarsIcon sx={{ fontSize: '0.8rem', color: '#f59e0b' }} />
              <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.72rem', fontWeight: 800, color: '#1E1E1E' }}>
                {balance ?? '—'}
              </Typography>
              <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.62rem', fontWeight: 500, color: '#8a97b0' }}>
                credits
              </Typography>
            </Box>

            {/* Avatar trigger */}
            <Box sx={{ position: 'relative' }} ref={dropdownRef}>
              <Box
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  cursor: 'pointer',
                  border: '1.5px solid',
                  borderColor: showProfileDropdown ? 'primary.main' : '#e0e7ef',
                  borderRadius: '12px',
                  px: 0.75, py: 0.5,
                  background: showProfileDropdown ? '#f0f4ff' : '#fafbfc',
                  transition: 'border-color 0.15s, background 0.15s',
                  '&:hover': { borderColor: 'primary.main', background: '#f0f4ff' },
                }}
              >
                <Avatar
                  src={profile?.imageUrl || '/avatar.jpg'}
                  alt={profile?.name}
                  sx={{ width: 28, height: 28 }}
                />
                <Typography sx={{
                  display: { xs: 'none', md: 'block' },
                  fontFamily: 'Montserrat', fontSize: '0.72rem', fontWeight: 700, color: '#1E1E1E',
                  maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {profile?.name?.split(' ')[0] || 'Me'}
                </Typography>
                <ArrowDownIcon sx={{
                  fontSize: '0.85rem', color: '#8a97b0',
                  transform: showProfileDropdown ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }} />
              </Box>

              {/* ── Dropdown ── */}
              {showProfileDropdown && (
                <Paper elevation={0} sx={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 232, borderRadius: '16px',
                  border: '1px solid #e8edf5',
                  boxShadow: '0 16px 48px rgba(23,50,120,0.13)',
                  p: 1.25, zIndex: 200, background: '#fff',
                  transformOrigin: 'top right',
                  animation: 'nav-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
                }}>
                  {/* User card */}
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.25,
                    background: 'linear-gradient(135deg, #f0f4ff, #e6faf6)',
                    border: '1px solid #dde8ff',
                    borderRadius: '12px', p: 1.25, mb: 1,
                  }}>
                    <Avatar src={profile?.imageUrl || '/avatar.jpg'} sx={{ width: 38, height: 38, border: '2px solid #1776F2' }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{
                        fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.76rem', color: '#1E1E1E',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {profile?.name || 'User'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.2 }}>
                        <StarsIcon sx={{ fontSize: '0.65rem', color: '#f59e0b' }} />
                        <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.6rem', fontWeight: 600, color: '#1776F2' }}>
                          {balance ?? '—'} credits
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    <Link to="/change-password" className="dd-row" onClick={() => setShowProfileDropdown(false)} style={{ textDecoration: 'none' }}>
                      <DdIcon><LockIcon /></DdIcon>
                      Change Password
                    </Link>
                    <Link to="/feedback" className="dd-row" onClick={() => setShowProfileDropdown(false)} style={{ textDecoration: 'none' }}>
                      <DdIcon><FeedbackIcon /></DdIcon>
                      Feedback
                    </Link>
                    <Link to="/billing" className="dd-row" onClick={() => setShowProfileDropdown(false)} style={{ textDecoration: 'none' }}>
                      <DdIcon><WalletIcon /></DdIcon>
                      Billing
                    </Link>

                    <Divider sx={{ my: 0.75, borderColor: '#f0f0f0' }} />

                    {/* Language picker */}
                    <Box sx={{ position: 'relative' }} ref={langRef}>
                      <button className="dd-row" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <DdIcon><LanguageIcon /></DdIcon>
                          Language
                        </Box>
                        <ArrowDownIcon sx={{
                          fontSize: '0.85rem', color: '#9ca3af',
                          transform: showLanguageDropdown ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s',
                        }} />
                      </button>

                      {showLanguageDropdown && (
                        <Paper elevation={0} sx={{
                          position: 'absolute', bottom: '100%', right: 0, mb: 0.5,
                          width: 148, borderRadius: '12px', p: 0.75,
                          border: '1px solid #e8edf5',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                          transformOrigin: 'top right',
                          animation: 'nav-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
                          zIndex: 300,
                        }}>
                          {[
                            { code: 'en', label: 'English', sub: 'EN', flag: '🇺🇸' },
                            { code: 'ja', label: '日本語', sub: 'JA', flag: '🇯🇵' },
                          ].map(({ code, label, sub, flag }) => (
                            <button key={code} className="dd-row"
                              onClick={() => { setLanguage(code as 'en' | 'ja'); setShowLanguageDropdown(false); }}
                              style={{
                                marginBottom: 2,
                                background: currentLanguage === code ? '#eef3ff' : undefined,
                                border: currentLanguage === code ? '1px solid #c7d8ff' : '1px solid transparent',
                              }}>
                              <span style={{ fontSize: '1rem' }}>{flag}</span>
                              <Box>
                                <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.68rem', fontWeight: 600 }}>{label}</Typography>
                                <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.58rem', color: '#9ca3af' }}>{sub}</Typography>
                              </Box>
                            </button>
                          ))}
                        </Paper>
                      )}
                    </Box>

                    <Divider sx={{ my: 0.75, borderColor: '#f0f0f0' }} />

                    <button className="dd-row dd-row-danger" onClick={handleLogout}>
                      <DdIcon color="#ef4444" bg="rgba(239,68,68,0.08)"><LogoutIcon /></DdIcon>
                      Sign Out
                    </button>
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
