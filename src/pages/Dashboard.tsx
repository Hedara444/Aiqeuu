import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  ArrowForward as ArrowForwardIcon,
  WorkOutline as WorkOutlineIcon,
  ListAlt as ListAltIcon,
  Description as DescriptionIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import Stepper from '@/components/ui/Stepper';
import { useProfileStore } from '@/store/profileStore';
import { Trans, useTranslation } from 'react-i18next';

/* ── Inject styles once ──────────────────────────────────────────────── */
const injectDashStyles = () => {
  if (document.getElementById('dash-anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'dash-anim-styles';
  s.textContent = `
    @keyframes dash-fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes dash-float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes dash-shimmer {
      0%   { background-position: -300% center; }
      100% { background-position: 300% center; }
    }
    @keyframes dash-orb {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
      50%        { transform: translate(20px, -15px) scale(1.05); opacity: 0.9; }
    }
    @keyframes dash-orb2 {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
      50%        { transform: translate(-15px, 12px) scale(1.08); opacity: 0.8; }
    }
    @keyframes create-btn-shine {
      0%   { left: -120%; }
      60%, 100% { left: 120%; }
    }
    @keyframes stat-count {
      from { opacity: 0; transform: scale(0.7); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes tip-appear {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .create-pos-btn {
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .create-pos-btn::before {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      width: 60%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      animation: create-btn-shine 2.5s 1s ease-in-out infinite;
      left: -120%;
    }
    .create-pos-btn:hover {
      transform: translateY(-3px) scale(1.01) !important;
      box-shadow: 0 16px 40px rgba(23,118,242,0.4) !important;
    }
    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important;
    }
    .tip-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .tip-card:hover {
      transform: translateX(4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important;
    }
  `;
  document.head.appendChild(s);
};


/* ── Quick tips ───────────────────────────────────────────────────────── */
const TIPS = [
  { icon: '📋', titleKey: 'dashboard.tips.createPosition.title', descKey: 'dashboard.tips.createPosition.desc' },
  { icon: '📤', titleKey: 'dashboard.tips.uploadCVs.title', descKey: 'dashboard.tips.uploadCVs.desc' },
  { icon: '🤖', titleKey: 'dashboard.tips.aiEvaluation.title', descKey: 'dashboard.tips.aiEvaluation.desc' },
];

/* ── Component ───────────────────────────────────────────────────────── */
export default function Dashboard() {
  useEffect(() => { injectDashStyles(); }, []);
  const { profile, balance, stats, getStats } = useProfileStore();
  const { t } = useTranslation();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboard.greeting.morning')
      : hour < 17
        ? t('dashboard.greeting.afternoon')
        : t('dashboard.greeting.evening');

  useEffect(() => {
    if (!stats) {
      void getStats();
    }
  }, [getStats, stats]);

  const positionsCount = stats?.positionsCount ?? null;
  const avgCriteriasPerUseCase = stats?.avgCriteriasPerUseCase != null ? Math.round(stats.avgCriteriasPerUseCase * 100) / 100 : null;
  const processedResumesCount = stats?.processedResumesCount ?? null;
  const avgScorePercent = stats?.avgScore != null ? Math.round(stats.avgScore) : null;

  const statCardSx = (accentA: string, accentB: string, glow: string) => ({
    borderRadius: '16px',
    p: 2,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(2px)',
    minHeight: 12,
    border: '1px solid rgba(23,118,242,0.12)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(135deg, ${accentA} 0%, ${accentB} 100%)`,
      opacity: 0.08,
      transform: 'translate3d(0,0,0)',
      backgroundSize: '200% auto',
      animation: 'dash-shimmer 6s linear infinite',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -60,
      right: -70,
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${accentA} 0%, rgba(255,255,255,0) 70%)`,
      opacity: 0.12,
      animation: 'dash-orb 10s ease-in-out infinite',
      pointerEvents: 'none',
    },
    '&:hover': {
      borderColor: 'rgba(23,118,242,0.18)',
      boxShadow: `${glow}, 0 16px 38px rgba(16,36,63,0.10)`,
    },
  });

  return (
    <Box sx={{
      px: { xs: 1.5, md: 3 },
      py: { xs: 2, md: 3 },
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Background decorative orbs ── */}
      <Box sx={{
        position: 'fixed', top: '15%', right: '-100px',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,118,242,0.08), transparent 70%)',
        animation: 'dash-orb 9s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'fixed', bottom: '20%', left: '-80px',
        width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,168,0.07), transparent 70%)',
        animation: 'dash-orb2 11s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Greeting banner ── */}
        <Box sx={{
          mb: 3,
          animation: 'dash-fade-up 0.5s 0.05s both',
        }}>
          <Typography sx={{
            fontFamily: 'Montserrat',
            fontSize: { xs: '1.1rem', md: '1.5rem' },
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.02em',
          }}>
            {greeting}, <Box component="span" sx={{
              background: 'linear-gradient(135deg, #1776F2, #00D4A8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {profile?.name?.split(' ')[0] || t('dashboard.greeting.fallbackName')} 👋
            </Box>
          </Typography>
          <Typography sx={{
            fontFamily: 'Montserrat',
            fontSize: { xs: '0.78rem', md: '0.88rem' },
            color: 'text.secondary',
            fontWeight: 500,
            mt: 0.4,
          }}>
            <Trans
              i18nKey="dashboard.creditsLine"
              values={{ credits: balance }}
              components={{ strong: <strong style={{ color: '#1776F2' }} /> }}
            />
          </Typography>
        </Box>

        {/* ── Stepper ── */}
        <Box sx={{ animation: 'dash-fade-up 0.5s 0.1s both' }}>
          <Stepper step={1} />
        </Box>

        <Box sx={{
          mt: 2.2,
          mb: 3,
          animation: 'dash-fade-up 0.5s 0.22s both',
        }}>
          <Typography sx={{
            fontFamily: 'Montserrat',
            fontSize: { xs: '0.78rem', md: '0.85rem' },
            fontWeight: 700,
            color: 'text.secondary',
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {t('dashboard.stats.title')}
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center" sx={{ maxWidth: 1060, mx: 'auto' }}>
            <Grid item xs={12} sm={6} md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper className="stat-card" elevation={0} sx={{ ...statCardSx('rgb(0,196,255)', 'rgba(23,118,242,1)', '0 14px 30px rgba(23,118,242,0.16)'), width: { xs: '100%', sm: 240 } }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0,196,255,0.16), rgba(23,118,242,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.7 }}>
                  <WorkOutlineIcon sx={{ fontSize: '1.05rem', color: '#1776F2' }} />
                </Box>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('dashboard.stats.positionsCount')}
                </Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.72rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #1776F2, #00D4A8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'stat-count 0.35s both' }}>
                  {positionsCount ?? '—'}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper className="stat-card" elevation={0} sx={{ ...statCardSx('rgb(0,196,255)', 'rgba(23,118,242,1)', '0 14px 30px rgba(99,102,241,0.16)'), width: { xs: '100%', sm: 240 } }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(23,118,242,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.7 }}>
                  <ListAltIcon sx={{ fontSize: '1.05rem', color: '#4f46e5' }} />
                </Box>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('dashboard.stats.avgCriteriasPerUseCase')}
                </Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.72rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #4f46e5, #1776F2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'stat-count 0.35s both' }}>
                  {avgCriteriasPerUseCase ?? '—'}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper className="stat-card" elevation={0} sx={{ ...statCardSx('rgb(103,227,241)', 'rgba(23,118,242,1)', '0 14px 30px rgba(0,212,168,0.16)'), width: { xs: '100%', sm: 240 } }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0,212,168,0.16), rgba(23,118,242,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.7 }}>
                  <DescriptionIcon sx={{ fontSize: '1.05rem', color: '#00b894' }} />
                </Box>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('dashboard.stats.processedResumesCount')}
                </Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.72rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #00b894, #1776F2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'stat-count 0.35s both' }}>
                  {processedResumesCount ?? '—'}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper className="stat-card" elevation={0} sx={{ ...statCardSx('rgb(71,255,175)', 'rgba(23,118,242,1)', '0 14px 30px rgba(255,140,66,0.16)'), width: { xs: '100%', sm: 240 } }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, rgba(71,255,175,0.18), rgba(23,118,242,0.16))', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.7 }}>
                  <InsightsIcon sx={{ fontSize: '1.05rem', color: '#12b886' }} />
                </Box>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t('dashboard.stats.avgScore')}
                </Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.72rem', lineHeight: 1.1, background: 'linear-gradient(135deg, #12b886, #1776F2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'stat-count 0.35s both' }}>
                  {avgScorePercent != null ? `${avgScorePercent}%` : '—'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>


        {/* ── Create New Position CTA ── */}
        <Box sx={{
          mb: 3,
          animation: 'dash-fade-up 0.5s 0.35s both',
        }}>
          <Box
            component={Link}
            to="/create-position"
            className="create-pos-btn"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              width: '100%',
              maxWidth: { xs: '100%', md: '520px' },
              mx: 'auto',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 50%, #1776F2 100%)',
              backgroundSize: '200% auto',
              borderRadius: '16px',
              py: 2,
              px: 3,
              boxShadow: '0 8px 24px rgba(23,118,242,0.35)',
              animation: 'dash-shimmer 3s linear infinite',
            }}
          >
            <AddIcon sx={{ color: 'white', fontSize: '1.5rem', animation: 'dash-float 2s ease-in-out infinite' }} />
            <Typography sx={{
              color: 'white',
              fontFamily: 'Montserrat',
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              fontWeight: 800,
              letterSpacing: '0.02em',
            }}>
              {t('dashboard.createNewPosition')}
            </Typography>
            <ArrowForwardIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', ml: 'auto' }} />
          </Box>
        </Box>

        {/* ── How it works tips ── */}
        <Box sx={{ animation: 'dash-fade-up 0.5s 0.45s both' }}>
          <Typography sx={{
            fontFamily: 'Montserrat',
            fontSize: { xs: '0.78rem', md: '0.85rem' },
            fontWeight: 700,
            color: 'text.secondary',
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {t('dashboard.howItWorks')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {TIPS.map(({ icon, titleKey, descKey }, i) => (
              <Paper
                key={titleKey}
                className="tip-card"
                elevation={0}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  p: { xs: 1.5, md: 2 },
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(23,118,242,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  animation: `tip-appear 0.4s ${0.5 + i * 0.1}s both`,
                }}
              >
                <Box sx={{
                  width: 40, height: 40, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(23,118,242,0.08), rgba(0,212,168,0.08))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', flexShrink: 0,
                }}>
                  {icon}
                </Box>
                <Box>
                  <Typography sx={{
                    fontFamily: 'Montserrat', fontWeight: 700,
                    fontSize: { xs: '0.75rem', md: '0.82rem' },
                    color: 'text.primary', mb: 0.2,
                  }}>
                    {t(titleKey)}
                  </Typography>
                  <Typography sx={{
                    fontFamily: 'Montserrat', fontWeight: 500,
                    fontSize: { xs: '0.65rem', md: '0.72rem' },
                    color: 'text.secondary',
                  }}>
                    {t(descKey)}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', color: 'rgba(23,118,242,0.3)', display: { xs: 'none', md: 'flex' } }}>
                  <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
