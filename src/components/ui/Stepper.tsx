import { useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
    WorkOutline as WorkIcon,
    UploadFile as UploadIcon,
    Insights as InsightsIcon,
    CheckCircle as CheckIcon,
    ChevronRight as ChevronIcon,
} from '@mui/icons-material';

const injectStepperStyles = () => {
    if (document.getElementById('stepper-anim-styles')) return;
    const s = document.createElement('style');
    s.id = 'stepper-anim-styles';
    s.textContent = `
    @keyframes step-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes active-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(23,118,242,0.4); }
      50%       { box-shadow: 0 0 0 5px rgba(23,118,242,0); }
    }
    @keyframes icon-spin-in {
      from { transform: rotate(-30deg) scale(0.7); opacity: 0; }
      to   { transform: rotate(0deg) scale(1); opacity: 1; }
    }
  `;
    document.head.appendChild(s);
};

const STEPS = [
    { label: 'New Position', sub: 'Create job criteria', icon: WorkIcon },
    { label: 'Upload CVs', sub: 'Upload candidates', icon: UploadIcon },
    { label: 'View Results', sub: 'AI-ranked output', icon: InsightsIcon },
];

const Stepper = ({ step }: { step: number }) => {
    useEffect(() => { injectStepperStyles(); }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '18px',
                p: { xs: '14px 16px', md: '18px 28px' },
                mb: 2.5,
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(23,118,242,0.1)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                animation: 'step-in 0.45s ease both',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Gradient top bar */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, #1776F2, #00D4A8)',
                borderRadius: '18px 18px 0 0',
            }} />

            {/* Steps row */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: { xs: 0.5, md: 1 },
            }}>
                {STEPS.map(({ label, sub, icon: Icon }, i) => {
                    const num = i + 1;
                    const done = step > num;
                    const active = step === num;

                    return (
                        <Box
                            key={label}
                            sx={{
                                display: 'flex', flex: 1, alignItems: 'center',
                                animation: `step-in 0.4s ${i * 0.1}s both`,
                            }}
                        >
                            {/* Step tile */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 0.8, md: 1.2 },
                                flex: 1,
                                p: { xs: '8px 10px', md: '10px 14px' },
                                borderRadius: '14px',
                                background: active
                                    ? 'linear-gradient(135deg, rgba(23,118,242,0.1), rgba(0,212,168,0.08))'
                                    : done
                                        ? 'rgba(0,212,168,0.07)'
                                        : 'rgba(0,0,0,0.02)',
                                border: active
                                    ? '1.5px solid rgba(23,118,242,0.3)'
                                    : done
                                        ? '1.5px solid rgba(0,212,168,0.25)'
                                        : '1.5px solid transparent',
                                transition: 'all 0.3s ease',
                            }}>
                                {/* Icon bubble */}
                                <Box sx={{
                                    width: { xs: 32, md: 38 },
                                    height: { xs: 32, md: 38 },
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    background: done
                                        ? 'linear-gradient(135deg, #00C49A, #00D4A8)'
                                        : active
                                            ? 'linear-gradient(135deg, #1776F2, #5BA4F5)'
                                            : '#f0f0f0',
                                    animation: active ? 'active-glow 2.2s ease-in-out infinite' : 'none',
                                    color: (active || done) ? 'white' : '#aaa',
                                    transition: 'all 0.3s ease',
                                    '& svg': {
                                        fontSize: { xs: '1rem', md: '1.15rem' },
                                        animation: active ? 'icon-spin-in 0.4s ease both' : 'none',
                                    },
                                }}>
                                    {done ? <CheckIcon /> : <Icon />}
                                </Box>

                                {/* Labels */}
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{
                                        fontFamily: 'Montserrat', fontWeight: 800,
                                        fontSize: { xs: '0.6rem', md: '0.72rem' },
                                        color: active ? '#1776F2' : done ? '#00b390' : 'text.secondary',
                                        lineHeight: 1.2,
                                        transition: 'color 0.3s',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {label}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: 'Montserrat', fontWeight: 500,
                                        fontSize: { xs: '0.5rem', md: '0.6rem' },
                                        color: 'text.secondary',
                                        display: { xs: 'none', sm: 'block' },
                                        lineHeight: 1.3,
                                        mt: 0.2,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {sub}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Chevron connector (between steps) */}
                            {i < STEPS.length - 1 && (
                                <ChevronIcon sx={{
                                    fontSize: '1.1rem',
                                    color: step > num + 1 ? '#00D4A8' : step > num ? 'rgba(23,118,242,0.5)' : '#d1d5db',
                                    mx: { xs: 0.25, md: 0.75 },
                                    flexShrink: 0,
                                    transition: 'color 0.4s ease',
                                }} />
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default Stepper;
