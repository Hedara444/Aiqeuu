import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { PurchaseModal } from '@/components/ui/purchase-modal';
import { useProfileStore } from '@/store/profileStore';


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
    maxWidth: '384px',
    borderRadius: '24px',
    p: { xs: 3, md: 3 },
    display: 'flex',
    flexDirection: 'column',
    border: highlighted ? '2px solid' : 'none',
    borderColor: highlighted ? 'primary.main' : 'transparent',
    boxShadow: 2
  }}>
    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" sx={{
          color: 'primary.main',
          fontFamily: 'Montserrat',
          fontSize: { xs: '1.1rem', md: '1.7rem' },
          fontWeight: 700,
          mb: 1.5
        }}>
          {name}
        </Typography>
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.9rem', md: '1.1rem' },
          fontWeight: 700,
          mb: 2.5
        }}>
          To improve your work
        </Typography>
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.82rem', md: '0.92rem' },
          lineHeight: 1.6
        }}>
          {description}
        </Typography>
      </Box>

      {/* Features */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 0.8,
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}>
        <CheckIcon sx={{
          color: 'primary.main',
          width: '22px',
          height: '22px',
          flexShrink: 0,
          mt: 0.2
        }} />
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.82rem', md: '0.92rem' },
          flex: 1
        }}>
          CV Credits:Process up to {points} CVs
        </Typography>
      </Box>

      {/* Pricing */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 0.8, mt: 1.6 }}>
          <Typography sx={{
            color: 'primary.dark',
            fontFamily: 'Montserrat',
            fontSize: { xs: '0.82rem', md: '0.92rem' }
          }}>
            You pay:
          </Typography>
        </Box>
        <Typography sx={{
          color: 'primary.dark',
          fontFamily: 'Montserrat',
          fontSize: { xs: '1rem', md: '1.25rem' },
          fontWeight: 700,
          mb: 0.8
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
          height: { xs: '43px', md: '42px' },
          borderRadius: '40px',
          backgroundColor: 'primary.main',
          color: 'white',
          fontFamily: 'Montserrat',
          fontSize: { xs: '0.9rem', md: '1rem' },
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

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Product>(null);
  const { products, buyProduct, getProducts, isLoading } = useProfileStore()
  const [isLoadingPage, setIsLoadingPage] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPage(true)
      await getProducts()
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


  // const plans = [
  //   {
  //     name: "Ultimate Vault",
  //     description: "1,000 CVs for $100. Built for agencies and enterprises handling large-scale recruitment with speed and precision.",
  //     points: 1000,
  //     price: "100.00",
  //     unit_amount: "1000",
  //     currency: "USD",
  //     metadata: { points: "1000" },
  //     id: "1"
  //   },
  //   {
  //     name: "Growth Mode",
  //     description: "Get 50 CVs analyzed for just $10. A smart choice for scaling teams and recruiters needing efficient, mid-level volume.",
  //     points: 10,
  //     price: "100.00",
  //     unit_amount: "1000",
  //     currency: "USD",
  //     metadata: { points: "1000" },
  //     id: "2"
  //   },
  //   {
  //     name: "Starter Bundle",
  //     description: "Analyze 4 CVs for $1 — perfect for quick checks or light hiring. Ideal for individuals and small teams testing the waters.",
  //     points: 4,
  //     price: "100.00",
  //     unit_amount: "1000",
  //     currency: "USD",
  //     metadata: { points: "1000" },
  //     id: "1"
  //   }
  // ];

  // const plans = [
  //   {
  //     title: "Ultimate Vault",
  //     description: "1,000 CVs for $100. Built for agencies and enterprises handling large-scale recruitment with speed and precision.",
  //     features: ["CV Credits: Process up to 1000 CVs"],
  //     price: "$100.00/package",
  //     credits: "1000 CVs",
  //     billing: "9.9 AED/month, billed annually",
  //     priceValue: 100.00,
  //     creditsValue: 1000
  //   },
  //   {
  //     title: "Growth Mode",
  //     description: "Get 50 CVs analyzed for just $10. A smart choice for scaling teams and recruiters needing efficient, mid-level volume.",
  //     features: ["CV Credits: Process up to 50 CVs"],
  //     price: "$10.00/package",
  //     credits: "50 CVs",
  //     billing: "9.9 AED/month, billed annually",
  //     priceValue: 10.00,
  //     creditsValue: 50
  //   },
  //   {
  //     title: "Starter Bundle",
  //     description: "Analyze 4 CVs for $1 — perfect for quick checks or light hiring. Ideal for individuals and small teams testing the waters.",
  //     features: ["CV Credits: Process up to 4 CVs"],
  //     price: "$1.00/package",
  //     credits: "4 CVs",
  //     billing: "9.9 AED/month, billed annually",
  //     priceValue: 1.00,
  //     creditsValue: 4
  //   }
  // ];

  const handleSubscribe = (product: Product) => {
    setSelectedPlan(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>


      {/* Main Content */}
      <Box sx={{ px: { xs: 1.5, md: 4.8 }, pb: 6.5 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 9 } }}>
          <Typography variant="h1" sx={{
            color: 'primary.dark',
            fontFamily: 'Montserrat',
            fontSize: { xs: '1.6rem', md: '2.2rem', lg: '2.8rem' },
            fontWeight: 700,
            mb: 1.5,
            mt: 5
          }}>
            Pricing
          </Typography>
          <Container maxWidth="md">
            <Typography sx={{
              color: 'primary.dark',
              fontFamily: 'Montserrat',
              fontSize: { xs: '0.92rem', md: '1rem', lg: '1.1rem' },
              lineHeight: 1.6
            }}>
              Choose Your Plan
              <br />
              Select the perfect package for your recruitment needs
            </Typography>
          </Container>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={{ xs: 3, lg: 3 }} justifyContent="center" sx={{ mx: 'auto' }}>
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
      </Box>



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