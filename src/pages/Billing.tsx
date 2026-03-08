import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Check as CheckIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { PurchaseModal } from '@/components/ui/purchase-modal';
import { useProfileStore } from '@/store/profileStore';
import { useBillingStore } from '@/store/billingStore';

/* ── Inject Billing Styles ────────────────────────────────────────────── */
const injectBillingStyles = () => {
  if (document.getElementById('billing-anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'billing-anim-styles';
  s.textContent = `
    @keyframes bill-fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes bill-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes bill-float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-4px); }
    }
    .bill-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
    }
    .bill-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(23,118,242,0.12) !important;
      border-color: rgba(23,118,242,0.2);
    }
    .product-card {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
    }
    .product-highlight {
      background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
      border: 2px solid #1776F2 !important;
    }
    .product-highlight::before {
      content: 'POPULAR';
      position: absolute;
      top: 12px; right: 12px;
      background: #1776F2;
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 20px;
      letter-spacing: 0.05em;
    }
    .status-chip-active {
      background: rgba(0, 212, 168, 0.1);
      color: #00D4A8;
    }
    .status-chip-finished {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  `;
  document.head.appendChild(s);
};

interface BillRowProps {
  plan: string;
  startDate: string;
  package: string;
  price: string;
  status: string;
}

const BillRow: React.FC<BillRowProps> = ({ plan, startDate, package: packageValue, price, status }) => {
  const isActive = status === 'active';
  
  return (
    <Card
      className="bill-card"
      sx={{
        borderRadius: '16px',
        mb: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        background: '#ffffff',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Plan Info */}
          <Grid item xs={12} md={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 42, height: 42, borderRadius: '12px',
                background: 'rgba(23,118,242,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'primary.main'
              }}>
                <ReceiptIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Montserrat', fontWeight: 700, lineHeight: 1.2 }}>
                  {plan}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Montserrat', fontWeight: 500 }}>
                  Invoice #{Math.floor(Math.random() * 10000)}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Date Info */}
          <Grid item xs={12} md={3}>
            <Stack spacing={0.5}>

              <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 600, color: 'text.primary' }}>
                {startDate}
              </Typography>
            </Stack>
          </Grid>

          {/* Package */}
          <Grid item xs={6} md={2}>
            <Stack spacing={0.5}>

              <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 600, color: 'text.primary' }}>
                {packageValue}
              </Typography>
            </Stack>
          </Grid>

          {/* Price */}
          <Grid item xs={6} md={2}>
            <Stack spacing={0.5}>

              <Typography variant="body1" sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'text.primary' }}>
                {price}
              </Typography>
            </Stack>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Chip
              label={isActive ? 'Active' : status}
              size="small"
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: '8px',
                height: 28,
                px: 1,
                textTransform: 'capitalize',
                ...(isActive ? {
                  bgcolor: 'rgba(0, 212, 168, 0.1)',
                  color: '#00D4A8'
                } : {
                  bgcolor: 'rgba(100, 116, 139, 0.1)',
                  color: '#64748b'
                })
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  points: number;
  highlighted?: boolean;
  onSubscribe: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  price,
  points,
  highlighted = false,
  onSubscribe
}) => (
  <Card 
    className={`product-card ${highlighted ? 'product-highlight' : ''}`}
    sx={{
      width: '100%',
      maxWidth: '360px',
      borderRadius: '24px',
      p: 3,
      border: '1px solid',
      borderColor: highlighted ? 'transparent' : 'grey.200',
      boxShadow: highlighted ? '0 12px 32px rgba(23,118,242,0.15)' : '0 2px 12px rgba(0,0,0,0.04)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1, '&:last-child': { pb: 0 } }}>
      {/* Icon Header */}
      <Box sx={{ 
        width: 56, height: 56, borderRadius: '16px', mb: 3, mx: 'auto',
        background: highlighted ? 'linear-gradient(135deg, #1776F2, #00D4A8)' : 'rgba(23,118,242,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: highlighted ? '0 8px 16px rgba(23,118,242,0.25)' : 'none',
        animation: highlighted ? 'bill-float 3s ease-in-out infinite' : 'none',
      }}>
        <LocalOfferIcon sx={{ color: highlighted ? 'white' : 'primary.main', fontSize: '1.8rem' }} />
      </Box>

      <Typography variant="h4" align="center" sx={{
        fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.5rem', mb: 1,
        color: 'text.primary'
      }}>
        {name}
      </Typography>
      
      <Typography align="center" sx={{
        fontFamily: 'Montserrat', fontSize: '0.875rem', color: 'text.secondary', mb: 3,
        minHeight: '42px', lineHeight: 1.5
      }}>
        {description}
      </Typography>

      <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

      <Stack spacing={2} sx={{ mb: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CheckIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.95rem', fontWeight: 600, color: 'text.primary' }}>
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>{points}</Box> CV Credits
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CheckIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.95rem', color: 'text.secondary' }}>
            Instant account credit
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ mt: 'auto' }}>
        <Typography align="center" sx={{ mb: 2 }}>
          <Box component="span" sx={{ fontFamily: 'Montserrat', fontSize: '2rem', fontWeight: 800, color: 'text.primary' }}>
            ${price}
          </Box>
          <Box component="span" sx={{ fontFamily: 'Montserrat', color: 'text.secondary', fontWeight: 500 }}>
            /pack
          </Box>
        </Typography>

        <Button
          onClick={onSubscribe}
          fullWidth
          variant={highlighted ? "contained" : "outlined"}
          sx={{
            py: 1.5,
            borderRadius: '50px',
            textTransform: 'none',
            fontFamily: 'Montserrat',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: highlighted ? '0 8px 20px rgba(23,118,242,0.25)' : 'none',
            borderWidth: highlighted ? 0 : '2px',
            '&:hover': {
              borderWidth: highlighted ? 0 : '2px',
              transform: 'translateY(-2px)',
              boxShadow: highlighted ? '0 12px 24px rgba(23,118,242,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
            }
          }}
        >
          Choose Plan
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default function Billing() {
  useEffect(() => { injectBillingStyles(); }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Product>(null);
  const { products, buyProduct, getProducts, isLoading } = useProfileStore();
  const { bills, getBillingHistory, pagination } = useBillingStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const handleSubscribe = (product: Product) => {
    setSelectedPlan(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPage(true);
      await Promise.all([
        getProducts(),
        getBillingHistory()
      ]);
      setIsLoadingPage(false);
    };

    fetchData();
  }, []);

  const handleBuyProduct = async (productId: string, quantity: number) => {
    const { url } = await buyProduct(productId, quantity);
    window.location.href = url;
  };

  if (isLoadingPage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fc", pb: 8 }}>
      
      {/* ── Header Section ── */}
      <Box sx={{ 
        pt: { xs: 6, md: 8 }, pb: { xs: 6, md: 8 }, 
        px: 2, 
        textAlign: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.03)'
      }}>
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Montserrat',
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'bill-fade-up 0.6s ease-out both'
            }}
          >
            Billing & Plans
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              color: "text.secondary",
              fontSize: { xs: "1rem", md: "1.125rem" },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              animation: 'bill-fade-up 0.6s 0.1s ease-out both'
            }}
          >
            Manage your billing history and choose the perfect credit package to scale your recruitment process.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4 }}>
        <Stack spacing={8}>
                    {/* ── Past Bills Section ── */}
          <Box sx={{ animation: 'bill-fade-up 0.6s 0.3s ease-out both' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, px: 1 }}>
              <Box sx={{ 
                width: 4, height: 24, 
                background: 'linear-gradient(180deg, #1776F2 0%, #00D4A8 100%)', 
                borderRadius: '4px' 
              }} />
              <Typography variant="h4" sx={{ 
                fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.5rem',
                color: 'text.primary'
              }}>
                Transaction History
              </Typography>
            </Box>

            {bills.length > 0 ? (
              <>
                {/* Desktop Header */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    px: 3, py: 2, mb: 2,
                    display: { xs: "none", md: "block" },
                    background: 'rgba(23,118,242,0.04)',
                    border: '1px solid rgba(23,118,242,0.08)'
                  }}
                >
                  <Grid container spacing={10} alignItems="center"
          justifyContent="space-between" sx={{ }}>
                    <Grid item md={2}><Typography variant="subtitle2" sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'text.secondary' }}>PLAN DETAILS</Typography></Grid>
                    <Grid item md={2}><Typography variant="subtitle2" sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'text.secondary' }}>DATE</Typography></Grid>
                    <Grid item md={2}><Typography variant="subtitle2" sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'text.secondary' }}>PACKAGE</Typography></Grid>
                    <Grid item md={2}><Typography variant="subtitle2" sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'text.secondary' }}>AMOUNT</Typography></Grid>
                    <Grid item md={2} sx={{ textAlign: 'right' }}><Typography variant="subtitle2" sx={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'text.secondary' }}>STATUS</Typography></Grid>
                  </Grid>
                </Paper>

                <Stack spacing={0}>
                  {bills.map((bill, index) => (
                    <BillRow key={bill.id || index} {...bill} />
                  ))}
                </Stack>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    disabled={!pagination || pagination.pageNumber === 0}
                    onClick={() => getBillingHistory((pagination?.pageNumber || 0) - 1, pagination?.pageSize || 10)}
                    sx={{
                      width: '140px', height: '44px', borderRadius: '50px', textTransform: 'none',
                      fontFamily: 'Montserrat', fontWeight: 600,
                      borderColor: 'grey.300', color: 'text.primary',
                      '&:hover': { borderColor: 'primary.main', background: 'rgba(23,118,242,0.04)' }
                    }}
                  >
                    Previous
                  </Button>
                  
                  {pagination && (
                    <Typography variant="body2" sx={{ fontFamily: 'Montserrat', fontWeight: 600, color: 'text.secondary' }}>
                      Page {pagination.pageNumber + 1} of {Math.ceil(pagination.totalCount / pagination.pageSize) || 1}
                    </Typography>
                  )}

                  <Button
                    variant="outlined"
                    disabled={!pagination || (pagination.pageNumber + 1) * pagination.pageSize >= pagination.totalCount}
                    onClick={() => getBillingHistory((pagination?.pageNumber || 0) + 1, pagination?.pageSize || 10)}
                    sx={{
                      width: '140px', height: '44px', borderRadius: '50px', textTransform: 'none',
                      fontFamily: 'Montserrat', fontWeight: 600,
                      borderColor: 'grey.300', color: 'text.primary',
                      '&:hover': { borderColor: 'primary.main', background: 'rgba(23,118,242,0.04)' }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                <Typography variant="h6" color="text.secondary">No billing history found</Typography>
              </Box>
            )}
          </Box>
          {/* ── Pricing Plans ── */}
          <Box sx={{ animation: 'bill-fade-up 0.6s 0.2s ease-out both' }}>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {products.reverse().map((product, index) => (
                <Grid item key={index} xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ProductCard
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    points={product.points}
                    highlighted={index === 1}
                    onSubscribe={() => handleSubscribe(product)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>


        </Stack>
      </Container>

      {/* Purchase Modal */}
      {selectedPlan && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          planName={selectedPlan.name}
          planId={selectedPlan.id}
          pricePerPackage={Number(selectedPlan.price)}
          creditsPerPackage={selectedPlan.points}
          handleBuyProduct={handleBuyProduct}
          isLoading={isLoading}
        />
      )}

    </Box>
  );
}