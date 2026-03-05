import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Box, Typography, Button, IconButton, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon, ShoppingBag as BagIcon } from '@mui/icons-material';

/* ── Inject Styles ──────────────────────────────────────────────────────── */
const injectModalStyles = () => {
  if (document.getElementById('modal-anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'modal-anim-styles';
  s.textContent = `
    .premium-modal-paper {
      border-radius: 24px !important;
      border: 1px solid rgba(23,118,242,0.1) !important;
      box-shadow: 0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset !important;
      background: rgba(255,255,255,0.98) !important;
      backdrop-filter: blur(12px) !important;
      overflow: hidden !important;
    }
  `;
  document.head.appendChild(s);
};

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planId: string;
  pricePerPackage?: number;
  creditsPerPackage?: number;
  isLoading: boolean;
  handleBuyProduct: (productId: string, quantity: number) => Promise<void>;
}

export function PurchaseModal({
  isOpen, onClose, planName, planId, pricePerPackage = 0, creditsPerPackage = 0, handleBuyProduct, isLoading
}: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    injectModalStyles();
    if (isOpen) setQuantity(1); // Reset quantity on open
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCredits = creditsPerPackage * quantity;
  const totalPrice = pricePerPackage * quantity;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handlePurchase = async () => {
    await handleBuyProduct(planId, quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'premium-modal-paper' }}>

      {/* Top Gradient Bar */}
      <Box sx={{ height: 4, background: 'linear-gradient(90deg, #1776F2, #00D4A8)' }} />

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        disabled={isLoading}
        sx={{ position: 'absolute', right: 16, top: 16, color: '#94a3b8', '&:hover': { background: '#f1f5f9', color: '#1E1E1E' } }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>

        {/* Header Icon */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px', mb: 2,
            background: 'linear-gradient(135deg, rgba(23,118,242,0.1), rgba(0,212,168,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1776F2'
          }}>
            <BagIcon sx={{ fontSize: '1.8rem' }} />
          </Box>
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.4rem', fontWeight: 800, color: '#1E1E1E', textAlign: 'center' }}>
            {planName}
          </Typography>
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', color: '#64748b', textAlign: 'center', mt: 0.5 }}>
            Customize your package volume
          </Typography>
        </Box>

        {/* Pricing Info Card */}
        <Box sx={{ background: '#f8fafc', borderRadius: '16px', p: 2.5, mb: 3, border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Base Price</Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1rem', color: '#1E1E1E', fontWeight: 700 }}>${pricePerPackage.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Credits Included</Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1rem', color: '#1776F2', fontWeight: 700 }}>{creditsPerPackage} CVs</Typography>
          </Box>
        </Box>

        {/* Quantity Selector */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 700, color: '#1E1E1E' }}>
            Quantity
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#f1f5f9', borderRadius: '12px', p: 0.5 }}>
            <IconButton onClick={decrementQuantity} disabled={quantity <= 1 || isLoading}
              sx={{ width: 36, height: 36, borderRadius: '8px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: quantity <= 1 ? '#cbd5e1' : '#1E1E1E', '&:hover': { background: '#f8fafc' } }}
            >
              <RemoveIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>

            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.1rem', fontWeight: 800, width: 40, textAlign: 'center', color: '#1E1E1E' }}>
              {quantity}
            </Typography>

            <IconButton onClick={incrementQuantity} disabled={isLoading}
              sx={{ width: 36, height: 36, borderRadius: '8px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#1E1E1E', '&:hover': { background: '#f8fafc' } }}
            >
              <AddIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Total Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Total Credits</Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.2rem', color: '#00D4A8', fontWeight: 800 }}>+{totalCredits} <span style={{ fontSize: '0.85rem' }}>CVs</span></Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Total Price</Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.8rem', color: '#1E1E1E', fontWeight: 800, lineHeight: 1 }}>${totalPrice.toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* Action Button */}
        <Button
          onClick={handlePurchase}
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #1776F2, #0d5fcc)',
            boxShadow: '0 8px 24px rgba(23,118,242,0.25)',
            color: 'white', fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 700, textTransform: 'none',
            '&:hover': { background: 'linear-gradient(135deg, #1776F2, #0a4aa1)', boxShadow: '0 12px 28px rgba(23,118,242,0.35)' }
          }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Proceed to Checkout'}
        </Button>

      </DialogContent>
    </Dialog>
  );
}
