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
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Check
} from '@mui/icons-material';
import { Navbar } from '@/components/ui/navbar';
import { PurchaseModal } from '@/components/ui/purchase-modal';
import { Footer } from '@/components/ui/Footer';
import { useProfileStore } from '@/store/profileStore';
import { useBillingStore } from '@/store/billingStore';

interface BillRowProps {
  plan: string;
  startDate: string;
  endDate: string;
  package: string;
  price: string;
  status: 'active' | 'finished';
}

const BillRow: React.FC<BillRowProps> = ({ plan, startDate, endDate, package: packageValue, price, status }) => (
  <Card
    sx={{
      borderRadius: { xs: "12px", md: "20px" },
      p: { xs: 3, md: 4 },
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 0 }
        }}
      >
        {/* Plan Info */}
        <Grid sx={{ minWidth: { md: 220 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ReceiptIcon sx={{ fontSize: "1.15rem", color: "text.primary" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.0125rem", md: "1rem" },
                color: "text.primary"
              }}
            >
              {plan}
            </Typography>
          </Stack>
        </Grid>

        {/* Date Info */}
        <Grid sx={{ minWidth: { md: 220 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2.5 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1rem" },
                color: "text.primary"
              }}
            >
              <Box component="span" sx={{ fontWeight: 400 , fontSize:'1rem' }}>Started </Box>
              <Box component="span" sx={{ fontWeight: 700 , fontSize:'1rem' }}>{startDate}</Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1rem" },
                color: "text.primary"
              }}
            >
              <Box component="span" sx={{ fontWeight: 400 }}>Ends </Box>
              <Box component="span" sx={{ fontWeight: 700 }}>{endDate}</Box>
            </Typography>
          </Stack>
        </Grid>

        {/* Package */}
        <Grid sx={{ minWidth: { md: 128 } }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1rem" },
              color: "text.primary",
              textAlign: { xs: "left", md: "center" }
            }}
          >
            {packageValue}
          </Typography>
        </Grid>

        {/* Price */}
        <Grid sx={{ minWidth: { md: 128 } }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1rem" },
              color: "text.primary",
              textAlign: { xs: "left", md: "center" }
            }}
          >
            {price}
          </Typography>
        </Grid>

        {/* Status */}
        <Grid sx={{ minWidth: { md: 128 } }}>
          <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "center" } }}>
            <Chip
              label={status === 'active' ? 'Now' : 'finished'}
              sx={{
                px: 2.25,
                py: 1,
                fontSize: "1rem",
                fontWeight: 700,
                backgroundColor: status === 'active' ? 'rgba(0, 235, 189, 0.1)' : 'rgba(255, 70, 86, 0.1)',
                color: status === 'active' ? 'primary.main' : '#FF4656',
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

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
  <Card sx={{
    position: 'relative',
    width: '100%',
    maxWidth: '342px',
    borderRadius: '30px',
    p: { xs: 1, md: 2 },
    display: 'flex',
    flexDirection: 'column',
    border: highlighted ? '2px solid' : 'none',
    borderColor: highlighted ? 'primary.main' : 'transparent',
    boxShadow: 2
  }}>
    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{
          color: 'primary.main',
          fontFamily: 'Montserrat',
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          fontWeight: 700,
          mb: 3
        }}>
          {name}
        </Typography>
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.85rem', md: '0.95rem' },
          fontWeight: 700,
          mb: 3
        }}>
          To improve your work
        </Typography>
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.8rem', md: '0.9rem' },
          lineHeight: 1.3
        }}>
          {description}
        </Typography>
      </Box>

      {/* Features */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        py: 1,
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Check sx={{
          color: 'primary.main',
          width: '28px',
          height: '28px',
          flexShrink: 0,
          mt: 0.25
        }} />
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.95rem', md: '1rem' },
          flex: 1
        }}>
          CV Credits:Process up to {points} CVs
        </Typography>
      </Box>

      {/* Pricing */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 1, mt: 2 }}>
          <Typography sx={{
            color: 'primary.dark',
            fontFamily: 'Montserrat',
            fontSize: { xs: '0.95rem', md: '1rem' }
          }}>
            You pay:
          </Typography>
        </Box>
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.9rem', md: '1rem' },
          fontWeight: 700,
          mb: 1
        }}>
          ${price}/package
        </Typography>

      </Box>

      {/* CTA Button */}
      <Button
        onClick={onSubscribe}
        variant="contained"
        fullWidth
        sx={{
          height: { xs: '44px', md: '52px' },
          borderRadius: '50px',
          backgroundColor: 'primary.main',
          color: 'white',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.95rem', md: '1rem' },
          fontWeight: 700,
          textTransform: 'none',
          '&:hover': {
            // backgroundColor: 'rgba(0, 235, 189, 0.9)',
          },
        }}
      >
        Subscribe Now
      </Button>
    </CardContent>
  </Card>
);

export default function   Billing() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Product>(null);
  const { products, buyProduct, getProducts, isLoading } = useProfileStore()
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
      setIsLoadingPage(true)
      await Promise.all([
        getProducts(),
        getBillingHistory()
      ]);
      setIsLoadingPage(false)
    }

    fetchData()
  }, [])

  const handleBuyProduct = async (productId: string, quantity: number) => {
    const { url } = await buyProduct(productId, quantity)
    window.location.href = url
    // window.history.pushState({}, '', url); // Update URL without reloading
  }

  // If still loading, show a loading spinner
  if (isLoadingPage) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 8, mb: 1 }}>
        {/* Header */}
        <Box textAlign="center" sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1rem", md: "2rem", lg: "2.5rem" },
              fontWeight: 700,
              mb: 3,
              color: "text.primary",
            }}
          >
            Billing
          </Typography>
          <Container maxWidth="md">
            <Typography
              variant="h5"
              sx={{
                color: "text.primary",
                fontSize: { xs: "1.025rem", md: "1.125rem" },
                lineHeight: 1.6,
              }}
            >
              Choose Your Plan<br />
              Select the perfect package for your recruitment needs
            </Typography>
          </Container>
        </Box>

        <Stack spacing={9} alignItems="center">
          <Container maxWidth="xl" sx={{mb:42}}>
            {/* Past Bills Section */}
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  fontWeight: 700,
                  mb: 2,
                  color: "text.primary"
                }}
              >
                Past Bills
              </Typography>

              <Stack spacing={2}>
                {/* Table Header - Hidden on Mobile */}
                <Card
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 2,
                    display: { xs: "none", md: "block" },
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                    <Grid sx={{ minWidth: 240 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                        Plan
                      </Typography>
                    </Grid>
                    <Grid sx={{ minWidth: 320 }}>
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        Date
                      </Typography>
                    </Grid>
                    <Grid sx={{ minWidth: 128 }}>
                      <Typography variant="body1" sx={{ color: "text.primary", textAlign: "center" }}>
                        package
                      </Typography>
                    </Grid>
                    <Grid sx={{ minWidth: 128 }}>
                      <Typography variant="body1" sx={{ color: "text.primary", textAlign: "center" }}>
                        Price
                      </Typography>
                    </Grid>
                    <Grid sx={{ minWidth: 128 }}>
                      <Typography variant="body1" sx={{ color: "text.primary", textAlign: "center" }}>
                        Status
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>

                {/* Bills List */}
                {bills.map((bill, index) => (
                  <BillRow key={bill.id || index} {...bill} />
                ))}

                {/* Pagination Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7, gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    disabled={!pagination || pagination.pageNumber === 0}
                    onClick={() => getBillingHistory((pagination?.pageNumber || 0) - 1, pagination?.pageSize || 10)}
                    sx={{
                     width:'154px',
                      height:'43px',
                      fontSize:"0.9rem",
                      borderRadius: '50px',
                      textTransform: 'none',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:disabled': {
                        borderColor: 'grey.300',
                        color: 'grey.400'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  
                  {pagination && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      Page {pagination.pageNumber + 1} of {Math.ceil(pagination.totalCount / pagination.pageSize) || 1}
                    </Typography>
                  )}

                  <Button
                    variant="outlined"
                    disabled={!pagination || (pagination.pageNumber + 1) * pagination.pageSize >= pagination.totalCount}
                    onClick={() => getBillingHistory((pagination?.pageNumber || 0) + 1, pagination?.pageSize || 10)}
                    sx={{
                      width:'154px',
                      height:'43px',
                      fontSize:"0.9rem",
                      borderRadius: '50px',
                      textTransform: 'none',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:disabled': {
                        borderColor: 'grey.300',
                        color: 'grey.400'
                      }

                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Stack>
            </Box>

            {/* My Plan Section */}
            {/*<Box>*/}
            {/*  <Typography*/}
            {/*    variant="h2"*/}
            {/*    sx={{*/}
            {/*      fontSize: { xs: "1.875rem", md: "2.5rem" },*/}
            {/*      fontWeight: 700,*/}
            {/*      mb: 4,*/}
            {/*      mt: 4,*/}
            {/*      color: "text.primary"*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    My Plan*/}
            {/*  </Typography>*/}

            {/*  <Card*/}
            {/*    sx={{*/}
            {/*      borderRadius: "12px",*/}
            {/*      px: { xs: 3, md: 4 },*/}
            {/*      py: { xs: 3, md: 4 },*/}
            {/*      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Grid*/}
            {/*      container*/}
            {/*      spacing={{ xs: 2, md: 4 }}*/}
            {/*      alignItems="center"*/}
            {/*      sx={{*/}
            {/*        flexDirection: { xs: "column", md: "row" },*/}
            {/*        gap: { xs: 2, md: 0 }*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      /!* Plan Info *!/*/}
            {/*      <Grid sx={{ minWidth: { md: 240 } }}>*/}
            {/*        <Stack direction="row" alignItems="center" spacing={1.5}>*/}
            {/*          <ReceiptIcon sx={{ fontSize: "2.25rem", color: "text.primary" }} />*/}
            {/*          <Typography*/}
            {/*            variant="h6"*/}
            {/*            sx={{*/}
            {/*              fontWeight: 700,*/}
            {/*              color: "text.primary"*/}
            {/*            }}*/}
            {/*          >*/}
            {/*            Ultimate Vault*/}
            {/*          </Typography>*/}
            {/*        </Stack>*/}
            {/*      </Grid>*/}

            {/*      /!* Plan Details *!/*/}
            {/*      <Grid sx={{ minWidth: { md: 256 } }}>*/}
            {/*        <Typography*/}
            {/*          variant="h6"*/}
            {/*          sx={{ color: "text.primary" }}*/}
            {/*        >*/}
            {/*          1000 CVs*/}
            {/*        </Typography>*/}
            {/*      </Grid>*/}

            {/*      <Grid sx={{ minWidth: { md: 128 } }}>*/}
            {/*        <Typography*/}
            {/*          variant="h6"*/}
            {/*          sx={{ color: "text.primary" }}*/}
            {/*        >*/}
            {/*          $100.00*/}
            {/*        </Typography>*/}
            {/*      </Grid>*/}

            {/*      /!* Subscription Info *!/*/}
            {/*      <Grid sx={{ flex: 1 }}>*/}
            {/*        <Stack spacing={0.5}>*/}
            {/*          <Typography variant="h6" sx={{ color: "text.primary" }}>*/}
            {/*            Subscribed on Mar 15, 2024*/}
            {/*          </Typography>*/}
            {/*          <Typography variant="h6" sx={{ color: "text.primary" }}>*/}
            {/*            Renews on Apr 15, 2025*/}
            {/*          </Typography>*/}
            {/*        </Stack>*/}
            {/*      </Grid>*/}
            {/*    </Grid>*/}
            {/*  </Card>*/}

            {/*</Box>*/}
          </Container>

          {/* Pricing Plans */}
          <Grid container spacing={{ xs: 4, lg: 6 }} justifyContent="center" sx={{ mx: '20px' , mt:3 }}>
            {products.reverse().map((product, index) => (
              <Grid key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <ProductCard
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  points={product.points}
                  highlighted={index === 1} // Highlight the middle product
                  onSubscribe={() => handleSubscribe(product)}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Purchase Modal */}
      {
        selectedPlan && (
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
        )
      }

    </Box >
  );
}