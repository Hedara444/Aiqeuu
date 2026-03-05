import { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Card, CardContent, Grid, CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  AutoAwesome as SparkleIcon,
  Diamond as DiamondIcon,
} from '@mui/icons-material';
import { PurchaseModal } from '@/components/ui/purchase-modal';
import { useProfileStore } from '@/store/profileStore';

/* ── Inject Styles ──────────────────────────────────────────────────────── */
const injectPricingStyles = () => {
  if (document.getElementById('pricing-anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'pricing-anim-styles';
  s.textContent = `
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float-fast {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-12px); }
    }
    .pricing-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .pricing-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 24px 48px rgba(23,118,242,0.15), 0 4px 12px rgba(0,0,0,0.05);
    }
    .pricing-highlight {
      border: 2px solid transparent !important;
      background: linear-gradient(#fff, #fff) padding-box, 
                  linear-gradient(135deg, #1776F2, #00D4A8) border-box !important;
      box-shadow: 0 16px 40px rgba(23,118,242,0.12) !important;
    }
    .pricing-highlight:hover {
      box-shadow: 0 32px 64px rgba(23,118,242,0.2) !important;
    }
  `;
  document.head.appendChild(s);
};

/* ── Product Card Component ────────────────────────────────────────────── */
interface ProductCardProps {
  name: string; description: string; price: string; points: number;
  highlighted?: boolean; onSubscribe: () => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, points, highlighted = false, onSubscribe, index }) => (
  <Card
    className={`pricing-card ${highlighted ? 'pricing-highlight' : ''}`}
    sx={{
      width: '100%',
      maxWidth: '320px', // Reduced from 380px
      borderRadius: '20px', // Slightly smaller radius to match standard compact sizes
      background: '#ffffff',
      border: '1px solid #e8edf5',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      animation: `fade-up 0.5s ${0.1 + (index * 0.1)}s ease both`,
      mx: 'auto', // Ensure it stays centered if grid changes
    }}
  >
    {/* Best Value Badge */}
    {highlighted && (
      <Box sx={{
        position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #1776F2, #00D4A8)',
        color: 'white', px: 2, py: 0.5, borderRadius: '99px',
        fontFamily: 'Montserrat', fontSize: '0.75rem', fontWeight: 800,
        boxShadow: '0 4px 12px rgba(23,118,242,0.3)',
        display: 'flex', alignItems: 'center', gap: 0.5,
        animation: 'float-fast 4s ease-in-out infinite',
      }}>
        <SparkleIcon sx={{ fontSize: '1rem' }} /> MOST POPULAR
      </Box>
    )}

    <CardContent sx={{ p: { xs: 3, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* Icon & Details */}
      <Box sx={{
        width: 56, height: 56, borderRadius: '16px', mb: 2.5,
        background: highlighted ? 'linear-gradient(135deg, rgba(23,118,242,0.1), rgba(0,212,168,0.1))' : 'rgba(241,245,249,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: highlighted ? '#1776F2' : '#64748b'
      }}>
        <DiamondIcon sx={{ fontSize: '2rem' }} />
      </Box>

      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.4rem', fontWeight: 800, color: '#1E1E1E', mb: 1 }}>{name}</Typography>
      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.85rem', color: '#5a6070', lineHeight: 1.5, mb: 3, minHeight: 40 }}>
        {description}
      </Typography>

      {/* Price */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography sx={{ fontFamily: 'Montserrat', fontSize: '2.5rem', fontWeight: 800, color: '#1E1E1E', letterSpacing: '-0.02em' }}>
          ${price}
        </Typography>
        <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>
          / package
        </Typography>
      </Box>

      <Box sx={{ height: '1px', background: '#e8edf5', mb: 3 }} />

      {/* Features */}
      <Box sx={{ mb: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <CheckIcon sx={{ color: highlighted ? '#00D4A8' : '#1776F2', fontSize: '1.2rem', mt: 0.2 }} />
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.88rem', fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>
            Process up to <Box component="span" sx={{ color: highlighted ? '#1776F2' : 'inherit', fontWeight: 800 }}>{points} CVs</Box> total
          </Typography>
        </Box>
      </Box>

      {/* Button */}
      <Button
        onClick={onSubscribe}
        variant="contained"
        fullWidth
        sx={{
          height: '48px', borderRadius: '14px',
          fontFamily: 'Montserrat', fontSize: '0.95rem', fontWeight: 700, textTransform: 'none',
          background: highlighted ? 'linear-gradient(135deg, #1776F2, #0d5fcc)' : '#f8fafc',
          color: highlighted ? 'white' : '#1E1E1E',
          border: highlighted ? 'none' : '1px solid #e2e8f0',
          boxShadow: highlighted ? '0 8px 20px rgba(23,118,242,0.3)' : 'none',
          transition: 'all 0.2s',
          marginTop: 'auto',
          '&:hover': {
            background: highlighted ? 'linear-gradient(135deg, #1776F2, #0a4aa1)' : '#f1f5f9',
            boxShadow: highlighted ? '0 12px 28px rgba(23,118,242,0.4)' : 'none',
          }
        }}
      >
        Choose {name}
      </Button>

    </CardContent>
  </Card>
);

/* ── Main Page Component ─────────────────────────────────────────────── */
export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { products, buyProduct, getProducts } = useProfileStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    injectPricingStyles();
    const fetchData = async () => { setIsLoadingPage(true); await getProducts(); setIsLoadingPage(false); };
    fetchData();
  }, []);

  const handleBuyProduct = async (productId: string, quantity: number) => {
    const { url } = await buyProduct(productId, quantity);
    window.location.href = url;
  };
  const handleSubscribe = (product: any) => { setSelectedPlan(product); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedPlan(null); };

  if (isLoadingPage) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: '#fafbfc' }}>
      <CircularProgress sx={{ color: '#1776F2' }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#fafbfc', position: 'relative', overflow: 'hidden', pb: 10 }}>

      {/* Floating Background Orbs */}
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.04), transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-20%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.04), transparent 70%)', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ px: { xs: 1.5, md: 2 }, pt: { xs: 6, md: 8 }, pb: 2 }}>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, animation: 'fade-up 0.5s ease both' }}>
            <Typography sx={{
              fontFamily: 'Montserrat', fontSize: { xs: '2rem', md: '2.8rem', lg: '3.4rem' },
              fontWeight: 800, color: '#1E1E1E', mb: 2, letterSpacing: '-0.03em', lineHeight: 1.1
            }}>
              Simple, transparent <Box component="span" sx={{ background: 'linear-gradient(135deg, #1776F2, #00D4A8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>pricing</Box>
            </Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: { xs: '0.95rem', md: '1.2rem' }, color: '#5a6070', maxWidth: 600, mx: 'auto', lineHeight: 1.5 }}>
              Choose the perfect package to scale your recruitment. No hidden fees, no expiration dates on your credits.
            </Typography>
          </Box>

          {/* Pricing Grid */}
          <Grid container spacing={{ xs: 4, lg: 4 }} justifyContent="center" alignItems="stretch" sx={{ mx: 'auto' }}>
            {/* Products are explicitly reversed as in the original code, but let's highlight index 1 */}
            {products.slice().reverse().map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <ProductCard
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  points={product.points}
                  highlighted={index === 1} // Highlights the middle plan
                  onSubscribe={() => handleSubscribe(product)}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>

        </Box>
      </Container>

      {selectedPlan && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          planName={selectedPlan.name}
          planId={selectedPlan.id}
          pricePerPackage={Number(selectedPlan.price)}
          creditsPerPackage={selectedPlan.points}
          handleBuyProduct={handleBuyProduct}
          isLoading={false}
        />
      )}
    </Box>
  );
}