import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';

const injectFooterStyles = () => {
    if (document.getElementById('footer-anim-styles')) return;
    const s = document.createElement('style');
    s.id = 'footer-anim-styles';
    s.textContent = `
    @keyframes logo-glow {
      0%, 100% { filter: drop-shadow(0 0 3px rgba(23,118,242,0.5)); }
      50%        { filter: drop-shadow(0 0 7px rgba(0,212,168,0.6)); }
    }
    .footer-link {
      color: #6b7280;
      text-decoration: none;
      font-family: Montserrat;
      font-size: 0.7rem;
      font-weight: 500;
      transition: color 0.18s;
    }
    .footer-link:hover { color: #1776F2; }
  `;
    document.head.appendChild(s);
};

export function Footer() {
    useEffect(() => { injectFooterStyles(); }, []);

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(180deg, #181c25 0%, #111318 100%)',
                py: 2,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Top glow edge */}
            <Box sx={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '50%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(23,118,242,0.5), rgba(0,212,168,0.4), transparent)',
            }} />

            <Container maxWidth="xl" sx={{ px: 2, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                }}>
                    {/* Logo + tagline */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <svg
                            viewBox="0 0 53 87" fill="none" xmlns="http://www.w3.org/2000/svg"
                            style={{ width: '14px', height: '22px', animation: 'logo-glow 3s ease-in-out infinite' }}
                        >
                            <path
                                d="M34.7183 86.5C34.2121 86.3976 34.0062 86.0288 33.7227 85.7419C26.4361 78.3638 21.2602 69.1269 18.7447 59.012C18.4475 57.5946 17.8379 56.2633 16.9614 55.1175C16.0848 53.9716 14.9639 53.0408 13.6822 52.3944C10.4153 50.571 6.96267 49.0958 3.77671 47.088C-0.610738 44.3563 -0.587117 42.4372 3.81721 39.6918C7.19217 37.5816 10.9046 36.1269 14.2796 34.0372C15.7291 33.326 16.9471 32.2098 17.7895 30.8206C18.1528 29.9007 18.4252 28.9468 18.6029 27.9727C21.2408 17.8517 26.4229 8.59367 33.6451 1.09937C34.4382 0.279853 34.8432 0.320829 35.6127 1.09937C41.0126 6.54917 46.4317 11.9705 51.8699 17.3634C52.582 18.0463 52.7238 18.4697 51.9509 19.2688C51.9509 19.2688 47.8301 25.5381 45.7005 28.6284C44.3974 30.9007 42.5555 32.8089 40.341 34.1806C36.7906 36.1269 33.014 37.6226 29.5412 39.7533C28.1 40.6343 26.2742 41.5358 26.2539 43.3592C26.2337 45.2646 28.1203 46.166 29.6019 47.0675C32.8689 49.0753 36.4025 50.5505 39.8112 52.3124C42.3643 53.8013 44.4653 55.9696 45.8861 58.5817C47.9111 61.6345 52.0555 67.675 52.0555 67.675C52.7035 68.3579 52.6023 68.6994 52.015 69.2935C46.4733 74.7843 40.9721 80.3126 35.4541 85.8239C35.228 86.0698 34.9445 86.2917 34.7183 86.5Z"
                                fill="#1776F2"
                            />
                        </svg>
                        <Typography sx={{
                            fontFamily: 'Poppins', fontWeight: 800, fontSize: '1rem',
                            background: 'linear-gradient(135deg, #1776F2, #00D4A8)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Aikyuu
                        </Typography>
                        <Box sx={{
                            ml: 0.5, display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5,
                            background: 'rgba(23,118,242,0.1)', border: '1px solid rgba(23,118,242,0.2)',
                            borderRadius: 99, px: 1, py: 0.3,
                        }}>
                            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: '#00D4A8', boxShadow: '0 0 5px #00D4A8' }} />
                            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.58rem', fontWeight: 700, color: '#00D4A8' }}>
                                AI-Powered
                            </Typography>
                        </Box>
                    </Box>

                    {/* Nav links */}
                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                        {[
                            { label: 'Dashboard', to: '/dashboard' },
                            { label: 'Use Cases', to: '/use-cases' },
                            { label: 'Pricing', to: '/pricing' },
                            { label: 'Billing', to: '/billing' },
                        ].map(({ label, to }) => (
                            <Link key={to} to={to} className="footer-link">{label}</Link>
                        ))}
                    </Box>

                    {/* Copyright */}
                    <Typography sx={{
                        color: '#4b5563', fontFamily: 'Montserrat', fontSize: '0.63rem',
                    }}>
                        © {new Date().getFullYear()} Aikyuu · Resumate
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
