import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

/* ─── Keyframe Animations (injected once) ─────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('payment-status-styles')) return;
  const style = document.createElement('style');
  style.id = 'payment-status-styles';
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
      60%  { transform: scale(1.15) rotate(10deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50%       { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50%       { transform: translateY(-14px) rotate(-5deg); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes confetti-fall {
      0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px) rotate(-2deg); }
      40%       { transform: translateX(8px) rotate(2deg); }
      60%       { transform: translateX(-6px) rotate(-1deg); }
      80%       { transform: translateX(6px) rotate(1deg); }
    }
    @keyframes dash {
      to { stroke-dashoffset: 0; }
    }
    @keyframes x-draw {
      0%   { stroke-dashoffset: 100; opacity: 0; }
      30%  { opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 1; }
    }
    @keyframes progress-fill {
      from { width: 0%; }
      to   { width: 100%; }
    }
    @keyframes bounce-dot {
      0%, 80%, 100% { transform: scale(0); }
      40%            { transform: scale(1); }
    }
    @keyframes orb-move {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(60px, -40px) scale(1.1); }
      66%       { transform: translate(-40px, 30px) scale(0.95); }
    }
    @keyframes orb-move2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(-50px, 40px) scale(1.05); }
      66%       { transform: translate(40px, -30px) scale(0.9); }
    }
    .payment-btn-success:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 30px rgba(0, 212, 168, 0.5) !important;
    }
    .payment-btn-cancel:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 30px rgba(23, 118, 242, 0.4) !important;
    }
    .payment-btn-success, .payment-btn-cancel {
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Confetti Particle ───────────────────────────────────────────────── */
interface ConfettiPiece { id: number; x: number; color: string; delay: number; duration: number; size: number; shape: 'circle' | 'rect'; }

const CONFETTI_COLORS = ['#1776F2', '#00D4A8', '#FFD700', '#FF6B6B', '#A8EDEA', '#FED6E3'];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 2.5,
    duration: 3 + Math.random() * 3,
    size: 6 + Math.random() * 10,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));
}

/* ─── Animated Check SVG ──────────────────────────────────────────────── */
const AnimatedCheck: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100" height="100" style={{ overflow: 'visible' }}>
    {/* Glow */}
    <circle cx="50" cy="50" r="48" fill="rgba(0,212,168,0.12)" />
    <circle cx="50" cy="50" r="42" fill="rgba(0,212,168,0.18)" />
    {/* Circle */}
    <circle
      cx="50" cy="50" r="36"
      fill="none"
      stroke="#00D4A8"
      strokeWidth="3"
      strokeDasharray="226"
      strokeDashoffset="226"
      strokeLinecap="round"
      style={{ animation: 'dash 0.7s 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
    />
    {/* Checkmark */}
    <polyline
      points="30,52 44,66 72,38"
      fill="none"
      stroke="#00D4A8"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="60"
      strokeDashoffset="60"
      style={{ animation: 'dash 0.5s 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
    />
  </svg>
);

/* ─── Animated X SVG ──────────────────────────────────────────────────── */
const AnimatedX: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100" height="100" style={{ overflow: 'visible' }}>
    <circle cx="50" cy="50" r="48" fill="rgba(255,107,107,0.1)" />
    <circle cx="50" cy="50" r="42" fill="rgba(255,107,107,0.16)" />
    <circle
      cx="50" cy="50" r="36"
      fill="none"
      stroke="#FF6B6B"
      strokeWidth="3"
      strokeDasharray="226"
      strokeDashoffset="226"
      strokeLinecap="round"
      style={{ animation: 'dash 0.7s 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
    />
    <line x1="33" y1="33" x2="67" y2="67" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round"
      strokeDasharray="50" strokeDashoffset="50"
      style={{ animation: 'x-draw 0.4s 0.9s ease forwards' }} />
    <line x1="67" y1="33" x2="33" y2="67" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round"
      strokeDasharray="50" strokeDashoffset="50"
      style={{ animation: 'x-draw 0.4s 1.1s ease forwards' }} />
  </svg>
);

/* ─── Main Component ──────────────────────────────────────────────────── */
const PaymentStatus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuccess = location.pathname.includes('/payment-success');
  const [countdown, setCountdown] = useState(5);
  const [confetti] = useState(() => generateConfetti(50));

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (!isSuccess) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); navigate('/use-cases'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSuccess, navigate]);

  /* ── Shared background ── */
  const bgGradient = isSuccess
    ? 'radial-gradient(ellipse at 20% 20%, rgba(23,118,242,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(0,212,168,0.15) 0%, transparent 60%), #F8F7F7'
    : 'radial-gradient(ellipse at 20% 20%, rgba(255,107,107,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(23,118,242,0.1) 0%, transparent 60%), #F8F7F7';

  const accentColor = isSuccess ? '#00D4A8' : '#FF6B6B';
  const accentDark = isSuccess ? '#00b390' : '#e05555';

  return (
    <div style={{
      minHeight: '100vh',
      background: bgGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Montserrat", sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px',
    }}>

      {/* ── Confetti (success only) ── */}
      {isSuccess && confetti.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          top: '-20px',
          left: `${p.x}%`,
          width: p.size,
          height: p.shape === 'rect' ? p.size * 0.5 : p.size,
          borderRadius: p.shape === 'circle' ? '50%' : '2px',
          background: p.color,
          animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          zIndex: 0,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Floating orbs ── */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: 320, height: 320, borderRadius: '50%',
        background: isSuccess
          ? 'radial-gradient(circle, rgba(0,212,168,0.25), transparent 70%)'
          : 'radial-gradient(circle, rgba(255,107,107,0.2), transparent 70%)',
        animation: 'orb-move 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,118,242,0.18), transparent 70%)',
        animation: 'orb-move2 10s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* ── Card ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 32,
        padding: '56px 48px',
        maxWidth: 480,
        width: '100%',
        boxShadow: `0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6)`,
        textAlign: 'center',
        animation: 'fadeInUp 0.6s 0.1s both',
      }}>

        {/* ── Pulse ring behind icon ── */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
          {[1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '50%',
              border: `2px solid ${accentColor}`,
              animation: `pulse-ring 2s ${i * 0.5}s ease-out infinite`,
              pointerEvents: 'none',
            }} />
          ))}
          <div style={{
            animation: 'scaleIn 0.7s 0.2s both',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isSuccess ? <AnimatedCheck /> : <AnimatedX />}
          </div>
        </div>

        {/* ── Title ── */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#1E1E1E',
          margin: '24px 0 12px',
          lineHeight: 1.2,
          animation: 'fadeInUp 0.5s 0.4s both',
          background: isSuccess
            ? 'linear-gradient(135deg, #1776F2 0%, #00D4A8 100%)'
            : 'linear-gradient(135deg, #FF6B6B 0%, #1776F2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {isSuccess ? 'Payment Successful! 🎉' : 'Payment Cancelled'}
        </h1>

        {/* ── Subtitle ── */}
        <p style={{
          fontSize: '1rem',
          color: '#707070',
          margin: '0 0 32px',
          lineHeight: 1.6,
          animation: 'fadeInUp 0.5s 0.55s both',
        }}>
          {isSuccess
            ? 'Your credits have been added to your account. You\'re all set to start evaluating candidates!'
            : 'No charges were made. You can always return to pricing and choose a plan that fits your needs.'}
        </p>

        {/* ── Success: countdown progress bar ── */}
        {isSuccess && (
          <div style={{ animation: 'fadeInUp 0.5s 0.65s both', marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginBottom: 10,
            }}>
              {/* Spinner dots */}
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#1776F2',
                  animation: `bounce-dot 1.2s ${i * 0.2}s infinite ease-in-out`,
                }} />
              ))}
              <span style={{ fontSize: '0.85rem', color: '#707070', marginLeft: 4 }}>
                Redirecting in <strong style={{ color: '#1776F2' }}>{countdown}s</strong>
              </span>
            </div>
            <div style={{
              height: 4, borderRadius: 99,
              background: 'rgba(23,118,242,0.12)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #1776F2, #00D4A8)',
                animation: `progress-fill ${countdown === 5 ? 5 : 0}s linear forwards`,
                width: countdown === 5 ? '0%' : `${((5 - countdown) / 5) * 100}%`,
              }} />
            </div>
          </div>
        )}

        {/* ── Cancel: decorative info box ── */}
        {!isSuccess && (
          <div style={{
            background: 'rgba(23,118,242,0.06)',
            border: '1px solid rgba(23,118,242,0.15)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 28,
            animation: 'fadeInUp 0.5s 0.65s both',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            textAlign: 'left',
          }}>
            <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }}>💡</span>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#707070', lineHeight: 1.6 }}>
              Not sure which plan is right for you?{' '}
              <strong style={{ color: '#1776F2' }}>Our Starter plan</strong> is free and lets you evaluate up to 5 candidates per month.
            </p>
          </div>
        )}

        {/* ── Buttons ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          animation: 'fadeInUp 0.5s 0.75s both',
        }}>
          {isSuccess ? (
            <>
              <button
                className="payment-btn-success"
                onClick={() => navigate('/use-cases')}
                style={{
                  background: 'linear-gradient(135deg, #1776F2 0%, #00D4A8 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 99,
                  height: 52,
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: '"Montserrat", sans-serif',
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                  boxShadow: '0 8px 24px rgba(0,212,168,0.35)',
                }}
              >
                🚀 Go to Use Cases Now
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'transparent',
                  color: '#707070',
                  border: '1.5px solid #DAD2D2',
                  borderRadius: 99,
                  height: 44,
                  fontSize: '0.9rem',
                  fontFamily: '"Montserrat", sans-serif',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#1776F2'; (e.target as HTMLButtonElement).style.color = '#1776F2'; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#DAD2D2'; (e.target as HTMLButtonElement).style.color = '#707070'; }}
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                className="payment-btn-cancel"
                onClick={() => navigate('/pricing')}
                style={{
                  background: 'linear-gradient(135deg, #1776F2 0%, #5BA4F5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 99,
                  height: 52,
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: '"Montserrat", sans-serif',
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                  boxShadow: '0 8px 24px rgba(23,118,242,0.35)',
                }}
              >
                View Pricing Plans
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'transparent',
                  color: '#707070',
                  border: '1.5px solid #DAD2D2',
                  borderRadius: 99,
                  height: 44,
                  fontSize: '0.9rem',
                  fontFamily: '"Montserrat", sans-serif',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#1776F2'; (e.target as HTMLButtonElement).style.color = '#1776F2'; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#DAD2D2'; (e.target as HTMLButtonElement).style.color = '#707070'; }}
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>

        {/* ── Success: feature highlights ── */}
        {isSuccess && (
          <div style={{
            marginTop: 36,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            animation: 'fadeInUp 0.5s 0.9s both',
          }}>
            {[
              { icon: '⚡', label: 'Instant Credits' },
              { icon: '🤖', label: 'AI Matching' },
              { icon: '🔒', label: 'Secure & Safe' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                background: 'linear-gradient(135deg, rgba(23,118,242,0.06), rgba(0,212,168,0.06))',
                border: '1px solid rgba(0,212,168,0.2)',
                borderRadius: 14,
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1776F2', lineHeight: 1.2, textAlign: 'center' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Floating decorative shapes ── */}
        <div style={{
          position: 'absolute', top: 20, right: 24,
          width: 20, height: 20,
          background: accentColor + '55',
          borderRadius: '50%',
          animation: 'float 3.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 30, left: 28,
          width: 14, height: 14,
          background: '#1776F255',
          borderRadius: '50%',
          animation: 'float2 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 50, left: 20,
          width: 10, height: 10,
          background: accentColor + '44',
          borderRadius: 3,
          animation: 'float 5s 1s ease-in-out infinite',
          pointerEvents: 'none',
          transform: 'rotate(45deg)',
        }} />
      </div>
    </div>
  );
};

export default PaymentStatus;