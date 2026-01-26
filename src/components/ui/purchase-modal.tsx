import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planId: string;
  pricePerPackage?: number;
  creditsPerPackage?: number;
  isLoading: boolean
  handleBuyProduct: (productId: string, quantity: number) => Promise<void>
}

export function PurchaseModal({
  isOpen,
  onClose,
  planName,
  planId,
  pricePerPackage,
  creditsPerPackage,
  handleBuyProduct,
  isLoading
}: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const totalCredits = creditsPerPackage * quantity;
  const totalPrice = pricePerPackage * quantity;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handlePurchase = async () => {
    // Handle purchase logic here

    await handleBuyProduct(planId, quantity)
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '24px', maxHeight: '90vh' }
      }}
    >
      <DialogContent sx={{ p: { xs: 1.6, md: 3.2 } }}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3.2 }}>
            <DialogTitle sx={{
              color: 'primary.dark',
              fontFamily: 'Montserrat',
              fontSize: { xs: '0.92rem', md: '1.1rem' },
              fontWeight: 700,
              p: 0
            }}>
              {planName}
            </DialogTitle>
          </Box>

          {/* Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.2 }}>
            {/* Separator */}
            <Divider />

            {/* Price and Credits Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                  Price per package:
                </Typography>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontWeight: 700
                }}>
                  {pricePerPackage.toFixed(2)} $
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                  Credits per package:
                </Typography>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700
                }}>
                  {creditsPerPackage} CVs
                </Typography>
              </Box>
            </Box>

            {/* Separator */}
            <Divider />

            {/* Quantity Selector */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 1.6
            }}>
              <Typography sx={{
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Select Quantity:
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                {/* Decrease Button */}
                <IconButton
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  sx={{
                    width: { xs: '30px', md: '35px' },
                    height: { xs: '30px', md: '35px' },
                    borderRadius: '10px',
                    backgroundColor: quantity <= 1 ? 'grey.200' : 'grey.200',
                    color: quantity <= 1 ? 'grey.400' : 'primary.dark',
                    '&:hover': {
                      backgroundColor: quantity <= 1 ? 'grey.200' : 'grey.300',
                    },
                    '&:disabled': {
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>

                {/* Quantity Display */}
                <Box sx={{
                  width: { xs: '102px', md: '128px' },
                  height: { xs: '38px', md: '51px' },
                  border: '2px solid',
                  borderColor: 'grey.200',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{
                    color: 'primary.dark',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 700
                  }}>
                    {quantity}
                  </Typography>
                </Box>

                {/* Increase Button */}
                <IconButton
                  onClick={incrementQuantity}
                  sx={{
                    width: { xs: '30px', md: '43px' },
                    height: { xs: '30px', md: '43px' },
                    borderRadius: '10px',
                    backgroundColor: 'grey.200',
                    color: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'grey.300',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} />
                </IconButton>
              </Box>
            </Box>

            {/* Separator */}
            <Divider />

            {/* Totals */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                  Total Credits:
                </Typography>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700
                }}>
                  {totalCredits} CVs
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                  Total Price:
                </Typography>
                <Typography sx={{
                  color: 'primary.dark',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700
                }}>
                  {totalPrice.toFixed(2)} $
                </Typography>
              </Box>
            </Box  >

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 , mb:2 }}>
    

             <Button
              onClick={onClose}
              variant="outlined"
              fullWidth
              disabled={isLoading} // Disable button when loading
              sx={{
                height: { xs: '35px', md: '40px' },
                borderRadius: '24px',
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                backgroundColor: 'grey.100',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 500,
                px: 3,
                py: 1,
                borderColor: 'grey.400',
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: 'grey.150',    
                    borderColor: 'grey.900',
                        },
              }}
            >
         Cancel
            </Button>

            <Button
              onClick={handlePurchase}
              variant="contained"
              fullWidth
              disabled={isLoading} // Disable button when loading
              sx={{
                height: { xs: '35px', md: '40px' },
                borderRadius: '24px',
                backgroundColor: isLoading ? 'grey.400' : 'primary.main', // Change color when loading
                color: 'white',
                fontFamily: 'Montserrat',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: isLoading ? 'grey.400' : 'primary.dark', // Prevent hover effect when loading
                },
                '&:disabled': {
                  cursor: 'not-allowed',
                }
              }}
            >
              {isLoading ? (
                // Show loading indicator when isLoading is true
                <CircularProgress size={22} sx={{ color: 'white' }} />
              ) : (
                // Show normal text when not loading
                `Purchase for ${totalPrice.toFixed(2)}$`
              )}
            </Button>

            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
